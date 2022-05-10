import { range, map, head, reduce, tail, last } from 'ramda'

export const splitPolyline = ({ polyline, gap }) =>
  reduce(
    (dots, pt) => {
      const lastDot = last(dots)
      const distance = Math.sqrt(
        Math.pow(pt.x - lastDot.x, 2) +
          Math.pow(pt.z - lastDot.z, 2) +
          Math.pow(pt.elevation - lastDot.elevation, 2)
      )
      const nbOfSegments = Math.round(distance / gap)
      const midpoints = map(i => ({
        levelIndex: lastDot.levelIndex,
        x: lastDot.x + (i / nbOfSegments) * (pt.x - lastDot.x),
        z: lastDot.z + (i / nbOfSegments) * (pt.z - lastDot.z),
        elevation:
          lastDot.elevation +
          (i / nbOfSegments) * (pt.elevation - lastDot.elevation)
      }))(range(1, nbOfSegments))
      return [...dots, ...midpoints, pt]
    },
    [head(polyline)]
  )(tail(polyline))
