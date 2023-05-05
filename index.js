const { readFile } = require("node:fs/promises");

/**
 * The function calculates total number of positions in a row where a beacon can not be present
 * ypos is the position of the row on y-axis
 */
const findEmptySpots = (data, ypos) => {
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

readFile("./input.txt", { encoding: "utf-8" }).then((result) => {
  const rows = result.split("\n");
  const data = rows.map((r) => {
    const arr = r.split(":");
    const xSensor = parseInt(
      arr[0].substring(arr[0].indexOf("x=") + 2, arr[0].indexOf(","))
    );
    const ySensor = parseInt(
      arr[0].substring(arr[0].indexOf("y=") + 2, arr[0].length)
    );
    const xBeacon = parseInt(
      arr[1].substring(arr[1].indexOf("x=") + 2, arr[1].indexOf(","))
    );
    const yBeacon = parseInt(
      arr[1].substring(arr[1].indexOf("y=") + 2, arr[1].length)
    );
    return {
      sensor: { x: xSensor, y: ySensor },
      beacon: { x: xBeacon, y: yBeacon },
    };
  });
  console.log(findEmptySpots(data, 2000000));
});
