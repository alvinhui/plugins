# 用原则名给智能体纠偏

pstack 将 24 条原则实现为独立技能。`/poteto-mode` 在每个多步骤任务开始时都会读取原则索引，应用任务触发的那几条，并在回复中点名每条应用的原则，说明它改变了哪个决策。

原则不是用来调用的，而是用名字来纠偏的。每个名字背后都是智能体已经读过的一条完整规则，因此一个短语就能比一整段指令更精准地把工作拉回正轨。

## 纠偏的实际用法

比如智能体打算在现有三个适配器之外直接追加一个新适配器：

```text
use subtract before you add. delete the obsolete adapters first, then design what's left.
```

比如它仅因构建通过就宣布成功：

```text
apply prove it works. run the real import flow and show me the written records.
```

比如两个并行尝试即将写入同一个分支：

```text
separate before serializing shared state. give each attempt its own worktree, no locks.
```

这些话之所以有效，是因为背后的规则足够具体。智能体仍须在回复中说清这条规则改变了哪个决策。只引用原则名却说不出对应的决策，说明它只是提到了规则名，并没有真正应用。

## 24 条原则速览

核心原则决定该构建多少、何时重新审视设计：

- [懒惰协议（Laziness Protocol）](../../skills/principle-laziness-protocol/SKILL.md) 优先删除，采用能解决问题的最小改动。
- [底层优先思考（Foundational Thinking）](../../skills/principle-foundational-thinking/SKILL.md) 写逻辑之前先确定核心数据结构。
- [从第一性原理重新设计（Redesign from First Principles）](../../skills/principle-redesign-from-first-principles/SKILL.md) 把新需求当作项目第一天就存在的需求来融入设计。
- [质疑前提（Attack the Premise）](../../skills/principle-attack-the-premise/SKILL.md) 两次以上修复都失败时，先写下它们共同依赖的前提，直接验证这个前提，再进行下一次修复。
- [先减后加（Subtract Before You Add）](../../skills/principle-subtract-before-you-add/SKILL.md) 先移除无用的负担，再在其上构建新代码。
- [降低阅读负担（Minimize Reader Load）](../../skills/principle-minimize-reader-load/SKILL.md) 压缩层数和隐藏状态，避免读者需要在头脑中同时记住大量信息。
- [面向结果执行（Outcome-Oriented Execution）](../../skills/principle-outcome-oriented-execution/SKILL.md) 重写直接收敛到目标设计，不为过渡期保留用完即弃的兼容状态。
- [体验优先（Experience First）](../../skills/principle-experience-first/SKILL.md) 以用户得到的结果为准，而不是迁就实现上的便利。
- [穷尽设计空间（Exhaust the Design Space）](../../skills/principle-exhaust-the-design-space/SKILL.md) 没有先例可循时，构建两三个相互竞争的原型。
- [造杠杆（Build the Lever）](../../skills/principle-build-the-lever/SKILL.md) 编写执行或验证工作的脚本，让评审者可以直接重跑。智能体反复手工做同一件事时，让它把自己缺的工具或技能编写出来。某一步骤脚本每次都能以同样方式完成，就交给脚本，把需要判断的部分留给智能体。

架构原则决定状态、校验和兼容逻辑放在哪里：

- [建模领域（Model the Domain）](../../skills/principle-model-the-domain/SKILL.md) 反复出现的规则收进同一个结构，而不是散落成大量条件判断。
- [边界纪律（Boundary Discipline）](../../skills/principle-boundary-discipline/SKILL.md) 校验只做在边界上，内部信任类型。
- [类型系统纪律（Type System Discipline）](../../skills/principle-type-system-discipline/SKILL.md) 让非法状态在类型层面无法表示。
- [让操作幂等（Make Operations Idempotent）](../../skills/principle-make-operations-idempotent/SKILL.md) 无论重试多少次，最终都收敛到同一个状态。
- [迁移调用方后删除旧 API（Migrate Callers Then Delete Legacy APIs）](../../skills/principle-migrate-callers-then-delete-legacy-apis/SKILL.md) 迁移和删除在同一波改动里完成。
- [先隔离再串行化共享状态（Separate Before Serializing Shared State）](../../skills/principle-separate-before-serializing-shared-state/SKILL.md) 引入协调机制之前，先消除共享本身。

验证原则定义什么才算证据：

- [证明它真的能跑（Prove It Works）](../../skills/principle-prove-it-works/SKILL.md) 验证真实产物，不用替代物充当证据。
- [修根因（Fix Root Causes）](../../skills/principle-fix-root-causes/SKILL.md) 改代码之前先复现，顺着线索追到根因。
- [把工作切成可验证的小单元（Sequence Work into Verifiable Units）](../../skills/principle-sequence-verifiable-units/SKILL.md) 每个小单元都以一次检查收尾，再开始下一个。
- [测行为，不测实现（Test Behavior, Not Implementation）](../../skills/principle-test-behavior-not-implementation/SKILL.md) 只断言代码使用者能观察到的行为，这样该行为被破坏时测试会失败，内部实现变更后测试仍然通过。
- [解释这个数字（Explain the Number）](../../skills/principle-explain-the-number/SKILL.md) 任何人采信或引用一个测量数字之前，先说清它的限制因素，并排除测到的其实是其他东西。[`/benchmark-checklist`](../../skills/benchmark-checklist/SKILL.md) 把这条原则转化为七个问题，答案都来自真实运行。

委托原则让并行工作保持有序：

- [守住上下文窗口（Guard the Context Window）](../../skills/principle-guard-the-context-window/SKILL.md) 大批量阅读交给子智能体，主聊天只保留结论。
- [不要卡在人身上（Never Block on the Human）](../../skills/principle-never-block-on-the-human/SKILL.md) 可逆的工作先行推进，再展示结果。

还有一条元原则：

- [把教训固化进结构（Encode Lessons in Structure）](../../skills/principle-encode-lessons-in-structure/SKILL.md) 同一条建议说过两次，就把它变成 lint、检查或脚本。[`/correct`](../../skills/correct/SKILL.md) 把这条原则用到整个仓库，见[改造成你自己的风格](./09-make-it-yours.md#用-correct-修环境而不是反复叮嘱)。

不必背诵这份清单。现在浏览一遍即可；当你发现智能体在做某件本可以用这里某个名字避免的事时，再回来查阅。这套词汇就是这样记住的。

下一步：[改造成你自己的风格](./09-make-it-yours.md)。
