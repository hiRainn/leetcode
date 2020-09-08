---
title: 字符串匹配算法
lang: zh_CN
---

字符串匹配算法一般用于查找主串中是否包含模式串，若包含，则返回主串中的起始位置。有2中最常用的匹配算法，BF(Brute Force)，即暴力算法，KMP快速模式匹配算法

字符串匹配算法一般用于查找主串中是否包含模式串，若包含，则返回主串中的起始位置。有2中最常用的匹配算法，BF(Brute Force)，即暴力算法，KMP快速模式匹配算法

## BF算法

BF算法，顾名思义，没有什么太多的技巧，直接暴力循环查找，当存在匹配全部模式串即返回起始位置。
为方便起见，对主串定义变量名称为s，模式串定义为m。箭头指向为当前指针位置，方框为当前游标位置。流程如下:

![image.png](https://sorahei.com/static/upload/cef87545ce0679683fd4148418c26358.png)


起始上下的指针跟游标都在头部，此时i与j均为0，对s[i]与m[j](即s[0]与m[0]，为方便后面的说明，均使用i,j)进行比较，当匹配成功后，主串游标后移一位，而匹配串指针后移一位，对s[i+1]与m[j]进行比较。延伸可知，每次均是s[i+j]与m[j]进行比较。

![image.png](https://sorahei.com/static/upload/19eeb102d5f65c8405a60db04c3da614.png)

当匹配失败后，将主串指针右移一位，匹配串指针重置到头部。

此时的初始位置是这样:
![image.png](https://sorahei.com/static/upload/e26a7a1b6645452708c2e4d714047fa1.png)。
如图，依旧不匹配，主串的指针继续右移一位，且可以判断，往后直4位(即j=3)均能匹配:

![image.png](https://sorahei.com/static/upload/3202e0a09da16367db538ac679ded30e.png)

而当下一位不匹配的时候继续右移主串指针:

![image.png](https://sorahei.com/static/upload/89d36f73d20ecb82553a4065d62a70f4.png)

即每次匹配失败，均将主串指针右移一位，匹配串指针重置到头部，直至匹配出完整模式串或直至结尾匹配失败，代码实现如下:

```go
func BF(s, m string) int{
  pos := -1
  for i,_ := range s {
    for j,_ := range m {
      if s[i+j] != m[j] {
        break
      }
      if j == len(m) - 1 {
        pos = i
        goto res
      }
    }
  }
  res :
    return pos
}
```
使用BF算法时，若主串长度为n，模式串长度为m时，则此时的时间复杂度为
>O(nm)

## KMP算法 

看完BF算法之后，就有一些思考，比如一个主串``abcdabcde``，模式串为``abcde``,使用BF算法的话，主串匹配到s[0+4]的时候，会匹配失败，游标就会从s[1]开始重新匹配，但是显然s[1]到s[4]都不会匹配成功，这种匹配方式并没有利用到之前匹配到的信息，即s[0]到s[3]是匹配成功的。而人为匹配的话，当s[4]匹配失败后，并不会从s[1]重新开始匹配起，而是去寻找模式串的头部，即"a","ab","abc"等。这里主串移动的距离就不是1，拿这个举例，移动的距离为直接从s[0]到s[4]为4。那么有没有一种算法类似这种，一次移动的距离不止1，甚至游标不回溯呢？

当然有，这就是KMP算法。

>在BF算法中，为了更清晰地说明双重循环的内外层循环，特地用了游标的概念，i指针指向的位置为外层循环当前所处的位置，而s[i+j]为游标读取主串的当前偏移量位置。每次模式串匹配失败则主串指针右移一位，模式串指针重置到头部。
而在KMP算法中，指针是跟着模式串移动的，当匹配失败后主串指针不回溯且模式串指针也无需重置到头部，这么做的好处是可以防止指针回溯，增加匹配查找的效率。
在下列例子与图中，全都会指针跟随移动(一层循环)

讲KMP的具体实现之前，先要讲一些概念。

### 前缀和后缀

对于一个长度为l的字符串s，``s.substr(0,n),0<n<l``的返回均为s的前缀,比如``abcd``的前缀有``a``,``ab``,``abc``。
同理，这个字符串的后缀为``s.substr(n,l-n),1<n<l``的返回为s的后缀，``abcd``的后缀为``bcd``,``cd``,``d``。
字符串本身不能为自己的前缀或者后缀。

>substr(start,length)为截取从start开始长度为length的字符串

好了，讲明白了什么是前缀后缀之后，再说说为什么要讲这个。

看一个例子:主串s为``ababbcabababcdab``,模式串m为``abababc``,直接匹配到第一次匹配不成功之前的一次:

![image.png](https://sorahei.com/static/upload/a4a9792d3ef94a5bdd1cb1c6748161de.png)
<center>此时i与j的指针位置都在3</center>
<br>

在下一次移动后，i指针的位置来到4，从图可以看出，是匹配失败的，但是我们还是有一些信息:即s[0]-s[3]与m[0]-m[3]是匹配的。

![image.png](https://sorahei.com/static/upload/dbfc58112651a7d523882c9994e2b70c.png)

很容易得出结论，每次匹配模式串的时候，一定是要前缀可以匹配得上的。这里的m[0]-m[2]组合为``abab``为模式串的前缀。
而当模式s[4]与m[4]匹配失败后，模式串后移，假设先后移一位，那么主串的头部``a``则不参与匹配，显然，主串中的``bab``,``ab``,``b``为主串已经匹配部分``abab``的后缀。

![image.png](https://sorahei.com/static/upload/5c7c7f7e346585a0fbc962e288400e9b.png)
<center>模主串头部不参与匹配，蓝色部分为主串后缀，黄色为模式串前缀</center>
<br>

从上图很清晰的可以看出，主串的后缀与模式串的前缀``ab``是相同的，所以相同部分是可以省略比较的，因为在移动之前，已经比较过了，显然，这里可以直接移动到如下位置:

![image.png](https://sorahei.com/static/upload/da29405d9383789a5083d740226c684c.png)
<center>模式串指针移动到主串后缀与模式前缀串相等的下一位</center>
<br>

当然你空间能力不是太差的话，就能理解到，这里的移动，其实是**j指针的回溯**。

到这里就可以得出一个结论:**当匹配失败后，模式串指针位置回溯到已经匹配成功的字符串前缀与后缀交集的最大长度值所在位置**

比如上例中第一次匹配成功匹配的``abab``的前缀为``a``,``ab``,``aba``,后缀为``bab``,``ab``,``b``，交集仅有一个``ab``，长度为2，所以下次指针回溯位置为2。第二次匹配成功的字符串是``ab``,前后缀没有交集，所以下次指针初始位置为0。s[i]与m[0]匹配失败后，i指针右移一位。

![image.png](https://sorahei.com/static/upload/234266d6fc0d49f318343a261da0cd2f.png)
<center>第二次匹配j指针初始位置为0</center>
<br>

这里要讲第三个概念，**PMT(Partial Match Table)部分匹配表**。即匹配失败后j指针的初始位置，也就是前缀与后缀的交集最大长度。模式串``abababc``的PMT为:
|char|a|b|a|b|a|b|c|
|-|-|-|-|-|-|-|-|
|index|0|1|2|3|4|5|6|
|PMT value|0|0|1|2|3|4|0|
>每次当j=index时匹配失败，j指针重置到index-1的PMT value位即可。例如当index=4时，abab匹配成功，s[4]匹配失败，则j指针重置到index为3的PMT value位，如图，值为2，与上述例子中一致。通常PMT在很多地方被写作next数组。

原理很清楚了，那如何求这个next数组，总不能每个都手写算吧？当然有办法可以求。

**编程实现 next 数组要解决的主要问题依然是 "如何计算每个字符前面前缀字符串和后缀字符串相同的个数"**。

根据前缀和后缀的定义已知:
- 自身不能是自身的前后缀，next[0]一定等于0
- 前缀必须包含m[0]，后缀必须包含m[i-1]
- 当首尾一致时，前后缀至少包含一个长度为1交集(首或尾)

匹配模式串的前后缀交集，同样可以看成是一个字符串的匹配过程:以前缀为主串，后缀为模式串，那么，同样可以next数据的原理:

![image.png](https://sorahei.com/static/upload/3c71b2ddf8bfeada04a194d37d85cea2.png)
<center>i为0的时候，next[0]为0</center>
<br>

![image.png](https://sorahei.com/static/upload/ce63319c4cb9b513b02d305ff1cc1c1e.png)
<center>j为1的时候，需要判断m[0]与m[1]是否想等</center>
<br>

![image.png](https://sorahei.com/static/upload/7ffa2d9a6afb0a833867355ec3095648.png)
<center>j为2的时候，与m[0]相等</center>
<br>

当j=2时，``aba``的前缀后缀首尾相等，所以此时为1，而``ab``的前后缀没有交集，因此可以断定，``aba``在``ab``的基础上，仅增加一个前后缀交集。当当前指针i与j指向值相等时，同时后移一位指针，如上图当前位置移动后如下图:

![image.png](https://sorahei.com/static/upload/6ec3f2efa67c4af8da6b4af6ca877c40.png)
<center>i,j指针值相等后移一位的位置</center>
<br>

因为m[0]=m[2],即``a=a``,那么当移动之后i与j指向的值相同的话，m[0]-m[1]一定等于m[2]-m[3]，即 ``a + b = a + b``，此时m[0]-m[1]为前缀，而m[2]-m[3]为后缀，此时next[3]的值应该在next[2]基础上+1。

>这里一定要理解，为什么是i与j同时往后移动，想不明白的多品几遍。

![image.png](https://sorahei.com/static/upload/768c153844f5b64da5ee7011fe7837a2.png)
<center>j=3时next数组的情况</center>
<br>

同样的，以此可以得到next[4],next[5]
![image.png](https://sorahei.com/static/upload/66550bcb00d6431908ee542edca398bc.png)
<center>next[4],next[5]</center>
<br>

>为了方便演示后续i与j不相等，将模式串加长了，不影响前面的实现

当i与j继续后移时，m[4]与m[6]不再相等了，那就要回去匹配m[0]-m[6]的前后缀交集了。如何匹配，是i指针直接回到0号位吗?当然不是。

![image.png](https://sorahei.com/static/upload/546f23c294c250c046a19152f291d99b.png)
<center>此时m[i]与m[j]不相等</center>
<br>

这里m[i]与m[j]不相等，但是我们一定要利用上之前的信息，即m[0]-m\[i-1](前缀)与m[j-l-1]-m\[j-1](后缀,l为next[i-1])为成功匹配字符串前后缀的最长子集，,所以仅需要将i指针移到next[i-1]的位置，此例中为2，然后继续比较:

![image.png](https://sorahei.com/static/upload/25575e7ec96d3602e6569fe853e4520c.png)
<center>将i指针指向next[i-1]</center>
<br>

>若移动后新的m[i]与m[j]相等，则next[j]= i + 1,前缀必须0开始，所以子集长度一定是i+1,此处需要理解。

继续判断，不相等继续将i指针移动到next[i-1]

![image.png](https://sorahei.com/static/upload/1cd85468a815aee0c478a8badd94131d.png)
<center>继续将i指针指向next[i-1]</center>
<br>

当i指针的位置为0的时候，此时若m[i]!=m[j]，那么next[j]=0,且右移j指针，重复上述步骤即可得出最后的next数组。

![image.png](https://sorahei.com/static/upload/7a73f1f456390f7b1b5001b8825c826d.png)
<center>最终结果</center>
<br>

那么next数组的go实现如下:

```go
func Next(m string) []int {
    next := make([]int, 0)
    next = append(next, 0)
    if len(m) == 1 {
        goto res
    } else {
        i, j := 0, 1
        for {
            if j >= len(m) {
                break
            }
            if m[i] == m[j] {
            //匹配成功则添加next
                next = append(next, i+1)
                j++
                i++
            } else {
                if i == 0 {
                    next = append(next, 0)
                    j++
                } else {
                    //匹配失败则移动i指针指向
                    i = next[i-1]
                }
            }
        }
    }
res:
    return next
}
```

//综上，KMP的算法实现为
```go
func KMP(s,m string) int {
    next := Next(m)
    pos := -1
    i,j := 0,0
    for {
        if s[i] == m[j] {
            i++
            j++
            if j == len(m) {
                pos = i-j
                goto res
            }
        } else {
            if j == 0 {
                i++
            } else {
                j = next[j-1]
            }
        }
    }
res:
    return pos
}

```




