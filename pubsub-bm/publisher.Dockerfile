FROM golang:alpine

ENV GO111MODULE=on \
    CGO_ENABLED=0 \
    GOOS=linux \
    GOARCH=amd64

WORKDIR /build

COPY go.mod .
COPY go.sum .
COPY . .

WORKDIR /build

RUN go build -o main .

WORKDIR /dist
RUN cp /build/main .

EXPOSE 4242

ENTRYPOINT ["/dist/main"]
