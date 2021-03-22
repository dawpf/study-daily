### git 常用命令

```js
cd demo.    // 进入项目文件夹
git init    // 初始化
git add .   // 文件暂存
git commit -m "描述xxx"  // 暂存的文件添加到缓存区

// 链接git仓库，若代码已经提交过，则不需要重新更改仓库地址，直接 git push 就可以
git remote add origin https://github.com/dawpf/test.git  
git push -u origin master  // 代码提交到仓库
```

