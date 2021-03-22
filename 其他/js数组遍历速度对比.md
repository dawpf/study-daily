# 数组遍历速度

循环一直是大多数编程语言的重要组成部分， `JavaScript ` 为我们提供了许多迭代或循环值的方法。

`for` 循环有很多变形，例如 `for`、`for`（倒序）、`for…of`、`forEach`、`for…in`、`for…await`。哪种循环更快呢？

**答案是：** `for`（倒序）

以下使用代码进行测试的结果：

```javascript
const steps = 1000000; 
const arr = Array(steps);
console.time('⏰');
for (let i = arr.length; i > 0; i--) {} // for(倒序)	 : 1.6ms
for (let i = 0; i < arr.length; i++) {} // for          : 1.7ms
arr.forEach(v => v)                     // foreach      : 2.0ms
for (const v of arr) {}                 // for...of     : 14ms
console.timeEnd('⏰');
```

造成这样结果的原因很简单，在代码中，正序和倒序的 `for` 循环几乎花费一样的时间，仅仅相差了 0.1 毫秒。原因是，`for`（倒序）只需要计算一次起始变量 `let i = arr.length`，而在正序的 `for` 循环中，它在每次变量增加后都会检查条件 `i< arr.length`。这个细微的差别不是很重要，你可以忽略它。（但是当数据量扩大，例如十亿，千亿等的数量级，差距就显著提升，我们就需要考虑时间对应用程序性能的影响了。例如：`steps = 100000000` 这个时候，两者的时间花费差距就很明显了）

而 `forEach` 是 `Array` 原型的一个方法，与普通的 `for` 循环相比，`forEach` 和 `for…of` 需要花费更多的时间进行数组迭代。

**附：console 的更多常见用法**

- `console.log()`：打印内容的通用方法；
- `console.debug()`：打印一条 `"debug"` 级别的消息；
- `console.info()`：打印一条资讯类说明信息；
- `console.warn()`：打印一条警告信息；
- `console.error()`：打印一条错误信息；
- `console.table()`：将列表型的数据打印成表格；
- `console.time()` ：启动一个以入参作为特定名称的 计时器 ；
- `console.timeEnd()`：结束特定的 计时器 并以豪秒打印其从开始到结束所用的时间；
- `console.assert()`：如果第一个参数为 `false` ，则将消息和堆栈跟踪记录到控制台；
- `console.count()`：以参数为标识记录调用的次数，调用时在控制台打印标识以及调用次数；
- `console.group` ：创建一个新的内联 group , 后续所有打印内容将会以子层级的形式展示；
- `console.groupEnd()`：闭合当前内联 group；
- `console.groupCollapsed()`：创建一个新的内联 group。使用方法和 `group()` 相同，不同的是，`groupCollapsed()` 方法打印出来的内容默认是折叠的。调用`groupEnd()`来闭合组。

