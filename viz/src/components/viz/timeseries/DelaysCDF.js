import React, { useEffect, useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
  LineChart,
  Line,
  Legend,
} from "recharts";

import { cdfNormal, formatMessages, getGlobalStats } from "./statsCommon";

const COLORS = ["#A5243D", "#631D76", "#201A23", "#84DCCF"];

export function DelaysCDF({
  runs,
  title,
  nostats,
  range = [0, 1000],
  select = [0, 3],
}) {
  const [sampleData, setSampleData] = useState([]);

  useEffect(() => {
    const formattedRuns = runs.map((run) => ({
      ...run,
      data: formatMessages(run),
    }));

    const datasets = formattedRuns.map((run) => ({
      ...run,
      globals: getGlobalStats(run.data),
    }));

    setSampleData(
      datasets.map((r) => ({
        ...r,
        data: r.data
          .map((m) => ({
            delay: m.delay,
            probability: cdfNormal(
              m.delay,
              r.globals.muDelay,
              r.globals.sigmaDelay
            ),
          }))
          .sort((a, b) => a.delay - b.delay),
      }))
    );
  }, [runs]);

  return (
    <div className="linechart-container">
      <h3 className="chart-title">{title}</h3>
      <ResponsiveContainer minWidth={300} minHeight={300}>
        <LineChart
          data={sampleData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 30,
          }}
        >
          <Legend verticalAlign="top" height={0} />
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            name="Delays(ms)"
            type={"number"}
            dataKey={"delay"}
            allowDataOverflow
            domain={range}
          >
            <Label value="Delay (ms)" offset={-5} position="insideBottom" />
          </XAxis>
          <YAxis
            type="number"
            label={{ value: "ECFD", angle: -90, position: "left" }}
            padding={{ top: 30 }}
          />
          <Tooltip />
          {sampleData.slice(select[0], select[1]).map((d, i) => (
            <Line
              name={d.description.displayName}
              dot={false}
              data={d.data}
              type={"monotone"}
              dataKey="probability"
              strokeWidth={2}
              stroke={COLORS[i]}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      {!nostats && (
        <div>
          <h3>Compiled data:</h3>
          {sampleData.map((d) => (
            <div>
              <h4>{d.description.displayName}</h4>
              <h5>Delay: {JSON.stringify(d.globals)}</h5>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
