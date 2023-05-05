// I added data here, alternatively it can be read from a file also
const data = [
  { sensor: { x: 3291456, y: 3143280 }, beacon: { x: 3008934, y: 2768339 } },
  { sensor: { x: 3807352, y: 3409566 }, beacon: { x: 3730410, y: 3774311 } },
  { sensor: { x: 1953670, y: 1674873 }, beacon: { x: 2528182, y: 2000000 } },
  { sensor: { x: 2820269, y: 2810878 }, beacon: { x: 2796608, y: 2942369 } },
  { sensor: { x: 3773264, y: 3992829 }, beacon: { x: 3730410, y: 3774311 } },
  { sensor: { x: 2913793, y: 2629579 }, beacon: { x: 3008934, y: 2768339 } },
  { sensor: { x: 1224826, y: 2484735 }, beacon: { x: 2528182, y: 2000000 } },
  { sensor: { x: 1866102, y: 3047750 }, beacon: { x: 1809319, y: 3712572 } },
  { sensor: { x: 3123635, y: 118421 }, beacon: { x: 1453587, y: -207584 } },
  { sensor: { x: 2530789, y: 2254773 }, beacon: { x: 2528182, y: 2000000 } },
  { sensor: { x: 230755, y: 3415342 }, beacon: { x: 1809319, y: 3712572 } },
  { sensor: { x: 846048, y: 51145 }, beacon: { x: 1453587, y: -207584 } },
  { sensor: { x: 3505756, y: 3999126 }, beacon: { x: 3730410, y: 3774311 } },
  { sensor: { x: 2506301, y: 3745758 }, beacon: { x: 1809319, y: 3712572 } },
  { sensor: { x: 1389843, y: 957209 }, beacon: { x: 1453587, y: -207584 } },
  { sensor: { x: 3226352, y: 3670258 }, beacon: { x: 3730410, y: 3774311 } },
  { sensor: { x: 3902053, y: 3680654 }, beacon: { x: 3730410, y: 3774311 } },
  { sensor: { x: 2573020, y: 3217129 }, beacon: { x: 2796608, y: 2942369 } },
  { sensor: { x: 3976945, y: 3871511 }, beacon: { x: 3730410, y: 3774311 } },
  { sensor: { x: 107050, y: 209321 }, beacon: { x: 1453587, y: -207584 } },
  { sensor: { x: 3931251, y: 1787536 }, beacon: { x: 2528182, y: 2000000 } },
  { sensor: { x: 1637093, y: 3976664 }, beacon: { x: 1809319, y: 3712572 } },
  { sensor: { x: 2881987, y: 1923522 }, beacon: { x: 2528182, y: 2000000 } },
  { sensor: { x: 3059723, y: 2540501 }, beacon: { x: 3008934, y: 2768339 } },
];

/**
 * The function calculates positions in a row where a beacon can not be present
 * ypos is the position of the row on y-axis
 */
const findEmptySpots = (ypos) => {
  const emptyPositionRanges = [];

  // The code is executed for each sensor-beacon pair to figure out empty places in a row
  data.forEach((datum) => {
    const { sensor, beacon } = datum;

    // If the distance of row from sensor is greater than the distance of beacon return
    const beconDistance =
      Math.abs(sensor.x - beacon.x) + Math.abs(sensor.y - beacon.y);
    const yposDistance = Math.abs(sensor.y - ypos);
    if (yposDistance > beconDistance) {
      return;
    }

    // Find out empty range of positions
    const factor = beconDistance - yposDistance;
    // Positions in this range can not have beacons as their distance is less than beacon's distance
    const range = [sensor.x - factor, sensor.x + factor];
    emptyPositionRanges.push(range);
  });

  // code below merge the ranges to remove overlap
  emptyPositionRanges.sort((v1, v2) => v1[0] - v2[0]);
  const newEmptyPositionRanges = [emptyPositionRanges[0]];
  for (let i = 1; i < emptyPositionRanges.length; i++) {
    const range = emptyPositionRanges[i];
    const newRange = newEmptyPositionRanges[newEmptyPositionRanges.length - 1];
    if (range[0] >= newRange[0] && range[0] <= newRange[1]) {
      if (range[1] >= newRange[1]) {
        newRange[1] = range[1];
      }
    } else {
      newEmptyPositionRanges.push(range);
    }
  }

  // add ranges length to find total number of positions that can be blank
  return newEmptyPositionRanges.reduce(
    (sum, r) => sum + Math.abs(r[0] - r[1]),
    0
  );
};

console.log(findEmptySpots(2000000));
