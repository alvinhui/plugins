# 用 /poteto-mode 分派任务

`/poteto-mode` 是入口指令。你给它一个目标，它从二十二个 playbook 里匹配一个，把该 playbook 的步骤抄进待办列表，再按每一步的需要调用其他技能。这一页讲清楚好提示词长什么样，以及它其实可以有多短。

![调度员扳动道岔，把坐着轨道手推车的机器人引向亮灯的闸口，头顶的 /poteto-mode 发车牌上写着 BUG FIX、FEATURE 和 INVESTIGATION。](./images/router.jpg)

## 你的提示词会经历什么

```mermaid
flowchart TD
    A[你的提示词] --> B[poteto-mode]
    B --> C[读取 Principles 小节]
    C --> D{匹配任务}
    D -->|只读提问| E[Investigation]
    D -->|缺陷| F[Bug fix]
    D -->|新行为| G[Feature]
    D -->|只动结构| H[Refactoring]
    D -->|实测变慢| I[Perf issue]
    D -->|大工程或没匹配上| J[figure-it-out]
    E --> K[验证并报告]
    F --> K
    G --> K
    H --> K
    I --> K
    J --> K
```

图里画的是常见路线。除此之外还有这些 playbook：把某个指标持续往上推、诊断线上症状和抓到的 trace、做原型、像素级视觉对齐、编写和评测技能、自主长跑、提 PR、把 PR 或 stack 盯到可合并、落地一整个已验证的 stack、让 PR 队列或 stack 自动驾驶、接手旧会话、安全暂停、多阶段计划，以及清理 worktree。完整清单见 [playbook 目录](../../skills/poteto-mode/playbooks/)。

## 说目标，别写流程排场

不用写需求文档。说清楚哪里出了问题、或者你想要什么，再补上你已经知道的、能替智能体省时间的信息：

```text
/poteto-mode users get two notifications after a retry. repro first, then fix and verify.
```

这是一条 Bug fix 提示词。"repro first"（先复现）是实打实的约束，不是客套话，playbook 会照办。你会看到待办列表被 Bug fix 的步骤填满。

## 提示词里该写什么

一条好用的提示词最多带五样东西，每样一句话就够：

- **目标。** 哪里出了问题，或者你想要什么。
- **完成判据。** 必须能判定通过或失败。"改好一点"和"花一小时弄这个"都不算判据。
- **你想看到的证据。** 明确要真实的命令输出、操作过程的录屏、写进去的值，或者前后对比的数字。
- **你已经知道的线索。** 一个症状、一步复现、一行日志或一个链接，都能替智能体省掉一轮翻找。
- **真正的约束。** "repro first"、"先别改代码"、"行为零变化"、"继续之前先给我看"，每一条都会改变智能体的做法。

五样齐全的一条长这样：

```text
/poteto-mode the csv export drops its last row since yesterday's deploy. failing job id is 4812. repro first, then fix. done means the 60k-row fixture exports every row. show me the row counts before and after.
```

有两样东西反而该省掉：

- **怎么做。** 只说要达成什么，把选路的余地留给智能体，它可能找到比你设想更好的走法。技能清单同理，见本页末尾的坑。
- **你对病因的猜测，至少一开始别给。** 猜测一旦说出口，排查范围就被钉在你指的那块地方。先让智能体自己把问题复述一遍，再聊你的直觉。

碰上信息嘈杂的报告，比如很长的讨论串或描述含糊的 bug，把复述当成第一步：

```text
/poteto-mode read this thread. restate the underlying issue in your own words, in plain english. don't change any code yet.
```

理解偏差会在复述里露出来，而这会儿还一行代码都没写。当场纠正只花一条消息，晚了就得赔上一次改错的修复。只想要复述、不想启动 playbook，就用 [`/in-your-own-words`](../../skills/in-your-own-words/SKILL.md)：它会把智能体理解的目标和要解决的问题原样讲给你听。

拿不准提示词的方向对不对，发出去之前先用 [`/sharpen`](../../skills/sharpen/SKILL.md) 磨一遍：

```text
/sharpen write a migration guide for the v2 config format.
```

智能体会指出四件事：顶尖行家会做、而你没要求的事；他们会从哪些最原始的材料入手；他们会用什么方法和工具；以及除了你和智能体的主观判断，还有什么能证明结果是对的。然后它据此重写你的提示词——挖得更深，而不是摊得更大。重写版会要求智能体：凡是能用实验定下来的选择就先做原型，再基于观察结果给出推荐；产品取向和个人偏好类的选择仍然留给你。它不会直接执行任务。你读一遍重写版，觉得对了再发出去，比如交给 `/poteto-mode`。

## 追问可以很短

上下文已经在对话里了，追问就能短到几乎不存在。下面这些都够用：

```text
/poteto-mode do it
```

```text
continue
```

```text
keep going until done
```

短之所以行得通，是因为流程结构由 playbook 扛着，而 Custom Mode 让 `/poteto-mode` 每一轮都留在上下文里。开启方法见[配置 pstack](./01-setup.md#跑第一个任务)。意图由你的话传达，严谨由技能兜底。

## 用 "new task" 切换任务

聊天一长，上一个任务的上下文就会一直堆在里面。换话题时要明说：

```text
/poteto-mode new task. figure out why the cache entry survives logout. don't change any code yet.
```

"new task" 让 `/poteto-mode` 重新匹配 playbook，而不是接着上一个跑；"don't change any code yet" 把这次锁定在 Investigation。少了这两句，正跑 Feature 跑到一半的模式，多半会把你的新问题当成功能开发的下一步。

## 并行任务各用一台机器

在一台电脑上对同一个仓库开多个智能体，它们会抢工作区、抢端口、抢构建产物。最干净的隔离是 [cloud subagent](https://cursor.com/docs/subagents#cloud-subagents)：每个子智能体独占一台虚拟机和一个分支，装依赖、跑应用、录结果视频都在云端完成，完全不碰你的机器。在任务前输入 `/in-cloud`，或者直接让父聊天把活派给云端子智能体。

活必须留在本地时，开口就要一个 worktree：

```text
/poteto-mode new task. branch off <base> in a fresh worktree, then port the parser change there.
```

每个任务独占分支和 worktree，谁也踩不到谁的文件。不过 worktree 吃磁盘也吃机器资源，一台笔记本同时跑不了几个。[Opening a PR playbook](../../skills/poteto-mode/playbooks/opening-a-pr.md) 改代码本来就默认在 worktree 里进行，所以只有当基线分支或目录位置有特殊要求时，你才需要专门交代这句。

worktree 会越攒越多。磁盘吃紧时问一句：

```text
/poteto-mode what's eating my disk? prune the worktrees that are safe to prune.
```

[Worktree cleanup playbook](../../skills/poteto-mode/playbooks/worktree-cleanup.md) 会按合并状态、有没有未提交的改动、还有哪些聊天在用它，给每个 worktree 分类。只有证据齐全、确认能删的才删；凡是还压着未提交改动的，都会停下来等你拍板。

## 让它自己跑下去

要离开时，把"做完"的标准说清楚，然后就可以走：

```text
/poteto-mode im stepping away. keep going until the migration check reports zero old callers. log your decisions.
```

这类事后才审阅的活会交给 [`/figure-it-out`](../../skills/figure-it-out/SKILL.md)：它先设计整个长跑的阶段，并全程维护一份 [`/show-me-your-work`](../../skills/show-me-your-work/SKILL.md) 决策日志。完整的过夜约定见[睡觉时也让任务继续跑](./07-overnight.md)。

**坑：** 别在提示词里排技能清单（"use /architect, then /arena, then /interrogate..."）。playbook 已经排好了顺序，手写的顺序往往会打乱、甚至漏掉 playbook 本来会做的步骤。只有想推翻某个具体选择时，才点名技能。

完整的分派规则读 [`poteto-mode`](../../skills/poteto-mode/SKILL.md) 技能本身。

下一步：[先读懂代码，再动手改](./03-understand.md)。
