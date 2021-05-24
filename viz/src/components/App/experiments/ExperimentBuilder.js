export function buildFirstExperimentMetadata(experimentResults) {
  return {
    barCharts: {
      multiRuns: [{
        title: "Events summary",
        props: {}
      }, {
        title: "Normalized events summary (v/#pub)",
        props: {
          norm: true
        }
      }, {
        title: "Events summary Per Peer (v/peer)",
        props: {
          sigma: true
        }
      },
        {
          title: "Normalized events summary Per Peer (v/peer/#pub)",
          props: {
            sigma: true,
            norm: true
          }
        }],
      singleRuns: [
        {
          title: "Events summary Per Peer",
          props: {}
        }, {
          title: "Normalized events summary Per Peer",
          props: {
            norm: true
          }
        }
      ]
    },
    lineCharts: {
      cdfComparison: {
        title: "Delays(ms) CDF",
        props: {}
      },
      cdf: {
        title: "Delays(ms) CDF comparison",
        props: {
          syncId: 'exp1_cdf_solo'
        }
      },
      hopsByDelays: {
        singleRuns: [
          {
            title: "Hops count distribution by delay(ms) by Publisher",
            props: {}
          },
        ]
      },
      delays: {
        singleRuns: [
          {
            title: "Delay(ms) per message by Publisher",
            props: {
              syncId: 'exp1_delay_solo'
            }
          },
        ]
      },
      hops: {
        singleRuns: [
          {
            title: "Hops count per message by Publisher",
            props: {
              syncId: 'exp1_hops_solo'
            }
          },
        ]
      }
    },
    runs: experimentResults.map(r => ({
      ...r,
      description: {
        ...r.description,
        id: r.description.nb_publishers + ' Publishers',
      },
    })),
    experimentDescription: {
      title: "Experiment #1",
      details: "Varying publishers number comparison",
      variables: [
        {
          label: "Number of Publishers",
          values: experimentResults.map(r => r.description.nb_publishers)
        }
      ],
      properties: [
        {
          label: "Pubsub Protocol",
          value: "GossipSub"
        },
        {
          label: "Duration",
          value: "30 minutes"
        },
        {
          label: "Number of Consumers",
          value: 30
        },
      ]
    }
  };
}

export function buildSecondExperimentMetadata(experimentResults) {
  return {
    barCharts: {
      multiRuns: [{
        title: "Events summary",
        props: {}
      }, {
        title: "Events summary Per Peer (v/peer)",
        props: {
          sigma: true
        }
      }],
      singleRuns: [
        {
          title: "Events summary Per Peer",
          props: {}
        },
      ]
    },
    lineCharts: {
      cdf: {
        title: "Delays(ms) CDF",
        props: {
          syncId: 'exp1_cdf_solo'
        }
      },
      cdfComparison: {
        title: "Delays(ms) CDF comparison",
        props: {}
      },
      hopsByDelays: {
        singleRuns: [
          {
            title: "Hops count distribution by delay(ms) by Publisher",
            props: {}
          },
        ]
      },
      delays: {
        singleRuns: [{
          title: "Delay(ms) per message by Publisher",
          props: {
            syncId: 'exp1_delay_solo'
          }
        },]
      },
      hops: {
        singleRuns: [
          {
            title: "Hops count per message by Publisher",
            props: {
              syncId: 'exp1_hops_solo'
            }
          },
        ]
      }
    },
    runs: experimentResults.map(r => ({
      ...r,
      description: {
        ...r.description,
        id: r.description.spec,
      },
    })),
    experimentDescription: {
      title: "Experiment #2",
      details: "Grafting and pruning: Connection manager is set to low-water=3 high-water=7. Comparison with control case",
      variables: [
        {
          label: "#Peer connections allowed",
          values: experimentResults.map(r => r.description.peerConnections)
        }
      ],
      properties: [
        {
          label: "Number of Publishers",
          value: 2
        },
        {
          label: "Pubsub Protocol",
          value: "GossipSub"
        },
        {
          label: "Duration",
          value: "10 minutes"
        },
        {
          label: "Number of Consumers",
          value: 30
        },
      ]
    }
  };
}

export function buildThirdExperimentMetadata(experimentResults) {
  return {
    barCharts: {
      multiRuns: [{
        title: "Events summary",
        props: {}
      }, {
        title: "Events summary Per Peer (v/peer)",
        props: {
          sigma: true
        }
      }],
      singleRuns: [
        {
          title: "Events summary Per Peer",
          props: {}
        },
      ]
    },
    lineCharts: {
      cdfComparison: {
        title: "Delays(ms) CDF comparison",
        props: {}
      },
      cdf: {
        title: "Delays(ms) CDF",
        props: {
          syncId: 'exp1_cdf_solo'
        }
      },

      hopsByDelays: {
        singleRuns: [
          {
            title: "Hops count distribution by delay(ms) by Publisher",
            props: {}
          },
        ]
      },
      delays: {
        singleRuns: [
          {
            title: "Delay(ms) per message by Publisher",
            props: {
              syncId: 'exp1_delay_solo'
            }
          },
        ]
      },
      hops: {
        singleRuns: [
          {
            title: "Hops count per message by Publisher",
            props: {
              syncId: 'exp1_hops_solo'
            }
          },
        ]
      }
    },
    runs: experimentResults.map(r => ({
      ...r,
      description: {
        ...r.description,
        id: r.description.psp,
      },
    })),
    experimentDescription: {
      title: "Experiment #3",
      details: "Pubsub protocols comparison",
      variables: [
        {
          label: "Pubsub protocol",
          values: experimentResults.map(r => r.description.psp)
        }
      ],
      properties: [
        {
          label: "Number of Publishers",
          value: 2
        },
        {
          label: "Number of Consumers",
          value: 30
        },
        {
          label: "Duration",
          value: "30 minutes"
        },

      ]
    }
  };
}