```
function _parseInt(str, radix) {
  let str_type = typeof str
  let res = 0;
  // 如果类型不是string或者number返回NaN
  if (str_type !== "string" && str_type !== "number") {
    return NaN
  }

  // 字符串处理
  str = String(str).trim().split(".")[0]
  let length = str.length
  if (!length) {
    return NaN
  }

  // 如果radix为0 null undefined
  // 转化为10
  if (!radix) {
    radix = 10
  }
  if (typeof radix !== "number" || radix < 2 || radix > 36) {
    return NaN
  }

  for (let i = 0; i < length; i++) {
    let arr = str.split("").reverse().join("")
    res += Math.floor(arr[i]) * Math.pow(radix, i)
  }

  return res
}
```
