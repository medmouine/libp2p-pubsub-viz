# go-libp2p-pubsub viz by Med Mouine

### How to run
See respective READMEs of `pubsub-bm` and `viz` to run experiments and visualize the resulting data.

Sample data is provided by default in this repository.

Experiments:

| Expriment        | # Publishers           | # Consumers  | Connection manager | Pubsub protocol|Duration|
| ------------- |-------------      | -----         |---                |---|               ---|
| Experiment 1 (Control 1)   |           2      | 30                | lw: 100, hw: 400 (default) |  GossipSub (default)       |30 minutes|
| Experiment 2    |           ***4***      | 30                | lw: 100, hw: 400 (default) |  GossipSub (default)       |30 minutes|
| Experiment 3    |           2      | 30                | ***lw: 3, hw: 7***  |  GossipSub (default)       |10 minutes|
| Experiment 4  (Control 2)  |           2      | 30                | lw: 100, hw: 400 (default) |  GossipSub (default)       |10 minutes|
| Experiment 5    |           2      | 30                | lw: 100, hw: 400 (default) |  ***FloodSub***       |10 minutes|
| Experiment 6    |           2      | 30                | lw: 100, hw: 400 (default) |  ***RandomSub***       |10 minutes|

