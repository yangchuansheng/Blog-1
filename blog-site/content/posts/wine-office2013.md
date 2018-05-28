---
title: "Linux安装Office2013"
date: 2018-04-26T08:14:31+08:00
draft: false
categories: "linux"
bigimg: [{src: "https://res.cloudinary.com/devops007/image/upload/v1527487900/System/Wine/Office2013/backgroud.jpg", desc: "苏州 创意产业园 May 5,2017"}]
tags: ["linux", "wine", "PlayOnLinux", "Office2013"]
---

&emsp;&emsp;如果你习惯了Office办公，比如我的学习笔记是用OneNote记录的。借助PlayOnLinux来完成安装，由于当前wine版本支持最稳定的Office是2010版本，Office2010的安装可以参考上篇`Photoshop-CS6`的安装，我们这篇主要介绍如何利用Bash脚本安装不稳定的Office2013，路总是人走出来的，只有大家一起努力，才能让那些不稳定的版本慢慢变得稳定，我们应该参与进去，而不是一味的将希望寄托在别人身上。
![office-list](https://res.cloudinary.com/devops007/image/upload/v1527487576/System/Wine/Office2013/office2013.logo.png)
<!--more-->

# 功能介绍

一些基础概念这篇就不介绍了，可以看上篇[Photoshop-CS6](/posts/wine-photoshop-cs6/)，这里介绍一下PlayOnLinux的Configure功能下的部分选项（经教程在Fedora24和26环境下测试通过）。

- __1. General__
  ![General](https://res.cloudinary.com/devops007/image/upload/v1527250610/System/Wine/Office2013/General.png)

  - `Wine version`:表示选择运行该软件的wine环境，如果软件安装好后，运行不稳定，我们可以调整这里的版本，直到找到一个稳定的版本。(这里的wine版本可以理解为windows内核而非操作系统)

- __2. Wine__
![Wine](https://res.cloudinary.com/devops007/image/upload/v1527250570/System/Wine/Office2013/Wine.png)

  - `Configure Wine` 管理一些驱动、库之类的内容
  - `Registry Editor` 注册表编辑器，与`wine regedit`命令一样，注册表是全局的，并不是针对某个wine版本的
  - `Windows reboot` 重启系统，有时候配置生效需要重启
  - `Repair virtual drive` 修复wine环境
  - `Command prompt` 类似于windows的cmd.exe程序，用于手动安装一些dll补丁
  - `Task manager` 任务管理器
  - `Kill processes` 终止进程
  - `Control pannel` 控制面板

- __3. Miscellaneous__
![Miscelaneous](https://res.cloudinary.com/devops007/image/upload/v1527250545/System/Wine/Office2013/Miscellaneous.png)

  - `Open virtual drive's directory` 打开wine环境的根目录
  - `Open a shell` 运行shell环境，用于脚本安装
  - `Run a.exe file this virtual drive` 在该wine环境下执行其他.exe程序，一般用于跑一些破解软件或安装补丁的.exe程序

# 安装Office2013
&emsp;&emsp;需要执行的步骤如下：

- 1. 下载Office2013中文版 32bit
- 2. 安装wine版本
- 3. 创建Office2013工程
- 4. 执行Office2013安装脚本
- 5. 切换可以运行Office2013的wine版本
- 6. 解决黑屏
- 7. 解决OneNote打不开
- 8. 切换中文语言
- 9. 破解

## 下载Office2013（32位）
&emsp;&emsp;如果需要中文版，务必下载32位的中文版，否则，不好汉化。[这里是中文版下载链接](https://www.microsoft.com/zh-CN/download/details.aspx?id=42017),下载完成后解压，找到setup.exe文件的路径，后面要用到。

## 安装wine版本
打开PlayOnLinux -> Tools -> Manager Wine versions -> (X86) -> 安装3.x的所有版本，如果有更高的版本也一并安装，同时安装2.x-staging，同样有更高版本也一并安装</br>
`说明：` </br>&emsp;&emsp;3.x版本用于安装Office2013，如果该版本安装过程crash了，则更换一个wine版本重新再试，直到找到一个正确的能成功安装， 2.x-staging用于安装完成后，运行Office2013的环境，同理，直到找到一个可稳定运行的版本。

## 创建Office2013工程
打开PlayOnLinux -> Configure -> New(新工程) -> Next -> 32 bits windows installation -> 先选择最高的3.x版本 -> 项目名称定义为`Office2013` -> 一路Next

## 执行Office2013安装脚本
安装脚本如下:

- `1.` 修改`WINEVERSION`变量的值为你上一步选择的3.x wine版本；
- `2.` Configure -> 左侧选中`Office2013`工程 -> Miscellaneous -> Open a shell -> 终端弹出来后，复制准备好的脚本粘贴在终端里，即开始了安装脚本的执行；
![open-shell](https://res.cloudinary.com/devops007/image/upload/v1527250536/System/Wine/Office2013/open-shell.png)
- `3.` 安装过程中如果提示你版本存在是否覆盖或者清除，选择第一项覆盖 -> 选择安装文件的时候指定`setup.exe`路径即可，如果幸运的话，安装过程很顺利；
- `4.` 如果报错，请往下看

```shell
#!/bin/bash
 
# CHANGELOG
# [Quentin PÂRIS] (2015-11-26 22-01)
# Initial version
# minorly modified Version by overflyer87
# (NOT CREDIT WORTHY, JUST TRYING TO HELP REGULAR USERS DYING FOR OFFICE 2013)
 
[ "$PLAYONLINUX" = "" ] && exit 0
source "$PLAYONLINUX/lib/sources"
 
PREFIX="Office2013"
WINEVERSION="3.6"
TITLE="Microsoft Office 2013"
 
POL_GetSetupImages "http://files.playonlinux.com/resources/setups/Office/top.jpg" "http://files.playonlinux.com/resources/setups/Office/left.png" "$TITLE"
 
POL_SetupWindow_Init
 
POL_SetupWindow_presentation "$TITLE" "Microsoft" "http://www.microsoft.com" "Quentin PÂRIS" "$PREFIX"
 
POL_RequiredVersion 4.0.18 || POL_Debug_Fatal "$TITLE won't work with $APPLICATION_TITLE $VERSION\nPlease update"
 
if [ "$POL_OS" = "Linux" ]; then
        wbinfo -V || POL_Debug_Fatal "Please install winbind before installing $TITLE"
fi
POL_Debug_Init
POL_System_SetArch "x86"
 
 
POL_SetupWindow_InstallMethod "LOCAL"
 
POL_SetupWindow_browse "$(eval_gettext 'Please select the setup file to run')" "$TITLE"
SetupIs="$APP_ANSWER"
 
 
POL_Wine_SelectPrefix "$PREFIX"
POL_Wine_PrefixCreate "$WINEVERSION"
 
Set_OS "win7"
 
POL_Wine_WaitBefore "$TITLE"
[ "$CDROM" ] && cd "$CDROM"
 
if [ ! "$(file $SetupIs | grep 'x86-64')" = "" ]; then
    POL_Debug_Fatal "$(eval_gettext "The 64bits version is not compatible! Sorry")";
fi
POL_Wine "$SetupIs"
POL_Wine_WaitExit "$TITLE"
 
# See http://forum.winehq.org/viewtopic.php?f=8&t=23126&p=95555#p95555
POL_Wine_OverrideDLL "native,builtin" "riched20"
 
# Fix a crash when loading a file
# This line was now calling POL_Call POL_Install_msxml6 which always failed since msxml6.dll is already present in
# even freshly created wineprefix and the question of if that file should be deleted and answered with n or y
# always results in crash of this Install function of POL. Install msxml6 manually via POL.
 
POL_Shortcut "WINWORD.EXE" "Microsoft Word 2013" "" "" "Office;WordProcessor;"
POL_Shortcut "EXCEL.EXE" "Microsoft Excel 2013" "" "" "Office;Spreadsheet;"
POL_Shortcut "POWERPNT.EXE" "Microsoft Powerpoint 2013" "" "" "Office;Presentation;"
POL_Shortcut "ONENOTE.EXE" "Microsoft OneNote 2013" "" "" "Network;InstantMessaging;" # No category for collaborative work?
POL_Shortcut "OUTLOOK.EXE" "Microsoft Outlook 2013" "" "" "Network;Email;" # Calendar;ContactManagement; ? :p
 
POL_Extension_Write doc "Microsoft Word 2013"
POL_Extension_Write docx "Microsoft Word 2013"
POL_Extension_Write xls "Microsoft Excel 2013"
POL_Extension_Write xlsx "Microsoft Excel 2013"
POL_Extension_Write ppt "Microsoft Powerpoint 2013"
POL_Extension_Write pptx "Microsoft Powerpoint 2013"
 
POL_SetupWindow_message "$(eval_gettext '$TITLE has been installed successfully\n\nIf an installation Windows prevent your programs from running, you must remove and reinstall $TITLE')" "$TITLE"
POL_SetupWindow_Close
exit
```

### 安装过程可能出现的报错
在安装的过程中，要注意终端窗口里脚本的执行，是否报错缺少某些库，如果没有明显的报错的信息，卡死不动，或者Office安装窗口迟迟不出来，则考虑更换wine版本。另外报错不要轻易终止，有时候是一些可忽略的错误，只管选择下一步，如果明确无法继续执行或者退出了再考虑重新开始执行。

- __1.__ `没有明显的报错的信息，卡死不动，或者Office安装窗口迟迟不出来`<br>
更换wine版本，主要是两处，一处是 Office2013工程 -> General -> Wine version -> 选择其他的3.x版本， 一处是脚本里的`WINEVERSION`变量，修改一致后，打开`Open a shell`重新粘贴开始执行

- __2.__ `PlayOnLinux.desktop: p11-kit: couldn't load module: /usr/lib/pkcs11/p11-kit-trust.so: /usr/lib/pkcs11/p11-kit-trust.so: cannot open shared object file: No such file or directory`</br>
安装你系统对应的p11-kit-devel.i686

- __3.__ `PlayOnLinux.desktop: p11-kit: couldn't load module: /usr/lib/pkcs11/gnome-keyring-pkcs11.so: /usr/lib/pkcs11/gnome-keyring-pkcs11.so: cannot open shared object file: No such file or directory`</br>
安装你系统对应的gnome-keyring i686版本

`注意：` 如果你不是Gnome3桌面，可能不会遇到上述问题


## 切换可以运行Office2013的wine版本

- `1.` Office2013工程 -> General -> Wine version -> 选择2.x-staging
- `2.` 回到PlayOnLinux主配置页面选中某个Office软件 -> Run

`注意：` 如果无法打开或者打开过程报错了，则重新换一个Wine版本,其他的2.x-staging

## 解决黑屏

- `1. `安装winetricks
- `2. `修改注册表
  - 1. 运行命令`wine regedit`或者直接在Wine选项下点击`Registry Editor`打开注册表
  - 2. HKEY_CURRENT_USER -> Software -> Wine 在Wine上鼠标右击选择 new -> key 命名为__Direct3D__（为Wine新建这个子目录）
  - 3. 选中__Direct3D__，右侧空白处鼠标右键 new -> DWORD 命名为__MaxVersionGL__， value值设置为__30002__（十六进制）
  - 4. 关闭注册表，打开Configure -> Office2013 -> Wine -> Windows reboot

## 解决OneNote打不开

打开OneNote提示: </br>
`You must install the desktop experience before you can start OneNote. Open Control Panel, go to Programs and Features, and then click  Open or Closed Windows Features.  `

这是因为缺少两个补丁文件，参照[windows处理的方法](http://www.xitongcheng.com/jiaocheng/dnrj_article_29214.html)，我们安装这两个补丁。

- [InkObj.dll](https://res.cloudinary.com/devops007/raw/upload/v1527478085/System/Wine/Office2013/InkObj.dll)
- [tpcps.dll](https://res.cloudinary.com/devops007/raw/upload/v1527478077/System/Wine/Office2013/tpcps.dll)

选中Office2013 -> Wine -> Command prompt -> 切换到补丁文件所在目录

```shell
> regsvr32 InkObj.dll
> regsvr32 tpcps.dll
```

`注意：`如果提示报错`error while loading shared libraries: libudev.so.0`执行下面的命令，然后重新尝试安装

```shell
ln -sf /usr/lib/libudev.so.1   /usr/lib/libudev.so.0
```

不出意外的话，可以保证OneNote顺利打开。

## 切换中文语言
在安装中文版后，默认打开仍然是英文版的，这是因为我们缺少Windows字体，找一个windows系统打包Fonts目录，拷贝到下面的目录

```
~/.PlayOnLinux/wineprefix/Office2013/drive_c/windows/Fonts
~/.wine/drive_c/windows/Fonts
```

然后随便打开一个Office软件 -> file -> option -> language -> Select user interface and help language（选择用户界面和帮助语言）设置为中文

![language](https://res.cloudinary.com/devops007/image/upload/v1527479719/System/Wine/Office2013/language.png)

设定好关闭软件重新打开，即可完成语言的切换。

## 破解
&emsp;&emsp;目前PlayOnLinux并没有为Office2013提供破解方法，不像Office2010提供了actived的工程，我尝试用KMS软件通过</br>
`Configure -> Office2013 -> Miscellaneous -> Run a.exe file this virtual drive`</br>
运行后进行破解，但是并没有成功，目前还没有好办法，只好退而求其次，在淘宝5块钱买了一个key，亲测可以使用。以下是破解后的信息。
![pojie](https://res.cloudinary.com/devops007/image/upload/v1527250466/System/Wine/Office2013/pojie.png)

# 问题遗留
- `1. `输入法存在问题，无法在Office里边切换中文输入法，有待解决
- `2. `在Gnome3桌面下，运行不稳定，偶尔会Crash掉，KDE桌面稳定一些。

# 总结
&emsp;&emsp;目前我在Gnome3桌面测试安装好的Office2013，发现运行还不是很稳定，但是可以使用，在KDE桌面下运行能够稳定一些。因此希望后面有人能提出好的解决办法。安装过程中大家遇到问题和我不同，注意报错信息，在论坛搜索答案一般都是可以解决的。我在安装的时候，使用PlayOnLinux的__`4.2.11`__版本，但是此版本存在Bug，无法使用Miscellaneous -> Open a shell, 因此降低了一个版本，使用了__`4.2.10`__,下面展示了Excel和World的运行截图。
<figure class="half">
    <img src="https://res.cloudinary.com/devops007/image/upload/v1527250481/System/Wine/Office2013/excel.png" width="600"/>
    <img src="https://res.cloudinary.com/devops007/image/upload/v1527250496/System/Wine/Office2013/word.png"  width="600"/>
</figure>
# 参考

- [Wine 2.0 says it supports Office 2013. How do I actually install it?](https://askubuntu.com/questions/879304/wine-2-0-says-it-supports-office-2013-how-do-i-actually-install-it?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa)
- [Microsoft Office 2013 on Linux using PlayOnLinux 4.2.9](https://www.reddit.com/r/linux/comments/3ukrfh/microsoft_office_2013_on_linux_using_playonlinux/)
- [Microsoft Office 2013](https://www.playonlinux.com/en/app-2665-Microsoft_Office_2013.html)
- [电脑中打开OneNote提示必须先安装桌面体验如何解决?](http://www.xitongcheng.com/jiaocheng/dnrj_article_29214.html)
