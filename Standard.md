# 编码规范

标签 ： Flagwind.UI

---

## 目录
[TOC]

## 原则

不管有多少人共同参与同一项目，一定要确保每一行代码都像是同一个人编写的。

## HTML

### 基础

- 按照从上至下、从左到右的视觉顺序书写 HTML 结构。[^order]
- 用四个空格来代替制表符（tab）。[^tab]
- 嵌套元素应当另起一行并缩进一次（即四个空格，head 和 body 元素不需要缩进）。
- 在大的模块之间用空行隔开，使模块更清晰。
- 对于属性（attribute）的定义，确保全部使用双引号，而不是单引号。
- 确保在自闭合（self-closing）元素的尾部添加斜线。
- 尽量遵循 HTML 标准和语义，但是不要以牺牲实用性为代价。任何时候都要尽量使用最少的标签并保持最小的复杂度。
- 通过 JavaScript 生成的标签让内容变得不易查找、编辑，并且降低性能。能避免时尽量避免。

``` html
<!DOCTYPE html>
<html lang="zh-cn">
<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
    <meta name="viewport" content="width=device-width" />
    
    <!-- 标题、描述、关键字 -->
    <title>Normal</title>
    <meta name="description" content="" />
    <meta name="keywords" content="" />
    
    <!-- 引入外部样式表 -->
    <link href="css/flagwind.css" rel="stylesheet" />
    
    <!-- 申明内部样式表 -->
    <style>
        /* ... */
    </style>
    
    <!-- 引入外部脚本文件 -->
    <script src="js/jquery.js"></script>
    <script src="js/flagwind.js"></script>
</head>

<body>
    <header>
        <h1>Title</h1>
    </header>
    
    <div class="container">
    </div>
    
    <footer>
        <p>Copyright</p>
    </footer>
</body>
</html>
```

### DOCTYPE

在 HTML 页面中的第一行添加一个标准声明，这样确保在所有浏览器中拥有一致的展现。

``` html
<!DOCTYPE html>
```

### 语言属性

根据 HTML5 规范：[^lang]

*强烈建议为 html 根元素指定 lang 属性，从而为文档设置正确的语言。这将有助于语音合成工具确定其所应该采用的发音，有助于翻译工具确定其翻译时所应遵守的规则等等。*

这里列出了[语言代码表](http://www.sitepoint.com/web-foundations/iso-2-letter-language-codes/)。

``` html
<!DOCTYPE html>
<html lang="zh-cn">
    <!-- ... -->
</html>
```

### 字符编码

通过声明字符编码，能够确保浏览器快速判断页面内容的渲染方式。这样做的好处是，可以避免在 HTML 中使用字符实体标记（character entity），从而全部与文档编码一致（强烈推荐 UTF-8 编码）。

``` html
<meta charset="UTF-8" />
```

### IE 兼容模式

IE 通过特定的 `<meta>` 标签来确定绘制当前页面所采用的 IE 版本。除非有强烈的特殊需求，否则最好设置为 **Edge** 模式，从而通知 IE 采用其所支持的最新的模式。

``` html
<meta http-equiv="X-UA-Compatible" content="IE=Edge" />
```

### 引入 CSS 和 JavaScript 文件

根据 HTML5 规范，在引入 CSS 和 JavaScript 文件时一般不需要指定 type 属性，因为 `text/css` 和 `text/javascript` 分别是它们的默认值。

``` html
<!-- 引入外部样式表 -->
<link href="css/flagwind.css" rel="stylesheet" />

<!-- 申明内部样式表 -->
<style>
    /* ... */
</style>

<!-- 引入外部脚本文件 -->
<script src="js/jquery.js"></script>
```

### 属性顺序

HTML 属性应当按照以下给出的顺序依次排列，确保代码的易读性。

- `class`
- `id`, `name`
- `data-*`
- `src`, `for`, `type`, `href`
- `title`, `alt`
- `aria-*`, `role`

class 用于标识高度可复用组件，因此应该排在首位。id 用于标识具体组件，应当谨慎使用（例如，页面内的书签），因此排在第二位。

``` html
<a class="..." id="..." data-modal="toggle" href="#">Example link</a>

<input class="form-control" type="text" />

<img src="..." alt="..." />
```

### 布尔（boolean）型属性

布尔型属性可在声明时不赋值（XHTML 规范要求为其赋值，但是 HTML5 规范不需要。），建议采用 **属性值=属性名** 的方式赋值。

``` html
<!--不写属性代表属性为false-->
<input type="checkbox" />

<!--属性值=属性名，代表属性为true-->
<input type="checkbox" checked="checked" />

<select>
  <option value="1" selected="selected">1</option>
</select>
```

### 减少标签的数量

编写 HTML 代码时，尽量避免多余的父元素。很多时候，这需要迭代和重构来实现。

``` html
<!-- 优化前 -->
<span class="avatar">
    <img src="..." />
</span>

<!-- 优化后 -->
<img class="avatar" src="..." />
```

[^order]: 有时候为了便于搜索引擎抓取，我们也会将重要内容在HTML结构顺序上提前。

[^tab]: 这是唯一能保证在所有环境下获得一致展现的方法，大部分编辑器中可设置。

[^lang]: 更多关于 lang 属性的知识可以从 [此规范](http://www.w3.org/html/wg/drafts/html/master/semantics.html#the-html-element) 中了解。