# pstack 指南

不再盯着智能体的每一步，pstack 才能发挥出最大效果。你只说要什么、以及怎么判断做完了。`/poteto-mode` 负责挑 playbook，按步骤需要调用其他技能，最后把证据摆给你看。本指南用贴近实战的提示词，帮你养成这个习惯。

你会学到：

1. [配置 pstack](./01-setup.md)。装好插件，选定模型。
2. [用 /poteto-mode 分派任务](./02-poteto-mode.md)。给一个目标，看它怎么挑 playbook。
3. [先读懂代码，再动手改](./03-understand.md)。先做只读排查，动手之前用 `/how`、`/why`、`/teach`、`/recall` 把代码摸清。
4. [写代码之前先定设计](./04-design.md)。趁代码还没定型，用 `/architect`、`/arena`、`/swarm`、`/interrogate`、原型和计划把设计敲下来。
5. [实现改动，收拾 diff](./05-build-and-clean.md)。构建类 playbook，以及 `/tdd`、`/unslop`、`/no-comments`。
6. [验证结果，提 PR](./06-verify-and-ship.md)。在真实应用上验证行为，用形式化验证覆盖测试够不着的地方，用 `/benchmark-checklist` 审查性能数字，然后提一个聚焦的 PR 并推到合并。
7. [睡觉时也让任务继续跑](./07-overnight.md)。先建立信任再上循环，一份过夜约定，一份能审计的决策日志，以及用 Project 和自动化把规模扩到多个智能体。
8. [用原则名给智能体纠偏](./08-principles.md)。24 个名字，任务中途一句话就能把方向掰回来。
9. [改造成你自己的风格](./09-make-it-yours.md)。生成你自己的模式，用 `/correct` 治反复犯的错，以及怎么测一处技能改动。
10. [提示词范例与常见坑](./10-recipes-and-pitfalls.md)。能直接抄的提示词，和不必再踩的坑。

第一遍按顺序读。之后每一页都能单独查。

卡住了，或者拿不准该用哪个技能，就把问题跟在 [`/poteto-help`](../../skills/poteto-help/SKILL.md) 后面输入：

```text
/poteto-help which skill should i use to review this branch?
```

它会回答问题，给你一条可以直接发出去的提示词，并附上答案出处——对应的技能或指南页。它不会直接开工：跑一次 pstack 花的是实打实的 token，所以提示词由你准备好了再发。它只在你输入时才运行。

## 如果你只记住一件事

用你自己的话，给智能体一个目标，再给一个能验证它的办法：

```text
/poteto-mode the export writes duplicate rows when a retry lands mid-run. repro first, then fix and verify.
```

不用指定 playbook，也不用列技能。一句 "repro first"（先复现）加一个可验证的结果，就是 `/poteto-mode` 分派任务所需的全部信号。它会匹配到 Bug fix playbook，把步骤抄进待办列表，再按每一步的需要调用对应技能。

下一步：[配置 pstack](./01-setup.md)。
