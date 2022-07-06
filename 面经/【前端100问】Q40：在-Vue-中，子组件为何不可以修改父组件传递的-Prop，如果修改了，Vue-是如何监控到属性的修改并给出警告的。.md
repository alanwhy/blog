### 写在前面

> 此系列来源于开源项目：[前端 100 问：能搞懂 80%的请把简历给我](https://github.com/yygmind/blog/issues/43)
> 为了备战 2021 春招
> 每天一题，督促自己
> 从多方面多角度总结答案，丰富知识
> [在 Vue 中，子组件为何不可以修改父组件传递的 Prop，如果修改了，Vue 是如何监控到属性的修改并给出警告的。](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/60)
> 简书整合地址：[前端 100 问](https://www.jianshu.com/c/70e2e00df1b0)

#### 正文回答

1. 子组件为何不可以修改父组件传递的 `Prop`？

- 一个父组件下不只有你一个子组件。同样，使用这份 prop 数据的也不只有你一个子组件。如果每个子组件都能修改 prop 的话，将会导致修改数据的源头不止一处。
- 单向数据流，易于监测数据的流动，出现了错误可以更加迅速的定位到错误发生的位置。

2. 如果修改了，Vue 是如何监控到属性的修改并给出警告的。

```js
// 在initProps的时候，在defineReactive时通过判断是否在开发环境
// 如果是开发环境，会在触发set的时候判断是否此key是否处于updatingChildren中被修改
// 如果不是，说明此修改来自子组件，触发warning提示
if (process.env.NODE_ENV !== "production") {
  var hyphenatedKey = hyphenate(key);
  if (
    isReservedAttribute(hyphenatedKey) ||
    config.isReservedAttr(hyphenatedKey)
  ) {
    warn(
      '"' +
        hyphenatedKey +
        '" is a reserved attribute and cannot be used as component prop.',
      vm
    );
  }
  defineReactive$$1(props, key, value, function () {
    if (!isRoot && !isUpdatingChildComponent) {
      warn(
        "Avoid mutating a prop directly since the value will be " +
          "overwritten whenever the parent component re-renders. " +
          "Instead, use a data or computed property based on the prop's " +
          'value. Prop being mutated: "' +
          key +
          '"',
        vm
      );
    }
  });
}
```

> 需要特别注意的是，当你从子组件修改的 `prop` 属于基础类型时会触发提示。这种情况下，你是无法修改父组件的数据源的， 因为基础类型赋值时是值拷贝。你直接将另一个非基础类型（Object, array）赋值到此 key 时也会触发提示(但实际上不会影响父组件的数据源)， **当你修改 `object` 的属性时不会触发提示，并且会修改父组件数据源的数据**。

#### vue 源码

```js
// src/core/instance/state.js 源码路径
function initProps(vm: Component, propsOptions: Object) {
  const propsData = vm.$options.propsData || {};
  const props = (vm._props = {});
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  const keys = (vm.$options._propKeys = []);
  const isRoot = !vm.$parent;
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false);
  }
  for (const key in propsOptions) {
    keys.push(key);
    const value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== "production") {
      const hyphenatedKey = hyphenate(key);
      if (
        isReservedAttribute(hyphenatedKey) ||
        config.isReservedAttr(hyphenatedKey)
      ) {
        warn(
          `"${hyphenatedKey}" is a reserved attribute and cannot be used as component prop.`,
          vm
        );
      }
      defineReactive(props, key, value, () => {
        if (!isRoot && !isUpdatingChildComponent) {
          warn(
            `Avoid mutating a prop directly since the value will be ` +
              `overwritten whenever the parent component re-renders. ` +
              `Instead, use a data or computed property based on the prop's ` +
              `value. Prop being mutated: "${key}"`,
            vm
          );
        }
      });
    } else {
      defineReactive(props, key, value);
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, `_props`, key);
    }
  }
  toggleObserving(true);
}

// src/core/observer/index.js
/**
 * Define a reactive property on an Object.
 */
export function defineReactive(
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  const dep = new Dep();

  const property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return;
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get;
  const setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  let childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      const value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value;
    },
    set: function reactiveSetter(newVal) {
      const value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return;
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== "production" && customSetter) {
        customSetter();
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) return;
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    },
  });
}
```
