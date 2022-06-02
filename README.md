## 手写webpack核心代码

基本思路是：

- 从入口文件分析依赖图
- 将多文件打包到单文件
- 统一导入导出规则
- 解决命名污染
- 手动实现loader
- 手动实现plugin

更多可以看[这里](https://juejin.cn/post/7102822282388570143)

<!-- bilibli视频：https://www.bilibili.com/video/BV1oL411V7BQ/?spm_id_from=333.788 -->