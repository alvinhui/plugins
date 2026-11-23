---
name: statechart
description: "检查一个在状态间迁移的系统（如产品流程、协议或服务）的 TLA+ 模型，并画成 Mermaid statechart。报告给出通往每个违反规则的状态的最短路径。用于 /statechart，或把一个 bug 展示为穿越状态的路径。"
disable-model-invocation: true
---

# Statechart（状态图）

图用读它的人的话，展示系统如何在状态间迁移。那个人——读者——来判断行为对不对。

## 运行

在仓库外的临时目录里工作。写一份 TLA+ spec 及其 config。然后运行：

```sh
<skill dir>/scripts/statechart SPEC.tla [--config FILE] [--view FILE] [--out DIR]
```

`scripts/statechart.ts` 是 TypeScript，用能执行 TypeScript 的运行时跑它。`scripts/statechart` 是负责挑选运行时的 POSIX shell 脚本。原生 Windows 上，用 Node 22.18 到 22.x、或 Node 23.6 及以上运行 `node --disable-warning=ExperimentalWarning <skill dir>/scripts/statechart.ts`。

首次运行会用 mise 安装 TLC 和 Java，需要网络。

## 编写 spec

- 读者认可的每条规则写成一个 INVARIANT。规则可以关于一个界面、一个结果、一个存储值或一条消息。模型里没有对应变量时，加变量。绝不为了让规则成立而弱化规则。
- `Next` 写成各 action 的析取，如 `YouPressPlay \/ YouPressStop`。不这样写，TLC 会把每一步都叫 `Next`。
- 没有出边的状态违反 `NoDeadlock`，正确的终态也一样。已有 INVARIANT 或 PROPERTY 占用该名字时，规则是 `CHECK_DEADLOCK`。给 `Next` 加一个只在终态为真且什么都不改的 action，如 `Done == phase \in {"paid", "failed"} /\ UNCHANGED vars`，并在 `step()` 里给它标签。

## 设计图

需要判断力的工作你来做：每个状态和箭头上的措辞、阶段及其颜色、标题、给读者的报告。把这些工作放进一个 view 模块，用 `--view` 传入。

要展示读者的话，view 导出 `state(vars)`。`state()` 的返回值决定形态：

- 字符串给出平面图：`export const state = (v) => (v.paid ? "Paid" : "Paying");`
- 数组给出父状态：`export const state = (v) => v.main.split(".");`
- 对象为每个 key 给出一个并行区域：`export const state = (v) => ({ Playback: v.playback, Volume: v.volume });`

每个状态用读者看得见或关心的东西标注，如「支付中」「持有租约，写入待处理」。标签里不出现变量名。`vars` 里 TLA+ 序列是从 1 起键的对象，所以 `v.pc[1]` 就是 `pc[1]`。集合是数组。

view 还可导出 `step(action, from, to)`。它拿到 TLC 的 action 名和该步前后的值，返回箭头的标签。每个步骤标签按用户看到它发生的方式写，如「你按下播放」「连接失败」。不要点名代码或 TLA+ action。在图里结局相同的两个 action 用同一标签，让它们共用一条箭头。

某步只在特定条件下发生时，标签末尾用方括号写条件，用读者的话，如 `you press play [while the file loads]`。分区图中，命令会把其他区域上的条件按它们的标签措辞写到箭头上，如 `[when Offline]`。你的方括号会替换它，来自同一状态的两条箭头可能因此看起来一样。所以分区图里不要为其他区域上的条件写方括号。某个任何标签都不展示的值决定步骤走向时，在标签里点名结果，如「花名册读取失败」。

view 还可导出：

- `group(vars)` 返回阶段名。每个图状态获得其分组的颜色。一个图状态背后的模型状态分属不同组时，该状态不着色。
- `colors` 给每个组名一个颜色 class。
- `title` 是图顶部显示的字符串。

命令对每个模型状态至多调用一次 `state()` 和 `group()`，对每步至多调用一次 `step()`。图和报告都用这些答案。所以让每个函数只依赖自己的参数。

停留在同一标签内的步骤图不画。读者必须看到这种步骤时，拆分标签。

箭头控制在约 20 条以内，更密的图难读。先让 `state()` 返回更粗的标签。行为相同的值给同一标签，读者不需要的细节省略，比如返回不改变任何事的在途调用。bug 路径的每个状态都保留，每个标记都保留。合并把 `breaks` 状态变成 `mayBreak` 时，会掩盖规则在哪里被违反。不要合并违反不同规则的两个状态，否则读者看不出哪条规则在哪里被违反。图仍然太密时，对读者不需要的步骤让 `step()` 返回 `null`，比如每个状态都有的 reset，或箭头重复了其他箭头信息的步骤。隐藏步骤时遵守这些规则：

- 每个图状态都要能从某个起始状态经箭头到达。
- 模型里有出边的每个图状态，至少保留一条出箭头。
- 一条箭头的步骤要么全隐藏，要么全不隐藏。只隐藏一部分会让它的条件变窄。
- 交接时说明图隐藏了哪些步骤。

## 读报告

- 图中违反规则的状态带 class `breaks`。它背后只有部分模型状态违反规则时，带 class `mayBreak`。Legend 点名每个标记对应的规则。两条规则被违反时，一个标记上点名两条，所以交接时说明哪个状态违反哪条规则。分区图中，包含某状态的每种区域状态组合都可能违反规则时，该状态获得标记。某组合可能违反规则而其中没有任何状态带标记时，该组合的每个状态都获得标记。
- TLC 会越过违反规则的状态继续走，所以图会展示 bug 之后的状态。
- 因为 TLC 越过 bug 继续走，状态数无上限的模型可能跑不完。常量取小，或加 CONSTRAINT。
- 有 VIEW 或 SYMMETRY 时，TLC 把它视为相同的状态算作一个，图也只画那一个。箭头可能指向它而不是该步实际到达的状态，报告会说明。
- 越过 CONSTRAINT 或 ACTION_CONSTRAINT 的每个状态，TLC 仍检查规则，但不探索该状态、不查它的死锁。TLC 某条规则的最短路径止于这种状态时，图画出该状态，报告给出该路径。界外的其他状态图不画。这种状态里的死锁不会显示。被 ACTION_CONSTRAINT 排除的每一步之后 TLC 也检查规则，即使它经另一条路到达下一状态。TLC 某条规则的最短路径以这种步骤结尾时，图画出该步骤。
- 命令按原样 config 用 TLC 检查规则，单 worker。某条规则被违反时，命令移除该规则再跑 TLC，直到没有规则被违反。首次违反之后，每次运行在 100,000 个不同状态处停，避免大模型跑不完。运行触到该上限或因错误停止时，报告在 "Rules not checked" 下列出未检查的规则，图不给它们标记。未检查的规则可能成立也可能被违反。要检查它，从 config 移除已违反的规则，或缩小模型。该上限会加一个改变 TLC 变量排序的模块，所以对 property，TLC 可能找到与不设上限的运行不同的反例。
- `tlc.out` 是 TLC 按原样 config 打印的输出。图没有展示某条被违反规则的 bug 路径时，`tlc-RULE.out` 是找到它的那次运行的 TLC 输出。TLC 重复其首条警告时，裸 TLC 打印两次，但 `tlc.out` 只显示一次，因为 TLC 没把第二份放进本命令读取的输出。这只发生在 Java 以 `-XX:+UseParallelGC` 运行时，否则 TLC 的首条警告是建议传该 flag，只打印一次。

## 展示图

把 `chart.mmd` 以 `mermaid` 代码块展示给用户。图的预算是 500 个状态，由 TLC 按原样 config 计数。超出后图只画通往被违反规则的路径；没有规则被违反时，命令不写 `chart.mmd`。它仍检查每条规则，报告给出状态数和每条 bug 路径。想看全图，就缩小模型。

用 Pele 渲染图。用户要图片，或图大到没法当文本读时，按 `references/render.md` 做。除非用户要求，不用别的渲染器。

## 交接

把每张图及其 Mermaid 文本交给必须拍板的人。每个 bug 加一行：规则、读者对那条规则的说法、报告编号的路径。说明模型没覆盖什么。给出能重新生成这些文件的命令，配新的 `--out` 目录。

模型描述的是代码时，把每条 bug 路径在真实代码上回放，做成测试或实测复现，一个 action 一步。bug 没出现时，先认定模型错了，直到你证明它没错。
