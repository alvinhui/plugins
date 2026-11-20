# pstack 指南

当你不再对智能体进行微观管理时，pstack 才能发挥最大作用。你只需描述你想要什么，以及你如何判断它已经完成。`/poteto-mode` 会挑选合适的 playbook，在步骤需要时调用其他技能，并向你展示证据。本指南通过贴近实际的提示词来培养这种习惯。

你将学到以下内容：

1. [安装 pstack](./01-setup.md)。安装插件并挑选你的模型。
2. [通过 `/poteto-mode` 路由工作](./02-poteto-mode.md)。给它一个目标，看它如何挑选 playbook。
3. [理解代码](./03-understand.md)。先做一次只读调查，然后在动手修改之前使用 `/how`、`/why`、`/teach` 和 `/recall`。
4. [设计变更](./04-design.md)。在代码定型之前，先使用 `/architect`、`/arena`、`/swarm`、`/interrogate`、原型和计划。
5. [构建并清理变更](./05-build-and-clean.md)。构建类 playbook、`/tdd`、`/unslop` 和 `/no-comments`。
6. [验证并交付](./06-verify-and-ship.md)。在真实应用上证明行为，用形式化验证覆盖测试难以触及的场景，用 `/benchmark-checklist` 审查数字，然后提交一个聚焦的 PR 并推动它合并。
7. [在你睡觉时运行工作](./07-overnight.md)。在循环之前建立信任，一份可审计的决策日志，以及能扩展到不止一个智能体的 Projects 和自动化。
8. [用原则名称来引导](./08-principles.md)。那 24 个能在任务中途重定向智能体的名称。
9. [把它变成你自己的](./09-make-it-yours.md)。你自己的模式、用于纠正重复错误的 `/correct`，以及如何测试一项技能改动。
10. [配方与陷阱](./10-recipes-and-pitfalls.md)。可以复制的提示词，以及需要避开的错误。

第一次请按顺序阅读各页。之后，每一页都可以独立阅读。

当你卡住，或者不确定该用哪个技能时，带着你的问题输入 [`/poteto-help`](../../skills/poteto-help/SKILL.md)：

```text
/poteto-help which skill should i use to review this branch?
```

它会给出答案，递给你一条可以直接发送的提示词，并附上答案来源的技能或指南页面链接。它不会启动工作，因为一次 pstack 运行会消耗真实的 token，所以你准备好之后再发送提示词。它只在你输入时才会运行。

## 如果你只记住一件事

用你自己的话，给智能体一个目标和一个检验它的方法：

```text
/poteto-mode the export writes duplicate rows when a retry lands mid-run. repro first, then fix and verify.
```

你不需要指定 playbook 或罗列技能。"repro first"（先复现）和一个可检验的结果，就是 `/poteto-mode` 所需的全部路由信号。它会匹配到 Bug 修复 playbook，把步骤复制到待办列表中，并在每一步触发时调用正确的技能。

下一步：[安装 pstack](./01-setup.md)。