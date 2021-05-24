import React from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
  Brush,
  LineChart, Legend, Line
} from 'recharts';
import {downSample} from "./common";

const COLORS = ['#A5243D', '#631D76', '#201A23', '#84DCCF']
export function CDFLineChartComparison({runs, title, id}) {

  return (
      <div className="linechart-container">
        <h3 className="chart-title">{title}</h3>
        <ResponsiveContainer minWidth={300} minHeight={300}>
          <LineChart
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 30,
              }}
          >
            <Legend />
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis
                type="number"
                dataKey="x"
                domain={["dataMax", "dataMax"]}
                minTickGap={100}
            >
              <Label value="Delay (ms)" offset={-5} position="insideBottom"/>
            </XAxis>
            <YAxis
                domain={['dataMin', 'dataMax * 2']}
                type="number"
                label={{value: 'Occurence', angle: -90, position: 'left'}}
            />
            <Tooltip/>
            {
              runs.map((run, i) => (
                  <Line
                      type="monotone"
                      name={run.description.id}
                      data={downSample(run.data.Delays.CDF.map(mc => ([mc.Millis, mc.Count])), 180)}
                      dataKey="y" stroke={COLORS[i]} fill={COLORS[i]}/>
              ))
            }
          </LineChart>
        </ResponsiveContainer>
      </div>
  )
}