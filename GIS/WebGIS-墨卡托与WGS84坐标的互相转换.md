```
/**
 * [mercatorToWgs84 墨卡托转WGS84]
 * @param  {[Object]} mercator [墨卡托坐标]
 * @return {[Object]} wgs84 [wgs84坐标]
 */
function mercatorToWgs84(mercator) {
  var wgs84 = {
    lon: '',
    lat: ''
  };
  var x = mercator.x / 20037508.34 * 180;
  var y = mercator.y / 20037508.34 * 180;
  y = 180 / Math.PI * (2 * Math.Atan(Math.Exp(y * Math.PI / 180)) - Math.PI / 2);
  wgs84.lon = x;
  wgs84.lat = y;
  return wgs84;
}

/**
 * [wgs84ToMercator WGS84转墨卡托]
 * @param  {[Object]} wgs84 [wgs84坐标]
 * @return {[Object]} mercator [墨卡托坐标]
 */
function wgs84ToMercator(wgs84) {
  var mercator = {
    lon: '',
    lat: ''
  };
  var x = wgs84.x * 20037508.34 / 180;
  var y = Math.Log(Math.Tan((90 + wgs84.y) * Math.PI / 360)) / (Math.PI / 180);
  y = y * 20037508.34 / 180;
  mercator.lon = x;
  mercator.lat = y;
  return mercator;
}

```
