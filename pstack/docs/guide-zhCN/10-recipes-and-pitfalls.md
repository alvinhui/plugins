# 提示词范例与常见坑

下面是值得直接复制的提示词，后面是每个人都踩过一次的坑。把路径和完成判据换成你自己的。这些提示词刻意写得很随意——实际使用时就是这样输入的，技能能准确理解意图。

![她在品尝一道做好的菜，机器人照着食谱盒做菜，台面上方钉着写有 /how、/tdd、/loop 的卡片。](./images/recipes.jpg)

## 理解一个陌生的子系统

```text
use /how first to understand how this initialization works. then use /why to figure out why it broke recently.
```

先看机制，再查历史。每个技能的报告都会写明检索过哪些来源，你可以知道答案的依据是什么。

## 修改代码之前，先复述清楚一份杂乱的问题报告

```text
/poteto-mode read this thread. restate the underlying issue in your own words, in plain english. don't change any code yet.
```

理解偏差会在复述中暴露出来，纠正只需一条消息。先让智能体给出它自己的判断，你的猜想暂不给出。`/in-your-own-words` 只要求复述，不走 playbook。

## 发送之前，先打磨提示词

```text
/sharpen write the onboarding doc for the new billing service.
```

智能体会指出：专家会做而你没要求的事、专家会从哪些原始材料入手、用什么方法和工具，以及用什么外部检查确认结果正确。它把这些要求写进你的提示词返回给你，但不执行任务。改写确认无误后，再发送。

## 定方案之前先做原型

```text
/poteto-mode prototype a few options for the settings layout. put them behind a switcher and send me screenshots of each.
```

你挑选的是能运行的实现，不是文字描述。布局和时机这类问题，智能体在实现过程中自己就能得到答案。

## 把定稿的设计变成计划

```text
/poteto-mode turn this design into a plan. small verifiable PRs, each with its own proof.
```

设计确定后再要计划。交付物就是计划本身，其中会写明用哪个 playbook 执行。

## 为设计征求第二意见

```text
ask /arena for a second opinion on this thread and our approach
```

你现在的设计只是候选之一，综合结论会告诉你：评审组是找到了更好的方案，还是确认了你的方案。相比推翻一个代价高昂的设计，这点成本微不足道。

## 并行检查相互独立的切片

```text
/swarm check every package under packages/ against its check.sh. one worker per package. one report.
```

每个 worker 只负责一个包。父智能体等所有切片完成后，汇总成一份 `PASS`、`ISSUES` 或 `BLOCKED` 报告，而不是把 worker 的原始输出直接输出给你。

## 以怀疑的态度评审一个分支

```text
/interrogate the whole branch, but skeptically. don't change anything yet. no nitpicks unless it's an actual bug or regression in behavior.
```

这几个限定条件都有实际作用。"don't change anything yet" 保证只读；不纠缠细枝末节的规则先过滤掉噪音，保留下来的发现才值得你花时间。

## 用一个失败的测试来修 bug

```text
/poteto-mode repro the duplicate write first. if there's a cheap test path, /tdd it. then fix and rerun.
```

"if there's a cheap test path" 这个前提很重要。靠脆弱的 mock 勉强构造的测试，证明力不如运行一次真实命令，playbook 可以直接说明这一点。

## 复现并修复一份问题报告，提供证据

```text
/poteto-mode repro this with /verify-<app>. if it repros on main, fix it and show me a video as proof.
```

"if it repros on main" 意味着 bug 已经消失时，这一轮可以提前结束。视频让你在读 diff 之前就能确认修复效果。

## 证明一条测试很难覆盖的性质

```text
/create-formal-verification-skill the retry queue. a message must never be delivered twice.
```

你会得到三项产出：一条在明确验证边界内所有情况都检查过的性质；如果代码已经违反它，一个用你代码中的概念表述的反例；还有一个项目技能，之后任何智能体修改这段代码都会运行它。

## 发布数字之前先审查

```text
/benchmark-checklist vet this 40% speedup before it goes in the pr description
```

结论是 faster、slower、no measurable difference 或 inconclusive 四种之一，附上运行次数、数值范围和这个数字的限制因素。

## 停止反复纠正同一个错误

```text
/correct agents keep adding new config flags without registering them in the schema
```

修复以架构、类型、lint 或测试的形式落进仓库，下一个智能体无法再犯这个错误。

## 只询问做法，不启动工作

```text
/poteto-help how do i get poteto-mode to stay on every turn?
```

你得到一个答案、一条可发送的提示词和一个出处链接。你不发送那条提示词，就不会有任何任务运行。

## 离开期间让运行保持可靠

```text
im going to bed, keep going autonomously until every fixture passes. do not stop. keep a decision log i can audit in the morning.
```

完整的过夜约定见[睡觉时也让任务继续跑](./07-overnight.md)。任务和完成判据已经在会话中说清之后，这个简短版本就足够。

## 纠正偏离方向的任务

纠偏提示词一行就够：

```text
i said the goal is to repro. i did not ask for a fix yet.
```

```text
apply prove it works. show me the real output, not the build log.
```

```text
/unslop that, no emdashes
```

基本不需要更多文字。你缺的只是那个正确的名字，[用原则名给智能体纠偏](./08-principles.md)就是这份词汇表。

## 让回复通俗易懂

```text
/bro
```

整条提示词就这一个词。[`/bro`](../../skills/bro/SKILL.md) 把上一条消息用平实的语言重述一遍，不带术语，更简短。回复在技术上足够详尽、你却没理解它说了什么时，就用它。

## 跟进持续运行的会话进度

```text
/ketchup
```

[`/ketchup`](../../skills/ketchup/SKILL.md) 用平实的语言讲清你上条消息之后发生了什么变化，再列出每个等你决定的决策点，附上建议选项、证据和风险。汇报期间不做任何改动。

想看视频版就运行 [`/ketchup-video`](../../skills/ketchup-video/SKILL.md)。它用一段带字幕的幻灯片短视频讲述发生了什么，等你决定的决策点以文字列在视频下方。

## 常见坑

- **在提示词里罗列技能顺序。** "use /architect then /arena then /interrogate" 是在重排 playbook 已经排好的步骤。说清目标和约束即可，只有要覆盖默认行为时才点名技能。
- **完成判据含糊。** "make it better" 让 `/loop` 无从检查。给一条能判定通过或失败的命令，或一个能判定通过或失败的产物。
- **一开始就给出你对病因的猜想。** 你指向哪里，智能体就只检索哪里。先让它复述问题，再给出你的直觉。
- **直接采用第一个设计。** 只试一次，等于锁定模型最先想到的那个形态。要原型或 `/architect`，凭证据选择。
- **打磨一份没有代码支撑的计划。** 对没有代码支撑的计划做对抗性评审，会臆造出根本不会发生的风险。先用原型解决悬而未决的问题，再评审实际构建出来的成果。
- **多个并行智能体共用同一个 worktree。** 互相覆盖，无法分清哪个智能体改了什么。改用云端智能体运行，或者写明 "own worktree per attempt"。
- **尚未信任循环就启动循环。** 循环不会验证自己的产出，只会让未经检查的工作累积得更快。先让验证技能可靠运行。
- **轻信未经审查的数字。** 热缓存或一条被跳过的代码路径都能制造虚假的加速。数字写到任何地方之前，先运行 `/benchmark-checklist`。
- **靠手工纠正同一个错误。** 会话里纠正一次只对一次运行有效。`/correct` 修复的是仓库，让之后的运行都不再犯。
- **用 `/arena` 做覆盖。** `/arena` 是同一份设计或代码任务运行多遍，选一个基础方案，嫁接各家最好的部分。`/swarm` 才是划分切片、跑声明好的竞速分支，再汇总成一份报告。
- **评审意见照单全收。** 机器人和人都会把真问题和噪音混在一个列表里。`/interrogate` 只保留重跑能证实的发现，并列出丢弃了哪些、为什么；两个方向你都可以推翻它的结论。
- **把 `auto` 当模型名用。** `auto` 和 `inherit-parent` 的意思是"省略 model 字段，让子智能体继承父聊天的模型"。[配置 pstack](./01-setup.md) 介绍了各模型角色。
- **构建通过就报告成功。** 构建只证明能编译。要真实命令、真实流程、落库的值或性能剖析结果，并要求回复里带证据。
- **手写 `SKILL.md`。** 走[编写或修改技能的 playbook](../../skills/poteto-mode/playbooks/authoring-a-skill.md)，让校验和评审真正发生。

指南到此为止。如果你是跳着看的，回到[配置 pstack](./01-setup.md)，运行一个真实任务。习惯来自使用，而不是阅读。

返回[指南索引](./README.md)。
