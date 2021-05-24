import {ASAP} from "downsample";

export function downSampleTimeseries(completeTimeseries, nbPublishers, targetResolution = 600) {
  let mergedData = [];
  for (let i = 1; i <= nbPublishers; i++) {
    const st = completeTimeseries.map(t => [t[0], t[i]])
    const ds = ASAP(st, targetResolution)
    if (!mergedData.length) {
      mergedData = ds.map(t => [Math.floor(t.x), Math.floor(t.y)])
      continue
    }
    mergedData.forEach((t, index) => t.push(Math.floor(ds[index]?.y)))
  }
  return mergedData;
}

export function downSample(data, targetResolution = 600) {
  return ASAP(data, targetResolution).map(xy => ({x: Math.floor(xy.x), y: Math.floor(xy.y)}))
}