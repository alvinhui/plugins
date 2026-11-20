# 把它变成你的

poteto-mode 是一个人的风格。它底下的 playbook、路由和模型角色，配上你的风格一样好用。这一页涵盖：生成一个个人模式、从一个会话里捕捉经验、修好仓库让智能体别再重复犯错、写一个聚焦的技能，以及在信任一个技能改动之前先测试它。

从比你想象的小处开始。你第一天不需要很多技能，甚至不需要这整个插件。朴实地提示，观察智能体在哪里失败，当同一个失败出现两次时再补一个技能或一次检查。

## 用 `/automate-me` 生成你自己的模式

```text
/automate-me
```

你不去描述你的风格，因为 [`/automate-me`](../../skills/automate-me/SKILL.md) 会从你的历史里把它读出来。它在当前工作区里挖掘你最近的记录，寻找反复出现的偏好——你喜欢的回复、委托、验证、代码、散文和流程方式——然后问你哪些模式真的是你。它通过 Cursor 内置的 `create-skill` 流程起草 `.cursor/skills/<your-name>-mode/SKILL.md`，把草稿过一遍 [`/unslop`](../../skills/unslop/SKILL.md)，并从一个 worktree 打开一个 PR，好让你像审阅任何其他改动一样审阅它。

每当你的习惯漂移时就再跑一次：

```text
/automate-me update my mode skill with everything since its last edit
```

Update mode 只挖掘这个技能上次改动以来的历史。它保留你没有反驳过的规则，修订那些有新证据的，并只为新出现的模式添加章节。

## 用 `/reflect` 捕捉一个会话的经验

在一个教会了你点东西的任务之后，立刻运行：

```text
/reflect that took way too long. capture what we learned so the next run doesn't repeat it.
```

[`/reflect`](../../skills/reflect/SKILL.md) 读记录，只保留那些会改变未来智能体工作的经验，并把提案分拣成 `Accepted`、`Rejected` 和 `Backlog`。在任何技能改动之前，它都会等你的批准。只有当一条提案会改变未来的某个决策时，才批准它。一次奇怪的会话是轶事，不是规则。

## 用 `/correct` 修环境

当你一次又一次地为同一个错误纠正智能体时，修复应该落在仓库里，而不是你的下一条提示词里。按它们能守多牢来给选项排序：

1. 用架构或更好的数据结构让这个错误不可能发生。
2. 用类型、或一个错误信息会点出修法的 lint 或 CI 检查来挡住它。
3. 用一个测试抓住它。
4. 把它写成一个文档或智能体规则。当智能体跳过一条规则时，什么都不会失败，所以这个排在最后。

人工审阅不在这个列表里。一个必须在每个 PR 上都抓住同一个错误的审阅者，正是这个要解决的问题。[`/correct`](../../skills/correct/SKILL.md) 来做这件事：

```text
/correct agents keep calling the database client directly instead of going through the repository layer
```

它读最近的提交、回退、审阅评论，以及那些解释 workaround 的评论，然后把错误分组归类。一类一旦发生过两次就算数。它把最频繁的几类，每类一个提交地修掉，修在能奏效的最高层级，并证明每个新检查都会在一个真实的过往错误上失败。它还在智能体指令文件里维护一张表，把每条规则和强制执行它的东西配对，这样一条没有任何东西强制执行的规则就会显示为重复。回复列出每一类及其证据、所选层级，以及为什么更高的层级行不通。

不带参数运行它，它就会自己从历史里找出这些类。`/reflect` 和 `/correct` 分工明确。`/reflect` 从一个会话改进技能。`/correct` 改仓库，让一类错误没法再回来。当修复是一个新边界时，把它和 `/architect` 配对。[并行跑许多项目](./07-overnight.md#并行跑许多项目)里有一条提示词，能跨整个仓库同时做这两件事。

## 写一个聚焦的技能

当你已经知道想捕捉的工作流时：

```text
/poteto-mode write a skill for verifying database migrations in this repo
```

写技能会匹配 [Authoring or modifying a skill playbook](../../skills/poteto-mode/playbooks/authoring-a-skill.md)，它走 Cursor 内置的 `create-skill`，校验 frontmatter 和链接，并通过 Opening a PR playbook 交付结果。面向智能体的散文比面向人的散文标准更高，因为一句没用的话会变成未来某个智能体要遵循的指令。让 playbook 守住这个标准，而不是随手写一个 `SKILL.md`。

两个特例有它们自己的生成器。一个必须驱动你的应用并证明行为的技能是验证技能，所以改用 [`/create-verification-skill`](../../skills/create-verification-skill/SKILL.md) 和 [`/maintain-verification-skill`](../../skills/maintain-verification-skill/SKILL.md)。一个用模型检查器、证明或其他验证器来检查你代码某个性质的技能是正式验证技能，所以用 [`/create-formal-verification-skill`](../../skills/create-formal-verification-skill/SKILL.md) 和 [`/maintain-formal-verification-skill`](../../skills/maintain-formal-verification-skill/SKILL.md)。[验证并发布](./06-verify-and-ship.md#用正式验证技能证明一个性质)涵盖了这两种。

## 用 `/technical-writing` 按标准写文档

技能不是你交付的唯一散文。对于文档、RFC、readme、PR 描述和提交信息：

```text
/technical-writing review the readme changes
```

[`/technical-writing`](../../skills/technical-writing/SKILL.md) 应用一套分层的标准。它的目标是让一个疲惫的工程师第一遍就能读懂的散文。它先定文档的模式（教程、操作指南、参考或解释），然后一句一句地过：谁做什么、一句一个想法、没有能读出两种意思的东西。用它来审阅你或某个智能体刚写的东西，或在你要一份文档时提前点名它。

## 盲测一个技能改动

一个技能编辑会影响每一个未来的会话，所以像对待一场实验那样测试它。采纳别人的技能也一样。在留下它之前，先确认它让智能体在你的工作上做得更好。

```text
/poteto-mode run the eval playbook on this skill change. same task for both variants, candidates stay blind.
```

当一个技能一直失手、而你知道它该做什么时，在一个任务里改并测它：

```text
/poteto-mode update the review skill so it flags missing migrations, and eval the change.
```

提前要这个 eval，能让这次编辑保持诚实。从一个糟糕会话里写出来的修复，往往会过拟合那个会话，而经过许多次编辑，技能会漂移。eval 在它发布前抓住这个漂移。

[Eval playbook](../../skills/poteto-mode/playbooks/eval.md) 围绕一种失败模式构建：观察者效应。一个知道自己在被评估的智能体会表现不同。所以候选智能体拿到的是在净化过的目录里的、看起来自然的任务，绝不会有"eval"或"candidate"这些字眼，也绝不知道彼此的存在。一个评委在中性标签下给所有输出打分，而链条的跟随情况则根据每个候选实际读了哪些文件来评分，而不是根据它声称读了什么。

在接受裁决之前，自己把每个输出都读一遍。如果你和评委意见相左，先怀疑评分标准，再怀疑你自己的判断。

## 用 `/make-bot-ui` 建一个机器人界面

有一个情境性的技能是给 Grok Bot 用户的。[`/make-bot-ui`](../../skills/make-bot-ui/SKILL.md) 建一个小页面，它的按钮通过一个 webhook 例程唤醒一个机器人。比如，你可以滑过一个审阅队列，让每一次滑动都让机器人对那一项采取行动。你机器上的一个服务器持有 webhook 的发送方密钥，所以密钥永远不会到达浏览器或聊天。这个技能也涵盖在 Tailscale 上暴露这个页面。

**陷阱：** 别在任务进行中因为技能表现不对就去改它。在它自己的 PR 里修它，让任务继续前进。一个纠缠在功能工作里一起交付的技能编辑，对审阅是不可见的，也无法评估。

下一步：[配方与陷阱](./10-recipes-and-pitfalls.md)。