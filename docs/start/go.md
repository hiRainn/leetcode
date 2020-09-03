---
title: go语法入门
lang: zh_CN
prev: false
---

# go语法入门

因为LeetCode上需要自己实现各种算法，故此处并不多做go内置函数的介绍，仅介绍算法常用包以及数据类型以便快速使用，全部go语法推荐[go语言圣经](https://books.studygolang.com/gopl-zh/) 或 [Go语言入门教程](http://c.biancheng.net/golang/)

## hello world

类似c、c++、java等语言，go的程序入口也是在main函数中，同时也需要定义包名，引入包，最简单的``hello world``程序代码如下

```go
package main

import "fmt"

func main(){
	fmt.Println("hello world")
}
```

在bash中执行``go run main.go``即可输出``hello world``

## 数据类型以及定义

### 变量的定义

go是强类型的语言，变量在使用之前，必须提前声明。声明的方式有3种，分别为标准模式、批量模式、简短模式，下面举例分别进行三种模式介绍

```go
//标准模式
var a int 
var b = 64
var c int8 = 32
//批量模式
var(
	a1 int 
	a2 = 64
	a3 int8 = 10
)
//简短模式
a := 16   //简短模式下会自动根据值的类型判断变量的类型，此处a的类型为int
c,d := 10,"hirainn"   //go的函数允许返回多个值，此时就可以用这种同时赋值多个值的方式
```

### 数据的两种类型

go的数据类型在总体上分为值类型、引用类型以及指针，指针需要显式的使用``new函数或者 &var``进行声明，值类型即对应地址的内存上直接存的数据内容，而引用类型对应的地址内存上存的是变量的地址(可以理解为指针)。
区分的方式为，定义一个变量，将之赋值给另一个变量，当改变其中一个变量值的时候另一个一起改变，则是引用类型，反之则为值类型。

```go
func main(){
	var a int8 = 127
	b := a
	a = 10
	fmt.Println(b)   //结果为127，b并没有随着a的改变而改变，所以int为值类型
	
	c := [3]int{1, 2, 3}
	d := c
	d[0] = 10
	fmt.Println(c[0])  //结果为1，所以array也是值类型
	
	e := []int{1, 2, 3}
	f := c
	f[0] = 10
	fmt.Println(e[0])  //结果为10，所以slice为引用类型
}

```

## 值类型
值类型变量声明后，不管是否已经赋值，编译器为其分配内存，此时该值存储于栈上。声明之后可以直接使用
值类型包括基本数据类型，``int,float,bool,string,array,struct(结构体),byte,rune,complex,interface(接口)``,其中``int``可以进一步分为``int8,uint8,int16,uint16,int32,uint32,int64,uint64``,``float``可以进一步分为``float32,float64``,``complex``可以进一步分为``complex32,conplex64``

```go
func main(){
	a := "hello world" //string类型一定是用双引号，单引号是byte跟rune使用的
	b := [3]{1,2}  //array的声明[]中的3代表数组的长度，数组是定长的，如果[]没有写长度，那就是另外一种数据类型slice(切片)
	c := 4.1415926 //float
	d := 'a'  //byte
	e := '好' //rune 
}
```

结构体的定义
go语言中定义结构体的方式是``type name struct``

```go
type Student struct{
	Name string
	Age int
}

func main(){
	var a Student
	a.Name = "hirainn"
	a.Age = 18
	fmt.Println(a)   //输出{hirainn 18}
}
```
需要注意的是，结构体的名称和属性首字母如果小写的话，那只能在同一个package内访问，外部是无法访问的。

interface(接口)类型会在下面单独讲

官方文档中特地指明``byte``为``uint8``的alias，``rune``为``int32``的alias，**在数值上alias之间的值是相等的，但是在类型上并不相等**

```go
func main(){
	var a byte
	a = 'a'
	var b int
	b = 97
	fmt.Println(a == 97) //返回值为true
	fmt.Println(a == b) //报错，2个类型不同的数据不能进行比较
}
```

那么为什么要"多此一举"的多设置2个类型？因为byte强调的是字节流，即``data raw``，而rune强调的是字符编码，即``unicode``的``code point``
complex为复数，这里暂时不多做介绍。
当使用等号=将一个变量的值赋给另一个变量时，如 ``a=b`` ,实际上是在内存中将 b 的值进行了拷贝，可以通过 &b 获取变量 b 的内存地址。此时如果修改某个变量的值，不会影响另一个。

## 引用类型
引用类型包括``slice(切片)，map(映射) ，chan(通道)``。
变量直接存放的就是一个内存地址值，这个地址值指向的空间存的才是值。所以修改其中一个，另外一个也会修改（同一个内存地址）。
引用类型必须申请内存才可以使用，make()是给引用类型申请内存空间。

### make函数

make函数的用法为``make(type,size,IntegerType) type``,其中type为``slice``,``map``,``chan``,size为初始长度，IntegerType为变量长度。返回值为类型本身。其中当type不为slice是size与IntegerType都可以省略，当type为slice是需要设置size大小，可以为0。

### 切片
不定长的数组就是slice(切片)
```go
func main() {
	a := []int{1, 2, 3, 4}   
	b := a
	b[0] = 10
	fmt.Println(a[0])  //输出10
	var c []int
	c[0] = 1  //报错，因为没有给map分配空间
}
```

### 映射
如果你写过PHP的话，那么可以先简单的将map理解为PHP的索引数组，如果没有写过PHP的话也没有关系，通过下面的例子你会很快理解map。
```go
func main(){
	params := make(map[string]string)
	params["name"] = "hirainn"
	params["job"] = "coder"
}
```

### chan(通道)

通道可以理解为一个阻塞的队列，遵循先进选出的特性，任何时候只有一个goroutine(go的协程，此处不做详解)可以访问一个chan
```go
c := make(chan int)
c <- 1  //往通道中输入1
a := <- c   //从通道中讲队列头部的值赋值给变量a
```

## interface(接口)

需要讲一下interface类型，可以说它是一个类型，也不是一个类型。很多初学的同学会把interface当做是万能型，实际上它是一个可以装所有类型数据的数据类型。如果有以下场景，前端接口传回来的某个字段无法确定具体类型，这个时候就可以用interface类型接收。此处为简化代码，post数据为post

```go
params := make(map[string]interface{})
params["key"] = post["key"]
```
此时无论``post["key"]``为任何类型时，均可以接收。那如何使用呢？go是强类型的语言，所以不同类型是无法进行比较的，在使用的时候，需要对interface进行类型转化(断言)。
interface的断言格式为:``value,ok := val.(Type)``,只有interface的类型可以使用断言。
```go
val,ok := params["key"].(string)
if ok {
	fmt.Println("key对应的值是string")
} else {
	fmt.Println("key对应的值不是string，同时给val赋值一个string的空值，即空字符串")  //如果断言int失败则返回0 false
}

val1,_ := params["key"].(int)  //当不需要第二个值的时候，可以用 _ 代替
fmt.Println(val1)
```

## 指针
学过编程的或多或少的都知道指针，这里也只是简单的讲一下它的用法，深入的话请自行搜索。指针的声明方式有以下2种：
```go
ptr1 := new(int) //声明一个int指针
*ptr1 = 10
fmt.Println(*ptr1)  //输出10

a := 10
ptr2 := &a
*ptr2 = 100
fmt.Println(a) //输出100
```

## 流程控制
