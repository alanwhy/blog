### 原文链接实现了左右，此处就不做代码重复

codepen 中可以发现上面的代码部分可以左右拖动，上下也是可以拖动改变的

![image.png](https://upload-images.jianshu.io/upload_images/12877063-e895e12ee8b93466.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### 上代码

##### 此处需要注意 codepen有一个 `header`，我们大概理解高度为 `60px`
##### 使用了 `vue` 作为开发框架 不影响使用

```html
	<div class="run-view-root">
		<div class="header">
			<img class="header-title" src="./../assets/img/title.png" alt="" />
			<div class="header-back" @click="linkToHome">
				返回首页
			</div>
		</div>
		<div class="container" id="container-box">
			<div id="code-container">
				<div class="code-text html-code"></div>
				<div class="code-text css-code"></div>
				<div class="code-text js-code"></div>
			</div>
			<div id="resize"></div>
			<div id="result-preview"></div>
		</div>
	</div>
```

```javascript
export default {
	methods: {
		linkToHome() {
			this.$router.push({
				name: "Home"
			});
		},
		resizeChange() {
			// 获取dom
			let resize = document.getElementById("resize");
			let top = document.getElementById("code-container");
			let bottom = document.getElementById("result-preview");
			let box = document.getElementById("container-box");
			resize.onmousedown = (e) => {
				let startY = e.clientY;
				// 此处减去header的60px
				resize.top = resize.offsetTop - 60;
				document.onmousemove = (e) => {
					let endY = e.clientY;

					let moveLen = resize.top + (endY - startY);
					let maxT = box.clientHeight - resize.offsetHeight;
					// 保留最小200的高度
					if (moveLen < 200) moveLen = 200;
					if (moveLen > maxT - 200) moveLen = maxT - 200;

					resize.style.top = moveLen;
					top.style.height = moveLen + "px";
					// 减去resize的高度10px
					bottom.style.height = box.clientHeight - moveLen - 10 + "px";
				};
				document.onmouseup = (evt) => {
					// 清除事件
					document.onmousemove = null;
					document.onmouseup = null;
					// 鼠标捕获事件
					resize.releaseCapture && resize.releaseCapture();
				};
				// 鼠标捕获事件
				resize.setCapture && resize.setCapture();
				return false;
			};
		}
	},
	mounted() {
		this.resizeChange();
	}
};
```

```css
$--run-background-color: #1e1f26;
$--run-border-color: #333642;
.run-view-root {
	min-width: 1200px;
	width: 100%;
	height: 100%;
	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 60px;
		box-sizing: border-box;
		border-bottom: 1px solid $--run-border-color;
		background: $--run-background-color;
		.header-title {
			margin-left: 40px;
		}
		.header-back {
			margin-right: 40px;
			color: #fff;
			cursor: pointer;
			&:hover {
				text-decoration: underline;
			}
		}
	}
	.container {
		width: 100%;
		height: calc(100% - 60px);
		#code-container {
			display: flex;
			width: 100%;
			height: calc(50% - 5px);
			background: $--run-background-color;
			.code-text {
				width: 33.33%;
				border-right: 2px solid $--run-border-color;
				&:last-child {
					border: 0px;
				}
			}
		}
		#resize {
			width: 100%;
			height: 9px;
			background: $--run-border-color;
			border-bottom: 1px solid black;
			box-shadow: 0 0 1px black;
			cursor: s-resize;
			z-index: 999;
		}
		#result-preview {
			width: 100%;
			height: calc(50% - 5px);
			background: radial-gradient(circle, #444857, #2c303a);
		}
	}
}
```

### 最终效果

此处只实现了上下的拖动，左右拖动可参考原文链接，都是同理

![image.png](https://upload-images.jianshu.io/upload_images/12877063-ef4376d900c58b68.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


> 原文链接：[实现左右可拖动改变宽度的div内容显示区，并且控制拖动范围]([https://www.jianshu.com/p/014380e6ae50](https://www.jianshu.com/p/014380e6ae50)
)
