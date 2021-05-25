### TLDR
Run 
```bash
docker-compose up
```
To run experiment with default settings:

- 2 publishers
- 30 consumers
- Remote tracer shared between all instances
- Gossipsub
- Default connection manager config (100, 400)


### Generate Peer ID for remote tracer in `volume/trid`
Uncomment first service in `docker-compose.yaml`
Run
```bash
docker-compose run tracer1
```

There a default one provided in the repository.

If tracer is not setup, instances will start with local JSON Tracer and send logs to `/volume/data`.

All zipped trace data will be stored in `/volume`.

Trace in JSON format will be exported to `/volume/data`.

Beware, the tracer is bugged and does not export the whole trace in JSON format.

You can use ***tracestat*** and ***trace2json*** to generate all trace in json format and results summary. 