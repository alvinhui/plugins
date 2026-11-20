# 验证结果，打开 PR

"能编译"不是证据。[Prove It Works 原则](../../skills/principle-prove-it-works/SKILL.md) 让智能体在报告成功之前先检查真实的产物，而你的工作，是让"真实的产物"变得可检查。这一页涵盖：陈述完成条件、核验一个测量出来的数字、为你的应用生成一个验证技能、正式验证一个测试很少触及的性质、打开 PR，以及把它推到合并。

验证是大多数智能体工作里最慢的一步，因为这一步通常要等人。让智能体能自己完成它，你就不再是瓶颈。跳过它，跑再多的智能体也只是给你更多未经检查的工作去审阅。

![一架原型飞机飞过一条真实的测试航线，她用秒表计时，机器人则拍摄并对着清单核对这一轮；终端上写着 verify: pass, evidence: captured。](./images/verification.jpg)

## 一开始就说清楚完成条件

把"完成"意味着什么放进第一条提示词，用任何合适的措辞：

```text
/poteto-mode add json output to this command. text output stays byte-identical, the json parses, both run against the sample project. show me the evidence.
```

现在智能体有了三个可以跑的检查，而不是一个要去满足的心情。当回复回来时，它应该带着确切的命令和输出。如果某个检查跑不了，好的回复会说"inconclusive"。一条没有证据却自信满满的回复，是一个警告信号。

让检查匹配改动：

- CLI 改动跑真实命令。
- UI 改动在运行中的应用里走一遍改动的流程。当它必须逐像素匹配参考时，[Visual parity playbook](../../skills/poteto-mode/playbooks/visual-parity.md) 会把截图和一个冻结的基线做 diff，而不是用眼睛判断。
- 解析器或迁移重放一份保存的输入。
- 性能改动对比前后 profile。
- 存储改动把写进去的值读回来。

把证明要成一个你能亲自检查的产物：先失败的测试再通过的测试、一段前后对比的视频、那份 trace、那张截图。如果修复已经合并了，就在 main 上再要一次同样的检查。一个产物胜过一份看似合理的解释，因为你不用重放整轮就能质疑它。

对于一个你不完全信任的小 diff，[`/blast-radius`](../../skills/blast-radius/SKILL.md) 会找出它可能在别处破坏什么。它找到让这个改动安全的那一个事实，并通过跑代码来证明这个事实，而不是靠论证。

## 用 `/benchmark-checklist` 核验一个测量出来的数字

一个前后对比的数字，是最容易无意中搞错的证据。一边是热缓存、一边是 debug 构建，或者工作根本没跑在计时区间内，每一样都能制造出一个令人信服的加速。在你报告或依据一个数字行动之前，敲：

```text
/benchmark-checklist vet the export speedup before it goes in the pr
```

[`/benchmark-checklist`](../../skills/benchmark-checklist/SKILL.md) 会问七个问题，每一个都想要一次运行给出的证据：

1. 是什么限制了这个数字，为什么它不是两倍？
2. 每一侧是不是都以生产环境的方式调优运行？
3. 结果是否突破了某个物理极限，比如磁盘带宽或核数？
4. 有没有任何东西报错或返回了错误的输出？
5. 在交替的运行中能否复现，带着中位数和区间？
6. 在用户会等待的那条路径上，它端到端地重要吗？
7. 工作是否真的发生在计时区间内？

裁决会以 faster、slower、no measurable difference 或 inconclusive 的形式返回，附带运行次数、区间和限制因素。当它说不出限制因素、或某一侧没有调优运行时，就说 inconclusive。`/poteto-mode` 已经在 Perf issue 和 Hillclimb playbook 内部跑这份清单，所以当你在它们之外测量了什么东西、或别人的数字好得过头时，你自己敲它。它是 [Explain the Number 原则](../../skills/principle-explain-the-number/SKILL.md) 的可操作形态。

## 创建一个项目验证技能

上面 UI 那条隐藏着一个真实的要求。智能体需要一种脚本化的方式来驱动你的应用。如果你的项目有，很好。如果没有，运行：

```text
/create-verification-skill
```

[`/create-verification-skill`](../../skills/create-verification-skill/SKILL.md) 访谈的是仓库，不是你。它弄明白用户会碰什么、应用怎么在本地启动、什么能驱动它（先看现成的装置，否则是浏览器加 CDP、一个 PTY，或纯 HTTP）、什么证据能证明行为，以及两个实例能否并排运行。它只问你代码回答不了的问题。

它写出 `.cursor/skills/verify-<app>/`，一份面向智能体的指令，带精确的 Launch、Doctor、Drive、Evidence 和 Cleanup 部分，一个 Helpers 部分用于它随附的任何脚本，外加 `features/` 下的一张功能地图，索引这个应用做什么、以及什么结果能证明每个功能是好的。这个技能随附一个[做好的功能地图示例](../../skills/create-verification-skill/references/feature-map-example/)，带一个 README 索引，每个功能一个文件，使用四个必需的 H2。在交付之前，生成器会端到端地证明这个技能一次：启动、doctor 检查、驱动一个功能、抓取证据、清理，然后确认证据在清理之后还在。如果那次证明失败，就别用这个输出。

从那时起，"在应用里验证它"就成了这个仓库里任何智能体都能执行、且无需设定对话的一步。当你想要特定形式的证明时，在提示词里点名它：

```text
/poteto-mode build the bulk-archive action. use /verify-<app> to verify your changes and show me a video and screenshots as proof.
```

```text
/poteto-mode repro this with /verify-<app>. if it repros on main, fix it and show me a video as proof.
```

一旦验证技能能用了，一个 [`/swarm`](../../skills/swarm/SKILL.md) 就能按功能地图条目把一个完整的一轮拆开，再聚合结果。一群验证者也能在足够大的样本上确认一个性能胜利，或在 PR 发布前对应用做模糊测试来找回归。

把验证技能当作基础设施，而不是一次性用品。提交它，这样团队里的每个人、每个智能体都以同样的方式驱动应用。然后[去造那个杠杆](../../skills/principle-build-the-lever/SKILL.md)。当智能体不断写一次性脚本来点穿应用时，要一个小的控制 CLI，让技能去调用它。智能体花的 token 更少，而且每一次运行都变得可复现。一个智能体用起来顺手的 CLI 有这些特征：

- 几个可组合的命令，每个都做实事，而不是许多单薄的命令。
- 任何有破坏性的东西都带一个 `--dry-run` 选项。
- 子命令逐步揭示功能，而不是一次全倒出来。
- 错误信息会告诉你该怎么做。
- 丰富的 `--help` 文本。
- 机器可读的输出，比如 JSON。

趁你在那儿，把开发环境也做成可复现的：种子数据、测试用户，以及一条每次都以同样方式把环境拉起来的命令。

## 让验证技能保持诚实

应用会变，功能地图会过时。至少每天跑一次这个，最好用定时自动化，这样谁都不用记：

```text
/maintain-verification-skill
```

[`/maintain-verification-skill`](../../skills/maintain-verification-skill/SKILL.md) 审计生成的技能：每个功能并行一个只读的源码读取器，然后一轮实况遍历，驱动每一个被映射的功能。它恰好以三种结果之一收尾。`clean` 意味着全覆盖、没什么要交付的。`changed` 意味着一个经过证明的修正 PR，局限在验证技能自己的目录里。`blocked` 会点出那个阻塞。它从不编辑产品代码。如果实况遍历抓到一个产品回归，它会报告这个回归，而不是用一次文档编辑把它藏起来。

## 用正式验证技能证明一个性质

验证技能证明的是你驱动的那些路径。有些 bug 活在没人驱动的路径上：两次重叠的重试、写写到一半就过期的锁、乱序到达的状态变更。测试很少触及这些情况。对于这种 bug 代价高昂的代码，运行：

```text
/create-formal-verification-skill
```

[`/create-formal-verification-skill`](../../skills/create-formal-verification-skill/SKILL.md) 从代码里挑目标：代码许下的一个承诺，一旦被破坏会伤害用户，而测试很少触及那个会破坏它的情况。它挑最强的目标，而不是最容易验证的。点名一个领域或一个 bug，就从那里开始：

```text
/create-formal-verification-skill the job lease and retry logic. a job must never run twice at once.
```

问题决定工具。事件是否可能以糟糕的顺序发生，适合在一个小的设计模型上跑模型检查器，而 TLA+ 是任何语言里这种场景的默认选择。代码是否对每个输入都表现正确，适合一个跑在代码上的验证器。如果你的语言没有验证器可跑，智能体会明说，并用生成的输入去测真实代码，而不是手写一个函数模型。一个必须在每个规模都成立的性质，可能需要一份证明。智能体会告诉你它选了哪个工具、为什么。

它验证一个性质，并展示这个性质在代码的一个被破坏的变体上失败——因为一个你从没见过它失败的检查，什么都证明不了。当当前代码已经破坏了这个性质时，你会拿到那个反例，用你代码的术语写成一小串步骤。性质保持原样陈述，所以发现就还是发现。除非你要求，产品代码不会变。

它写一个项目本地的技能，告诉下一个智能体：某个改动是否触及被验证的代码、如何用一条命令跑这个检查、以及如何区分真正的 bug 和建模错误。在交付之前，生成器会先在一个破坏该性质的临时改动上照着那个技能走一遍，而检查必须能抓住它。交付说明会写清楚：验证了什么、用了哪个工具和什么边界、检查发现了什么、以及它没覆盖什么。一次通过覆盖的是那个模型或那个边界，不是整个系统。

这个技能还会记录每个检查覆盖哪些代码，以及检查最后一次匹配到它的那次提交。跳过这个技能的合并和重构，会让检查在一段已经消失的代码描述上继续通过。在那之后，运行 [`/maintain-formal-verification-skill`](../../skills/maintain-formal-verification-skill/SKILL.md)。它从代码更新验证、重跑它、展示每个更新后的检查仍然能失败，并告诉你每一次失败是验证的漂移，还是代码里的 bug。

## 用状态图展示行为

一个用模型术语写成的反例能说服你。但拥有这个行为的 PM 或设计师，需要用他们的术语来看它。运行：

```text
/statechart what the user sees when they edit a note offline
```

[`/statechart`](../../skills/statechart/SKILL.md) 画一张用户所见内容的 Mermaid 状态图，从一个 TLA+ 模型生成，这样图和被检查的模型就不会漂移。读者的规则（"你离线时绝不会看到 Synced"）变成不变量。图表会标出每一个破坏规则的状态，报告会用读者的话给出到达它的最短路径。在交付之前，智能体会在真实代码里复现每一条 bug 路径，这样建模错误就不会以一个 bug 的形式传到读者那里。

## 打开 PR

```text
/poteto-mode open the pr. small ordered commits, evidence in the description.
```

[Opening a PR playbook](../../skills/poteto-mode/playbooks/opening-a-pr.md) 从一个 worktree 工作，把工作变基成小而可落地的提交，清理 diff，写一份一分钟简报作为正文，然后打开一个就绪的 PR。堆叠的后续 PR 胜过一根不断生长的分支。

## 用 Babysit 把 PR 推到可合并

一个打开的 PR 会立刻开始累积阻塞。检查失败、审阅者评论、主干在移动。把这些琐碎交给 [Babysit playbook](../../skills/poteto-mode/playbooks/babysit.md)：

```text
/poteto-mode babysit this pr. get it green.
```

Babysit 盯着这个 PR，在 GitHub 上带一个打包好的 watcher，或在 Origin CLI 可用时用它，并按顺序处理阻塞：先是冲突，再是审阅线程，最后是 CI。它从不变基或强推。一个冲突或过时的基线会带着需要变基的分支回到你这里。评论的分类是持怀疑态度的，因为人和机器人把真正的抓取和噪音放在同一个列表里。一个真正的发现会得到修复，噪音则会被驳回，并把反证贴在那个线程上。当你只想要状态时，问得小一点，Babysit 就会在不启动循环的情况下回答：

```text
/poteto-mode check on pr 123. anything outstanding?
```

Babysit 在可合并处停下。它从不合并，即便一切绿灯，因为合并是另一个决定。

## 用 Shipping 落地 stack

绿灯不等于安全。当你准备好落地时，说出来：

```text
/poteto-mode land the stack.
```

[Shipping playbook](../../skills/poteto-mode/playbooks/shipping.md) 在武装任何东西之前，先独立地验证每个 PR。每个 PR 一个全新的智能体，实况证明行为，而评判一个改动的智能体，绝不是写它的那个。然后 Shipping 只从底部落地那段连续的、已验证的运行，一次一个 PR，默认走 GitHub，或在 Origin CLI 可用时走它，并报告第一个断链的 PR。一个坐在未验证 PR 之上的已验证 PR 会等，因为合并它会把这个缺口拉到下面来。

下一步：[在你睡觉时运行工作](./07-overnight.md)。