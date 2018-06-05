---
title: "为Hugo重新渲染Toc目录样式"
date: 2018-05-23T19:33:47+08:00
draft: false
categories: "hugo"
tags: ["hugo", "beautifulhugo", "Toc"]
bigimg: [{src: "https://res.cloudinary.com/devops007/image/upload/dpr_0.75/v1523215797/IMG_0165.jpg", desc: "May 1,2017"}]
---

&emsp;&emsp;`Hugo`的皮肤`beautifulhugo`自带的目录不是很美观，因此我们对`{{.TableOfContents}}`的模板进行重新渲染，让它美观一些，
由于不是专业的前端，css水平几乎为0，因此我需要找一个现成的插件进行移植，这里选取了`gitbook`的
[gitbook-plugin-anchor-navigation-ex](https://github.com/zq99299/gitbook-plugin-anchor-navigation-ex)
插件进行移植,该插件设计风格简单不占页面空间，我们只引用其中的css文件，js由我们自己编写。

<!--<figure>
    <img src="https://res.cloudinary.com/devops007/image/upload/v1527262700/beautifulhugo/Toc/toc.gif" width="1000">
</figure> -->
<!--more-->

# 效果展示
&emsp;&emsp;直接将鼠标移到右上侧图标处，即可展开目录，将鼠标移至右下侧图标处可回到顶部


# 处理步骤
&emsp;&emsp;由于无法直接修改{{ .TableOfContents }}生成的内容，这是由Hugo预先定义好的Toc模板，因此我们
的思路是在html加载完成后，利用js重写</br>{{ .TableOfContents }}的内容，再加上我们预先定义好的css文件即可。

  - `1`. 为{{.TableOfContents}}模板外围，增加`目录`和`返回顶部`的html元素
  - `2`. 在main.js中解析{{.TableOfContents}}模板的原始内容，重新构造否合我们css样式的模板内容
    - 递归抽取{{.TableOfContents}}模板下的标题内容
    - 递归生成{{.TableOfContents}}模板的内容，增加手势图标和目录号
    - 用新生成的html内容替换{{.TableOfContents}}模板的内容
  - `3`. 调整css样式(主要是位置)直到我们满意为止

## 利用js重写{{.TableOfContents}}模板内容
&emsp;&emsp;通过js脚本在html加载完成后，递归解析{{.TableOfContents}}模板ul的li元素，重写该模板。

###  为{{.TableOfContents}}模板前后增加元素
&emsp;&emsp;toc.html文件如下,增加`目录`和`返回顶部`的html元素，通过前端观察发现{{ .TableOfContents }}模板展开后是
```<nav id="TableOfContents"> ... </nav>```可通过$("#TableOfContents")获取该jQuery对象

```html
{{ if not .Params.notoc }}
  {{ if or .Params.toc (and (gt .WordCount 400 ) (ne .Params.toc "false")) }}
  <aside class="toc">
    <div id='anchors-navbar'>
        <i class='fa fa-anchor'></i>
        {{ .TableOfContents }}
    </div>
    <a href="#" id="GoTop">
        <i class="fa fa-arrow-up"></i>
    </a>
  </aside>
  {{ end }}
{{ end }}
```

### 对比{{ .TableOfContents }}模板修改前后的内容

- {{ .TableOfContents }}模板生成的原始内容

```html
<ul>
   <li><a href="#gnu-sed-replacement-string-标志">Gnu Sed {replacement-string}标志</a></li>
   <ul>
        <li><a href="#l">\l</a></li>
    <ul>
    <li><a href="#你好">你好</a></li>
    <li><a href="#你好-1">你好</a></li>
    <ul>
        <li><a href="#hello">hello</a></li>
        <ul>
            <li><a href="#world">world</a></li>
        </ul>
    </ul>
        <li><a href="#你好-2">你好</a></li>
    </ul>
        <li><a href="#l-1">\L</a></li>
        <li><a href="#u">\u</a></li>
        <li><a href="#u-1">\U</a></li>
        <li><a href="#e">\E</a></li>
   </ul>
   <li><a href="#replacement-string-标志的用法">{replacement-string}标志的用法</a></li>
</ul>

```
- {{ .TableOfContents }}模板修改后的内容

```html

<ul>
   <li><span class="title-icon "></span> <a href="#gnu-sed-replacement-string-标志"><b>1. </b>Gnu Sed {replacement-string}标志</a></li>
   <ul>
        <li> <span class="title-icon "></span> <a href="#l"><b>1.1. </b>\l</a></li>
    <ul>
    <li><span class="title-icon "></span><a href="#你好"><b>1.1.1. </b>你好</a></li>
    <li><span class="title-icon "></span><a href="#你好-1"><b>1.1.2. </b>你好</a></li>
    <ul>
        <li><span class="title-icon "></span><a href="#hello"><b>1.1.2.1. </b>hello</a></li>
        <ul>
            <li><span class="title-icon "></span><a href="#world"><b>1.1.2.1.1. </b>world</a></li>
        </ul>
    </ul>
        <li><span class="title-icon "></span><a href="#你好-2"><b>1.1.3. </b>你好</a></li>
    </ul>
        <li><span class="title-icon "></span><a href="#l-1"><b>1.2. </b>\L</a></li>
        <li><span class="title-icon "></span><a href="#u"><b>1.3. </b>\u</a></li>
        <li><span class="title-icon "></span><a href="#u-1"><b>1.4. </b>\U</a></li>
        <li><span class="title-icon "></span><a href="#e"><b>1.5. </b>\E</a></li>
   </ul>
   <li><span class="title-icon "></span><a href="#replacement-string-标志的用法"><b>2. </b>{replacement-string}标志的用法</a></li>
</ul>

```

### 重新渲染{{ .TableOfContents }}模板
这里我们为main.js引入3个方法，分别为:iterativeUL、iterativeUI、initNavigations

- __递归解析模板{{ .TableOfContents }}的ul结构__

```js
iterativeUL: function($dom) {
    var li_list = []
    $dom.children("li").each(function(i, item) {
        var _li = { 
            url: $(item).children("a").attr("href"), 
            name: $(item).children("a").text(),
            children: []
        }   
        $sub_ul = $(item).children("ul")
        if ($sub_ul.length > 0) {
            _li.children = main.iterativeUL($sub_ul)
        }   
        li_list.push(_li)
    })  
    return li_list
}
```

- __递归合成模板{{ .TableOfContents }}的ul结构__

```js
iterativeUI: function(root, template, prefix) {
    template += "<ul>"
    $.each(root, function(i, item) {
        var next_prefix = prefix + String(i+1) + "." 
        template += '<li>'+
                        '<i class="fa fa-hand-o-right" aria-hidden="true"></i>'+
                        '<span class="title-icon "></span>'+
                        '<a href="99991997"><b>99991998  </b>99991999</a>'
                           .replace("99991997", item.url)
                           .replace("99991999", item.name)
                           .replace("99991998", next_prefix) +
                    '</li>'
        if (item.children.length > 0) {
            template = main.iterativeUI(item.children, template, next_prefix)
        }   
    })  
    template += "</ul>"
    return template
}
```

- __入口方法，替换模板{{ .TableOfContents }}为新生成ul结构，重新渲染Toc__

&emsp;&emsp;`注意：`由于导航栏固定显示,所以目录锚点需要往上偏移导航栏高度的距离，这里通过js事件来控制滚轴上移。

```js
initNavigations: function() {
    var $navigations = $("#TableOfContents");
    /* 这是个大坑, 需要大于号>来限制只选择一级子元素，否则会有多组ul被匹配到 */
    var root = main.iterativeUL($("#TableOfContents > ul"))
    if (root.length <= 0) {
        return;
    }

    var html = main.iterativeUI(root, '', '')

    //重新替换Toc模板
    $navigations.html(html)

    //由于导航栏固定,所以调整目录锚点往上偏移导航栏高度的距离
    var fixSet = $("#main-navbar").height() + 10; 
    $('nav#TableOfContents a[href^="#"][href!="#"]').click(function(e) {
        e.preventDefault();
        $('html, body').animate({scrollTop: $(decodeURI(this.hash)).offset().top - fixSet}, 400);
    }); 
}
```

## 为模板{{ .TableOfContents }}增加css样式
toc.css文件如下:

```css
/* 浮动导航 */
#anchors-navbar {
    background-color: #fafafa;
    border: 1px solid rgba(0, 0, 0, .07);
    border-radius: 1px;
    -webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, .175);
    box-shadow: 0 6px 12px rgba(0, 0, 0, .175);
    background-clip: padding-box;
    padding: 5px 10px;
    position: fixed;
    right: 50px;
    top: 68px;
    font-size: 12px;
    white-space: nowrap;
    z-index: 999;
    cursor: pointer;
    text-align: right;
    max-height: 70%;
    overflow-y: auto;
    overflow-x: hidden;
}

#anchors-navbar ul{
    display: none;
    text-align: left;
    padding-right: 10px;
    padding-left: 18px;
    padding-top: 5px;
    list-style-type: none;
}

#anchors-navbar:hover ul{
    display: block;
}

#anchors-navbar ul li a {
    text-decoration: none;
    border-bottom: none;
    font-size: 14px;
    color: #364149;
    background: 0 0;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    position: relative;
    font-weight: bold;
}

#anchors-navbar ul li a:hover {
    text-decoration: underline;
    font-weight: bold;
    color: #0000FF;
}

#anchors-navbar ul li .title-icon {
    padding-right: 4px;
}

/* 返回顶部 */
#GoTop {
    position: fixed;
    right: 50px;
    bottom: 68px;
    background-color: #fafafa;
    border: 1px solid rgba(0, 0, 0, .07);
    border-radius: 1px;
    -webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, .175);
    box-shadow: 0 6px 12px rgba(0, 0, 0, .175);
    background-clip: padding-box;
    z-index: 999;
    cursor: pointer;
    font-size: 12px;
    padding: 5px 10px;
    color: #364149;
}
```

# 总结
&emsp;&emsp;以上方案只是一个简单例子，大家可以为自己设计更漂亮的目录样式，希望能够抛砖引玉。这里只是展示一种重新渲染
模板的思路，在我们选取了一个主题后，可以基于该主题设计完善符合我们自己个性的内容，下一篇我们来重新设计基于algolia搜索
的beautifulhugo主题的搜索框。


# 参考

- [gitbook的gitbook-plugin-anchor-navigation-ex插件](https://github.com/zq99299/gitbook-plugin-anchor-navigation-ex)
- [Hugo 官方对于Toc的介绍](https://gohugo.io/content-management/toc/)
