---
title: "post_save VS pre_save VS rewrite_save 哪个更好?"
date: 2018-07-10T18:56:35+08:00
draft: true
categories: "python3"
tags: ["python3", "Django", "signal"]
bigimg: [{src: "https://res.cloudinary.com/devops007/image/upload/v1531224303/python3/nature.jpg", desc: "Jul 10,2018"}]
---

&emsp;&emsp;`post_save` vs `pre_save` 或者处理模型时覆盖`save()`方法哪个更好？我们来讨论一下。<br/>
在大多数情况下，我认为[Signals](https://docs.djangoproject.com/en/1.10/topics/signals/)是处理模型之间共享数据的最佳方式，假设每个相关模型的CRUD不是一起完成的（即在视图中）。因此，`post_save`, `pre_save`, `post_delete`, `pre_delete` 等通常是处理任何给定模型实例所依赖的数据的最佳方式,在保存前后操作模型数据（例如使用slugify方法在标题上设置slug）这一点上，信号是专门为此设计的。关于信号另一个好处是你可以在整个项目中连接它们，而不一定只是在定义模型的地方,只需导入模型和您要连接的信号即可。
<!--more-->

# 讨论

```python
# models.py

from django.db.models.signals import pre_save
from django.utils.text import slugify

from yourapp.models import YourModel # assuming YourModel isn't defined on this page

def your_receiver_function(sender, instance, *args, **kwargs):
      if instance.title and not instance.slug:
               instance.slug = slugify(instance.title)

pre_save.connect(your_receiver_function, sender=YourModel)`
```

每一个信号都有自己的特点，你可以在这里的[文档](https://docs.djangoproject.com/en/1.10/topics/signals/)中阅读,但是我想用`pre_save`和`post_save`信号分享一些我的心得。

 - 每次调用模型时都会调用.save()方法，换句话说，每当保存模型实例都会触发此信号
 - 在post_save实例上运行save()通常会创建一个永不停止的循环，因此只有在您没有正确使用.save()时才会导致超出最大递归深度错误
 - pre_save非常适合更改实例数据，因为您不必调用save()，从而消除了上面的可能性。 你不必调用save()的原因是因为pre_save信号的字面意思是在保存之前
 - signal可以调用其他信号或运行延迟任务(celery)，这是非常有作用的。

&emsp;&emsp;可以覆盖`save()`方法，但通常不推荐使用，因为signal接收器是针对特定情况而设计的。接收器函数(处理信号的回调函数)在其他模型中非常有用而且可重用，但是覆盖save()方法通常不太可重用。因此建议使用信号来覆盖模型方法(如`save()`、`delete()`等)，这正是Django开发人员为我们设计的。
