import React, {useState, useEffect} from 'react';
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
import {downSampleTimeseries} from "./common";

const COLORS = ['#A5243D', '#631D76', '#201A23', '#84DCCF']
const getDelaysDataPoints = (run) => {
  const nbPublishers = run.description.nb_publishers;
  let delays = []

  Object.keys(run.data.Delays.PerMessage).forEach((m, i) => {
    const t = Math.floor(i / nbPublishers) * 5
    if (i % nbPublishers === 0) {
      delays.push([t, run.data.Delays.PerMessage[m][run.data.Delays.PerMessage[m].length - 1]])
    } else {
      delays[(i - (i % nbPublishers)) / nbPublishers].push(run.data.Delays.PerMessage[m][run.data.Delays.PerMessage[m].length - 1])
    }
  })

  return delays;
}

export function DelaysTimeseries({run, title, syncId, brush, expand}) {
  const [formattedData, setFormattedData] = useState([])

  const DOWNSAMPLE_TR = 180

  useEffect(() => {
    setFormattedData(downSampleTimeseries(getDelaysDataPoints(run), run.description.nb_publishers, DOWNSAMPLE_TR));
  }, [run])

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
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis
                scale="time"
                type="number"
                dataKey="0"
                minTickGap={120}
            >
              <Label value="t (s)" offset={-10} position="insideBottom"/>
            </XAxis>
            <YAxis type="number"
                   label={{value: 'Delay (ms)', angle: -90, position: 'insideLeft'}}
                   domain={[0, 80]}
                   allowDataOverflow/>
            <Tooltip/>
            <Legend verticalAlign="top" height={0}/>
            {
              (Array(run.description.nb_publishers).fill()).map((_, i) => (
                  <Line name={"Publisher " + (i + 1)}
                        strokeWidth={2}
                        type={"linear"}
                        dataKey={i + 1}
                        stroke={COLORS[i]}
                        dot={false}
                  />
              ))
            }
            {!!brush && <Brush stroke="#8884d8"/>}
          </LineChart>
        </ResponsiveContainer>
      </div>
  )
}