---
name: no-comments
description: "派生 Comment Sicko，修复被接受的发现，并为声称的约束提出编码方案。"
disable-model-invocation: true
---

# No comments

派生 Comment Sicko。对被接受的发现采取行动。

尊重 Comment Sicko 的新鲜视角。

## 范围

用调用方给的文件或 diff。否则用当前相对基线分支（默认 `main`）的 diff，包含工作区。

## 步骤

1. 派生 `Task`，`subagent_type: "comment-sicko"`。传入范围。按 **poteto-mode** 技能的 Subagents 一节，为每个子智能体挑选适合工作的推理档位。不要复述它的规则。
2. 检查它的报告和 diff。拒绝这些情况：改了应用代码、越出范围、删除受豁免保护的注释、`MUST KILL` 理由陈述失实、把有意保留的代码当作有罪来标记。针对我们自己代码里意外情况的「重塑」类标记仍然可执行。不要恢复那些注释。一条保留（keep）只有在证明它涉及我们无法改变的东西时才能存活。审计漏掉的范围内 lint 和 TypeScript 抑制注释。涉及正确性或安全的抑制注释仍是可执行的 `MUST KILL`。只有拿到确切的豁免和范围内的证明才恢复被删注释。在接受单薄的 `IMPORTANT` 或 `do not remove` 类删除或保留之前，追踪其符号或对运行 `/why`。删除（kill）有歧义就不恢复。保留（keep）被驳倒或仍有歧义就删掉。对一份被拒的报告，回滚并点名失败原因重跑一次。第二次仍被拒，就把它报告为未决，并让 `/no-comments` 失败。
3. 琐碎的被接受标记直接修：删掉死路径、去掉参数、或改用真正的 API。如果任何修复需要设计形状，对被接受的集合及周边代码运行一次 `/architect`。到勾画为止。architect 定形状，第 4 步做实现。
4. 在范围内实现最小的根因修复。移除每一个被点名的变通方案。根因在范围之外时，落地范围内最小的修复，其余报告为未决。**principle-fix-root-causes** 和 **principle-redesign-from-first-principles** 技能只指引意图。两者都不授权扩大围栏，也不授权修围栏之外的实例。绝不外加症状守卫。
5. 约束类注释写着 `do not remove`、`do not change wording` 或 `talk to X before changing`。涉及我们无法改变之物的保留注释留着。提出范围内最便宜的类型、运行时、测试或 CI lint 编码方案。等待交互批准。无人值守和评测场景要求调用方预先批准。获批后先编码再删除。否则删除，把约束报告为未决，并勾画范围外的工作。
6. 报告删除数、恢复的注释、重跑、architect 勾画、修复、编码提议、已落地的编码、未被强制的约束，以及其他未决工作。
