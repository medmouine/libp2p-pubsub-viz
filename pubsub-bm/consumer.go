package main

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/libp2p/go-libp2p-core/peer"
	pubsub "github.com/libp2p/go-libp2p-pubsub"
)

const messageBuffSize = 128

type Topic struct {
	Messages chan *PublisherMessage

	ctx   context.Context
	ps    *pubsub.PubSub
	topic *pubsub.Topic
	sub   *pubsub.Subscription

	topicName string
	self      peer.ID
	id        string
}

func JoinTopic(ctx context.Context, ps *pubsub.PubSub, selfID peer.ID, hostId string, topicName string) (*Topic, error) {
	topic, err := ps.Join(topicName)
	if err != nil {
		return nil, err
	}
	sub, err := topic.Subscribe()
	if err != nil {
		return nil, err
	}

	t := &Topic{
		ctx:       ctx,
		ps:        ps,
		topic:     topic,
		sub:       sub,
		self:      selfID,
		id:        hostId,
		topicName: topicName,
		Messages:  make(chan *PublisherMessage, messageBuffSize),
	}

	fmt.Printf("Listening on topic [%s]...\n", topicName)
	go t.readLoop()
	return t, nil
}

func (t *Topic) readLoop() {
	for {
		msg, err := t.sub.Next(t.ctx)
		if err != nil {
			close(t.Messages)
			return
		}
		// only forward messages delivered by others
		if msg.ReceivedFrom == t.self {
			continue
		}
		pm := new(PublisherMessage)
		err = json.Unmarshal(msg.Data, pm)
		if err != nil {
			continue
		}
		// send valid messages onto the Messages channel
		fmt.Printf("Consumed message \"%s\" on topic [%s] from Publisher [%s:%s]\n", pm.Message, t.topicName, pm.SenderHostId, pm.SenderID)
		t.Messages <- pm
	}
}
