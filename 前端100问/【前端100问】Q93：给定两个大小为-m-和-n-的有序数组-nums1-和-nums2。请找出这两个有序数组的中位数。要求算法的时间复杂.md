### 写在前面

> 此系列来源于开源项目：[前端 100 问：能搞懂 80%的请把简历给我](https://github.com/yygmind/blog/issues/43)
> 为了备战 2021 春招
> 每天一题，督促自己
> 从多方面多角度总结答案，丰富知识
> [给定两个大小为 m 和 n 的有序数组 nums1 和 nums2。请找出这两个有序数组的中位数。要求算法的时间复杂度为 O(log(m+n))](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/143)
> 简书整合地址：[前端 100 问](https://www.jianshu.com/c/70e2e00df1b0)

#### 正文回答

##### 题目

示例 1：

```js
nums1 = [1, 3];
nums2 = [2];
```

中位数是 2.0

示例 2：

```js
nums1 = [1, 2];
nums2 = [3, 4];
```

中位数是(2 + 3) / 2 = 2.5

##### 回答

```js
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findMedianSortedArrays = function (nums1, nums2) {
  let m = nums1.length;
  let n = nums2.length;
  let k1 = Math.floor((m + n + 1) / 2);
  let k2 = Math.floor((m + n + 2) / 2);

  return (
    (findMedianSortedArraysCore(nums1, 0, nums2, 0, k1) +
      findMedianSortedArraysCore(nums1, 0, nums2, 0, k2)) /
    2
  );
};

/**
 *
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @param {number} i
 * @param {number} j
 * @param {number} k
 * @return {number}
 */
const findMedianSortedArraysCore = (nums1, i, nums2, j, k) => {
  // 如果数组起始位置已经大于数组长度-1
  // 说明已经是个空数组
  // 直接从另外一个数组里取第k个数即可
  if (i > nums1.length - 1) {
    return nums2[j + k - 1];
  }
  if (j > nums2.length - 1) {
    return nums1[i + k - 1];
  }
  // 如果k为1
  // 就是取两个数组的起始值里的最小值
  if (k === 1) {
    return Math.min(nums1[i], nums2[j]);
  }
  // 取k2为(k/2)或者数组1的长度或者数组2的长度的最小值
  // 这一步可以避免k2大于某个数组的长度（长度为从起始坐标到结尾）
  let k2 = Math.floor(k / 2);
  let length1 = nums1.length - i;
  let length2 = nums2.length - j;
  k2 = Math.min(k2, length1, length2);

  let value1 = nums1[i + k2 - 1];
  let value2 = nums2[j + k2 - 1];

  // 比较两个数组的起始坐标的值
  // 如果value1小于value2
  // 就舍弃nums1前i + k2部分
  // 否则舍弃nums2前j + k2部分
  if (value1 < value2) {
    return findMedianSortedArraysCore(nums1, i + k2, nums2, j, k - k2);
  } else {
    return findMedianSortedArraysCore(nums1, i, nums2, j + k2, k - k2);
  }
};
```

##### 不考虑后半段的题目答案

```js
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findMedianSortedArrays = function (nums1, nums2) {
  let num = nums1.concat(nums2);
  num = num.sort((a, b) => a - b);
  let mid = Math.floor(num.length / 2);
  if (num.length % 2 === 0) {
    return (num[mid - 1] + num[mid]) / 2;
  } else {
    return num[mid];
  }
};
```
