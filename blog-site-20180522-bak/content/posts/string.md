---
title: "Sed 101 Hackas"
date: 2018-04-09T21:56:04+08:00
draft: false
categories: "cloud-native"
tags: ["service-mesh","cloud-native"]
bigimg: [{src: "https://res.cloudinary.com/devops007/image/upload/dpr_0.75/v1523215797/IMG_0165.jpg", desc: "杭州建德 May 8,2016"}]
slug: "20180409"
---
# Gnu Sed {replacement-string}标志

这些标志仅在sed的GNU版本中可用。它们可以用于sed替换命令的{replacement-string}部分。

## \l

当你在{replacement-string}部分指定\l，它将紧跟在\l上的字符视为小写字母。 
你已经知道下面这个简单的例子会将John改为JOHNNY。<br/>

```
sed 's/John/JOHNNY/' employee.txt
```

以下示例在{replacement-string}中的H之前包含\l（即JO\lHNNY）。 这只会将JOHNNY中的字符h改为小写。

__替换John 为 JOhNNY__:

```
$ sed -n 's/John/JO\lHNNY/p' employee.txt
101,JOhNNY Doe,CEO
```

## \L

当你在{replacement-string}部分指定\L，会将其余字符视为小写字母。<br/>

以下示例在{replacement-string}中的H之前包含\L（即JO\LHNNY）。这将会其余的字符从H开始全部变为小写。

__替换Johnny 为 JOhnny__:
```
$ sed -n 's/John/JO\LHNNY/p' employee.txt
101,JOhnny Doe,CEO
```

## \u

类似与\l，不过是变为大写。在{replacement-string}中指定\u,它会将紧跟在\u后面的字符视为大写字母。以下
示例在{replacement-string}（即jo\uhnny）中在h之前包含\u，这将会 johnny 中的h改为大写。

__替换John 为 joHnny__:

```
$ sed -n 's/John/jo\uhnny/p' employee.txt
101,joHnny Doe,CEO
```

## \U

当您在{replacement-string}部分中指定\U时，它会将其余字符视为大写字母。 以下示例在{replacement-string}（即jo\Uhnny）中h之前包含\U。
这会将其余的字符从johnny中的h开始以后的部分全部改为大写。

__替换John to joHNNY__:

```
$ sed -n 's/John/jo\Uhnny/p' employee.txt
101,joHNNY Doe,CEO
```

## \E

这应该与\L和\U组合使用，这会停止由\L和\U启动的转换。以下示例以大写打印
整个{replacement-string}中的"Johnny Boy",因为我们在{replacement-string}开头有\U。

__替换John 为 JOHNNY BOY:__:

```
$ sed -n 's/John/\UJohnny Boy/p' employee.txt
101,JOHNNY BOY Doe,CEO
```

__替换John 为 JOHNNY Boy:__:

```
$ sed -n 's/John/\UJohnny\E Boy/p' employee.txt
101,JOHNNY Boy Doe,CEO
```
上面的例子只用大写字母打印"Johnny"，因为我们在替换字符串中紧接在"Johnny"之后有\ E。

# {replacement-string}标志的用法

以上静态示例仅用于了解这些开关如何工作，但是，与静态值一起使用时，标志没有太大价值，
因为您只需要在需要的确切情况下输入静态值即可。<br/>

与分组结合使用时，标志非常有用。 在前面的例子中，我们学习了如何使用分组将字段1与字段3交换。 
您可以使用这些开关将整个分组转换为大写或小写。

__employee name全部大写，employee title全部小写__:

```
$ sed 's/\([^,]*\),\([^,]*\),\(.*\).*/\U\2\E,\1,\L\3/g' employee.txt
JOHN DOE,101,ceo
JASON SMITH,102,it manager
RAJ REDDY,103,sysadmin
ANAND RAM,104,developer
JANE MILLER,105,sales manager
```

在上面的例子中，{replacement-string}走以下流程

  * \U\2\E -- 这表明该字段是第二组（employee name），应该转换为大写字母。 \U开始大写转换，\E停止转换。
  * \L\3 -- 这表明该字段是第三组（employee title），应该转换为小写。\L开始对其余字符进行小写转换。
