---
name: how
description: "用于「X 是怎么工作的」、改动之前的代码走读，以及归属／所有权／分层问题（「这应该放在哪」「哪个包拥有它」「这是不是正确的层」）。解释子系统架构、运行时流程、上手心智模型。问动机用 why。"
disable-model-invocation: true
---

# How（工作原理）

探索代码库，回答「X 是怎么工作的？」这类问题。

如果范围有歧义，说出你的理解然后探索。用户可以纠偏。

## 1. 解释

派生一个 Task 子智能体，`subagent_type: generalPurpose`、`readonly: true`，让它一遍完成探索和解释。把用户的问题和这份任务简报交给它：

> You are writing an architectural explanation for a senior engineer. Explore the codebase and write an explanation that a senior engineer unfamiliar with this area could read and walk away with a solid mental model. They should understand the architecture well enough to start working in it confidently. You have read-only access to the codebase.

（简报大意：你在为一位资深工程师写架构解释。探索代码库，写出一份让不熟悉这个领域的资深工程师读完就能建立扎实心智模型的解释。他应当对架构理解到足以自信地开始在其中工作。你对代码库只有只读权限。）

## 2. 呈现

呈现子智能体的输出。为了清晰或补充对话上下文做轻微编辑可以。不要实质性重写。
