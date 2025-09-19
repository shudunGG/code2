export default function clamp(value, min, max) {
  var dx = value - min;
  var dy = max - value;
  if (dx >= 0 && dy >= 0) {
    return value;
  }
  if (Math.abs(dx) >= Math.abs(dy)) {
    return max;
  }
  return min;
}
