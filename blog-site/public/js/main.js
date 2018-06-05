// Dean Attali / Beautiful Jekyll 2016

var main = {

  bigImgEl : null,
  numImgs : null,

  init : function() {
    // Shorten the navbar after scrolling a little bit down
    $(window).scroll(function() {
        if ($(".navbar").offset().top > 50) {
            $(".navbar").addClass("top-nav-short");
        } else {
            $(".navbar").removeClass("top-nav-short");
        }
    });

    
    // On mobile, hide the avatar when expanding the navbar menu
    $('#main-navbar').on('show.bs.collapse', function () {
      $(".navbar").addClass("top-nav-expanded");
    });
    $('#main-navbar').on('hidden.bs.collapse', function () {
      $(".navbar").removeClass("top-nav-expanded");
    });
  
    // On mobile, when clicking on a multi-level navbar menu, show the child links
    $('#main-navbar').on("click", ".navlinks-parent", function(e) {
      var target = e.target;
      $.each($(".navlinks-parent"), function(key, value) {
        if (value == target) {
          $(value).parent().toggleClass("show-children");
        } else {
          $(value).parent().removeClass("show-children");
        }
      });
    });

    // Ensure nested navbar menus are not longer than the menu header
    var menus = $(".navlinks-container");
    if (menus.length > 0) {
      var navbar = $("#main-navbar").find("ul");
      var fakeMenuHtml = "<li class='fake-menu' style='display:none;'><a></a></li>";
      navbar.append(fakeMenuHtml);
      var fakeMenu = $(".fake-menu");

      $.each(menus, function(i) {
        var parent = $(menus[i]).find(".navlinks-parent");
        var children = $(menus[i]).find(".navlinks-children a");
        var words = [];
        $.each(children, function(idx, el) { words = words.concat($(el).text().trim().split(/\s+/)); });
        var maxwidth = 0;
        $.each(words, function(id, word) {
          fakeMenu.html("<a>" + word + "</a>");
          var width =  fakeMenu.width();
          if (width > maxwidth) {
            maxwidth = width;
          }
        });
        $(menus[i]).css('min-width', maxwidth + 'px')
      });

      fakeMenu.remove();
    }      


    //处理目录
    main.initNavigations();
    // show the big header image  
    main.initImgs();
  },
    
  /* 递归解析ul结构 */
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
  },
  /* 递归合成模板 */
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
  },
  /* 重新渲染Toc */
  initNavigations: function() {
      var $navigations = $("#TableOfContents");
      /* 这是个大坑, 大于号>来限制只选择一级子元素，否则会有多组ul被匹配到 */
      var root = main.iterativeUL($("#TableOfContents > ul"))
      if (root.length <= 0) {
          return;
      }

      //var html = '<div id="anchors-navbar"><i class="fa fa-anchor"></i>';
      var html = main.iterativeUI(root, '', '')
      $navigations.html(html)
      // 调整目录锚点往上偏移导航栏高度的距离。
      var fixSet = $("#main-navbar").height() + 10;
      $('nav#TableOfContents a[href^="#"][href!="#"]').click(function(e) {
          e.preventDefault();
          $('html, body').animate({scrollTop: $(decodeURI(this.hash)).offset().top - fixSet}, 400);
      });
  },
  
  initImgs : function() {
    // If the page was large images to randomly select from, choose an image
    if ($("#header-big-imgs").length > 0) {
      main.bigImgEl = $("#header-big-imgs");
      main.numImgs = main.bigImgEl.attr("data-num-img");

          // 2fc73a3a967e97599c9763d05e564189
    // set an initial image
    var imgInfo = main.getImgInfo();
    var src = imgInfo.src;
    var desc = imgInfo.desc;
      main.setImg(src, desc);
    
    // For better UX, prefetch the next image so that it will already be loaded when we want to show it
      var getNextImg = function() {
      var imgInfo = main.getImgInfo();
      var src = imgInfo.src;
      var desc = imgInfo.desc;      
      
    var prefetchImg = new Image();
      prefetchImg.src = src;
    // if I want to do something once the image is ready: `prefetchImg.onload = function(){}`
    
      setTimeout(function(){
                  var img = $("<div></div>").addClass("big-img-transition").css("background-image", 'url(' + src + ')');
        $(".intro-header.big-img").prepend(img);
        setTimeout(function(){ img.css("opacity", "1"); }, 50);
      
      // after the animation of fading in the new image is done, prefetch the next one
        //img.one("transitioned webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
      setTimeout(function() {
        main.setImg(src, desc);
      img.remove();
        getNextImg();
      }, 1000); 
        //});   
      }, 6000);
      };
    
    // If there are multiple images, cycle through them
    if (main.numImgs > 1) {
        getNextImg();
    }
    }
  },
  
  getImgInfo : function() {
    var randNum = Math.floor((Math.random() * main.numImgs) + 1);
    var src = main.bigImgEl.attr("data-img-src-" + randNum);
  var desc = main.bigImgEl.attr("data-img-desc-" + randNum);
  
  return {
    src : src,
    desc : desc
  }
  },
  
  setImg : function(src, desc) {
  $(".intro-header.big-img").css("background-image", 'url(' + src + ')');
  if (typeof desc !== typeof undefined && desc !== false) {
    $(".img-desc").text(desc).show();
  } else {
    $(".img-desc").hide();  
  }
  }
};

// 2fc73a3a967e97599c9763d05e564189

document.addEventListener('DOMContentLoaded', main.init);
