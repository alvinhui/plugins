---
name: principle-laziness-protocol
description: "重构、评估 diff 大小，或想加抽象、加层、层层传信号时应用。偏向删除，偏向能解决问题的最小改动。"
disable-model-invocation: true
---

# Laziness Protocol（懒惰协议）

- **合并决策。** 不要在多处重复同一个选择。把它放进唯一的真实来源，把结果作为简单标记传递。
- **最小化 diff。** 做能解决问题的最小改动。更少的行数胜过「优雅」的样板代码。
