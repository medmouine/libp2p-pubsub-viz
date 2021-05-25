import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Label,
} from "recharts";

const getDefaultSummaryPerPeer = (run) => {
  return Object.keys(run.data.Events.PerPeer)
    .sort((p1, p2) => {
      return (
        run.data.Events.PerPeer[p2].Publish -
        run.data.Events.PerPeer[p1].Publish
      );
    })

    .map((p, i) => ({
      index: i + 1,
      id: p,
      ...run.data.Events.PerPeer[p],
    }));
};

const getNormalizedSummaryPerPeer = (run, nbPublishers) => {
  const defaultRunSummaryPerPeer = getDefaultSummaryPerPeer(run);
  const valuesToNormalize = ["Publish", "Deliver", "Duplicate", "SendRPC"];

  return defaultRunSummaryPerPeer.map((p) => {
    valuesToNormalize.forEach((v) => {
      p[v] = Math.round(p[v] / nbPublishers);
    });
    return p;
  });
};

export const BarGraphSummaryPerPeer = ({ run, title, norm }) => {
  const [formattedData, setFormattedData] = useState([]);

  useEffect(() => {
    if (norm) {
      return setFormattedData(
        getNormalizedSummaryPerPeer(run, run.description.nb_publishers)
      );
    }

    setFormattedData(getDefaultSummaryPerPeer(run));
  }, [run]);

  return (
    <div className="chart-container">
      <ResponsiveContainer minWidth={300} minHeight={300}>
        <BarChart
          data={formattedData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="index" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Publish" stackId="a" fill="#FFCAD4" />
          <Bar dataKey="Deliver" stackId="a" fill="#B0D0D3" />
          <Bar dataKey="Duplicate" stackId="a" fill="#C08497" />
          <Bar dataKey="SendRPC" stackId="a" fill="#F7AF9D" />
        </BarChart>
      </ResponsiveContainer>
      <h3 className="chart-title">{title}</h3>
    </div>
  );
};
