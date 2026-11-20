# 配方与陷阱

值得复制的提示词，然后是每个人都犯过一次的错误。换成你自己的路径和完成条件。这些配方是刻意非正式的——实际敲的时候就是这样，而技能读意图读得很准。

![她尝一道做好的菜，机器人则照着食谱盒做饭，柜台上方钉着卡片，写着 /how、/tdd 和 /loop。](./images/recipes.jpg)

## 理解一个不熟悉的子系统

```text
use /how first to understand how this initialization works. then use /why to figure out why it broke recently.
```

先机制，后历史。每个技能的报告都会告诉你它搜了哪些来源，所以你知道答案扎根在哪里。

## 在碰代码之前先复述一份嘈杂的报告

```text
/poteto-mode read this thread. restate the underlying issue in your own words, in plain english. don't change any code yet.
```

误读会显现在复述里，在那里纠正只花一条消息。在你自己的理论之外，先让智能体说出它自己的。`/in-your-own-words` 只要求复述，不带 playbook。

## 在发送之前先打磨一条提示词

```text
/sharpen write the onboarding doc for the new billing service.
```

智能体会点出：一个专家会做而你没要求的事、他们会从什么原材料开始、他们的方法和工具，以及一个确认结果正确的外部检查。它把你的提示词改写后交回来，要求那些东西，而不去做任务。当改写读起来对的时候，再发送它。

## 在挑选之前先做原型

```text
/poteto-mode prototype a few options for the settings layout. put them behind a switcher and send me screenshots of each.
```

你从能跑的东西里挑，而不是从描述里挑。智能体沿途回答它自己的布局和时机问题。

## 把一个定下来的设计变成计划

```text
/poteto-mode turn this design into a plan. small verifiable PRs, each with its own proof.
```

只在设计定下来之后再要。计划就是交付物，而它会点出将执行它的那个 playbook。

## 给一个设计要第二意见

```text
ask /arena for a second opinion on this thread and our approach
```

你当前的设计变成几个候选之一，而综合会告诉你，专家组是找到了更好的东西，还是确认了你已有的。相比一个逆转起来很贵的设计，这成本很低。

## 并行检查独立的切片

```text
/swarm check every package under packages/ against its check.sh. one worker per package. one report.
```

每个 worker 负责一个包。父级等每一个切片，并返回一份 `PASS`、`ISSUES` 或 `BLOCKED` 报告，而不是原始的 worker 转储。

## 怀疑地审阅一个分支

```text
/interrogate the whole branch, but skeptically. don't change anything yet. no nitpicks unless it's an actual bug or regression in behavior.
```

这些限定词做的是实事。"don't change anything yet" 让它保持只读，而 nitpick 规则预先过滤掉噪音，好让那些被验证的发现值得你花时间。

## 通过一个失败的测试修 bug

```text
/poteto-mode repro the duplicate write first. if there's a cheap test path, /tdd it. then fix and rerun.
```

"if there's a cheap test path" 很要紧。硬把一个测试塞进脆弱的 mock，比跑真实命令证明得更少，而 playbook 被允许这么说。

## 带证据地复现并修一份报告

```text
/poteto-mode repro this with /verify-<app>. if it repros on main, fix it and show me a video as proof.
```

"if it repros on main" 让这次运行在 bug 已经消失时能早点停下。视频让你在读 diff 之前先检查修复。

## 证明一个测试很少触及的性质

```text
/create-formal-verification-skill the retry queue. a message must never be delivered twice.
```

你得到的是：在一个明确范围内、每种情况下都检查过的一个性质；如果代码已经破坏了它，一个用你代码术语写成的反例；以及一个项目技能，下一个智能体在改动那段代码时会运行它。

## 在发出去之前先核验一个数字

```text
/benchmark-checklist vet this 40% speedup before it goes in the pr description
```

你得到 faster、slower、no measurable difference 或 inconclusive，附带运行次数、区间，以及是什么限制了这个数字。

## 别再纠正同一个错误

```text
/correct agents keep adding new config flags without registering them in the schema
```

修复以架构、一个类型、一个 lint 或一个测试的形式落在仓库里，这样下一个智能体就犯不了这个错。

## 在不启动工作的前提下问怎么做

```text
/poteto-help how do i get poteto-mode to stay on every turn?
```

你得到一个答案、一条要发送的提示词，以及一个指向来源的链接。在你发送那条提示词之前，什么都不运行。

## 在你离开时让一次运行保持诚实

```text
im going to bed, keep going autonomously until every fixture passes. do not stop. keep a decision log i can audit in the morning.
```

完整契约在[过夜那一页](./07-overnight.md)。当任务和完成条件已经在对话里时，这个短形式就够用。

## 重定向一次漂移的运行

掌舵提示词是一行：

```text
i said the goal is to repro. i did not ask for a fix yet.
```

```text
apply prove it works. show me the real output, not the build log.
```

```text
/unslop that, no emdashes
```

你很少需要更多词。你需要的是那个对的名字，而[原则那一页](./08-principles.md)就是词汇表。

## 用大白话拿回复

```text
/bro
```

这就是整条提示词。[`/bro`](../../skills/bro/SKILL.md) 像一个人对另一个人说话那样复述上一条消息，没有行话，更短。当一条回复技术上很彻底、而你还是不知道它说了什么时用它。

## 追上一个你留着跑的聊天

```text
/ketchup
```

[`/ketchup`](../../skills/ketchup/SKILL.md) 用大白话告诉你自你上一条消息以来发生了什么变化，然后列出每一个在等你的调用，带上它的选择、证据和风险。它在报告时什么都不改。

想用看的方式来追，就运行 [`/ketchup-video`](../../skills/ketchup-video/SKILL.md)。它把发生的事用一段带字幕的幻灯片短视频展示出来，并把等你的调用以文本形式列在下面。

## 陷阱

- **在提示词里枚举技能。** "use /architect then /arena then /interrogate" 会重排 playbook 本已排好的步骤。陈述目标和约束。只有要覆盖一个默认值时，才点名一个技能。
- **模糊的完成条件。** "make it better" 给 `/loop` 的东西无可检查。给一个能通过或失败的命令或产物。
- **带着你的原因理论开头。** 智能体只会往你指的方向搜。先让它复述问题，再分享你的直觉。
- **采用第一个设计。** 一次尝试就锁定了模型想到的第一个形状。要原型或 `/architect`，从证据里挑。
- **打磨一个抽象的计划。** 对一个背后没有代码的计划做对抗性审阅，会发明出永远不会发生的风险。先用原型解决开放问题，再审阅建出来的东西。
- **并行智能体共用一个 worktree。** 它们互相覆盖，而且没人能说清哪个智能体改了什么。把它们当云端智能体跑，或说"own worktree per attempt"。
- **在你信任循环之前就让它循环。** 一个不能核验自己工作的循环，只会让未经检查的工作更快。先把验证技能弄好。
- **信任一个没核验过的数字。** 一个热缓存或一条被跳过的代码路径，能伪造出一个加速。在这个数字去任何地方之前，先跑 `/benchmark-checklist`。
- **手工纠正同一个错误。** 聊天里的一次纠正只帮一次运行。`/correct` 修仓库，好让之后的运行都不再重复它。
- **用 `/arena` 做覆盖。** `/arena` 重复一份设计或代码简报，然后挑一个基底、嫁接最好的部分。`/swarm` 分割切片或声明的竞赛分支，并聚合一份报告。
- **接受每一条审阅评论。** 机器人和人都把真正的抓取和噪音放进同一个列表。`/interrogate` 只留下一次重跑能证明的发现，并列出它丢掉了什么、为什么，而你可以往哪个方向覆盖它。
- **把 `auto` 当成一个模型 slug。** `auto` 和 `inherit-parent` 的意思是"省略 model 字段，让子智能体继承父聊天的模型"。[设置](./01-setup.md)涵盖了这些角色。
- **凭一个绿灯构建报告成功。** 一次构建只证明它能编译。要真实的命令、流程、存储的值或 profile，并期待证据出现在回复里。
- **随手写一个 `SKILL.md`。** 把它路由到 [Authoring or modifying a skill playbook](../../skills/poteto-mode/playbooks/authoring-a-skill.md)，好让校验和审阅发生。

这就是这份指南。如果你跳着看了，回到[设置](./01-setup.md)，跑一个真实的任务。习惯来自使用，不来自阅读。

回到[指南索引](./README.md)。