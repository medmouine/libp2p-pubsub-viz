FROM golang:alpine

RUN apk add git

RUN git clone https://github.com/libp2p/go-libp2p-pubsub-tracer.git

WORKDIR go-libp2p-pubsub-tracer

RUN go install ./...

EXPOSE 4001

RUN mkdir -p /p2p/data

ENTRYPOINT ["traced"]