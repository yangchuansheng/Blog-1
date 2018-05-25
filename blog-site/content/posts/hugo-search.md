---
title: "为Hugo设计搜索框"
date: 2018-05-24T11:15:23+08:00
draft: false
categories: "hugo"
tags: ["hugo", "beautifulhugo", "algolia", "search"]
bigimg: [{src: "https://res.cloudinary.com/devops007/image/upload/v1523274059/about.jpg", desc: "苏州夜幕 May 3,2018"}]
---

&emsp;&emsp;网上对于`beautifulhugo`主题的搜索框千篇一律，都是基于modal做的，在了解了`algolia`搜索插件的API后，我们基于该插件设计自己的可伸缩搜索框。
希望可以抛砖引玉，为大家提供一个思路。关于algolia插件的引入这里就不介绍了，网上教程很多。我们主要是美化我们的搜索框风格。
<!--more-->

# 效果展示
&emsp;&emsp;右上角就是我为该网站设计的搜索框，点击可以展开，输入内容后自动匹配包含关键字的标题文章，实时刷新。

# 设计思路
&emsp;&emsp;将搜索框融入菜单栏，作为其中的一部分，在点击后可以自动展开，搜索内容为空的情况再次点击可以收起搜索框，或者点击其他任何地方即可收起，
在搜索过程中可以在弹出的下拉列表中选择文章，无列表表示没有标题被匹配到。

## 在菜单栏模板位置增加一个菜单选项
&emsp;&emsp;编辑themes/beautifulhugo/layouts/partials/nav.html文件在`<div class="collapse navbar-collapse" id="main-navbar"> ul`最后增加一个`<li>`标签，
内容为导入search.html文件.

```html
{{ if isset .Site.Params "algolia" }}
    {{ partial "search.html" . }}
{{ end }}
```

&emsp;&emsp;search.html文件内容如下, `<li>`标签引入搜索框，`<script>`脚本初始化algolia搜索框的样式和algolia索引，获取索引内容后通过监听文本框的变化来实时更新下拉列表的内容

```html
<li>
     <div class="column">
         <div id="sb-search" class="sb-search">
             <form>
                 <input class="sb-search-input" placeholder="Enter your search term..." type="text" value="" name="search" id="search" autocomplete="off">
                 <input class="sb-search-submit" type="text" value="" autocomplete="off">
                 <span  class="sb-icon-search "></span>
             </form>
             <ul class="sb-option">
             </ul>
         </div>
     </div>
</li>

<script src="{{ "js/algoliasearch.min.js" | absURL }}"></script>
<!-- 搜索插件 -->
<script src="{{ "js/classie.js" | absURL }}"></script>
<script src="{{ "js/uisearch.js" | absURL }}"></script>


<script>
    var client = algoliasearch("X4YB3WOBNV", "{{ .Site.Params.algolia }}");
    var index = client.initIndex('xxxx');

    $(document).ready(function(){
        new UISearch( document.getElementById( 'sb-search' ) );
    })
    .on('input propertychange', '.sb-search-input', function() {
        var search_str = $(this).val()
        if (search_str == "") {
            $(".sb-option").empty()
        } else {
            index.search(search_str, function (err, contacts){
                $(".sb-option").empty()
                for (var i = 0; i < contacts.hits.length; i++) {
                    var _li = '<li>' +
                                  '<a href="/' + contacts.hits[i].uri  + '">'+
                                      '<span>' + contacts.hits[i].title  + '</span>'+
                                  '</a>'+
                              '</li>'
                    $(".sb-option").append(_li)
                }
            });
        }
    })
</script>

```

## 设计css文件渲染搜索框
&emsp;&emsp;search.css文件是修改过后的，里面涉及字体文件，后面有下载链接，大家可以调整该文件完美融入自己的主题。


## 下载链接
- [search.css]()
- [uisearch.js]()
- [classie.js]()
- [字体文件]()

# 参考
- [Hugo 集成 Algolia 搜索](https://juejin.im/entry/5ab6e9c8f265da239d4943c6)
- [自伸缩的搜索框](http://www.jq22.com/jquery-info3866)
- [jQuery可伸缩搜索框](http://www.jq22.com/jquery-info9142)

