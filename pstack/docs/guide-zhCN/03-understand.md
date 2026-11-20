# 先理解代码，再改它

在不理解的情况下改代码，正是那些不易察觉的回归被发布出去的原因，这一点对智能体和对你自己都一样成立。智能体通常以两种方式失败：要么误读了你的意图，要么缺少把事做对的上下文。[提示词里该放什么](./02-poteto-mode.md#提示词里该放什么)处理第一种，这一页处理第二种。

pstack 给你四条入口。`/how` 解释代码现在做了什么。`/why` 挖出它被塑造成这个样子的原因。`/teach` 把两者融进一份解释。`/recall` 重建你自己最近在某个话题上的上下文。每一条还会让智能体用你能核对的措辞解释自己——这正是你监督一个可能比你更懂代码的智能体的方式。

![一位侦探用放大镜研究机器蓝图，机器人则去取案件卷宗；她身后的证据板上，线索被归到 /how 和 /why 之下。](./images/understanding.jpg)

## 从一次只读调查开始

当原因不明时，要的是发现，不是修复：

```text
/poteto-mode investigate why background jobs time out every few hours. give me what we know, what data you used, and your best hypotheses. don't change any code yet.
```

"don't change any code yet" 会把这条路由到 [Investigation playbook](../../skills/poteto-mode/playbooks/investigation.md)。它会追踪代码，为关于动机的问题补上 `/why`，并返回一份带引用的解释。对于多个选项之间的取舍，它会返回一个带权衡表的推荐。问"what data you used"能让智能体把证据和猜测分开。当发现指向某个修复时，把这个修复作为一个新任务开始。

## 用 `/how` 追踪行为

```text
/how do we dedupe notifications? is there an n+1 when we look up subscribers?
```

问出你真正想问的问题。[`/how`](../../skills/how/SKILL.md) 会读代码，并以一位资深工程师带你上手这个子系统的水平来回答，涵盖运行时流程、关键类型和那些不显然的部分。它会启动一个只读子智能体去探索代码并写出解释。

## 用 `/why` 挖历史

```text
/why was the retry limit set to five? does the reason still hold?
```

[`/why`](../../skills/why/SKILL.md) 从记录里找答案，而不是从代码里。它读引入这段代码以及之后每一次改动的提交和 PR 讨论，并在那条线索太稀薄时参考其他来源。答案会引用作者写下的原话，把智能体自己的推断标注为推断，并说明记录没有回答什么——因为"没人写下为什么"本身也是一种回答。

这两者可以自然组合。当你怀疑是历史解释了这个烂摊子时，"do why first then how" 是一条好提示词。

## 用 `/teach` 真正弄懂它

```text
/teach me how this PR changes retries. convince me it fixes the cause and not the symptom.
```

[`/teach`](../../skills/teach/SKILL.md) 用于一份摘要还不够的时候。它会跑 `/how` 和 `/why`（对于小改动，也许只跑其中一个），把发现织进一份朴素的解释，一张图一张图地搭起来。"convince me" 这个说法值得复用。它把解释变成一场你可以检验的论证，而不是一次走马观花。

它也能用在智能体自己的选择上：

```text
/teach me why you implemented it this way and not with a queue. what did you trade off, and why?
```

教学对智能体的帮助不亚于对你。一个必须解释自己工作的智能体，就得去读代码、为每一条论断拿出证据，而不是自信满满地说完就走。

## 用 `/recall` 重建你自己的上下文

```text
/recall catch me up on the export work from last week
```

[`/recall`](../../skills/recall/SKILL.md) 挖掘你自己最近的聊天记录，加上共享记录（issue、先前的修复、仍在报错的错误），交回一份关于现状和下一步的简报。你的旧聊天里装着新智能体所没有的上下文，所以在一个旧话题上开始新工作时，先把它加载进来，再把新的输入交过去：

```text
/recall my work on the virtualized list from yesterday, then read this bug report.
```

如果你想接着某个具体的聊天继续，那是下面要讲的 Session pickup playbook，而不是 `/recall`。

## 用 Session pickup 接手之前的工作

当另一个智能体（或者上周的你）把一个分支留在了半路上：

```text
/poteto-mode take over this branch. read the decision log, figure out what's done, and continue from there. don't redo finished work.
```

[Session pickup playbook](../../skills/poteto-mode/playbooks/session-pickup.md) 把之前的线索当作权威。它重建分支状态和决策，点出续接点，并对照最初的目标核验继承来的论断，而不是从零重新推导一切。

**陷阱：** 别因为"反正智能体也会去读代码"就跳过这一页的技能。一个没有追踪过模型就开始改代码的智能体，往往会在第一个看似合理的地方去治标。先跑 `/how`，比再出一个 bug 更便宜。

下一步：[设计改动](./04-design.md)。