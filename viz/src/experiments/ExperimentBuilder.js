import React from "react";
import { ChartType } from "./types";
import {
  BarGraphComparison,
  BarGraphSummaryPerPeer,
} from "../components/viz/bars";
import {
  DelaysCDF,
  DelaysTimeseries,
  HopsByDelayScatter,
  HopsTimeseries,
} from "../components/viz/timeseries";

const TR_EXP1 = 180;
const TR_EXP2 = 180;
const TR_EXP3 = 180;
const buildFirstExperimentMetadata = (experimentResults) => ({
  runs: experimentResults.map((r) => ({
    ...r,
    description: {
      ...r.description,
      displayName: r.description.nb_publishers + " Publishers",
    },
  })),
  experimentDescription: {
    title: "Experiment #1",
    details: "Varying publishers number comparison",
    variables: [
      {
        label: "Number of Publishers",
        values: experimentResults.map((r) => r.description.nb_publishers),
      },
    ],
    properties: [
      {
        label: "Pubsub Protocol",
        value: "GossipSub",
      },
      {
        label: "Duration",
        value: "30 minutes",
      },
      {
        label: "Number of Consumers",
        value: 30,
      },
      {
        label: "Connection manager",
        value: "[100, 400] (Default)",
      },
    ],
  },
  charts: [
    {
      getComponent: (key, runs) => (
        <BarGraphComparison key={key} runs={runs} title={"Events summary"} />
      ),
      type: ChartType.MULTI,
    },
    {
      getComponent: (key, runs) => (
        <BarGraphComparison
          key={key}
          runs={runs}
          title={"Normalized events summary (v/#pb)"}
          norm
        />
      ),
      type: ChartType.MULTI,
    },
    {
      getComponent: (key, runs) => (
        <BarGraphComparison
          key={key}
          runs={runs}
          title={"Events summary Per Peer (v/peer)"}
          sigma
        />
      ),
      type: ChartType.MULTI,
    },
    {
      getComponent: (key, runs) => (
        <BarGraphComparison
          key={key}
          runs={runs}
          title={"Normalized events summary Per Peer (v/peer/#pb)"}
          sigma
          norm
        />
      ),
      type: ChartType.MULTI,
    },
    {
      getComponent: (key, run) => (
        <BarGraphSummaryPerPeer
          key={key}
          run={run}
          title={
            "Events summary Per Peer (" + run.description.displayName + ")"
          }
        />
      ),
      type: ChartType.SOLO,
      title: "Events summary Per Peer",
      props: {},
    },
    {
      getComponent: (key, run) => (
        <BarGraphSummaryPerPeer
          key={key}
          run={run}
          title={
            "Normalized events summary Per Peer (" +
            run.description.displayName +
            ")"
          }
          norm
        />
      ),
      type: ChartType.SOLO,
    },
    {
      type: ChartType.BREAKER,
      getComponent: () => (
        <h2 className={"breaker-note"}>
          **Note: For Timeseries, data has been down sampled using{" "}
          <a target="_blank" href="https://arxiv.org/pdf/1703.00983.pdf">
            {" "}
            the ASAP Algorithm
          </a>{" "}
          with TR = {TR_EXP1}
        </h2>
      ),
    },
    {
      type: ChartType.SOLO,
      getComponent: (key, run, brush) => (
        <DelaysTimeseries
          TR={TR_EXP1}
          syncId={"exp1_delay_solo"}
          key={key}
          run={run}
          title={
            "Delay(ms) per message by Publisher (" +
            run.description.displayName +
            ")"
          }
          brush={brush}
        />
      ),
    },
    {
      getComponent: (key, run, brush) => (
        <HopsTimeseries
          syncId={"exp1_hops_solo"}
          key={key}
          run={run}
          title={
            "Hops count per message by Publisher (" +
            run.description.displayName +
            ")"
          }
          brush={brush}
        />
      ),
      type: ChartType.SOLO,
    },
    {
      getComponent: (key, run) => (
        <HopsByDelayScatter
          TR={TR_EXP1}
          key={key}
          run={run}
          title={
            "Hops count distribution by delay(ms) (" +
            run.description.displayName +
            ")"
          }
        />
      ),
      type: ChartType.SOLO,
    },
    {
      getComponent: (key, runs, runId) => (
        <DelaysCDF runs={runs} id={runId} title={"Delays(ms) CDF"} />
      ),
      type: ChartType.MULTI,
    },
  ],
});

const buildSecondExperimentMetadata = (experimentResults) => ({
  runs: experimentResults.map((r) => ({
    ...r,
    description: {
      ...r.description,
      displayName: r.description.spec,
    },
  })),
  experimentDescription: {
    title: "Experiment #2",
    details:
      "Grafting and pruning: Connection manager is set to low-water=3 high-water=7. Comparison with control case",
    variables: [
      {
        label: "#Peer connections allowed",
        values: experimentResults.map((r) => r.description.peerConnections),
      },
    ],
    properties: [
      {
        label: "Number of Publishers",
        value: 2,
      },
      {
        label: "Pubsub Protocol",
        value: "GossipSub",
      },
      {
        label: "Duration",
        value: "10 minutes",
      },
      {
        label: "Number of Consumers",
        value: 30,
      },
    ],
  },
  charts: [
    {
      getComponent: (key, runs) => (
        <BarGraphComparison key={key} runs={runs} title={"Events summary"} />
      ),
      type: ChartType.MULTI,
    },
    {
      getComponent: (key, runs) => (
        <BarGraphComparison
          key={key}
          runs={runs}
          title={"Events summary Per Peer (v/peer)"}
          sigma
        />
      ),
      type: ChartType.MULTI,
    },
    {
      getComponent: (key, run) => (
        <BarGraphSummaryPerPeer
          key={key}
          run={run}
          title={
            "Events summary Per Peer (" + run.description.displayName + ")"
          }
        />
      ),
      type: ChartType.SOLO,
      title: "Events summary Per Peer",
      props: {},
    },
    {
      type: ChartType.BREAKER,
      getComponent: () => (
        <h2 className={"breaker-note"}>
          **Note: For Timeseries, data has been down sampled using{" "}
          <a target="_blank" href="https://arxiv.org/pdf/1703.00983.pdf">
            {" "}
            the ASAP Algorithm
          </a>{" "}
          with TR = {TR_EXP2}
        </h2>
      ),
    },
    {
      type: ChartType.SOLO,
      getComponent: (key, run, brush) => (
        <DelaysTimeseries
          TR={TR_EXP2}
          syncId={"exp2_delay_solo"}
          key={key}
          run={run}
          title={"Delay(ms) per message (" + run.description.displayName + ")"}
          brush={brush}
        />
      ),
    },
    {
      getComponent: (key, run, brush) => (
        <HopsTimeseries
          syncId={"exp2_hops_solo"}
          key={key}
          run={run}
          title={"Hops count per message (" + run.description.displayName + ")"}
          brush={brush}
        />
      ),
      type: ChartType.SOLO,
    },
    {
      getComponent: (key, run) => (
        <HopsByDelayScatter
          TR={TR_EXP2}
          key={key}
          run={run}
          title={
            "Hops count distribution by delay(ms) (" +
            run.description.displayName +
            ")"
          }
        />
      ),
      type: ChartType.SOLO,
    },
    {
      getComponent: (key, runs, runId) => (
        <DelaysCDF runs={runs} id={runId} title={"Delays(ms) CDF"} />
      ),
      type: ChartType.MULTI,
    },
  ],
});

const buildThirdExperimentMetadata = (experimentResults) => ({
  runs: experimentResults.map((r) => ({
    ...r,
    description: {
      ...r.description,
      displayName: r.description.psp,
    },
  })),
  experimentDescription: {
    title: "Experiment #3",
    details: "Pubsub protocols comparison",
    variables: [
      {
        label: "Pubsub protocol",
        values: experimentResults.map((r) => r.description.psp),
      },
    ],
    properties: [
      {
        label: "Connection manager",
        value: "[100, 400] (Default)",
      },
      {
        label: "Number of Publishers",
        value: 2,
      },
      {
        label: "Number of Consumers",
        value: 30,
      },
      {
        label: "Duration",
        value: "10 minutes",
      },
    ],
  },
  charts: [
    {
      getComponent: (key, runs) => (
        <BarGraphComparison key={key} runs={runs} title={"Events summary"} />
      ),
      type: ChartType.MULTI,
    },
    {
      getComponent: (key, runs) => (
        <BarGraphComparison
          key={key}
          runs={runs}
          title={"Events summary Per Peer (v/peer)"}
          sigma
        />
      ),
      type: ChartType.MULTI,
    },
    {
      getComponent: (key, run) => (
        <BarGraphSummaryPerPeer
          key={key}
          run={run}
          title={
            "Events summary Per Peer (" + run.description.displayName + ")"
          }
        />
      ),
      type: ChartType.SOLO,
      title: "Events summary Per Peer",
      props: {},
    },
    {
      type: ChartType.BREAKER,
      getComponent: () => (
        <h2 className={"breaker-note"}>
          **Note: For Timeseries, data has been down sampled using{" "}
          <a target="_blank" href="https://arxiv.org/pdf/1703.00983.pdf">
            {" "}
            the ASAP Algorithm
          </a>{" "}
          with TR = {TR_EXP3}
        </h2>
      ),
    },
    {
      type: ChartType.SOLO,
      getComponent: (key, run, brush) => (
        <DelaysTimeseries
          TR={TR_EXP3}
          syncId={"exp3_delay_solo"}
          key={key}
          run={run}
          title={"Delay(ms) per message (" + run.description.displayName + ")"}
          brush={brush}
        />
      ),
    },
    {
      getComponent: (key, run, brush) => (
        <HopsTimeseries
          syncId={"exp3_hops_solo"}
          key={key}
          run={run}
          title={"Hops count per message (" + run.description.displayName + ")"}
          brush={brush}
        />
      ),
      type: ChartType.SOLO,
    },
    {
      getComponent: (key, run) => (
        <HopsByDelayScatter
          TR={TR_EXP3}
          key={key}
          run={run}
          title={
            "Hops count distribution by delay(ms) (" +
            run.description.displayName +
            ")"
          }
        />
      ),
      type: ChartType.SOLO,
    },
    {
      getComponent: (key, runs, runId) => (
        <DelaysCDF
          runs={runs}
          id={runId}
          select={[0, 1]}
          title={"Delays(ms) CDF"}
          nostats={true}
        />
      ),
      type: ChartType.MULTI,
    },
    {
      getComponent: (key, runs, runId) => (
        <DelaysCDF
          range={[0, 100]}
          runs={runs}
          select={[1, 3]}
          id={runId}
          title={"Delays(ms) CDF"}
        />
      ),
      type: ChartType.MULTI,
    },
  ],
});

export default {
  first: buildFirstExperimentMetadata,
  second: buildSecondExperimentMetadata,
  third: buildThirdExperimentMetadata,
};
