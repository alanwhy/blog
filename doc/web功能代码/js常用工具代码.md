### 判断类型

```javascript
/**
 * 判断传入参数是什么类型
 * @param {*} o 传入参数
 * @return 传入参数的类型
 */
const TypeJudge = (o) => {
  const types = [
    "String",
    "Number",
    "Boolean",
    "Function",
    "Null",
    "Undefined",
    "Object",
    "Array",
    "Date",
    "RegExp",
    "Error",
    "Symbol",
    "Promise",
    "Set",
  ];
  const curType = Object.prototype.toString.call(o).slice(8, -1);
  if (types.indexOf(curType) > -1) {
    return curType;
  }
};
```

### 将阿拉伯数字翻译成中文的大写数字

```js
const numberToChinese = (num) => {
  var AA = new Array("零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十");
  var BB = new Array("", "十", "百", "仟", "萬", "億", "点", "");
  var a = ("" + num).replace(/(^0*)/g, "").split("."),
    k = 0,
    re = "";
  for (var i = a[0].length - 1; i >= 0; i--) {
    switch (k) {
      case 0:
        re = BB[7] + re;
        break;
      case 4:
        if (!new RegExp("0{4}//d{" + (a[0].length - i - 1) + "}$").test(a[0])) re = BB[4] + re;
        break;
      case 8:
        re = BB[5] + re;
        BB[7] = BB[5];
        k = 0;
        break;
    }
    if (k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0) re = AA[0] + re;
    if (a[0].charAt(i) != 0) re = AA[a[0].charAt(i)] + BB[k % 4] + re;
    k++;
  }

  if (a.length > 1) {
    // 加上小数部分(如果有小数部分)
    re += BB[6];
    for (var i = 0; i < a[1].length; i++) re += AA[a[1].charAt(i)];
  }
  if (re == "一十") re = "十";
  if (re.match(/^一/) && re.length == 3) re = re.replace("一", "");
  return re;
};
```

### 数组去重

```js
const unique = (arr) => {
  if (Array.hasOwnProperty("from")) {
    return Array.from(new Set(arr));
  } else {
    var n = {},
      r = [];
    for (var i = 0; i < arr.length; i++) {
      if (!n[arr[i]]) {
        n[arr[i]] = true;
        r.push(arr[i]);
      }
    }
    return r;
  }
};
```

### 将类数组转换为数组

```js
const formArray = (ary) => {
  var arr = [];
  if (Array.isArray(ary)) {
    arr = ary;
  } else {
    arr = Array.prototype.slice.call(ary);
  }
  return arr;
};
```

### 字符转换

```js
/**
 * 字符转换
 * @param {*} str 需要转换的字符
 * @param {*} type 如何转换？ 1:首字母大写 2：首字母小写 3：大小写转换 4：全部大写 5：全部小写
 * @return 转换后的字符
 */
const changeCase = (str, type) => {
  type = type || 4;
  switch (type) {
    case 1:
      return str.replace(/\b\w+\b/g, function (word) {
        return word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase();
      });
    case 2:
      return str.replace(/\b\w+\b/g, function (word) {
        return word.substring(0, 1).toLowerCase() + word.substring(1).toUpperCase();
      });
    case 3:
      return str
        .split("")
        .map(function (word) {
          if (/[a-z]/.test(word)) {
            return word.toUpperCase();
          } else {
            return word.toLowerCase();
          }
        })
        .join("");
    case 4:
      return str.toUpperCase();
    case 5:
      return str.toLowerCase();
    default:
      return str;
  }
};
```

> 参考原文：# [前端常用 60 余种工具方法](https://segmentfault.com/a/1190000022736837)
