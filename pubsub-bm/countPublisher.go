package main

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/libp2p/go-libp2p-core/peer"
	"time"

	pubsub "github.com/libp2p/go-libp2p-pubsub"
)

type PublisherTopic struct {
	ctx   context.Context
	ps    *pubsub.PubSub
	topic *pubsub.Topic
	sub   *pubsub.Subscription

	topicName string
	self      peer.ID
	id        string
}

type PublisherMessage struct {
	Message      string
	SenderID     string
	SenderHostId string
}

func CreateTopic(ctx context.Context, ps *pubsub.PubSub, selfID peer.ID, hostId string, topicName string) (*PublisherTopic, error) {
	topic, err := ps.Join(topicName)
	if err != nil {
		return nil, err
	}

	pt := &PublisherTopic{
		ctx:       ctx,
		ps:        ps,
		topic:     topic,
		self:      selfID,
		id:        hostId,
		topicName: topicName,
	}

	return pt, nil
}

func (pt *PublisherTopic) startPublishing() {
	fmt.Printf("Starting publisher on topic [%s]\n", pt.topicName)
	pt.writeCountLoop()
}

func (pt *PublisherTopic) Publish(message string) error {
	m := PublisherMessage{
		Message:      message,
		SenderID:     pt.self.Pretty(),
		SenderHostId: pt.id,
	}
	msgBytes, err := json.Marshal(m)
	if err != nil {
		return err
	}
	return pt.topic.Publish(pt.ctx, msgBytes)
}

func (pt *PublisherTopic) writeCountLoop() {
	var count = 0
	for {
		count = count + 1
		time.Sleep(5 * time.Second)
		fmt.Printf("Published message #%i from %s", count, pt.id)

		err := pt.Publish(fmt.Sprintf("Published message #%d", count))
		if err != nil {
			fmt.Printf("error publishing message #%d: %v\n", count, err)
		}
	}
}
