# 先读懂代码，再动手改

没读懂就修改，是隐蔽回归进入线上的主要来源——智能体如此，你自己也一样。智能体失败通常有两种方式：要么误解了你的意图，要么缺少把任务做对所需的上下文。前一种靠[提示词里该写什么](./02-poteto-mode.md#提示词里该写什么)解决，这一页解决后一种。

pstack 提供了四个切入口。`/how` 讲清代码当前的行为；`/why` 追溯它为什么是现在的样子；`/teach` 把两者整合成一份讲解；`/recall` 帮你找回自己最近在某个话题上的上下文。它们还有一个共同点：促使智能体把解释说到你能核对的程度。面对一个可能比你更熟悉代码的智能体，这就是你的监督手段。

![侦探拿着放大镜研究机器蓝图，机器人分头调取案卷；她身后的证据板上，线索按 /how 和 /why 连成一张网。](./images/understanding.jpg)

## 从只读排查开始

原因还不清楚时，要调查结论，不要修复：

```text
/poteto-mode investigate why background jobs time out every few hours. give me what we know, what data you used, and your best hypotheses. don't change any code yet.
```

"don't change any code yet" 会把这条提示词分派给 [Investigation playbook](../../skills/poteto-mode/playbooks/investigation.md)。它会沿代码追踪下去，涉及设计动机的问题再补一轮 `/why`，最后给出带出处的解释。如果是在几个方案之间做取舍，它会给出推荐和一张权衡对照表。追问 "what data you used"，是为了让智能体把证据和猜测分开陈述。排查结论指向某个修复时，把修复作为新任务另行开始。

## 用 /how 追踪行为

```text
/how do we dedupe notifications? is there an n+1 when we look up subscribers?
```

直接问你真正想问的问题。[`/how`](../../skills/how/SKILL.md) 读完代码后，会按资深工程师带新人熟悉子系统的标准来讲解：运行时流程、关键类型，以及那些不看代码就注意不到的地方。它启动一个只读子智能体去阅读代码、撰写讲解。

## 用 /why 追溯历史

```text
/why was the retry limit set to five? does the reason still hold?
```

[`/why`](../../skills/why/SKILL.md) 的答案来自历史记录，不是代码本身。它阅读引入这段代码的提交和 PR 讨论，以及后来每次改动留下的记录；线索不足时再查其他来源。答案会引用作者的原话，把智能体自己的推断明确标注为推断，也会直说哪些问题记录中没有答案——"当时没人写下原因"本身就是一种答案。

两者天然互补。怀疑眼前混乱的现状是历史遗留造成的，就用 "do why first then how" 这样的提示词。

## 用 /teach 真正理解

```text
/teach me how this PR changes retries. convince me it fixes the cause and not the symptom.
```

[`/teach`](../../skills/teach/SKILL.md) 适用于"只看摘要不够"的场合。它会运行 `/how` 和 `/why`（改动小的话可能只运行一个），把结论整合成一份平实的讲解，一张图接一张图地建立起理解。"convince me" 这个提法值得反复使用：它把讲解变成一场你能检验的论证，而不是一次走马观花式的导览。

它同样能用来追问智能体自己的决策：

```text
/teach me why you implemented it this way and not with a queue. what did you trade off, and why?
```

讲解对智能体的收益不亚于对你。要把内容给别人讲明白，它就必须真正阅读代码、为每个论断提供证据，而不是语气笃定地说完就转入下一件事。

## 用 /recall 找回自己的上下文

```text
/recall catch me up on the export work from last week
```

[`/recall`](../../skills/recall/SKILL.md) 会检索你自己最近的聊天，再加上公共记录（issue、之前的修复、仍在出现的报错），给你一份简报：进展到哪一步、接下来做什么。旧聊天中保存着新智能体没有的上下文，所以在旧话题上开始新任务时，先加载旧上下文，再提供新输入：

```text
/recall my work on the virtualized list from yesterday, then read this bug report.
```

要继续某个具体聊天的工作，用的是下面的 Session pickup playbook，不是 `/recall`。

## 用 Session pickup 接手既有工作

另一个智能体（或者上周的你）把一个分支进行到一半后搁置了：

```text
/poteto-mode take over this branch. read the decision log, figure out what's done, and continue from there. don't redo finished work.
```

[Session pickup playbook](../../skills/poteto-mode/playbooks/session-pickup.md) 把先前留下的记录当作事实依据。它重建分支状态和已有决策，指出从哪里继续，并用最初的目标核验继承来的结论，而不是从头把所有内容重新推导一遍。

**坑：** 不要以"反正智能体会自己读代码"为由跳过这一页的技能。没有理清代码脉络就动手的智能体，往往在第一个看似合理的位置治标不治本。先运行一遍 `/how`，比再修一个 bug 便宜得多。

下一步：[写代码之前先定设计](./04-design.md)。
