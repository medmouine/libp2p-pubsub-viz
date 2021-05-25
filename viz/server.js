const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const ndjson = require("ndjson");
const querystring = require("querystring");

const NB_EXPERIMENTS = 6;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.static(path.resolve(__dirname, "build")));

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

app.get("/api/results/all", async (req, res) => {
  const data = [];
  for (let i = 1; i <= NB_EXPERIMENTS; i++) {
    const result = JSON.parse(
      await fs.readFileSync(__dirname + `/data/exp${i}/result.json`)
    );
    const description = JSON.parse(
      await fs.readFileSync(__dirname + `/data/exp${i}/description.json`)
    );
    data.push({ description, data: result });
  }

  res.send(data);
});

app.get("/api/results/:expId", async (req, res) => {
  const result = await fs.readFileSync(
    __dirname + `/data/exp${req.params.expId}/result.json`
  );

  res.send(JSON.parse(result));
});

app.get("/api/trace/:expId/bounds", (req, res) => {
  const readStream = fs
    .createReadStream(__dirname + `/data/exp${req.params.expId}/trace.ndjson`)
    .pipe(ndjson.parse());
  readStream.on("data", (data) => {
    const normTs = data.timestamp / 1000; // Convert timestamp to ms
    if (req.query.start && req.query.end) {
      if (req.query.start <= normTs && req.query.end >= normTs) {
        res.write(JSON.stringify(data) + "\n");
        return;
      }
      if (req.query.end < normTs) {
        readStream.pause();
        res.end();
      }
    } else {
      res.status(400).json({ error: "no bounds" });
    }
  });

  readStream.on("end", () => {
    res.end();
  });
});

app.get("/api/trace/expId/lines", (req, res) => {
  const readStream = fs
    .createReadStream(__dirname + `/data/exp${req.params.expId}/trace.ndjson`)
    .pipe(ndjson.parse());
  let count = 0;
  readStream.on("data", (data) => {
    if (req.query.lines && req.query.lines <= count) {
      readStream.pause();
      res.end();
    } else {
      res.write(JSON.stringify(data) + "\n");
      ++count;
    }
  });

  readStream.on("end", () => {
    res.end();
  });
});

app.get("/api/trace/:expId/all", (req, res) => {
  const readStream = fs
    .createReadStream(__dirname + `/data/exp${req.params.expId}/trace.ndjson`)
    .pipe(ndjson.parse());
  readStream.on("data", (data) => {
    if (!!data) {
      readStream.pause();
      res.end();
    } else {
      res.write(JSON.stringify(data) + "\n");
    }
  });

  readStream.on("end", () => {
    res.end();
  });
});

const listener = app.listen(5000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
