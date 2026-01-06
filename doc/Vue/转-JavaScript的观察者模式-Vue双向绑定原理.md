关于 Vue 实现数据双向绑定的原理，请点击：[Vue 实现数据双向绑定的原理](https://www.jianshu.com/p/eed4c3a1cc81)
原文链接：[JavaScript 设计模式之观察者模式](https://juejin.im/post/5bce9a35f265da0abd355715) ##什么是观察者模式？

> **观察者模式（Observer）**通常又被称为 **发布-订阅者模式** 或 **消息机制**，它定义了对象间的一种一对多的依赖关系，只要当一个对象的状态发生改变时，所有依赖于它的对象都得到通知并被自动更新，解决了主体对象与观察者之间功能的耦合，即一个对象状态改变给其他对象通知的问题。

比如比较当下热门 vue 框架，里面不少地方都涉及到了观察者模式，比如：
![数据的双向绑定.png](https://upload-images.jianshu.io/upload_images/12877063-bc6533a07dfe8c9a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
利用`Object.defineProperty()`对数据进行劫持，设置一个监听器 `Observer`，用来监听所有属性，如果属性上发上变化了，就需要告诉订阅者 `Watcher `去更新数据，最后指令解析器 `Compile `解析对应的指令，进而会执行对应的更新函数，从而更新视图，实现了双向绑定~

###创建一个观察者
首先我们需要创建一个观察者对象，它包含一个消息容器和三个方法，分别是订阅消息方法` on` , 取消订阅消息方法 `off` ，发送订阅消息 `subscribe` 。

```
    const Observe = (function () {
    	//防止消息队列暴露而被篡改，将消息容器设置为私有变量
    	let __message = {};
    	return {
        	//注册消息接口
            on : function () {},
            //发布消息接口
    		subscribe : function () {},
            //移除消息接口
            off : function () {}
        }
    })();
```

###注册消息方法
注册消息方法的作用是将订阅者注册的消息推入到消息队列中，因此需要传递两个参数：消息类型和对应的处理函数，要注意的是，如果推入到消息队列是如果此消息不存在，则要创建一个该消息类型并将该消息放入消息队列中，如果此消息已经存在则将对应的方法突入到执行方法队列中。

```
    //注册消息接口
    on: function (type, fn) {
        //如果此消息不存在，创建一个该消息类型
        if( typeof __message[type] === 'undefined' ){
        	// 将执行方法推入该消息对应的执行队列中
            __message[type] = [fn];
        }else{
        	//如果此消息存在，直接将执行方法推入该消息对应的执行队列中
            __message[type].push(fn);
        }
    }
```

###发布消息方法
发布消息，其功能就是当观察者发布一个消息是将所有订阅者订阅的消息依次执行，也需要传两个参数，分别是消息类型和对应执行函数时所需要的参数，其中消息类型是必须的。

```
    //发布消息接口
    subscribe: function (type, args) {
    	//如果该消息没有注册，直接返回
    	if ( !__message[type] )  return;
    	//定义消息信息
    	let events = {
        	type: type,           //消息类型
        	args: args || {}       //参数
        },
        i = 0,                         // 循环变量
        len = __message[type].length;   // 执行队列长度
    	//遍历执行函数
    	for ( ; i < len; i++ ) {
    		//依次执行注册消息对应的方法
            __message[type][i].call(this,events)
    	}
    }
```

###移除消息方法
移除消息方法，其功能就是讲订阅者注销的消息从消息队列中清除，也需要传递消息类型和执行队列中的某一函数两个参数。这里为了避免删除是，消息不存在的情况，所以要对其消息存在性制作校验。

```
    //移除消息接口
    off: function (type, fn) {
    	//如果消息执行队列存在
    	if ( __message[type] instanceof Array ) {
    		// 从最后一条依次遍历
    		let i = __message[type].length - 1;
    		for ( ; i >= 0; i-- ) {
    			//如果存在改执行函数则移除相应的动作
    			__message[type][i] === fn && __message[type].splice(i, 1);
    		}
    	}
    }
```

###大显身手

```
   //订阅消息
    Observe.on('say', function (data) {
    	console.log(data.args.text);
    })
    Observe.on('success',function () {
        console.log('success')
    });

    //发布消息
    Observe.subscribe('say', { text : 'hello world' } )
    Observe.subscribe('success');
```

我们在消息类型为 `say `的消息中注册了两个方法，其中有一个接受参数，另一个不需要参数，然后通过 `subscribe` 发布` say` 和`success`消息，结果跟我们预期的一样，控制台输出了`hello world`以及 `success `
