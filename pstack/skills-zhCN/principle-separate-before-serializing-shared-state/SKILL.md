---
name: principle-separate-before-serializing-shared-state
description: "并发参与者可能写同一个文件、分支、键或状态对象时应用。先消除共享；只有当单一共享写入目标是真正的不变量时，才在结构上串行化。"
disable-model-invocation: true
---

# Separate Before Serializing Shared State（先分离，再串行化共享状态）

并发参与者可能写同一个文件、分支、键或对象时，先追问：它们需要一个共享对象，还是在发布各自独立的事实？默认给每个参与者自己的文件、键、分支或状态目录，只在读取状态的地方合并。两个工作智能体各写自己的字段进同一个 `state.json`，仍然是共享修改。

只有当单一共享写入目标是真正的不变量时，才在结构上串行化访问（锁文件、单一写入者、顺序阶段、compare-and-swap）。指令不是并发控制，「我们需要一把锁」是要先检查的坏味道。
