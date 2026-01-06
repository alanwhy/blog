###取出相同的元素

```
getArrEqual(arr1, arr2) {
    let newArr = [];
    for (let i = 0; i < arr2.length; i++) {
        for (let j = 0; j < arr1.length; j++) {
            if(arr1[j] === arr2[i]){
                newArr.push(arr1[j]);
            }
        }
    }
    return newArr;
},
```

###取出不同的元素

```
getArrDifference(arr1, arr2) {
    return arr1.concat(arr2).filter(function(v, i, arr) {
        return arr.indexOf(v) === arr.lastIndexOf(v);
    });
}
```
