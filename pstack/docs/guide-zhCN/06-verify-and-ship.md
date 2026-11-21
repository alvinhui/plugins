# 验证结果，提 PR

"能编译"不算证据。[证明它真的能跑（Prove It Works）原则](../../skills/principle-prove-it-works/SKILL.md)要求智能体在汇报成功之前先检查真实产物，而你要做的，是让"真实产物"可检查。这一页讲：说清完成判据、审查测出来的数字、为你的应用生成验证技能、用形式化方法验证一条测试很少覆盖的性质、提 PR，再一路推到合并。

验证是多数智能体工作里最慢的一环，因为这一环通常要等人。让智能体自己能做验证，你就不再是瓶颈。跳过验证，跑再多智能体也只是攒下更多没检查过的工作等你审。

![一架原型机飞过真实测试航线，她用秒表计时，机器人拍摄全程并对照清单逐项核对；终端上写着 verify: pass, evidence: captured。](./images/verification.jpg)

## 一开始就说清完成判据

在第一条提示词里就写明完成的标准，措辞随意：

```text
/poteto-mode add json output to this command. text output stays byte-identical, the json parses, both run against the sample project. show me the evidence.
```

这样智能体手里就有三项能跑的检查，而不是一个只能凭感觉去满足的要求。回复应该附上确切的命令和输出。哪项检查跑不了，合格的回复会写"inconclusive"（无法定论）。没有证据却信心十足的回复，是危险信号。

检查要对得上改动：

- CLI 改动就跑真实命令。
- UI 改动就在运行中的应用里走一遍改过的流程。如果要求与参考图逐像素一致，[Visual parity playbook](../../skills/poteto-mode/playbooks/visual-parity.md) 会拿截图与冻结基线做 diff，而不是靠肉眼判断。
- 解析器或迁移就重放一份保存的输入。
- 性能改动就对比前后的性能剖析结果。
- 存储改动就把写入的值读回来。

要证据时，要你能亲自检查的产物：先失败后通过的测试、前后对比视频、trace、截图。如果修复已经合并，就在 main 上把同样的检查再要一遍。产物胜过听起来合理的解释：你不必把整轮运行重放一遍，就能对它提出质疑。

小 diff 你不完全放心时，用 [`/blast-radius`](../../skills/blast-radius/SKILL.md) 找出它可能波及别处的地方。它会找到让这次改动安全的那个关键事实，并靠跑代码来证明，而不是靠嘴上论证。

## 用 /benchmark-checklist 审查性能数字

前后对比的数字，是最容易在不经意间搞错的证据。缓存是热的、某一侧跑的是 debug 构建、要测的工作根本没落在计时区间内——随便哪一条都能造出看似可信的加速。在汇报数字或据此行动之前，输入：

```text
/benchmark-checklist vet the export speedup before it goes in the pr
```

[`/benchmark-checklist`](../../skills/benchmark-checklist/SKILL.md) 会问七个问题，每个问题都要有真实运行给出的证据：

1. 这个数字被什么限制住了？为什么不是两倍？
2. 每一侧是否都按生产环境的方式调优后运行？
3. 结果有没有突破物理极限，比如磁盘带宽或核数？
4. 有没有报错，或返回了错误输出？
5. 交替运行能否复现？中位数和波动范围是多少？
6. 在用户真正等待的那条路径上，端到端有没有影响？
7. 要测的工作是不是真的发生在计时区间内？

结论只会是 faster、slower、no measurable difference 或 inconclusive 之一，并附上运行次数、波动范围和限制因素。说不出限制因素，或某一侧没调优就跑了，结论就是 inconclusive。`/poteto-mode` 在 Perf issue 和 Hillclimb playbook 里已经内置这份清单；你在这些 playbook 之外测了数字，或者别人的数字好得可疑时，再自己输入它。这是[解释这个数字（Explain the Number）原则](../../skills/principle-explain-the-number/SKILL.md)的落地形式。

## 给项目生成验证技能

上面 UI 那条背后藏着一个硬性要求：智能体得有脚本化的手段来驱动你的应用。项目里已经有，很好；没有就运行：

```text
/create-verification-skill
```

[`/create-verification-skill`](../../skills/create-verification-skill/SKILL.md) 盘问的是仓库，不是你。它会弄清用户会操作什么、应用怎么在本地启动、用什么驱动（优先用现成的测试装置，否则用浏览器加 CDP、PTY 或纯 HTTP）、什么证据能证明行为，以及两个实例能否同时运行。只有代码答不上来的问题才会问你。

它生成 `.cursor/skills/verify-<app>/`：一份面向智能体的说明，包含明确的 Launch、Doctor、Drive、Evidence、Cleanup 小节，随附脚本都写进 Helpers 小节；外加 `features/` 下的功能地图，索引应用有哪些功能、每个功能用什么结果证明有效。技能自带一份[完整的功能地图示例](../../skills/create-verification-skill/references/feature-map-example/)，有 README 索引，每个功能一个文件，都用四个必需的 H2。交付之前，生成器会把技能端到端跑通一次：启动、doctor 检查、驱动一个功能、采集证据、清理，再确认证据在清理后仍然完好。这次验证失败，就别用生成的结果。

从此，"在应用里验证"就是这个仓库里任何智能体都能直接执行的一步，不用再聊一轮环境配置。想要特定形式的证据，就在提示词里点名这个技能：

```text
/poteto-mode build the bulk-archive action. use /verify-<app> to verify your changes and show me a video and screenshots as proof.
```

```text
/poteto-mode repro this with /verify-<app>. if it repros on main, fix it and show me a video as proof.
```

验证技能能用之后，[`/swarm`](../../skills/swarm/SKILL.md) 就能按功能地图的条目拆分一整轮验证，再汇总结果。一批验证 worker 还能在足够大的样本上确认性能提升，或在 PR 交付前对应用做模糊测试、排查回归。

把验证技能当基础设施，别当一次性用品。把它提交进仓库，团队里每个人、每个智能体就都用同一套方式驱动应用。然后[造杠杆（Build the Lever）](../../skills/principle-build-the-lever/SKILL.md)：智能体总写一次性脚本去点应用时，就要一个小型控制 CLI，让技能改为调用它。智能体省 token，每次运行也都可复现。智能体用得顺手的 CLI 有这些特点：

- 少量可组合的命令，每条都干实事，而不是一大堆单薄的命令。
- 有破坏性的操作都带 `--dry-run` 选项。
- 子命令逐层展开功能，而不是一口气全摊出来。
- 报错信息直接说该改做什么。
- `--help` 文本足够详尽。
- 输出机器可读，比如 JSON。

顺手把开发环境也做成可复现的：种子数据、测试用户，加一条命令，每次都以同样方式把环境拉起来。

## 让验证技能不过时

应用在变，功能地图会过时。这个命令至少每天跑一次，最好挂成定时自动化，谁都不用惦记：

```text
/maintain-verification-skill
```

[`/maintain-verification-skill`](../../skills/maintain-verification-skill/SKILL.md) 审计生成的技能：先给每个功能并行派一个只读的源码阅读者，再实际跑一轮，把地图上每个功能都驱动一遍。结局只有三种。`clean`：覆盖完整，没有要提交的东西。`changed`：一个 PR，装着验证过的修正，只动验证技能自己的目录。`blocked`：写明阻塞项。它从不改产品代码。实测中发现产品回归，就如实上报，不会改改文档把问题盖过去。

## 用形式化验证技能证明一条性质

验证技能证明的是你驱动过的路径。有些 bug 藏在没人驱动的路径上：两次重试撞在一起、锁在写入中途过期、状态变更乱序到达。测试很少覆盖到这些情况。如果代码里这类 bug 代价高昂，运行：

```text
/create-formal-verification-skill
```

[`/create-formal-verification-skill`](../../skills/create-formal-verification-skill/SKILL.md) 从代码里挑目标：代码许下的某个承诺，破坏它会伤到用户，而测试又很少覆盖到会破坏它的情形。它挑最有分量的目标，不是最好验证的。也可以点名一个模块或一个 bug，让它从那里入手：

```text
/create-formal-verification-skill the job lease and retry logic. a job must never run twice at once.
```

问题决定工具。"事件会不会以坏顺序发生"适合对设计的小模型跑模型检查器，这类场景不管什么语言，默认都用 TLA+。"代码对任意输入是否行为正确"适合直接跑在代码上的验证器。你的语言没有可用的验证器时，智能体会直说，并改用生成的输入去测真实代码，而不是手写一个函数模型。必须在任意规模下都成立的性质，可能需要证明。智能体会告诉你选了哪个工具、为什么。

它一次验证一条性质，并演示这条性质在故意改坏的代码变体上如何失败——从没见过失败的检查，什么都证明不了。如果现有代码已经违反了这条性质，你会拿到反例：用你代码里的术语写成的一小串步骤。性质本身保持原样，发现的问题就仍然是问题。除非你要求，产品代码不会改动。

它生成一个项目内的技能，告诉下一个智能体：改动有没有碰到已验证的代码、怎么用一条命令跑检查、怎么区分真 bug 和建模错误。交付之前，生成器会先做一个破坏该性质的临时改动，照着技能走一遍，检查必须能抓住它。交付说明写清楚：验证了什么、用的什么工具和验证边界、检查发现了什么、没覆盖什么。一次通过覆盖的是模型或验证边界之内，不是整个系统。

技能还会记录每项检查覆盖哪些代码，以及检查最后一次与之匹配时的 commit。绕过这个技能的合并和重构，可能让检查对着一段早已不存在的代码描述继续通过。这类改动之后，运行 [`/maintain-formal-verification-skill`](../../skills/maintain-formal-verification-skill/SKILL.md)。它按代码更新验证、重新运行、演示每个更新后的检查仍然能失败，并告诉你每次失败是验证过时了，还是代码里有 bug。

## 用状态图讲清行为

用模型术语写的反例能说服你，但对这个行为负责的 PM 或设计师，需要用他们的语言看懂它。运行：

```text
/statechart what the user sees when they edit a note offline
```

[`/statechart`](../../skills/statechart/SKILL.md) 从 TLA+ 模型生成一张 Mermaid 状态图，画的是用户眼中的行为，图和被检查的模型因此不会脱节。读者定下的规则（"离线时绝不该看到 Synced"）变成不变式。图会标出每个违反规则的状态，报告用读者的语言给出到达该状态的最短路径。交付之前，智能体会在真实代码里复现每条 bug 路径，建模错误就不会被当成 bug 递给读者。

## 提 PR

```text
/poteto-mode open the pr. small ordered commits, evidence in the description.
```

[Opening a PR playbook](../../skills/poteto-mode/playbooks/opening-a-pr.md) 在 worktree 里干活：把工作变基成小而可落地的提交、清理 diff、写一份一分钟能读完的简报当正文，然后提出一个可直接评审的 PR。后续改动堆叠成新 PR，好过让一条分支越长越大。

## 用 Babysit 把 PR 推到可合并

PR 一提出来就开始攒阻塞项：检查失败、评审者留言、主干还在前进。把这些变动交给 [Babysit playbook](../../skills/poteto-mode/playbooks/babysit.md)：

```text
/poteto-mode babysit this pr. get it green.
```

Babysit 盯着 PR——GitHub 上用自带的 watcher，Origin CLI 可用时就用它——按顺序清阻塞项：先冲突，再评审讨论，最后 CI。它从不变基，也不强推。遇到冲突或基线过时，会连同需要变基的分支一起交回给你。它甄别评论时抱着怀疑态度，因为人和机器人会把真问题和噪音混在同一个列表里。真问题就修掉；噪音就驳回，并把反证贴在评审讨论里。只想知道状态时，把问题问小一点，Babysit 会直接回答，不启动循环：

```text
/poteto-mode check on pr 123. anything outstanding?
```

Babysit 到"达到可合并状态"就停。即使 CI 全绿它也从不合并，因为合并是另一个决定。

## 用 Shipping 落地整个 stack

CI 全绿不等于安全。准备好落地时，直说：

```text
/poteto-mode land the stack.
```

[Shipping playbook](../../skills/poteto-mode/playbooks/shipping.md) 在启动合并流程之前，先独立验证每个 PR：每个 PR 由一个全新的智能体实际运行、证明行为，评判改动的智能体绝不是写它的那个。然后 Shipping 只从 stack 底部落地那段连续的已验证区间，一次一个 PR，默认走 GitHub，Origin CLI 可用时走 Origin，并报告第一个断链的 PR。已验证的 PR 如果压在未验证的 PR 上面，就得等——合并它会把中间的缺口一起带进主干。

下一步：[睡觉时也让任务继续跑](./07-overnight.md)。
