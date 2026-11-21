# 先读懂代码，再动手改

没读懂就改，是隐蔽回归混进线上的头号来源——智能体如此，你自己也一样。智能体翻车通常就两种：要么理解错了你的意图，要么缺了把事做对所需的上下文。前一种靠[提示词里该写什么](./02-poteto-mode.md#提示词里该写什么)解决，这一页解决后一种。

pstack 给了四个切入口。`/how` 讲清代码现在的行为；`/why` 挖出它为什么长成这样；`/teach` 把两者揉成一份讲解；`/recall` 帮你找回自己最近在某个话题上的上下文。它们还有个共同点：逼智能体把话说到你能核对的程度。面对一个可能比你更熟代码的智能体，这就是你的监督手段。

![侦探拿着放大镜研究机器蓝图，机器人分头去调案卷；她身后的证据板上，线索按 /how 和 /why 串成一张网。](./images/understanding.jpg)

## 从只读排查开始

原因还不清楚时，要结论，别要修复：

```text
/poteto-mode investigate why background jobs time out every few hours. give me what we know, what data you used, and your best hypotheses. don't change any code yet.
```

"don't change any code yet" 会把这条提示词分派给 [Investigation playbook](../../skills/poteto-mode/playbooks/investigation.md)。它会顺着代码追下去，涉及设计动机的问题再补一轮 `/why`，最后给出带出处的解释。如果是在几个方案之间做取舍，它会给出推荐加一张权衡对照表。追问 "what data you used"，是为了逼智能体把证据和猜测分开摆。排查结论指向某个修复时，把修复另起一个任务来做。

## 用 /how 追行为

```text
/how do we dedupe notifications? is there an n+1 when we look up subscribers?
```

直接问你真正想问的。[`/how`](../../skills/how/SKILL.md) 读完代码后，会按资深工程师带新人熟悉子系统的标准来讲：运行时流程、关键类型，以及那些不看代码想不到的地方。它开一个只读子智能体去翻代码、写讲解。

## 用 /why 挖历史

```text
/why was the retry limit set to five? does the reason still hold?
```

[`/why`](../../skills/why/SKILL.md) 的答案来自历史记录，不是代码本身。它去读引入这段代码的提交和 PR 讨论，以及后来每次改动留下的记录；线索太薄时再找其他来源。答案会引用作者的原话，把智能体自己的推断明确标成推断，也会直说哪些问题记录里没有答案——"当年没人写为什么"本身就是一种答案。

两者天然互补。怀疑眼前这摊乱码是历史遗留造成的，就用 "do why first then how" 这样的提示词。

## 用 /teach 真正搞懂

```text
/teach me how this PR changes retries. convince me it fixes the cause and not the symptom.
```

[`/teach`](../../skills/teach/SKILL.md) 是给"看摘要不够"的场合用的。它会跑 `/how` 和 `/why`（改动小的话可能只跑一个），把结论揉成一份平实的讲解，一张图接一张图地把理解搭起来。"convince me" 这个提法值得反复用：它把讲解变成一场你能检验的论证，而不是一次走马观花式的导览。

它同样能用来盘问智能体自己的决策：

```text
/teach me why you implemented it this way and not with a queue. what did you trade off, and why?
```

讲解对智能体的收益不比对你小。要给别人讲明白，它就必须真去读代码、给每个论断配上证据，而不是语气笃定地说完就翻篇。

## 用 /recall 找回自己的上下文

```text
/recall catch me up on the export work from last week
```

[`/recall`](../../skills/recall/SKILL.md) 会翻你自己最近的聊天，再加上公共记录（issue、之前的修复、还在报的错），给你一份简报：事情到哪一步了、接下来做什么。旧聊天里存着新智能体没有的上下文，所以老话题上开新活，先加载旧上下文，再递新输入：

```text
/recall my work on the virtualized list from yesterday, then read this bug report.
```

要接着某个具体聊天往下干，用的是下面的 Session pickup playbook，不是 `/recall`。

## 用 Session pickup 接手别人的活

另一个智能体（或者上周的你）把一个分支干到一半撂下了：

```text
/poteto-mode take over this branch. read the decision log, figure out what's done, and continue from there. don't redo finished work.
```

[Session pickup playbook](../../skills/poteto-mode/playbooks/session-pickup.md) 把前人留下的记录当作事实依据。它重建分支状态和已有决策，指出从哪里接着干，并拿最初的目标去核验继承来的结论，而不是从头把所有东西重推一遍。

**坑：** 别拿"反正智能体会自己读代码"当理由跳过这一页的技能。没把代码脉络摸清就动手的智能体，往往在第一个看着顺眼的地方治标不治本。先跑一遍 `/how`，比再修一个 bug 便宜得多。

下一步：[写代码之前先定设计](./04-design.md)。
