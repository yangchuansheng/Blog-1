---
title: "如何在Linux桌面上养鱼"
date: 2018-04-11T20:50:21+08:00
draft: false
categories: "Fedora Opensuse Redhat Centos"
tags: ["compiz-fusion","fedora", "opensuse", "redhat", "centos"]
bigimg: [{src: "https://res.cloudinary.com/devops007/image/upload/v1523547959/basketball.jpg", desc: "苏州微软篮球对抗赛 Apr 10,2018"}]
slug: "20180411"
---

&emsp;&emsp;[Compiz](http://wiki.compiz.org/) 是第一个由 [OpenGL](https://zh.wikipedia.org/wiki/OpenGL)
 驱动的运行于 [X Window System](https://zh.wikipedia.org/wiki/X_Window_System) 上的混合窗口管理器 。
 Compiz的混合渲染能力使其可以在窗口管理过程中实现多种视觉效果，比如在矩形虚拟桌面上的窗口最小化。
 compiz整合了多种特效，最为有趣的是飞雪和养鱼，今天带大家来看看如何在办公桌上养鱼。<br>
<br>
<br>

![compiz](https://res.cloudinary.com/devops007/image/upload/v1523446334/cube2.png)

我们以Fedora系统举例演示，先看一下最终的养鱼效果图,在vim编辑代码的时候鱼儿仍然置于最前端：

![fish](https://res.cloudinary.com/devops007/image/upload/v1523446219/myFish.gif)



## 环境准备
1. KDE桌面(Gnome-Unity也可以)
2. 软件compiz-fusion

## 软件安装
- __KDE桌面安装__（Gnome-Shell 不支持3D，主要是显卡的冲突问题，Gnome-Unity是支持的,这里以KDE桌面演示）
    1. Fedora(Centos, Redhat)
    ```shell
    #yum install @"KDE Plasma Workspaces"
    ```

    2. openSuSe
    ```shell
    #zypper install -t pattern kde kde_plasma
    ```

    3. Ubuntu
    ```shell
    #apt-get install kubuntu-plasma5-desktop plasma-workspace-wallpapers
    ```

- __Compiz-Fusion安装__(一般版本新一点的系统都会集成这些包)
    ```shell
    #apt-get|zypper|yum|dnf install compiz*  *fusion-*
    ```

- __最终软件如下（Fedora24）__:

   ```
   compizconfig-python-0.8.14-1.fc26.x86_64
   compiz-plugins-experimental-devel-0.8.14-1.fc26.x86_64
   compiz-devel-0.8.14-1.fc26.x86_64
   compiz-0.8.14-1.fc26.x86_64
   compiz-plugins-experimental-0.8.14-1.fc26.x86_64
   compiz-plugins-main-devel-0.8.14-1.fc26.x86_64
   compiz-plugins-extra-0.8.14-1.fc26.x86_64
   compiz-plugins-main-0.8.14-1.fc26.x86_64
   libcompizconfig-0.8.14-1.fc26.x86_64
   compiz-plugins-extra-devel-0.8.14-1.fc26.x86_64
   qt4-style-fusion-0-3.hg20151214.fc26.x86_64
   fusion-icon-0.2.4-1.fc26.noarch
   ```

## 配置
- [X] `CompizConfig Settings Manager`(CompizCMM) 特效配置
- [ ] `Compiz Start` 控制3D特效启动与关闭
- [ ] `Compiz Fusion Icon` 功能与Compiz Start功能一样，控制启动

![Software](https://res.cloudinary.com/devops007/image/upload/v1523300794/compiz.png)

&emsp;&emsp;接下来重点介绍一下,立体鱼缸与平面鱼缸的配置，立体鱼缸呢就是桌面呈现立方体形状，鱼儿在鱼缸中心点活跃，看起来里离自己比较远，可以旋转(Ctrl+Alt+方向键）,
平面鱼缸就像上面那样，虽然没有鱼缸效果，但是鱼儿仍然是立体的，效果更逼真一点，最大的优点是平面状态，鱼儿始终在屏幕最前方，也就是说不管你是浏览网页，还是
写代码，亦或是锁屏鱼儿都会以立体的方式出现，再配一张类似于上面的深海壁纸，效果就更好了！

以下是整体配置界面,主要需要关注的是Desktop（3D功能控制）和Effects（特效设置）
![setting](https://res.cloudinary.com/devops007/image/upload/v1523534928/compiz_setting.png)

- __`Step1`开启3D__(Desktop项)
    1. Desktop Cube -> Behavior
        - [X] Inside Cube 勾选，开启立体桌面，鱼儿在鱼缸中央活动，这时候把鱼儿尺寸设大一些
        - [ ] Inside Cube 不选，鱼儿在平面桌面上活动，如上面动图所示（建议不勾选）
        ![Desktop-Cube](https://res.cloudinary.com/devops007/image/upload/v1523535787/Desktop-Cube.png)
    2. Rotate Cube 开启3D旋转(Ctrl+Alt+方向键)

- __`Step2` 设置鱼儿数量及鱼缸__(Effects项)
    1. Cube Atlantis(亚特兰蒂斯立方体)
        - [X] General 配置鱼儿的速度和大小种类，还有水草
        - [X] Water/Ground 配置鱼缸水的深度和透明度（这里全部设置透明，不建议使用，因为液体与水草效果不逼真）
        - [X] Display 设置阳光和鱼的透明度，也就是上面动图水面的阳光及鱼儿的颜色深度，建议调亮一些，让阳光穿透海平面
        ![Cube-Atlantis](https://res.cloudinary.com/devops007/image/upload/v1523535641/Cube-Atlantis.png)

- __`Step3` 设置深海壁纸__(Utility项)
    1. Wallpaper -> General 这里我们选择一张深海背景图，替换鱼缸特效

![Wallpaper](https://res.cloudinary.com/devops007/image/upload/v1523535703/Wallpaper.png)

## 总结
&emsp;&emsp;飞雪特效大家可以按着类似思路进行配置，难点在于软件的安装，如果系统版本比较老的话可能没有集成好的包，就需要我们一个一个去找了，不建议使用源码编译，该软件已经
很久不更新了，依赖很难解决，可能涉及到要降低你的软件版本问题。另外就是该软件与Gnome桌面兼容性不好,会造成黑屏，桌面不受控制。默认是支持KDE桌面的，Gnome-Unity也支持，
但是Gnome-Unity对Fedora系列系统来说已经不使用了，目前是Ubuntu系统的默认桌面，因此Ubuntu用户也可不切换KDE桌面就可以使用此软件。

## 参考

- [compiz-wiki Archlinux 中文社区](https://wiki.archlinux.org/index.php/Compiz_(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87)) <br><br><br>

