---
name: principle-guard-the-context-window
description: "上下文快被填满时应用：大输出、长文件、重复读取、并行分发规划。把大批量内容交给子智能体；主线程只留摘要，不留原始载荷。"
disable-model-invocation: true
---

# Guard the Context Window
（守护上下文窗口）

**原因：** 上下文溢出会降低推理质量、产生压缩失真，并让进展停滞。

**模式：**
- **给阶段定规模，给范围设上限。** 限制每阶段的文件数，设定轮次预算，把机制本身的开销算进去。
