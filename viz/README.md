This project was bootstrapped
with [Create React App](https://github.com/facebookincubator/create-react-app).

Below you will find some information on how to perform common tasks.<br>
You can find the most recent version of this
guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md)
.

### TLDR

Put your data in `/data/exp<exp_id>` as shown in the existing sample

Run

```bash
yarn install
yarn dev
```

or for production build

```bash
yarn install
yarn build
yarn start:prod
```

Go to `localhost:5000` for vizualisation.

Go to `localhost:5000/api` for the API

available endpoints:

| Endpoint        | Path params           | Query Params  | Returns |
| ------------- |:-------------:| -----:|---|
| `/`    | NA | NA | Return visualization app|
| `/api/results/all`    | NA      |   NA |return all results summaries located in `/data/exp<id>/result.json`|
| `/api/results/:expId` | Experience ID (i.e 1)      |    NA |return results summary located in `/data/exp1/result.json`|
| `/api/trace/:expId/bounds` | Experience ID (i.e 1)      |    start: number, end: number |return specified line bounds from communication trace in ndjson format located in `/data/exp1/trace.ndjson`|
| `/api/trace/:expId/lines` | Experience ID (i.e 1)      |    lines: number | return N next lines from communication trace in ndjson format located in `/data/exp1/trace.ndjson` starting at 0|
| `/api/trace/:expId/all` | NA    |    NA | return full communication trace in ndjson format located in `/data/exp1/trace.ndjson` starting at 0|