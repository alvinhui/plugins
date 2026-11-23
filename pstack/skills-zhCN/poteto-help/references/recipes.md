# 值得复制的提示词

换上真实的路径、技能和完成检查。口语化的措辞也行。

## 理解

- `/poteto-mode read <thread>. restate the underlying issue in your own words, in plain english.`
- `/in-your-own-words <long or messy ask>`
- `/sharpen <the prompt you're about to send>`
- `/poteto-mode investigate why <symptom>. give me what we know, what data you used, and your best hypotheses. don't change any code yet.`
- `use /how to understand <subsystem>. then use /why to find out why it broke recently.`
- `/recall my work on <topic> from last week, then read <issue>.`
- `/teach me why you implemented it this way and not <other way>. what did you trade off?`
- `/poteto-mode take over this branch. read the decision log, find what's done, and continue. don't redo finished work.`

（大意：读某个 thread 并用自己的话复述根本问题；复述冗长混乱的请求；磨尖即将发送的提示词；调查症状但先不改代码；用 /how 理解子系统再用 /why 查最近为何坏掉；召回上周在某主题上的工作再读 issue；讲解为何这样实现而非另一种、取舍是什么；接管分支、读决策日志、接着做未完成的部分。）

## 构建

- Bug：`/poteto-mode <symptom>. repro first, then fix and verify.`
- 应用里的 Bug：`/poteto-mode repro this with /verify-<app>. if it repros on main, fix it and show me a video as proof.`
- 有便宜测试路径的 Bug：`/poteto-mode repro <bug> first. if there's a cheap test path, /tdd it. then fix and rerun.`
- 功能：`/poteto-mode add <behavior>. <current output> stays byte-identical. verify both.`
- 重构：`/poteto-mode move <code> into one module, zero behavior change. record the current output first and prove it's unchanged after.`
- 性能：`/poteto-mode <operation> takes <time> on <fixture>. trace it, fix the measured cause, show me before and after.`

（大意：先复现再修复并验证；用 /verify-<app> 复现、main 上也复现就修并给视频证据；有便宜测试路径就走 /tdd；加新行为但既有输出逐字节不变、两者都验证；把代码收进一个模块、零行为变化、先记录当前输出再证明没变；某操作在某夹具上耗时多少，追 trace、修实测原因、给前后对比。）

## 设计与计划

- `/poteto-mode prototype a few options for <feature>. take screenshots or videos for me to compare.`
- `/poteto-mode we need <feature>. /architect it first, and answer open questions with prototypes. let me review before proceeding.`
- `/poteto-mode write a tutorial for how i would use <new package> first. then /teach me why it beats the current one.`
- `ask /arena for a second opinion on this thread and our approach.`
- `/poteto-mode turn this design into a plan. small verifiable PRs, each with its own verification steps.`
- `/poteto-mode plan the migration of <library> to <target>. small verifiable PRs. the result must match the original exactly, bugs included.`

（大意：为功能做几个原型选项、截图或录视频供比较；先 /architect、悬而未决的问题用原型回答、继续前让我审阅；先写新包的使用教程再 /teach 讲解它为何胜过现用的；让 /arena 给这个 thread 和我们的方案一个第二意见；把设计变成小步可验证、各带验证步骤的 PR 计划；规划库迁移，结果必须与原实现完全一致，缺陷也照旧。）

## 评审与交付

- `/interrogate the whole branch, but skeptically. don't change anything yet. no nitpicks unless it's a real bug or regression.` 也要读 Dropped 清单。
- `/create-formal-verification-skill prove <property> holds in <module>, even when <steps> interleave or retry.` 该代码合并或重构之后：`/maintain-formal-verification-skill`。
- `/swarm check every package under <dir> against its check script. one worker per package. one report.`
- `/poteto-mode open the pr. small ordered commits, evidence in the description.`
- `/poteto-mode babysit this pr. get it green.` 只查状态：`/poteto-mode check on pr <number>. anything outstanding?`
- `/poteto-mode land the stack.`

（大意：怀疑地对抗性评审整个分支、先不改任何东西、非真 Bug 或回归不挑刺；证明某性质在某模块中即使步骤交错或重试也成立；对目录下每个包跑其检查脚本、一包一工作智能体、汇总一份报告；开 PR、小而有序的提交、描述里放证据；看护 PR 到全绿；合并整个 stack。）

## 离开与回来

- `/poteto-mode im going to bed. <goal> in a fresh worktree off <base>. done means <checks>. keep a decision log. don't ask me before committing. /loop until done. if you're truly stuck after a few hours, stop and write up why.`
- `/show-me-your-work catch me up on what you did last night.` 先读它的 Attention 一节。
- `/ketchup` 让你补上自上一条消息以来本聊天的进展，并列出每一个等你拍板的事项。
- `/poteto-mode full autopilot on this queue. each item is independent.`
- `/poteto-mode autopilot these changes, but don't merge. i'll land them.`
- `/reflect capture what we learned so the next run doesn't repeat it.` 只批准能改变未来决策的编辑。
- `/bro` 用平实的话复述上一条回复。

（大意：我去睡了，在基于某 base 的新 worktree 里完成目标，完成标准是这些检查，记决策日志，提交前不用问我，/loop 到做完，几小时后真卡住就停下写清原因；讲讲昨晚做了什么；对独立条目的队列全自动驾驶；自动驾驶这些变更但不合并、由我来落地；沉淀本次学到的教训。）
