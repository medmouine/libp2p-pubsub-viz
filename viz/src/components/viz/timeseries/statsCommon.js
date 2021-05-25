import * as stats from "simple-statistics";
import * as mathjs from "mathjs";

export const getGlobalStats = (normalizedDelaysPerHopPerMessage) => {
  const muDelay = stats.mean(
    normalizedDelaysPerHopPerMessage.map((m) => m.delay)
  );
  const muHops = stats.mean(
    normalizedDelaysPerHopPerMessage.map((m) => m.hopsCount)
  );
  const sigmaDelay = stats.standardDeviation(
    normalizedDelaysPerHopPerMessage.map((m) => m.delay)
  );
  const sigmaHops = stats.standardDeviation(
    normalizedDelaysPerHopPerMessage.map((m) => m.hopsCount)
  );
  const hopsCount = stats.sum(
    normalizedDelaysPerHopPerMessage.map((m) => m.hopsCount)
  );
  const maxDelay = stats.max(
    normalizedDelaysPerHopPerMessage.map((m) => m.delay)
  );
  return {
    maxDelay,
    hopsCount,
    muDelay,
    muHops,
    sigmaDelay,
    sigmaHops,
  };
};

export const cdfNormal = (x, mu, sigma) => {
  return (1 - mathjs.erf((mu - x) / (Math.sqrt(2) * sigma))) / 2;
};

export const formatMessages = (run) => {
  const normalizedDelaysPerHopPerMessage = Object.values(
    run.data.Delays.PerMessage
  ).map((delays) =>
    delays.map((d, i) => (delays[i - 1] !== undefined ? d - delays[i - 1] : d))
  );
  return normalizedDelaysPerHopPerMessage.map((dh, i) => ({
    meanDelayPerHop: stats.mean(dh),
    delay: stats.max(dh),
    delayVariance: stats.variance(dh),
    delayMedian: stats.median(dh),
    hopsCount: dh.length,
    message: i,
  }));
};
