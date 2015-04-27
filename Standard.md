# 编码规范

标签 ： Flagwind.UI

---

## 目录

[TOC]

## 原则

不管有多少人共同参与同一项目，确保每一行代码都像同一个人编写的。

## 命名规则

### 项目名

项目名以点号分隔。（例如：Flagwind.UI）

### 目录名

目录名采用全小写形式，多个单词组成时，以中划线分隔，有复数结构时，采用复数命名法。允许使用缩写单词作为目录名。（例如：js、docs、less）

### 文件名

文件名采用全小写形式，多个单词组成时，采用中划线连接方式。（例如：account-model.js、retina-sprites.css、error-report.html）

## 编辑器配置

根据以下设置来配置你的编辑器，避免代码不一致的问题。

- 用4个空格代替制表符（tab ）。
- 保存文件时，删除尾部的空白符。
- 设置文件编码为 utf-8（无BOM）。
- 在文件结尾添加一个空白行。

## HTML 规范

### 基础

- 用4个空格来代替制表符（tab）。
- 嵌套元素应当另起一行并缩进一次（即4个空格，`head` 和 `body` 元素不需要缩进）。
- 在大的模块之间用空行隔开，使模块更清晰。
- 对于属性（attribute）的定义，确保全部使用双引号，而不是单引号。
- 确保在自闭合（self-closing）（例如，`<img />` 或 `<input />`）元素的尾部添加斜线。
- 脚本文件应尽量在 body 的后面引入，这样可以减少因载入脚本而造成页面内容也被延迟载入的问题。

``` html

<!DOCTYPE html>
<html lang="zh-cn">
<head>
    <meta charset="utf-8" />
    <meta name="renderer" content="webkit" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    
    <title>Untitled</title>
    <meta name="description" content="" />
    <meta name="keywords" content="" />
    
    <!-- 核心 CSS 文件 -->
    <link rel="stylesheet" href="css/flagwind.min.css" />
    
    <!-- HTML5 & Media Queries 兼容文件 -->
    <!--[if lt IE 9]>
    <script src="js/html5shiv.min.js"></script>
    <script src="js/respond.min.js"></script>
    <![endif]-->
</head>

<body>
    <div class="container">
        ...
    </div>
    
    <!-- 核心 JavaScript 文件 -->
    <script src="js/jquery.min.js"></script>
    <script src="js/flagwind.min.js"></script>
</body>
</html>

```

### DOCTYPE

在 HTML 页面中的第一行添加一个标准声明，使其在所有浏览器中拥有一致的展现。虽然 doctype 不区分大小写，但是按照惯例，请将 doctype 大写。

``` html

<!DOCTYPE html>

```

### 语言属性

根据 HTML5 规范：

*强烈建议为 html 根元素指定 lang 属性，从而为文档设置正确的语言。这将有助于语音合成工具确定其所应该采用的发音，有助于翻译工具确定其翻译时所应遵守的规则等等。*

这里列出了[语言代码表](http://www.sitepoint.com/web-foundations/iso-2-letter-language-codes/)。

``` html

<!DOCTYPE html>
<html lang="zh-cn">
</html>

```

### 字符编码

通过声明字符编码，能够确保浏览器快速判断页面内容的渲染方式。这样做的好处是，可以避免在 HTML 中使用字符实体标记（character entity），从而全部与文档编码一致（强烈推荐 utf-8 编码）。

``` html

<meta charset="utf-8" />

```

### IE 兼容模式

IE 通过特定的 `<meta>` 标签来确定绘制当前页面所采用的 IE 版本。除非有强烈的特殊需求，否则最好设置为 **Edge** 模式，从而通知 IE 采用其所支持的最新的模式。

更多信息，请阅读这篇 [Stack Overflow](http://stackoverflow.com/questions/6771258/whats-the-difference-if-meta-http-equiv-x-ua-compatible-content-ie-edge-e) 文章。

``` html

<meta http-equiv="X-UA-Compatible" content="IE=Edge" />

```

### 引入 CSS 和 JavaScript 文件

根据 HTML5 规范，在引入 CSS 和 JavaScript 文件时一般不需要指定 type 属性，因为 `text/css` 和 `text/javascript` 分别是它们的默认值。

HTML5 规范链接：

- [使用 link](http://www.w3.org/TR/2011/WD-html5-20110525/semantics.html#the-link-element)
- [使用 style](http://www.w3.org/TR/2011/WD-html5-20110525/semantics.html#the-style-element)
- [使用 script](http://www.w3.org/TR/2011/WD-html5-20110525/scripting-1.html#the-script-element)

``` html

<!-- 引入样式表文件 -->
<link href="css/flagwind.css" rel="stylesheet" />

<!-- 申明内部样式表 -->
<style>
    /* ... */
</style>

<!-- 引入脚本文件 -->
<script src="js/jquery.js"></script>

```

### 实用高于完美

尽量遵循 HTML 标准和语义，但是不应该以浪费实用性作为代价。任何时候都要用尽量小的复杂度和尽量少的标签来解决问题。

### 属性顺序

HTML 属性应当按照以下给出的顺序依次排列，确保代码的易读性。

- `id`
- `class`
- `name`
- `data-*`
- `src`, `for`, `type`, `href`
- `title`, `alt`
- `aria-*`, `role`

class 用于标识高度可复用组件，理论上他们应该排在第一位。id 用于标识具体组件，应当谨慎使用（例如，页面内的书签），但为了突出 id 的重要性，所以把 id 放到了第一位。

``` html

<a id="..." class="..." data-modal="toggle" href="#">Example link</a>

<input class="form-control" type="text" />

<img src="..." alt="..." />

```

### 布尔（boolean）型属性

布尔型属性可在声明时不赋值（XHTML 规范要求为其赋值，但是 HTML5 规范不需要。），建议采用 **属性值=属性名** 的方式赋值。

了解更多内容，请参考 [WhatWG section on boolean attributes](http://www.whatwg.org/specs/web-apps/current-work/multipage/common-microsyntaxes.html#boolean-attributes)。

``` html

<!-- 不写属性代表属性为false -->
<input type="checkbox" />

<!-- 属性值=属性名，代表属性为true -->
<input type="checkbox" checked="checked" />

<select>
    <option value="1" selected="selected">1</option>
</select>

```

### 减少标签的数量

编写 HTML 代码时，尽量避免多余的父元素。很多时候，这需要迭代和重构来实现。

``` html

<!-- 糟糕的实例 -->
<span class="avatar">
    <img src="..." />
</span>

<!-- 好的实例 -->
<img class="avatar" src="..." />

```

### JavaScript 生成标签

通过 JavaScript 生成的标签让内容变得不易查找、编辑，性能更差。应该尽量避免这种情况的出现。

## CSS 规范

### 基础

- 用4个空格来代替制表符（tab）。
- 为选择器分组时，将单独的选择器单独放在一行。
- 声明块的左花括号应当单独成行。
- 每条声明语句的冒号（`:`）后应该插入一个空格。
- 为了获得更准确的错误报告，每条声明都应该独占一行。
- 所有声明语句都应当以分号结尾，包括最后一条语句。
- 对于以逗号分隔的属性值，每个逗号后面都应该插入一个空格（例如，`box-shadow`）。
- 不要在 `rgb()`、`rgba()`、`hsl()`、`hsla()` 或 `rect()` 值的内部的逗号后面插入空格。
- 对于属性值或颜色参数，省略小于 1 的小数前面的 0 （例如，`.5` 代替 `0.5`；`-.5px` 代替 `-0.5px`）。
- 十六进制值应该全部小写，例如，`#fff`。在阅读文档时，小写字符易于分辨。
- 尽量使用简写形式的十六进制值，例如，用 `#fff` 代替 `#ffffff`。
- 为选择器中的属性添加双引号，例如，`input[type="text"]`。
- 避免为 0 值指定单位，例如，用 `margin: 0`; 代替 `margin: 0px`;。

更多规则请参考 Wikipedia 中的 [CSS语法部分](http://en.wikipedia.org/wiki/Cascading_Style_Sheets#Syntax)。

``` css

/* 糟糕的实例 */
.selector, .selector-secondary, .selector[type=text] {
    padding:15px;
    margin:0px 0px 15px;
    background-color:rgba(0, 0, 0, 0.5);
    box-shadow:0px 1px 2px #CCC,inset 0 1px 0 #FFFFFF
}

/* 好的实例 */
.selector,
.selector-secondary,
.selector[type="text"]
{
    padding: 15px;
    margin-bottom: 15px;
    background-color: rgba(0,0,0,.5);
    box-shadow: 0 1px 2px #ccc, inset 0 1px 0 #fff;
}

```

### class 命名

- class 名称中只能出现小写字符和中划线（不是下划线，也不是驼峰命名法）。中划线应当用于相关 class 的命名（类似于命名空间）（例如，`.fw` 和 `.fw-header`）。
- 避免过度任意的简写。`.fw` 代表 flagwind，但是 `.s` 不能表达任何意思。
- class 名称应当尽可能短，并且意义明确。
- 使用有意义的名称。使用有组织的或目的明确的名称，不要使用表现形式（presentational）的名称。
- 基于最近的父 class 或基本（base） class 作为新 class 的前缀。
- 使用 `.js-*` class 来标识行为（与样式相对），并且不要将这些 class 包含到 CSS 文件中。

``` css

/* 糟糕的实例 */
.t { ... }
.red { ... }
.header { ... }

/* 好的实例 */
.fw { ... }
.important { ... }
.fw-header { ... }

```

### 选择器

- 对于通用元素使用 class ，这样利于渲染性能的优化。
- 对于经常出现的组件，避免使用属性选择器（例如，`[class^="..."]`）。浏览器的性能会受到这些因素的影响。
- 选择器要尽可能短，并且尽量限制组成选择器的元素个数，建议不要超过 3 个。
- 只有在必要的时候才将 class 限制在最近的父元素内（也就是后代选择器）（例如，不使用带前缀的 class 时 --前缀类似于命名空间）。

扩展阅读:

- [Scope CSS classes with prefixes](http://markdotto.com/2012/02/16/scope-css-classes-with-prefixes/)
- [Stop the cascade](http://markdotto.com/2012/03/02/stop-the-cascade/)

``` css

/* 糟糕的实例 */
span { ... }
.page-container #stream .stream-item .fw .fw-header .username { ... }
.avatar { ... }

/* 好的实例 */
.avatar { ... }
.fw-header .username { ... }
.fw .avatar { ... }

```

### 代码组织

- 以组件为单位组织代码段。
- 制定一致的注释规范。
- 使用一致的空白符将代码分隔成块，这样利于阅读较大的文档。
- 如果使用了多个 CSS 文件，将其按照组件而非页面的形式分拆，因为页面会被重组，而组件只会被移动。

``` css

/*
 * Component section heading
 */

.element { ... }


/*
 * Component section heading
 *
 * Sometimes you need to include optional context for the entire component.
 * Do that up here if it's important enough.
 */

.element { ... }

/*
 * Contextual sub-component or modifer
 */

.element-heading { ... }

```

### 声明顺序

相关的属性声明应当归为一组，并按照下面的顺序排列：

1. Positioning（定位）
2. Box model（盒模型）
3. Typographic（排版）
4. Visual（外观）

由于定位（positioning）可以从正常的文档流中移除元素，并且还能覆盖盒模型（box model）相关的样式，因此排在第一位。盒模型紧跟其后，因为他决定了一个组件的尺寸和位置。

其他属性只是影响组件的内部（inside）或者是不影响前两组属性，所以他们排在后面。

关于完整的属性以及他们的顺序，请参考 [Recess](http://twitter.github.io/recess/)。

``` css

.declaration-order
{
    /* 定位 */
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 100;

    /* 盒模型 */
    display: block;
    float: right;
    width: 100px;
    height: 100px;

    /* 排版 */
    font: normal 13px "Helvetica Neue", sans-serif;
    line-height: 1.5;
    color: #333;
    text-align: center;

    /* 外观 */
    background-color: #f5f5f5;
    border: 1px solid #e5e5e5;
    border-radius: 3px;

    /* 其他 */
    opacity: 1;
}

```

为了方便查阅，我们将 Recess 的顺序贴了一份出来：

``` js

var order =
[
    'position',
    'top',
    'right',
    'bottom',
    'left',
    'z-index',
    'display',
    'float',
    'width',
    'height',
    'max-width',
    'max-height',
    'min-width',
    'min-height',
    'padding',
    'padding-top',
    'padding-right',
    'padding-bottom',
    'padding-left',
    'margin',
    'margin-top',
    'margin-right',
    'margin-bottom',
    'margin-left',
    'margin-collapse',
    'margin-top-collapse',
    'margin-right-collapse',
    'margin-bottom-collapse',
    'margin-left-collapse',
    'overflow',
    'overflow-x',
    'overflow-y',
    'clip',
    'clear',
    'font',
    'font-family',
    'font-size',
    'font-smoothing',
    'osx-font-smoothing',
    'font-style',
    'font-weight',
    'hyphens',
    'src',
    'line-height',
    'letter-spacing',
    'word-spacing',
    'color',
    'text-align',
    'text-decoration',
    'text-indent',
    'text-overflow',
    'text-rendering',
    'text-size-adjust',
    'text-shadow',
    'text-transform',
    'word-break',
    'word-wrap',
    'white-space',
    'vertical-align',
    'list-style',
    'list-style-type',
    'list-style-position',
    'list-style-image',
    'pointer-events',
    'cursor',
    'background',
    'background-attachment',
    'background-color',
    'background-image',
    'background-position',
    'background-repeat',
    'background-size',
    'border',
    'border-collapse',
    'border-top',
    'border-right',
    'border-bottom',
    'border-left',
    'border-color',
    'border-image',
    'border-top-color',
    'border-right-color',
    'border-bottom-color',
    'border-left-color',
    'border-spacing',
    'border-style',
    'border-top-style',
    'border-right-style',
    'border-bottom-style',
    'border-left-style',
    'border-width',
    'border-top-width',
    'border-right-width',
    'border-bottom-width',
    'border-left-width',
    'border-radius',
    'border-top-right-radius',
    'border-bottom-right-radius',
    'border-bottom-left-radius',
    'border-top-left-radius',
    'border-radius-topright',
    'border-radius-bottomright',
    'border-radius-bottomleft',
    'border-radius-topleft',
    'content',
    'quotes',
    'outline',
    'outline-offset',
    'opacity',
    'filter',
    'visibility',
    'size',
    'zoom',
    'transform',
    'box-align',
    'box-flex',
    'box-orient',
    'box-pack',
    'box-shadow',
    'box-sizing',
    'table-layout',
    'animation',
    'animation-delay',
    'animation-duration',
    'animation-iteration-count',
    'animation-name',
    'animation-play-state',
    'animation-timing-function',
    'animation-fill-mode',
    'transition',
    'transition-delay',
    'transition-duration',
    'transition-property',
    'transition-timing-function',
    'background-clip',
    'backface-visibility',
    'resize',
    'appearance',
    'user-select',
    'interpolation-mode',
    'direction',
    'marks',
    'page',
    'set-link-source',
    'unicode-bidi',
    'speak'
]

```

### 不要使用 @import

与 `<link>` 标签相比，`@import` 指令要慢很多，不光增加了额外的请求次数，还会导致不可预料的问题。替代办法有以下几种：

- 使用多个 `<link>` 元素。
- 通过 Sass 或 Less 类似的 CSS 预处理器将多个 CSS 文件编译为一个文件。
- 通过 Rails、Jekyll 或其他系统中提供过 CSS 文件合并功能。

更多信息，请阅读 [Steve Souders 的文章](http://www.stevesouders.com/blog/2009/04/09/dont-use-import/)。

``` html

<!-- 推荐使用 link 元素 -->
<link rel="stylesheet" href="layout.css">

<!-- 避免使用 @import 指令 -->
<style>
    @import url("layout.css");
</style>

```

### 媒体查询（Media query）的位置

将媒体查询放在尽可能相关规则的附近。不要将他们放在文档底部或者打包放在一个单一样式文件中。如果你把他们分开了，将来只会被大家遗忘。下面给出一个典型的示例：

``` css

.element { ... }
.element-avatar { ... }
.element-selected { ... }

@media (min-width: 480px)
{
    .element { ...}
    .element-avatar { ... }
    .element-selected { ... }
}

```

### 带前缀的属性

当使用特定厂商的带有前缀的属性时，通过缩进的方式，让每个属性的值在垂直方向对齐，这样便于多行编辑。

- 在 Textmate 中，使用 *Text → Edit Each Line in Selection (⌃⌘A)。* 
- 在 Sublime Text 2/3 中， *使用 Selection → Add Previous Line (⌃⇧↑) 和 Selection → Add Next Line (⌃⇧↓)。*

``` css
.selector
{
    -webkit-box-shadow: 0 1px 2px rgba(0,0,0,.15);
            box-shadow: 0 1px 2px rgba(0,0,0,.15);
}
```

### 单条声明的声明块

在一个声明块中**只包含一条**声明的情况下，为了易读性和快速编辑可以考虑移除其中的换行。所有包含多条声明的声明块应该分为多行。

这样做的关键因素是错误检测 - 例如，一个 CSS 验证程序显示你在 183 行有一个语法错误,如果是一个单条声明的行，那就是他了。在多个声明的情况下，你必须为哪里出错了费下脑子。

``` css

/* 单条声明 */
.span1 { width: 60px; }
.span2 { width: 140px; }
.span3 { width: 220px; }

/* 多条声明 */
.sprite
{
    display: inline-block;
    width: 16px;
    height: 15px;
    background-image: url(../images/sprite.png);
}

```

### 简写形式的属性声明

在需要显示地设置所有值的情况下，应当尽量限制使用简写形式的属性声明。常见的滥用简写属性声明的情况如下：

- `padding`
- `margin`
- `font`
- `background`
- `border`
- `border-radius`

大部分情况下，我们不需要为简写形式的属性声明指定所有值。例如，HTML 的 heading 元素只需要设置上、下边距（margin）的值，因此，在必要的时候，只需覆盖这两个值就可以。过度使用简写形式的属性声明会导致代码混乱，并且会对属性值带来不必要的覆盖从而引起意外的副作用。

Mozilla Developer Network 有一篇对不熟悉属性简写及其行为的人来说很棒的关于 [shorthand properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties) 的文章。

``` css

/* 糟糕的实例 */
.element
{
    margin: 0 0 10px;
    background: red;
    background: url("image.jpg");
    border-radius: 3px 3px 0 0;
}

/* 好的实例 */
.element
{
    margin-bottom: 10px;
    background-color: red;
    background-image: url("image.jpg");
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
}

```

### LESS 和 SASS 中的嵌套

避免不必要的嵌套。可以进行嵌套，不意味着你应该这样做。只有在需要给父元素增加样式并且同时存在多个子元素时才需要考虑嵌套。

``` css

/* 糟糕的实例 */
.table > thead > tr > th { … }
.table > thead > tr > td { … }

/* 好的实例 */
.table > thead > tr
{
    > th { … }
    > td { … }
}

```

### 注释

代码是由人编写并维护的。请确保你的代码能够自然描述、注释良好并且易于他人理解。好的代码注释能够传达上下文关系和代码目的。不要简单地重申组件或 class 名称。

对于较长的注释，务必书写完整的句子；对于一般性注解，可以书写简洁的短语。

``` css

/* 糟糕的实例 */

/*
 * Modal header
 */
.modal-header
{
    ...
}

/* 好的实例 */

/*
 * 包含 .modal-title 和 .modal-close 的容器。
 */
.modal-header
{
    ...
}

```

## JavaScript 规范

### 基础

- 用4个空格来代替制表符（tab）。
- 代码块的左花括号应当单独成行。
- 所有的变量必须在使用前声明。
- 一般情况下使用双引号而不是单引号。
- 尽量减少全局变量的使用，不要让局部变量覆盖全局变量。
- `eval` 和 `with` 非特殊场景，应避免使用他们。
- 不要给 `setTimeout` 或者 `setInterval` 传递字符串参数。
- 使用 `{}` 代替 `new Object()`。使用 `[]` 代替 `new Array()`。
- 使用 `===` 和 `!==` 操作符作比较运算。`==` 和 `!= ` 操作符会进行类型强制转换。特别是，不要将 `==` 与这些值比较： `false`，`null`，`undefined`，`""`，`0`，`NaN`。
- 应该总是使用分号，即使他们可由 JavaScript 解析器隐式创建。
- 避免每行超过 80 个字符，当一条语句一行写不下时，请考虑换行，并相对上一行缩进4个空格。
- `use strict` 必须放在函数的第一行，可以用自执行函数包含大的代码段。

### 命名

- 类名（构造函数名）使用 Pascal（首字母大写）命名方式，如：`function Animal() {...}`
- 变量名和方法名使用 Camel（首字母小写）命名方式，如：`var name = p1.getName();`
- 常量名采用全大写形式，如：`var PI = 3.141592653;`
- 使用一个下划线前缀来表示一个私有属性或方法。
- 所有函数内变量声明放在函数内头部，并且只使用一个 `var`，一个变量一行，并在行末添加注释。

``` js

function Animal()
{
    this._name = null;

    this.getName = function()
    {
        var min = 111111,       //随机数最小值
            max = 999999;       //随机数最大值

        if(!this._name)
        {
            return Math.floor(Math.random() * (max - min)) + min;
        }

        return this._name;
    };

    this.setName = function(name)
    {
        this._name = name;
    };
}

```

### 空行

- 函数与函数之间加
- 单行或多行注释前加
- 逻辑块之间加空行增加可读性

### 缩进

缩进的单位为4个空格，规则也很简单——花括号里面的东西。这就意味着函数体、循环 (do, while, for, for-in)、if、switch，以及对象字面量中的对象属性。下面的代码就是使用缩进的示例：

``` js

function outer(a, b)
{
    var c = 1,
        d = 2,
        inner;

    if(a > b)
    {
        inner = function()
        {
            return {
                r : c - d
            };
        };
    }
    else
    {
        inner = function()
        {
            return {
                r : c + d
            };
        };
    }

    return inner;
}
```

### 空格

空格的使用同样有助于改善代码的可读性和一致性。适合使用空格的地方包括：

- for 循环分号分开后的的部分，如： `for(var i = 0; i < 10; i++) {...}`
- for 循环中初始化的多变量(i 和 max)：`for(var i = 0, max = 10; i < max; i++) {...}`
- 分隔数组项的逗号的后面：`var a = [1, 2, 3];`
- 对象属性逗号的后面以及分隔属性名和属性值的冒号的后面：`var o = {a: 1, b: 2};`
- 限定函数参数：`fun(a, b, c)`
- 操作符 `+`，`-`，`*`，`/`，`=`，`<`，`>`，`<=`，`>=`，`===`，`!==`，`&&`，`||`，`+=` 等前后都需要空格。

### 花括号

花括号 `{}` 应总被使用，即使在它们为可选的时候。虽然在 `if` 或者 `for` 中如果语句仅一条，花括号是不需要的，但是你还是应该总是使用它们，这会让代码更有持续性和易于更新。

想象下你有一个只有一条语句的 for 循环，你可以忽略花括号，而没有解析的错误。

``` js

// 糟糕的实例
for(var i = 0; i < 10; i++)
    alert(i);

```

但是，如果，后来，主体循环部分又增加了行代码：

``` js

// 糟糕的实例
for(var i = 0; i < 10; i++)
    alert(i);
    alert(i + " is " + (i % 2 ? "odd" : "even"));

```

第二个 alert 已经在循环之外，缩进可能欺骗了你。为了长远打算，最好总是使用花括号，即使只有一行代码：

``` js

// 好的实例
for(var i = 0; i < 10; i++)
{
    alert(i);
}

```

因此，涉及 `if`，`for`，`while`，`do...while`，`try...catch...finally` 的地方都必须使用花括号。

### for 语句

- 普通 `for` 循环，分号后留一个空格，前置条件如果有多个，逗号后面需留一个空格。
- `for in` 循环一定要有 `hasOwnProperty` 的判断。

``` js

var name,                           // 属性名称
    person,                         // Person 类的实例
    list = [10, 12, 13, 14, 15];    // 整型数组

// 普通循环实例
for(var i = 0, length = list.length; i < length; i++)
{
    console.log(list[i]);
}

// for in 循环实例
for(name in person)
{
    // 判断 person 对象是否拥有指定的属性。
    if(person.hasOwnProperty(name))
    {
        console.log("Property name is " + name);
        console.log("Property value is " + person[name]);
    }
}

```

### switch 语句

`case` 需要缩进，在 `break` 与之后的 `case` 中间需要一个换行。

``` js

switch(condition)
{
    case "first":
        // code
        break;

    case "third":
        // code
        break;

    default:
    // code
}

```

### null 关键字

#### 使用场景

- 初始化一个将来可能被声明为一个对象的变量。
- 与一个可能是对象或者非对象的初始化变量相比。
- 传入一个对象待定的函数。
- 作为一个对象待定的函数的返回值。

#### 非使用场景

- 不要用 null 来测试一个变量是否存在。
- 不要用 null 来测试一个没声明的变量。

### undefined 关键字

- 不要直接使用 undefined 进行变量判断。
- 使用 typeof 推断类型并用字符串 "undefined" 对变量进行判断。

``` js

var person;

// 糟糕的实例
if(person === undefined)
{
    ...
}

// 好的实例
if(typeof person === "undefined")
{
    ...
}

```

### 注释

#### 单行注释

- 双斜线后，必须跟注释内容保留一个空格。
- 可独占一行，前边不许有空行，缩进与下一行代码保持一致。
- 可位于一个代码行的末尾，注意这里的格式。

``` js

// 好的实例
if(condition)
{
    // 条件成立，执行 allowed 函数。
    allowed();
}

var name = "jason";    // 双斜线距离分号一个缩进，双斜线后始终保留一个空格。

```

#### 多行注释

什么时候使用多行注释？

- 难于理解的代码段。
- 可能存在错误的代码段。
- 浏览器特殊的 HACK 代码。
- 业务逻辑相关的代码。

多行注释的标准？

- 在注释前面保留一个空行。
- 最少三行，格式如下：

``` js

/*
 * 注释内容与星标前保留一个空格
 */

```

#### 文档注释

请按照如下场景添加文档注释，具体用到的标签（例如：`@param`）请参考 [JSDoc](http://usejsdoc.org/)。

- 所有的文件头部。
- 所有的全局变量。
- 所有的构造函数。
- 所有的成员属性。
- 所有的成员方法。

``` js

/*!
 * Flagwind.UI(Alert) v1.0.1
 * Copyright 2014 Flagwind Inc. All rights reserved.
 * Licensed under the MIT License.
 * https://github.com/Flagwind/Flagwind.UI/blob/master/LICENSE
 *
 * @author jason
 * @email jasonsoop@gmail.com
!*/

+function($)
{
    "use strict";

    /**
     * @public @class 初始化 Alert 类的新实例。
     * @param {object=} options 配置选项。
     * @return {object} this
     */
    var Alert = function(options)
    {
        return this;
    }

    /**
     * @public @property {string} 版本号
     */
    Alert.VERSION = "1.0.1";

    /**
     * @public 显示提示框。
     * @param {(string|number)} duration 一个字符串或数字用于控制动画的时长。
     * @return {object} this
     */
    Alert.prototype.show = function(duration)
    {
        return this;
    }

}(jQuery);

```
