---
name: show-me-your-work
description: "为长时间或无人值守的工作保留可审阅的决策记录：一个 TSV 日志，每个决策一行（做了什么、为什么、证据、结果）。默认留在本地；审阅者需要靠这份记录才能信任结果时才提交。用于 /show-me-your-work、自主或多阶段运行，或人类离开后回来审阅的工作。"
disable-model-invocation: true
---

# Show me your work

只维护一份权威日志。

## 格式

单个 TSV 文件，每个决策一行。单元格保持单行。证据是指针，不是段落。

复制 `references/decision-log-template.tsv`（表头行）来开一份干净的日志。各列：

- **ts。** ISO8601 时间戳。
- **phase。** 阶段或工作流。
- **decision。** 选择了什么或做了什么，一行。
- **why。** 用平实的话写原因。如果是某条原则驱动的，直接说明白，不写成行话标签。
- **evidence。** 能证明它的链接或路径：提交 SHA、PR 编号、`file:line`，或产物、trace、截图的路径。绝不写一段话。
- **result。** 结果或判据状态：`tests green`、`reverted`、`pixel-diff 0`、`INCONCLUSIVE`、`open`。

一个示例，用平实的话写，让审阅者一眼读懂。

```
ts	phase	decision	why	evidence	result
2026-05-24T09:02:00Z	frame	counted the work first, about 100 components and roughly 75 hours	wanted to know the size before starting a long run	commit 3a9f1c2	found 5 things to sort out before starting
2026-05-24T09:40:00Z	harness	took screenshots of the old version before changing anything	so we can compare old against new and catch any visual change	scripts/snapshot.sh, baseline/	saved 120 reference screenshots
2026-05-24T11:15:00Z	widget	moved the widget styles over without changing how it looks	keep the change small and the result identical	commit 7c21e0a, pixel-diff 0	looks identical, tests pass
2026-05-24T12:30:00Z	widget	threw out a helper's work because its screenshots were blank	checked the real files instead of trusting its summary	worktree reset	reverted, tightened the instructions for next time
```

## 记一行

每条记录都像对队友讲你做了什么那样写。平实的词、具体的动作，不用 AI 腔和抽象行话（**unslop** 技能同样适用于日志文字）。

用辅助脚本 `scripts/log.sh <logfile> <phase> <decision> <why> <evidence> <result>`。它会打 `ts` 时间戳、首次使用时写表头、剔除多余的 tab／换行，并给以 `=`、`+`、`-`、`@` 开头的单元格加单引号前缀。裸 `printf` 追加一行也行，但单元格来自生成或用户提供的文本时，注意同样这些字节。

记决策点和检查点，不是每个动作：选定的分岔、完成并附验证结果的单元、带触发原因的转向或回滚、浮出的阻塞、修好的检验关口。循环运行每次迭代一行。琐碎和不言自明的跳过。

一次运行（run）是一个智能体会话，包括它后续的轮次和对它的任何总结。续接、替换的智能体、或新聊天都开启一次新运行。一次运行往已有行的日志里追加时，它的第一行 phase 为 `start`；跟在另一次运行的 `start` 行之后的第一行也是。所以在后续轮次回到日志的运行，先读日志最后几行，看是否有别的运行写入过。`start` 行写明它之前、非本次运行写入的行的 `ts` 范围，其 evidence 标明本次运行，比如它的 agent id。phase `start` 不作他用。

## 存放位置

默认日志是工作产物，不提交。放在工作目录的 `decisions.tsv`，多项工作并行时放 `.audit/<task-slug>.tsv`，不进 git。

只有工作大到审阅者需要靠这份记录才能信任结果时才提交。

## 规则

- 只追加。错误的判断用新的一行取代它。绝不编辑或删除历史。
- 优先用已提交脚本产生的证据，而不是手工的一次性产物（**encode-lessons-in-structure** 原则技能）。

## 对照会话记录审计日志

运行结束、交还之前，检查日志说的是不是真话。读本次运行在活动工作区 `agent-transcripts/` 目录下的会话记录（系统提示词写明了路径）。不要跨 `~/.cursor/projects/*/` 做 glob，那会读到无关的私密聊天。把本次运行的行逐一对照实际发生的事。每段行从本次运行的某个 `start` 行开始（本次运行创建了日志的话从第一行开始），到另一次运行的下一个 `start` 行结束：

- 检查每一行都对应一个真实的决策或动作。
- 检查每行的 evidence 能解析，且展示了该行声称的内容。
- 影响了工作走向、却没记录的分岔、转向或放弃的方案是缺口。补上。

修正日志，不修正故事。审计绝不编辑或删除任何行，编造的也不行。某行既没记录真实决策也没记录真实动作、或其声称或证据有误时，加一行取代它，写明实际发生的事和一个能解析的指针。本审计不检查本次运行段落之外的行。本次运行自己的工作表明其中某行有错时，像对待任何错误判断一样取代它。

## 记录的跨模型评审

交还之前，派生一个子智能体，用与做工作的模型不同厂商的模型。自我评审不能替代。子智能体读审计记录和本次运行的会话记录，然后标出用户该注意的地方。不是重做工作，是扫描次优或有风险之处。按 **poteto-mode** 技能的 Subagents 一节，为每个子智能体挑选适合工作的推理档位。

- 证据薄弱或缺失的决策记录。
- 被跳过的验证步骤，或会话记录里没有证明却声称做过的。
- 事后看来有风险的选择（过早、范围蔓延、糊住症状）。
- 用户随手一翻会漏掉的缺口。

产生了记录的运行，每条回复都以 "Attention" 一节收尾。第一行单独写评审者的模型（`reviewed by <model>`），然后逐条列出标记，指向具体的行或时刻。「No flags」是有效取值。只写模型名不是。

## 审阅这份记录

从头读到尾，跟着证据指针抽查。GitHub 把提交的 TSV 渲染成表格。`column -s$'\t' -t decisions.tsv` 在终端里渲染它。

## 组合本技能

其他技能把审计记录路由到这里，而不是自造一套。按名字引用它，格式归它管。不要复述各列定义。
