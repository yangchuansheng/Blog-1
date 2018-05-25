---
title: "用Wine为Linux移植Photoshop-CS6"
date: 2018-04-25T15:17:20+08:00
draft: false
categories: "fedora"
bigimg: [{src: "https://res.cloudinary.com/devops007/image/upload/v1527247808/System/Wine/PhotoShop/wine-1.jpg"}]
tags: ["fedora", "wine", "PlayOnLinux", "PhotoshopCS6"]
---

&emsp;&emsp;`Photoshop`强大之处自不必多说，假设你拥有一点PS技术，身为IT工作者的你由于工作需要有时会处理一些图片，比如我为自己的博客设计背景图片，这个时候在Linux桌面上拥有一款
PS软件是非常方便的，虽然Linux环境下拥有替代产品`IMP`,但是习惯PS的我还是想在Linux上实现这一目标，由于Windows环境不在考虑范围内，Mac也不是人人都有，但是感谢`Wine`社区的努力，让我们
在Linux环境底下运行`.exe`程序不再是梦想，喜欢打游戏的IT人员一定会爱上它的，而且最近我在YouTobe上看到了有人成功移植了LOL。
![CS6](http://res.cloudinary.com/devops007/image/upload/v1527245761/System/Wine/PhotoShop/Adobe-Photoshop-CS6.png)
<!--more-->

# Wine是什么？
&emsp;&emsp;Wine不是Windows模拟器，而是运用API转换技术实做出Linux对应到Windows相对应的函数来调用DLL以运行Windows程序。Wine可以工作在绝大多数的UNIX版本下,包括Linux, FreeBSD, 和 Solaris。另外，也有适用于Mac OS X的Wine程序。Wine不需要Microsoft Windows, 因为这是一个完全由百分之百的免费代码组成的。如果有可利用的副本的话，它也可以随意地使用本地系统的DLLs。Wine的发布是完全公开源代码的，并且是免费发行的。(基于LGPL发布:GNU宽通用公共许可证)
关于Wine的真正含义，有人对"Wine Is Not an Emulator"的说法表示质疑，认为"非模拟器"的解释不过是一种娱乐性的说法，Wine的真实意思应当是是Windows Enviroment的缩写，即WinE。

# Wine可以干什么? 

- `1.`跑游戏，一些经典的单机游戏都有，具体支持的游戏列表可以去[官网](https://www.playonlinux.com/en/supported_apps.html)上看， 也可以在PlayOnLinux上Install列表里查看而且最近我发现一个外国牛人移植了[LOL](https://www.youtube.com/watch?v=Atfix4mK5Qg)到Linux上，运行流畅，有时间我也会去尝试一下。

- `2.`办公软件，比如我是一个OneNote的重度使用者，为自己移植了Office2013后，在公司和我家里的windows电脑上的OneNote笔记同步，随时更新。WORD、PPT、Excel也用起来非常顺手，当然如果你用的是MAC，就不需要考虑这么多了，我之所以考虑的多，研究各种Linux系统，没错！就是因为我穷。。。

- `3.`图像处理， 像Adobe系列产品基本都是支持的，比如我们今天讲的PhotoShop-CS6就是一款强悍的图像处理软件。


# 借助PlayOnLinux安装Wine
&emsp;&emsp;目前大家使用的各个Linux版本都比较强大，关于PlayOnLinux在各大Linux版本上的安装，网上有很多的教程，这里就不再细说了。PlayOnLinux装好之后，Wine自动就装好了。
Wine是真正运行.exe程序的执行者，PlayOnLinux用来管理Wine的各个版本，隔离软件跑在自己的wine版本环境底下。我安装的是__`4.2.10`__版本，最新的4.2.11存在`Bug`，不能打开shell终端，无法执行
脚本，希望大家注意一下。
![PlayOnLinux](https://res.cloudinary.com/devops007/image/upload/v1527234932/System/Wine/PhotoShop/PlayOnLinux.png)


# 安装Photoshop-CS6
以下会详细说明每一步的安装步骤和会遇到的问题:

- 1. 下载Photoshop-CS6软件
- 2. 安装wine版本
- 3. 指定setup.exe安装文件
- 4. 断网安装Photoshop-CS6
- 5. 破解
- 6. 解决中文乱码

## 下载Photoshop-CS6（32位）
[https://helpx.adobe.com/x-productkb/policy-pricing/cs6-product-downloads.html](Photoshop CS6, Photoshop CS6 Extended) -> 展开`Photoshop CS6, Photoshop CS6 Extended` -> `Chinese Simplified`（Windows版本）

```shell
wget http://trials3.adobe.com/AdobeProducts/PHSP/13/win32/Photoshop_13_LS3.7z
```
下载完成后，解压开找到`setup.exe`文件，记住路径。

## 安装wine
打开PlayOnLinux -> Tools -> Manager Wine versions -> (X86) -> 选择3.4

![wine-version](https://res.cloudinary.com/devops007/image/upload/v1527236482/System/Wine/PhotoShop/Wine-version.png)
`注意：`该步骤也可不做，因为PlayOnLinux会根据软件自动选择合适的wine版本，建议跳过该步骤（该步骤在下一篇脚本安装Office2013的时候会用到）

## 指定setup.exe文件路径
打开PlayOnLinux -> Install -> 搜索Photo..出来后 -> 选中Adobe Photoshop CS6 -> 点击右下角install
![ps-install](https://res.cloudinary.com/devops007/image/upload/v1527236836/System/Wine/PhotoShop/ps-install.png)

一路Next -> 遇到Browse时选择我们刚才setup.exe文件，然后一路Next -> 版本选择32（wine仅支持32位）-> 一路next -> 在Photoshop的setup.exe文件运行后，剩下的就是真正安装PhotoShop的过程
![brows](https://res.cloudinary.com/devops007/image/upload/v1527237471/System/Wine/PhotoShop/ps-brows.png)


## 安装Photoshop-CS6（必须断网）
__`断网`__ -> 选择安装（我有序列号） -> 输入序列号（随便选择一个） -> 提示无法连接网络（选择`稍后连接`）</br>-> 勾选上所有的安装选项（不建议修改安装路径） -> 开始安装 -> 安装完成后关闭（不要打开软件）

```json
1330-1692-9902-6314-3617-7501
1330-1118-3520-6264-1054-3630
1330-1068-5620-4840-9508-1915
1330-1815-5938-9647-9527-4510
```

## 破解
下载：[32位破解补丁](http://res.cloudinary.com/devops007/raw/upload/v1527238675/System/Wine/PhotoShop/amtlib.dll)

```shell
wget http://res.cloudinary.com/devops007/raw/upload/v1527238675/System/Wine/PhotoShop/amtlib.dll
```

拷贝覆盖掉原安装文件的amtlib.dll文件，路径如下（路径不对，可自行在~/.PlayOnLinux/wineprefix/中用find查找该文件）：

```Shell
cp  amtlib.dll  ~/.PlayOnLinux/wineprefix/PhotoshopCS6/drive_c/"Program Files"/Adobe/"Adobe Photoshop CS6"/
```

打开PhotoShop软件，未提示激活信息则表示破解成功，此时可以联网了。
G
## 解决中文乱码

- __1. 安装宋体__
```shell
wget  http://down7.pc6.com/qd3/simsun.zip
unzip simsun.zip
mkdir /usr/share/fonts/truetype/wine-fonts
cp simsun.ttf /usr/share/fonts/truetype/wine-fonts
fc-cache
cp simsun.ttf ~/.wine/drive_c/windows/Fonts/
```

- __2. 修改注册表__

  - 运行命令：wine regedit 打开注册表
  - 找到HKEY_LOCAL_MACHINE\Software\Microsoft\Windows NT\CurrentVersion\FontSubstitutes在右边窗格找到MS Shell Dlg 把他的值数据修改为simsun
  - 再找到MS Shell Dlg 2同样也把他的值数据修改为simsun
  - 然后在右边窗格空白处点鼠标右键：新建–字符串值（名称输入：Tahoma)然后再把这个值数据修改为simsun
  - 再进入：HKEY_LOCAL_MACHINE\Software\Microsoft\Windows NT\CurrentVersion\Fonts键值下面，在右边窗格空白处新建一字符串名称是：simsun (TrueType)，再修改此值数据为 z:\usr\share\fonts\truetype\wine-fonts\simsun.ttf （就是字体路径）。

# 总结
最终软件如下：

![ps-final](https://res.cloudinary.com/devops007/image/upload/v1527240475/System/Wine/PhotoShop/ps-final.png)
至此，所有步骤走完，就可以使用了，下面是几点说明，希望能解答你遇到的疑惑。

- __1. `为什么没有说明操作系统？`__

&emsp;&emsp;该教程与操作系统无关，现在主流的操作系统Fedora、Ubuntu、OpenSUSE、Mint都可以简单的安装PlayOnLinux，甚至于Centos也是可以尝试一下的,
我们的重点放在如何理解PlayOnLinux与Wine的关系，如何搭配和使用。（我在Fedora24和26上均测试通过）

- __2. `为什么可以跳过步骤1,不自主选择Wine的版本`__

&emsp;&emsp;所有Install列表列出的软件（只要没有标红）都是已经运行非常稳定的可移植软件，因此这些软件已经定义好了脚本，Wine的版本也确定了下来，而
Photoshop-CS6对应的稳定Wine版本就是3.4，相当于我们提前下载了而已，没有步骤1,流程也会提醒你需要下载。我们下一节安装Office2013就是一个不稳定版本，
需要我们自己通过脚本来定义安装过程，目的是为了自定义Wine的版本和调试错误。

- __3. `为什么要断网？`__

&emsp;&emsp;断网是为了让PS无法验证序列号的正确性，然后我们选择稍后连接，这样不影响后续我们安装所有的包，安装完后替换破解补丁让PS误以为我们的软件是已授权的。而如果选择试用，可能
会造成安装的软件包不全，毕竟需要让你知道不付费的话某些功能是没有或者不能使用的。

- __4. `为什么会乱码？`__

&emsp;&emsp;Photoshop-CS6采用的是宋体，但是我们的系统缺少windows字体，因此需要为系统安装宋体，修改注册表告诉系统simsun.ttf字体的路径，只要能够找到字体，乱码问题就可以得已解决。
甚至于建议大家把Windows的Fonts目录直接拷贝到`~/.wine/drive_c/windows/`下，这样就有了所有的字体，为后面的软件打基础。操作系统有个特性，就是需要的字体没找到，会选择相近的字体来使用，但是没有验证过。

- __5. `很不幸，我安装的过程中crash崩溃了，怎么办？`__

&emsp;&emsp;遇到崩溃的问题，建议大家不要慌，按照提示继续点击下一步，如果最后安装程序退出了，那就从头再来一次，本人恰好遇到crash问题，又来了一遍就可以了。唯一不同的是中间可能会提醒你
Photoshop-CS6已经存在，选择覆盖安装。这是因为上次安装残留下来了文件造成的。Photoshop-CS6在Wine中已经是非常稳定的版本，安装报错的概率非常小，使用起来也非常稳定。下一节我们介绍Office2013
这种不稳定软件的时候你才会懂得什么叫痛苦与折磨。

# 参考

- [How to install Adobe Photoshop CS6 on Ubuntu 16.04](https://www.youtube.com/watch?v=Xq8ditjQ_bs)
- [在linux下使用wine安装photoshop cs6](在linux下使用wine安装photoshop cs6)
