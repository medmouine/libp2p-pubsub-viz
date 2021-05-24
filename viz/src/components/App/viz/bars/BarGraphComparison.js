import React, {useState, useEffect} from 'react';
import {BarChart, Bar, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, Label} from "recharts";

function normalizeSummary(run, factor) {
  const valuesToNormalize = ['Publish', 'Deliver', 'Duplicate', 'SendRPC'];
  valuesToNormalize.forEach(v => {
    run[v] = Math.round(run[v] / factor)
  })

  return run
}

const getSigmaSummary = (runs, norm) => {
  if (norm) return getNormalizedSummary(runs).map(r => normalizeSummary(r, r.nbPeers))
  return getDefaultRunsSummary(runs).map(r => normalizeSummary(r, r.nbPeers))
};

const getNormalizedSummary = runs => {
  return getDefaultRunsSummary(runs).map(r => normalizeSummary(r, r.nbPublisher))
};

const getDefaultRunsSummary = (runs) => runs.map(r => ({
  ...r.data.Events.Totals,
  id: r.description.id,
  nbPublisher: r.description.nb_publishers,
  nbPeers: Object.keys(r.data.Events.PerPeer).length
}));

const BarGraphComparison = ({runs, title, norm, sigma}) => {
  const [formattedData, setFormattedData] = useState([])

  useEffect(() => {
    if (sigma) {
      return setFormattedData(getSigmaSummary(runs, norm))
    }

    if (norm) {
      return setFormattedData(getNormalizedSummary(runs))
    }


    setFormattedData(getDefaultRunsSummary(runs));

  }, [runs])

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
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="id"/>
            <YAxis/>
            <Tooltip/>
            <Legend/>
            <Bar dataKey="Publish" fill="#FFCAD4"/>
            <Bar dataKey="Deliver" fill="#B0D0D3"/>
            <Bar dataKey="Duplicate" fill="#C08497"/>
            <Bar dataKey="SendRPC" fill="#F7AF9D"/>
          </BarChart>
        </ResponsiveContainer>
        <h3 className="chart-title">{title}</h3>
      </div>
  );
}


export default BarGraphComparison;