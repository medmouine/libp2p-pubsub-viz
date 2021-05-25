import React, { useState, useEffect } from "react";
import {
  CartesianGrid,
  Legend,
  Label,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Brush,
} from "recharts";
import { downSampleTimeseries } from "./common";

const COLORS = ["#A5243D", "#631D76", "#201A23", "#84DCCF"];
const buildHopsTimeseries = (run) => {
  const nbPublishers = run.description.nb_publishers;
  const messages = run.data.Delays.PerMessage;
  let delays = [];

  Object.keys(messages).forEach((m, i) => {
    const t = Math.floor(i / nbPublishers) * 5;
    if (i % nbPublishers === 0) {
      delays.push([t, messages[m].length]);
    } else {
      delays[(i - (i % nbPublishers)) / nbPublishers].push(messages[m].length);
    }
  });

  return delays;
};

export function HopsTimeseries({ run, title, syncId, brush, TR }) {
  const [formattedData, setFormattedData] = useState([]);

  useEffect(() => {
    setFormattedData(
      downSampleTimeseries(
        buildHopsTimeseries(run),
        run.description.nb_publishers,
        TR
      )
    );
  }, [run]);

  return (
    <div className="linechart-container">
      <h2>{title}</h2>
      <ResponsiveContainer minWidth={300} minHeight={300}>
        <LineChart
          syncId={syncId}
          data={formattedData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 30,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            // scale={'auto'}
            dataKey={"0"}
            // type={"number"}
            domain={["auto", 1800]}
            minTickGap={120}
          >
            <Label value="t (s)" offset={-10} position="insideBottom" />
          </XAxis>
          <YAxis
            type="number"
            label={{ value: "Delay (ms)", angle: -90, position: "insideLeft" }}
            domain={[0, 40]}
            allowDataOverflow
          />
          <Tooltip />
          <Legend verticalAlign="top" height={0} />
          {Array(run.description.nb_publishers)
            .fill()
            .map((_, i) => (
              <Line
                name={"Publisher " + (i + 1)}
                strokeWidth={2}
                type={"linear"}
                dataKey={i + 1}
                stroke={COLORS[i]}
                dot={false}
              />
            ))}
          {!!brush && <Brush stroke="#8884d8" />}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
