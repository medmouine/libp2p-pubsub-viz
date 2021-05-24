import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
  Brush,
  LineChart
} from 'recharts';

const COLORS = ['#A5243D', '#631D76', '#201A23', '#84DCCF']
export function DelaysCDFAreaChart({run, title, id, brush, syncId}) {

  return (
      <div className="linechart-container">
        <h3 className="chart-title">{title}</h3>
        <ResponsiveContainer minWidth={300} minHeight={300}>
          <AreaChart
              syncId={syncId}
              data={run.data.Delays.CDF}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 30,
              }}
          >
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis
                domain={['dataMin', 'dataMax + 300']}
                name="Delays(ms)"
                unit={'ms'}
                dataKey="Millis"
                minTickGap={100}
            >
              <Label value="Delay (ms)" offset={-5} position="insideBottom"/>
            </XAxis>
            <YAxis
                domain={['dataMin', 'dataMax']}
                type="number"
                label={{value: 'Occurence', angle: -90, position: 'left'}}
            />
            <Tooltip/>
            <Area type="monotone" dataKey="Count" stroke={COLORS[id]} fill={COLORS[id]}/>
            {!!brush && <Brush stroke="#8884d8"/>}
          </AreaChart>
        </ResponsiveContainer>
      </div>
  )
}