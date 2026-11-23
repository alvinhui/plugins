---
name: interrogate
description: "用于「interrogate」「对抗性评审」「多模型评审」「挑战一下」「给这段代码做压力测试」「找盲点」「把它撕开」。对抗者尝试击破一个变更或设计，只有被实际运行证明的发现才能存活。"
disable-model-invocation: true
---

# Interrogate

对抗者尝试击破一个变更或设计。一条发现只有被实际运行证明才存活。报告发现。不做修复。

## 定框

范围以用户点名的为准。否则是分支相对基线分支 merge base 的 diff，含工作区。用 **in-your-own-words** 技能，根据用户消息、提交和 PR 描述陈述意图。意图不清楚时问用户。

## 并行分发

运行 **arena** 技能的阶段 A 第 3、4 步和阶段 B，做四处替换。读 `interrogate reviewers` 行，替代 `arena runners`。把范围内的未提交改动复制进每个 worktree。每个对抗者以 `generalPurpose` 派生。用范围、意图和下面这份任务简报，替代 arena 的任务和缘由：

> Break this change. Prove each finding with a run against the real code, such as a failing test, a repro script, or command output that shows the wrong behavior. For a design or plan, run a prototype or probe the current tree. Keep repros in your own worktree. Report each finding with a title, the exact command, the output it printed, and the output the intent requires. Leave out anything you did not run. That covers style, naming, structure, and risks that need a future change to matter. No findings is a valid result.

（简报大意：击破这个变更。每条发现都用一次针对真实代码的运行来证明，比如失败的测试、复现脚本、或展示错误行为的命令输出。对设计或计划，跑原型或探查当前代码树。复现留在你自己的 worktree 里。每条发现报告标题、确切命令、它打印的输出、以及意图要求的输出。没跑过的东西一律不报，包括风格、命名、结构、以及要等未来变更才有影响的风险。没有发现是有效结果。）

## 验证

按 arena 阶段 F 重跑每条发现的命令来验证。输出展示了失败、且失败破坏意图时才保留。其余丢弃。共享根因的发现合并。

跳过 arena 的阶段 C、D、E。对抗者找的是不同的失败，所以结论保留每一条验证过的发现，而不是某一个对抗者的清单。

## 输出

- **Intent（意图）**：那段复述。
- **Findings（发现）**：每条验证过的发现，给出命令、输出、它如何破坏意图、以及发现它的对抗者。没有存活者时说「no verified findings」。
- **Dropped（丢弃）**：每个对抗者被丢弃的发现数量及原因。
