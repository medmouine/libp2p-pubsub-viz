package main

import (
	"context"
	"crypto/rand"
	"flag"
	"fmt"
	"github.com/libp2p/go-libp2p"
	"github.com/libp2p/go-libp2p-core/crypto"
	"io"
	"io/ioutil"
	"os"
	"time"

	"github.com/libp2p/go-libp2p-core/peer"
	"github.com/libp2p/go-libp2p/p2p/discovery"

	"github.com/libp2p/go-libp2p-core/host"
	ma "github.com/multiformats/go-multiaddr"

	pubsub "github.com/libp2p/go-libp2p-pubsub"
)

// DiscoveryInterval is how often we re-publish our mDNS records.
const DiscoveryInterval = time.Hour

// DiscoveryServiceTag is used in our mDNS advertisements to discover other peers.
const DiscoveryServiceTag = "pubsub-bm"

const jsonTracerFilePath = "/p2p/trace.pb"

func main() {
	hostIdFlag := flag.String("id", "", "Identifier to use. will be generated if empty")
	topicFlag := flag.String("topic", "", "name of topic to create and publish to. Default is 'topic-<ID>' if empty")
	tracerPortFlag := flag.String("tracerPort", "4001", "Port tracer is exposed on. Default is 4241")
	tracerAddrFlag := flag.String("tracerAddr", "0.0.0.0", "Address to reach remote tracer. Default is 0.0.0.0")
	tracerPeerIdFlag := flag.String("tracerId", "/p2p/trid", "Tracer Peer id location. Tracer set to JSON mode at /p2p/trace.json if not specified. If init, default id folder is /p2p")
	isAgentFlag := flag.Bool("agent", false, "Specify if agent or host. (Agents subscribe to publishers topic)")
	initTracerIdentityFlag := flag.Bool("init", false, "Create tracer identity. Default false.")
	consumerTopic1Flag := flag.String("topic1", "pub-topic-1", "name of topic to join. Will 'pub-topic-1' if empty")
	consumerTopic2Flag := flag.String("topic2", "pub-topic-2", "name of topic to join. Will 'pub-topic-2' if empty")
	flag.Parse()

	if *initTracerIdentityFlag {
		fmt.Println("Starting in Init mode.")
		createTracerPeerId(*tracerPeerIdFlag)
		os.Exit(0)
	}

	ctx := context.Background()
	h, _ := libp2p.New(ctx, libp2p.ListenAddrStrings("/ip4/0.0.0.0/tcp/4242"),
		libp2p.DefaultTransports,
		// TODO: Uncomment to enable connmgr [3, 7]
		//libp2p.ConnectionManager(connmgr.NewConnManager(
		//	3,         // Lowwater
		//	7,         // HighWater,
		//	time.Minute, // GracePeriod
		//)),
	)

	if !*isAgentFlag {
		fmt.Println("Starting in Publisher mode.")
		tracer := initTracer(tracerPeerIdFlag, tracerAddrFlag, tracerPortFlag, ctx, h)
		hostId := *hostIdFlag
		topicName := *topicFlag
		startPublisher(ctx, h, tracer, hostId, topicName)
	} else {
		fmt.Println("Starting in Agent mode.")
		tracer := initTracer(tracerPeerIdFlag, tracerAddrFlag, tracerPortFlag, ctx, h)
		startAgent(ctx, h, tracer, consumerTopic1Flag, consumerTopic2Flag)
	}

}

func startAgent(ctx context.Context, h host.Host, tracer pubsub.EventTracer, consumerTopic1Flag *string, consumerTopic2Flag *string) {
	ps, err := initPubsub(ctx, h, tracer)

	hostId, err := os.Hostname()
	if err != nil {
		panic(err)
	}

	err = setupDiscovery(ctx, h)
	if err != nil {
		panic(err)
	}
	if len(hostId) == 0 {
		hostId = defaultHostId(h.ID(), "c-")
	}

	topic1 := *consumerTopic1Flag
	topic2 := *consumerTopic2Flag
	_, err = JoinTopic(ctx, ps, h.ID(), hostId, topic1)
	if err != nil {
		fmt.Printf("Could not subsribe to Topic [%s]: %v", topic1, err)
	}
	_, err = JoinTopic(ctx, ps, h.ID(), hostId, topic2)
	if err != nil {
		fmt.Printf("Could not subsribe to Topic [%s]: %v", topic2, err)
	}

	for {
	}
}

func initPubsub(ctx context.Context, h host.Host, tracer pubsub.EventTracer) (*pubsub.PubSub, error) {
	// TODO: uncomment to specify Pubsub protocol
	ps, err := pubsub.NewGossipSub(ctx, h, pubsub.WithEventTracer(tracer))
	//ps, err := pubsub.NewFloodSub(ctx, h, pubsub.WithEventTracer(tracer))
	//ps, err := pubsub.NewRandomSub(ctx, h, 32, pubsub.WithEventTracer(tracer))
	return ps, err
}

func initTracer(tracerPeerIdFlag *string, tracerAddrFlag *string, tracerPortFlag *string, ctx context.Context, h host.Host) pubsub.EventTracer {
	var tracer pubsub.EventTracer
	if *tracerPeerIdFlag != "" && *tracerAddrFlag != "" && *tracerPortFlag != "" {
		trcrPeerIdBuff, err := ioutil.ReadFile(*tracerPeerIdFlag + "_str")
		if err != nil {
			panic(err)
		}
		var trcrPeerId = string(trcrPeerIdBuff)

		tr := fmt.Sprintf("/ip4/%s/tcp/%s/p2p/%s", *tracerAddrFlag, *tracerPortFlag, trcrPeerId)
		fmt.Printf("Instantiating with remote tracer: %s.\n", tr)
		multiAddr := ma.StringCast(tr)
		pi, err := peer.AddrInfoFromP2pAddr(multiAddr)
		tracer, err = pubsub.NewRemoteTracer(ctx, h, *pi)

	} else {
		fmt.Println("Instantiating local JSON Tracer")
		jsonTracer, err := pubsub.NewJSONTracer(jsonTracerFilePath)
		tracer = jsonTracer
		if err != nil {
			panic(err)
		}

	}
	return tracer
}

func startPublisher(ctx context.Context, h host.Host, tracer pubsub.EventTracer, hostId string, topicName string) {
	ps, err := initPubsub(ctx, h, tracer)
	if err != nil {
		panic(err)
	}
	err = setupDiscovery(ctx, h)
	if err != nil {
		panic(err)
	}

	if len(hostId) == 0 {
		hostId, err = os.Hostname()
		if err != nil {
			panic(err)
		}
	}
	if len(topicName) == 0 {
		topicName = hostId + "-topic"
	}

	cp, err := CreateTopic(ctx, ps, h.ID(), hostId, topicName)
	if err != nil {
		panic(err)
	}

	cp.startPublishing()
}

func createTracerPeerId(idPath string) peer.ID {
	var r io.Reader
	r = rand.Reader
	priv, _, err := crypto.GenerateKeyPairWithReader(crypto.RSA, 2048, r)

	bufPrivTrc, err := crypto.MarshalPrivateKey(priv)
	if err != nil {
		panic(err)
	}

	err = ioutil.WriteFile(idPath, bufPrivTrc, 0644)
	if err != nil {
		panic(err)
	}

	peerTrcId, err := peer.IDFromPrivateKey(priv)
	if err != nil {
		panic(err)
	}
	err = ioutil.WriteFile(idPath+"_str", []byte(peerTrcId.Pretty()), 0644)
	if err != nil {
		panic(err)
	}

	fmt.Printf("Trace peer ID initialized in %s. String format can be found in %s. \n", idPath, idPath+"_str")

	return peerTrcId
}

// defaultHostId generates a hostId based on the $HOST_ID, the type of the peer (agent / publisher) environment variable and
// the last 8 chars of a peer ID.
func defaultHostId(p peer.ID, prefix string) string {
	if os.Getenv("HOST_ID") == "" {
		return fmt.Sprintf("%s-%s", prefix, shortID(p))
	}
	return fmt.Sprintf("%s-%s-%s", prefix, os.Getenv("HOST_ID"), shortID(p))
}

// shortID returns the last 8 chars of a base58-encoded peer id.
func shortID(p peer.ID) string {
	pretty := p.Pretty()
	return pretty[len(pretty)-8:]
}

// discoveryNotifee gets notified when we find a new peer via mDNS discovery
type discoveryNotifee struct {
	h host.Host
}

// HandlePeerFound connects to peers discovered via mDNS. Once they're connected,
// the PubSub system will automatically startPublisher interacting with them if they also
// support PubSub.
func (n *discoveryNotifee) HandlePeerFound(pi peer.AddrInfo) {
	fmt.Printf("discovered new peer %s\n", pi.ID.Pretty())
	err := n.h.Connect(context.Background(), pi)
	if err != nil {
		fmt.Printf("error connecting to peer %s: %s\n", pi.ID.Pretty(), err)
	}
}

// setupDiscovery creates an mDNS discovery service and attaches it to the libp2p Host.
// This lets us automatically discover peers on the same LAN and connect to them.
func setupDiscovery(ctx context.Context, h host.Host) error {
	// setup mDNS discovery to find local peers
	disc, err := discovery.NewMdnsService(ctx, h, DiscoveryInterval, DiscoveryServiceTag)
	if err != nil {
		return err
	}

	n := discoveryNotifee{h: h}
	disc.RegisterNotifee(&n)
	return nil
}
