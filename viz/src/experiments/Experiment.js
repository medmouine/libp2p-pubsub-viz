import React from "react";
import Loader from "react-loader-spinner";
import { ExperimentWrapper } from "./ExperimentWrapper";
import { ChartType } from "./types";

export default ({ isLoading, experiment: exp }) => (
  <div>
    {isLoading ? (
      <Loader type="Puff" color="#00BFFF" height={100} width={100} />
    ) : (
      <ExperimentWrapper {...exp.experimentDescription}>
        {exp.charts
          .map((chart, i) => {
            if (chart.type === ChartType.BREAKER) return chart.getComponent();
            if (chart.type === ChartType.MULTI)
              return chart.getComponent(i, exp.runs);
            if (chart.type === ChartType.SOLO)
              return exp.runs.map((run, ri) =>
                chart.getComponent(
                  i + "_" + ri,
                  run,
                  ri === exp.runs.length - 1,
                  ri
                )
              );
          })
          .flat()}
      </ExperimentWrapper>
    )}
  </div>
);
