# 用原则名来掌舵

pstack 把 24 条原则作为独立的技能随附。`/poteto-mode` 会在每一个多步骤任务的开始读它们的索引，应用任务触发的那些，并在回复里点出每一条被应用的原则，以及它改变的那个决策。

你不去调用原则。你用它们的名字来掌舵。每个名字都指向一条智能体已经读过的完整规则，所以一个短语就能比一段指令更精确地重定向工作。

## 实践中的掌舵

假设智能体正要把一个新适配器焊到三个现有适配器上：

```text
use subtract before you add. delete the obsolete adapters first, then design what's left.
```

假设它因为构建通过就宣称成功：

```text
apply prove it works. run the real import flow and show me the written records.
```

假设两次并行尝试正要写进同一个分支：

```text
separate before serializing shared state. give each attempt its own worktree, no locks.
```

每个短语之所以能落地，是因为它背后的规则是具体的。智能体仍然必须在回复里说出这条规则改变了哪个决策。一条没有决策支撑的原则引用，意味着智能体只是点了名，而没有应用它。

## 24 条，简述

核心原则决定要建多少，以及何时重新思考设计：

- [Laziness Protocol](../../skills/principle-laziness-protocol/SKILL.md) 偏好删除，以及能解决问题的最小改动。
- [Foundational Thinking](../../skills/principle-foundational-thinking/SKILL.md) 在写逻辑之前先选定核心数据结构。
- [Redesign from First Principles](../../skills/principle-redesign-from-first-principles/SKILL.md) 把新需求当作它从第一天就在那里一样整合进去。
- [Attack the Premise](../../skills/principle-attack-the-premise/SKILL.md) 写下两次或更多次失败修复所共有的那个前提，并在下一次修复前直接检验它。
- [Subtract Before You Add](../../skills/principle-subtract-before-you-add/SKILL.md) 在往上盖之前先移除死重量。
- [Minimize Reader Load](../../skills/principle-minimize-reader-load/SKILL.md) 折叠读者必须记在脑子里的层级和隐藏状态。
- [Outcome-Oriented Execution](../../skills/principle-outcome-oriented-execution/SKILL.md) 让重写收敛到目标设计，而不是保留一次性的兼容状态。
- [Experience First](../../skills/principle-experience-first/SKILL.md) 优先用户的结果，而不是实现的便利。
- [Exhaust the Design Space](../../skills/principle-exhaust-the-design-space/SKILL.md) 在没有先例时，造两三个相互竞争的原型。
- [Build the Lever](../../skills/principle-build-the-lever/SKILL.md) 造出那个做这件事或证明这件事的脚本，好让审阅者能重跑它。当智能体一直手工做同一件事时，让它写出它希望拥有的那个工具或技能。如果一个脚本每次都能用同样的方式做某一步，就用脚本，把判断的活儿留给智能体。

架构原则决定状态、校验和兼容性住在哪里：

- [Model the Domain](../../skills/principle-model-the-domain/SKILL.md) 把重复的规则编码进一个结构，而不是散落的条件判断。
- [Boundary Discipline](../../skills/principle-boundary-discipline/SKILL.md) 在边界处校验，并信任内部的类型。
- [Type System Discipline](../../skills/principle-type-system-discipline/SKILL.md) 让非法的状态无法被表示。
- [Make Operations Idempotent](../../skills/principle-make-operations-idempotent/SKILL.md) 让重试收敛到同一个终态。
- [Migrate Callers Then Delete Legacy APIs](../../skills/principle-migrate-callers-then-delete-legacy-apis/SKILL.md) 在一波里完成迁移和删除。
- [Separate Before Serializing Shared State](../../skills/principle-separate-before-serializing-shared-state/SKILL.md) 在加协调之前先移除共享。

验证原则定义什么才算证明：

- [Prove It Works](../../skills/principle-prove-it-works/SKILL.md) 验证真实的产物，而不是一个代理。
- [Fix Root Causes](../../skills/principle-fix-root-causes/SKILL.md) 在改代码之前先复现并追踪到原因。
- [Sequence Work into Verifiable Units](../../skills/principle-sequence-verifiable-units/SKILL.md) 让每个小单元都以一次检查收尾，再开始下一个。
- [Test Behavior, Not Implementation](../../skills/principle-test-behavior-not-implementation/SKILL.md) 断言代码用户能观察到的东西，这样测试会在那个行为坏掉时失败，并在内部实现变化后存活。
- [Explain the Number](../../skills/principle-explain-the-number/SKILL.md) 在任何人信任或报告一个测量出来的数字之前，先点出是什么限制了它，并排除它量的是别的东西。[`/benchmark-checklist`](../../skills/benchmark-checklist/SKILL.md) 把它变成七个你从真实运行中回答的问题。

委托原则让并行工作保持清醒：

- [Guard the Context Window](../../skills/principle-guard-the-context-window/SKILL.md) 把批量阅读路由给子智能体，把发现留在主聊天里。
- [Never Block on the Human](../../skills/principle-never-block-on-the-human/SKILL.md) 在可逆的工作上继续推进，并呈现结果。

还有一条元原则：

- [Encode Lessons in Structure](../../skills/principle-encode-lessons-in-structure/SKILL.md) 把你重复过两次的建议变成一个 lint、检查或脚本。[`/correct`](../../skills/correct/SKILL.md) 把它应用到整个仓库，如[把它变成你的](./09-make-it-yours.md#用-correct-修环境)所示。

别去背这份清单。现在扫一眼，然后当你抓到智能体做了某个这里某个名字本可以阻止的事情时，再回来翻。词汇就是这么记住的。

下一步：[把它变成你的](./09-make-it-yours.md)。