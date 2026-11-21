# 提示词范例与常见坑

下面是值得直接抄的提示词，后面是每个人都踩过一次的坑。把路径和完成判据换成你自己的。这些提示词故意写得很随意——实际用起来就是这么敲的，技能读得懂意图。

![她在尝一道做好的菜，机器人照着食谱盒做菜，台面上方钉着写有 /how、/tdd、/loop 的卡片。](./images/recipes.jpg)

## 搞懂一个陌生的子系统

```text
use /how first to understand how this initialization works. then use /why to figure out why it broke recently.
```

先看机制，再查历史。每个技能的报告都会写明查过哪些来源，你能知道答案的依据是什么。

## 动代码之前，先复述清楚一份乱糟糟的问题报告

```text
/poteto-mode read this thread. restate the underlying issue in your own words, in plain english. don't change any code yet.
```

理解偏差会在复述里露出来，纠正只花一条消息。先让智能体给出它自己的判断，你的猜想暂时憋着。`/in-your-own-words` 只要复述，不走 playbook。

## 发出去之前，先把提示词磨锋利

```text
/sharpen write the onboarding doc for the new billing service.
```

智能体会指出：专家会做而你没要求的事、专家会从哪些原始材料入手、用什么方法和工具，以及用什么外部检查确认结果没错。它把这些要求写进你的提示词交回来，但不执行任务。改写读着对了，再发出去。

## 定方案之前先做原型

```text
/poteto-mode prototype a few options for the settings layout. put them behind a switcher and send me screenshots of each.
```

你挑的是能跑的东西，不是文字描述。布局和时机这类问题，智能体做的过程中自己就有了答案。

## 把定稿的设计变成计划

```text
/poteto-mode turn this design into a plan. small verifiable PRs, each with its own proof.
```

设计定了再要计划。交付物就是计划本身，里面会写明用哪个 playbook 执行。

## 给设计找第二意见

```text
ask /arena for a second opinion on this thread and our approach
```

你现在的设计只是候选之一，综合结论会告诉你：评审组是找到了更好的方案，还是确认了你的方案。比起推翻一个代价高昂的设计，这点成本不算什么。

## 并行检查相互独立的切片

```text
/swarm check every package under packages/ against its check.sh. one worker per package. one report.
```

每个 worker 只管一个包。父智能体等所有切片跑完，汇总成一份 `PASS`、`ISSUES` 或 `BLOCKED` 报告，而不是把 worker 的原始输出倒给你。

## 带着怀疑评审一个分支

```text
/interrogate the whole branch, but skeptically. don't change anything yet. no nitpicks unless it's an actual bug or regression in behavior.
```

这几个限定条件都有实际作用。"don't change anything yet" 保证只读；不挑毛病的规则先把噪音滤掉，留下来的发现才值得你花时间。

## 用一个失败的测试来修 bug

```text
/poteto-mode repro the duplicate write first. if there's a cheap test path, /tdd it. then fix and rerun.
```

"if there's a cheap test path" 这个前提很重要。靠脆弱的 mock 硬凑出来的测试，证明力不如跑一次真实命令，playbook 可以直说这一点。

## 复现并修复一份报告，拿出证据

```text
/poteto-mode repro this with /verify-<app>. if it repros on main, fix it and show me a video as proof.
```

"if it repros on main" 意味着 bug 已经消失时，这一轮可以提前收工。视频让你在读 diff 之前就能确认修复效果。

## 证明一条测试很难覆盖的性质

```text
/create-formal-verification-skill the retry queue. a message must never be delivered twice.
```

你得到三样东西：一条在明确验证边界内所有情况都检查过的性质；如果代码已经违反它，一个用你代码里的概念表述的反例；还有一个项目技能，之后任何智能体改这段代码都会跑它。

## 数字发出去之前先审一遍

```text
/benchmark-checklist vet this 40% speedup before it goes in the pr description
```

结论是 faster、slower、no measurable difference 或 inconclusive 四种之一，附上运行次数、数值范围和这个数字的限制因素。

## 别再一遍遍纠正同一个错误

```text
/correct agents keep adding new config flags without registering them in the schema
```

修复以架构、类型、lint 或测试的形式落进仓库，下一个智能体想犯这个错都犯不了。

## 只问怎么做，先不动手

```text
/poteto-help how do i get poteto-mode to stay on every turn?
```

你拿到一个答案、一条可发送的提示词和一个出处链接。你不发那条提示词，就什么都不会跑。

## 人不在，跑的任务也不糊弄

```text
im going to bed, keep going autonomously until every fixture passes. do not stop. keep a decision log i can audit in the morning.
```

完整版本见[睡觉时也让任务继续跑](./07-overnight.md)。任务和完成判据已经在会话里说清之后，这个短版就够用。

## 把跑偏的任务拉回来

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

基本不需要更多字。你缺的只是那个对的名字，[用原则名给智能体纠偏](./08-principles.md)就是这份词汇表。

## 让回复说人话

```text
/bro
```

整条提示词就这一个词。[`/bro`](../../skills/bro/SKILL.md) 把上一条消息用人对人的口吻重讲一遍，不带行话，更短。回复技术上滴水不漏、你却没看懂它说了什么时，就用它。

## 补上挂着跑的会话的进度

```text
/ketchup
```

[`/ketchup`](../../skills/ketchup/SKILL.md) 用大白话讲清你上条消息之后发生了什么变化，再列出每个等你拍板的决策点，附上建议选项、证据和风险。汇报期间不做任何改动。

想看视频版就跑 [`/ketchup-video`](../../skills/ketchup-video/SKILL.md)。它用一段带字幕的幻灯片短视频讲发生了什么，等你拍板的决策点以文字列在视频下方。

## 常见坑

- **在提示词里罗列技能顺序。** "use /architect then /arena then /interrogate" 是在重排 playbook 已经排好的步骤。说清目标和约束就行，只有要覆盖默认行为时才点名技能。
- **完成判据含糊。** "make it better" 让 `/loop` 无从检查。给一条能判定通过或失败的命令，或一个能判定通过或失败的产物。
- **一上来就抛出你的病因猜想。** 你指哪儿，智能体就只搜哪儿。先让它复述问题，再说你的直觉。
- **拿第一个设计就用。** 只试一次，等于锁死模型最先想到的那个形状。要原型或 `/architect`，凭证据挑。
- **打磨一份没有代码支撑的计划。** 对空计划做对抗性评审，会臆造出根本不会发生的风险。先用原型解决悬而未决的问题，再评审做出来的东西。
- **多个并行智能体挤同一个 worktree。** 互相覆盖，谁也说不清哪个智能体改了什么。改用云端智能体跑，或者写明 "own worktree per attempt"。
- **还没信任循环就开循环。** 循环不会验证自己的产出，只会让没检查过的工作堆得更快。先把验证技能跑通。
- **轻信没审过的数字。** 热缓存或一条被跳过的代码路径都能造出假加速。数字写到任何地方之前，先跑 `/benchmark-checklist`。
- **靠手工纠正同一个错误。** 会话里纠正一次只管一次运行。`/correct` 修的是仓库，让之后的运行都不再犯。
- **拿 `/arena` 做覆盖。** `/arena` 是同一份设计或代码任务跑多遍，挑一个底子，嫁接各家最好的部分。`/swarm` 才是划分切片、跑声明好的竞速分支，再汇总成一份报告。
- **评审意见照单全收。** 机器人和人都会把真问题和噪音混在一个列表里。`/interrogate` 只保留重跑能证实的发现，并列出丢掉了哪些、为什么；两个方向你都可以推翻它。
- **把 `auto` 当模型名用。** `auto` 和 `inherit-parent` 的意思是"省略 model 字段，让子智能体继承父聊天的模型"。[配置 pstack](./01-setup.md) 讲了各模型角色。
- **构建绿了就报成功。** 构建只证明能编译。要真实命令、真实流程、落库的值或性能剖析结果，并要求回复里带证据。
- **徒手撸 `SKILL.md`。** 走[编写或修改技能的 playbook](../../skills/poteto-mode/playbooks/authoring-a-skill.md)，让校验和评审真正发生。

指南到此为止。如果你是跳着看的，回到[配置 pstack](./01-setup.md)，跑一个真实任务。习惯是用出来的，不是读出来的。

返回[指南索引](./README.md)。
