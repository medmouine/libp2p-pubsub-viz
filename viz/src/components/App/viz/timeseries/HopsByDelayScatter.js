import React, {useState, useEffect} from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend, ZAxis, Label,
} from 'recharts';
import {downSample} from "./common";

const COLORS = ['#A5243D', '#631D76', '#201A23', '#84DCCF']
const SHAPES = ['circle', 'cross', 'diamond', 'square', 'star', 'triangle']

const buildHopsByDelayScatter = (run) => {
  const nbPublishers = run.description.nb_publishers;
  const delaysPerHops = Array(nbPublishers).fill([])
  const messages = run.data.Delays.PerMessage;

  Object.keys(run.data.Delays.PerMessage).forEach((m, i) => {
    const t = Math.floor(i / nbPublishers) * 5
    const pb = i % nbPublishers;

    delaysPerHops[pb].push([messages[m][messages[m].length - 1], messages[m].length]);
  })

  return delaysPerHops.map(pb => downSample(pb, 180));
}


export function HopsByDelayScatter({run, title}) {
  const [formattedData, setFormattedData] = useState([])

  useEffect(() => {
    setFormattedData(buildHopsByDelayScatter(run));
  }, [run])

  return (
      <div className="chart-container">
        <ResponsiveContainer minWidth={300} minHeight={500}>
          <ScatterChart
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
          >
            <CartesianGrid/>
            <XAxis type="number"
                   padding={{left: 20, right: 20}}
                   domain={[0, 50]}
                   allowDataOverflow
                   dataKey="x"
                   name="Delay(ms)"
                   unit={'ms'}
            >
              <Label value="Delay (ms)" offset={-10} position="insideBottom"/>
            </XAxis>
            <YAxis type="number"
                   padding={{top: 20, bottom: 20}}
                   label={{value: 'Hops', angle: -90, position: 'insideLeft'}}
                   domain={[0, 40]}
                   dataKey="y"
                   name="Hops count"
            />
            <Tooltip cursor={{strokeDasharray: '3 3'}}/>
            <Legend margin={{bottom: 100}} verticalAlign={"top"} align={"left"}/>
            {
              formattedData.map((pb, i) => (
                  <Scatter name={"Publisher " + (i + 1)} data={pb} fill={COLORS[i]} shape={SHAPES[i]}/>
              ))
            }
            {/*<Scatter name="B school" data={data02} fill="#82ca9d" shape="triangle" />*/}
          </ScatterChart>
        </ResponsiveContainer>
        <h3 className="chart-title">{title}</h3>
      </div>
  )
}