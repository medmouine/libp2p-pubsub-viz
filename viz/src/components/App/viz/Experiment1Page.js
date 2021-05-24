import React from 'react'
import Loader from "react-loader-spinner";
import {ExperimentWrapper} from "./ExperimentWrapper";
import BarGraphComparison from "./bars/BarGraphComparison";
import BarGraphSummarySingleRun from "./bars/BarGraphPerPeer";
import {DelaysTimeseries} from "./timeseries/DelaysTimeseries";
import {HopsTimeseries} from "./timeseries/HopsTimeseries";
import {HopsByDelayScatter} from "./timeseries/HopsByDelayScatter";
import {DelaysCDFAreaChart} from "./timeseries/DelaysCDFAreaChart";
import {CDFLineChartComparison} from "./timeseries/CDFLineChartComparison";

export default function ({isLoading, experiment: exp}) {

  console.log(exp)
  return (
      <div>
        {isLoading ?
            <Loader
                type="Puff"
                color="#00BFFF"
                height={100}
                width={100}
            /> :
            <ExperimentWrapper {...exp.experimentDescription}>
              {exp.barCharts.multiRuns.map((chart, ci) => (
                  <BarGraphComparison key={'mr-' + ci}
                                      runs={exp.runs}
                                      title={chart.title}
                                      {...chart.props}
                  />
              ))}
              {exp.barCharts.singleRuns.map((chart, ci) => (
                  exp.runs.map((run, ri) => (
                      <BarGraphSummarySingleRun key={'sr-' + ri + '-' + ci}
                                                run={run}
                                                title={chart.title + ' (' + run.description.id + ')'}
                                                {...chart.props}
                      />
                  ))
              ))}
              <h2 className={'breaker-note'}>**Note: For Timeseries, data has been down sampled using <a
                  target="_blank" href="https://arxiv.org/pdf/1703.00983.pdf"> the ASAP Algorithm</a> with TR =
                180</h2>
              {exp.lineCharts.delays.singleRuns.map((chart, ci) => (
                  exp.runs.map((run, ri) => (
                      <DelaysTimeseries key={'sr-' + ri + '-' + ci}
                                        run={run}
                                        title={chart.title + ' (' + run.description.id + ')'}
                                        brush={ri === exp.runs.length - 1}
                                        {...chart.props}
                      />
                  ))
              ))}
              {exp.lineCharts.hops.singleRuns.map((chart, ci) => (
                  exp.runs.map((run, ri) => (
                      <HopsTimeseries key={'sr-' + ri + '-' + ci}
                                      run={run}
                                      title={chart.title + ' (' + run.description.id + ')'}
                                      brush={ri === exp.runs.length - 1}
                                      {...chart.props}
                      />
                  ))
              ))}
              {exp.lineCharts.hopsByDelays.singleRuns.map((chart, ci) => (
                  exp.runs.map((run, ri) => (
                      <HopsByDelayScatter
                          key={'sr-' + ri + '-' + ci}
                          run={run}
                          title={chart.title + ' (' + run.description.id + ')'}
                          {...chart.props}
                      />

                  ))
              ))}
              {
                exp.runs.map((run, ri) => (
                    <DelaysCDFAreaChart
                        run={run}
                        id={ri}
                        brush={ri === exp.runs.length - 1}
                        title={exp.lineCharts.cdf.title + ' (' + run.description.id + ')'}
                        {...exp.lineCharts.cdf.props}/>
                ))
              }
              <CDFLineChartComparison
                  runs={exp.runs}
                  title={exp.lineCharts.cdfComparison.title}
                  {...exp.lineCharts.cdfComparison.props}/>
            </ExperimentWrapper>
        }
      </div>

  )
}