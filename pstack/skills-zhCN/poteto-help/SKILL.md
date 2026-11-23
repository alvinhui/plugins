---
name: poteto-help
description: 引导用户完成 pstack 安装、使用 /poteto-mode，并为任务挑选技能、playbook 或原则。输入 /poteto-help 加问题即可。
disable-model-invocation: true
---

# Poteto help（pstack 帮助）

回答用户关于 pstack 的问题，递给用户一条可直接发送的提示词，并链接答案来源文件。帮助类问题不要开工。用户问的是怎么做，而一次 pstack 运行花的是真金白银的 token，让用户自己发提示词。

要求干活的消息，如「use pstack to fix this bug」（用 pstack 修这个 bug），不是帮助类问题。读 [`poteto-mode`](../poteto-mode/SKILL.md)，按它干活，并提一句 Custom Mode 能让它持续生效。

本文件把问题映射到持有答案的技能和指南页。细节归那些文件所有。引用前先读你路由到的文件；它与本地图冲突时，以它为准。这里的链接指向已安装的插件，用户可能打不开，所以给用户文件的公开副本：`https://github.com/cursor/plugins/blob/main/pstack/` 加上其路径。

## 弄清用户要什么

从消息和对话推断需求。点名了场景的，如「哪个技能评审 PR？」，直接进对应章节。需求仍不明时，问一个多选题，选项如下，然后只回答选中的章节：

- 完成安装
- 用 `/poteto-mode` 开始任务
- 为场景挑技能
- 修复跑偏的运行
- 把 pstack 变成自己的

检查会改变答案的状态，只在真有改变时才提：

- 没有 `~/.cursor/rules/pstack-models.mdc`，说明该用户没跑过 `/setup-pstack`，每个角色都用默认模型。
- 项目里没有 `verify-*` 技能或其他应用执行框架，说明智能体没有脚本化驱动应用的手段。问题涉及证明改动有效时，提 `/create-verification-skill`。
- 项目里没有形式化验证技能，说明测试覆盖之外的性质没有被检查。问题涉及竞态、不变量或其他测试很少命中的情况时，提 `/create-formal-verification-skill`。已有该技能、且它覆盖的代码在其记录的最后同步提交之后改过时，问题碰到那段代码就提 `/maintain-formal-verification-skill`。

模型规则缺失且确有影响的，问用户要不要现在就为每个角色选模型和推理预算。有影响的场景：用户是新手、问题关于安装或成本、答案取决于跑哪些模型。每个会话至多问一次。需求也不明时，两个问题一起问。给两个选项：

- 现在：给用户 `/setup-pstack` 去输入，同时回答用户的问题。
- 稍后：回答用户的问题，加一行说明在跑 `/setup-pstack` 之前每个角色都保持默认模型。

## 完成安装

1. 在会话里用 `/add-plugin pstack` 安装，或从侧栏 Customize 安装。
2. 运行 [`/setup-pstack`](../setup-pstack/SKILL.md)。它会问推理预算、给每个角色配模型、写一条规则。规则对新会话生效。然后除非项目已有，它会各提议一次为项目生成验证技能和形式化验证技能。
3. 用 `/poteto-mode` 加一个目标、一个能判通过或失败的检查，开始真实任务。

安装本身什么都不改变，直到用户调用技能。只有 `/setup-pstack` 会从用户的话里自动加载。细节见 [README](../../README.md) 和[指南第 1 页](../../docs/guide-zhCN/01-setup.md)。按 [`references/prompting.md`](references/prompting.md) 主动帮用户措辞第一条提示词。

担心成本时，说清 token 花在哪、怎么少花。pstack 的额外 token 花在子智能体和评审组上。重跑 `/setup-pstack`，选更小的预算或更便宜的模型。设为 `auto` 或 `inherit-parent` 的角色跑会话的模型，会话用 Auto 或更便宜的模型时就省 token。评审组名单越短，跑的子智能体越少，一个条目一个。把 `/poteto-mode` 留给需要严谨的工作。

pstack 为 Cursor 而建，也能装进 Claude Code：先 `/plugin marketplace add cursor/plugins`，再 `/plugin install pstack@cursor-plugins`。在那里每个命令加 `pstack:` 前缀，如 `/pstack:poteto-mode`。[Claude Code 适配器](../../docs/harness/claude-code.md)映射了 Cursor 的名字；需要 Cursor 独有功能（如 Bugbot 或 Automations）的步骤会跳过并留一行说明。

其他工具能读这些技能，因为它们用 Agent Skills 格式。但多数工作流技能——包括 `/poteto-mode`、`/how`、`/teach`——会派 Cursor 子智能体，有的按角色配模型，而 Custom Modes 和 `/loop` 是 Cursor 功能，所以那些部分在别处可能不工作。

## 用 `/poteto-mode` 开始任务

`/poteto-mode` 把任务匹配到一个 playbook，把 playbook 的步骤抄进待办列表，按步骤需要运行其他技能。好的提示词说清目标和怎么判断完成，不罗列技能，因为手写的顺序容易丢掉或打乱 playbook 本会保留的步骤。帮用户措辞前先读 [`references/prompting.md`](references/prompting.md)。示例见[指南第 2 页](../../docs/guide-zhCN/02-poteto-mode.md)。

`/poteto-mode` 是否持续生效取决于用户怎么启动：

- 对 `/poteto-mode` 按 Enter，技能只附着一条消息，随会话推进而淡出。
- Mac 上 Option+Enter、Windows 上 Alt+Enter，或从技能条目选 Use as Mode，会把它变成 Custom Mode。每轮都在上下文里，直到用户退出该模式，闲聊轮次不受影响。
- Cursor 文档列出了 Agents Window 和 CLI 里的 Custom Modes。其他地方，每个新任务都用 `/poteto-mode` 开头。

谈到这个时链接 [Cursor 的技能文档](https://cursor.com/docs/skills)。会话中途说 "new task"（新任务）会让模式匹配新的 playbook。`/poteto-mode` 的 playbook 步骤派子智能体时已经用 `poteto-agent`。想让自己派的子智能体也有同样风格，用 `subagent_type: "poteto-agent"` 派它。

## 挑技能

默认答案是 `/poteto-mode`，它的步骤需要时会运行其余大多数技能。用户想要比 playbook 给的更多或更少时，直接点名技能。推荐前先读该技能，并给一条示例提示词。

| 用户想要 | 技能 |
|---|---|
| 严谨地做任何非平凡任务 | [`/poteto-mode`](../poteto-mode/SKILL.md) |
| 开工前确认智能体理解了目标和问题 | [`/in-your-own-words`](../in-your-own-words/SKILL.md) |
| 发送前把提示词改得更深而不是更大：顶尖专业人士会补充什么、原始素材和方法、外部检查。它返回提示词，不做任务 | [`/sharpen`](../sharpen/SKILL.md) |
| 了解代码现在如何工作，或新代码该放哪 | [`/how`](../how/SKILL.md) |
| 了解代码为何长这样，或某个数字从哪来 | [`/why`](../why/SKILL.md) |
| 用平实讲解理解一个改动或子系统 | [`/teach`](../teach/SKILL.md) |
| 补上自己近期在某主题上的工作进展 | [`/recall`](../recall/SKILL.md) |
| 用平实的话和小图同步本会话自上一条消息以来的变化，逐项列出等用户拍板的事项，只凭回复即可拍板 | [`/ketchup`](../ketchup/SKILL.md) |
| 像 `/ketchup` 一样同步，用带字幕的幻灯片短视频，等拍板的决策以文字放在视频下 | [`/ketchup-video`](../ketchup-video/SKILL.md) |
| 知道一个小 diff 可能弄坏自身之外的什么 | [`/blast-radius`](../blast-radius/SKILL.md) |
| 写跨函数边界的代码前定下类型和模块形态 | [`/architect`](../architect/SKILL.md) |
| 同一份任务简报跑多次尝试，合并出最好的一份 | [`/arena`](../arena/SKILL.md) |
| 以云端智能体对切片并行检查，或让工作智能体竞速 | [`/swarm`](../swarm/SKILL.md) |
| 让不同模型评审 diff 并试图击破它 | [`/interrogate`](../interrogate/SKILL.md) |
| 有廉价本地测试时，测试先行修 bug | [`/tdd`](../tdd/SKILL.md) |
| 对 `.ts` 或 `.tsx` 工作应用 TypeScript 规则 | [`/typescript-best-practices`](../typescript-best-practices/SKILL.md) |
| 评审前剥掉注释，用没写过它们的评审者 | [`/no-comments`](../no-comments/SKILL.md) |
| 清除文字里的 AI 痕迹 | [`/unslop`](../unslop/SKILL.md) |
| 按标准写文档、RFC、README、PR 描述或提交信息 | [`/technical-writing`](../technical-writing/SKILL.md) |
| 用平实的话再听一遍上一条回复 | [`/bro`](../bro/SKILL.md) |
| 给智能体脚本化驱动应用、证明行为的手段 | [`/create-verification-skill`](../create-verification-skill/SKILL.md) |
| 让验证技能及其功能地图与应用重新对齐 | [`/maintain-verification-skill`](../maintain-verification-skill/SKILL.md) |
| 形式化验证竞态、不变量等测试很少触达的性质 | [`/create-formal-verification-skill`](../create-formal-verification-skill/SKILL.md) |
| 覆盖的代码变更后让形式化验证重新对齐，并判明失败是漂移还是 bug | [`/maintain-formal-verification-skill`](../maintain-formal-verification-skill/SKILL.md) |
| 把用户看到的东西画成经 TLA+ 模型检查的图给 PM 或设计师看，附通往每个违反规则状态的最短路径 | [`/statechart`](../statechart/SKILL.md) |
| 报告或依据性能数字行动前先审查它 | [`/benchmark-checklist`](../benchmark-checklist/SKILL.md) |
| 运行大型或横切改动，或离开后要回头评审的运行 | [`/figure-it-out`](../figure-it-out/SKILL.md) |
| 运行期间记决策日志，事后复盘 | [`/show-me-your-work`](../show-me-your-work/SKILL.md) |
| 为每个角色选模型和推理预算 | [`/setup-pstack`](../setup-pstack/SKILL.md) |
| 把自己的工作习惯变成个人 mode 技能 | [`/automate-me`](../automate-me/SKILL.md) |
| 把做完的任务的教训变成技能修改 | [`/reflect`](../reflect/SKILL.md) |
| 阻止智能体在本仓库重复同样的错误 | [`/correct`](../correct/SKILL.md) |
| 构建按钮通过 webhook 唤醒 Grok Bot 的页面 | [`/make-bot-ui`](../make-bot-ui/SKILL.md) |
| 在 pstack 里找路 | `/poteto-help` |

与本文件相邻的技能目录没进表格时，读它的 frontmatter，按 description 路由。`principle-*` 目录由下面的原则部分覆盖。

易混的选择：

- `/how` 解释代码做什么。`/why` 解释原因。`/teach` 跑其一或两者，并平实讲解结果。
- `/arena` 给每个工作智能体同一份任务简报，合并最好的部分。`/swarm` 把工作切成切片或竞速，返回一份报告。
- `/interrogate` 评审 diff。`/blast-radius` 找 diff 之外的破坏，并证明让改动安全的那一个事实。
- `/recall` 跨近期会话重建上下文。`/ketchup` 只覆盖本会话自用户上一条消息以来。接续某个特定会话或分支走 Session pickup playbook。
- `/figure-it-out` 设计一次严谨的运行。Autonomous run playbook 把一个任务推到完成条件。

不在 pstack 里：

- `/deslop`、`control-cli`、`control-ui` 随 `cursor-team-kit` 插件分发。
- `/loop` 和 `/create-skill` 是 Cursor 内置。
- pstack 没有 `/orchestrate` 技能。斜杠菜单里出现 `/orchestrate` 时，那是别的插件提供的。

## Playbook 与原则

Playbook 是 `/poteto-mode` 内部的步骤清单，不是技能，所以没有斜杠命令。在 `/poteto-mode` 里描述任务即可选中一个，这些短语直接点名：

- "babysit this pr"（看护这个 PR）或 "check on pr 123"（查一下 PR 123）运行 Babysit。它把 PR 推到可合并状态就停。用户没说 merge、land 或 ship 就不合并。
- "land the stack"（合并这个 stack）运行 Shipping。
- "take over this branch"（接管这个分支）运行 Session pickup。
- "pause safely"（安全暂停）运行 Pause safely。
- "full autopilot on this queue"（这个队列全自动）运行 Autopilot-full。"autopilot, don't merge"（自动驾驶，别合并）运行 Autopilot-stack。
- "run the eval playbook"（跑评测 playbook）运行 Eval。

没有 `/poteto-mode` 时，"babysit this pr" 这类短语可能启动 Cursor 自带的同类技能。[`poteto-mode`](../poteto-mode/SKILL.md) 的 Playbooks 一节列出全部 playbook。[指南第 6 页](../../docs/guide-zhCN/06-verify-and-ship.md)覆盖开 PR、看护和合并。

pstack 没有规划技能。Cursor 的 Plan Mode 与它并行工作。跨阶段或叠 stack 的工作，向 `/poteto-mode` 要计划会运行 [Multi-phase plan playbook](../poteto-mode/playbooks/multi-phase-plan.md)，它写计划、不实现。设计问题由 Prototype playbook 或 `/architect` 先用代码定夺。

原则是单规则技能，`/poteto-mode` 读取并在回复中引用。用户很少直接调用，而是用名字转向，如 "apply prove it works. show me the real output."（应用 prove it works，给我看真实输出）。输入 `/principle-<name>` 仍能按需加载。清单见[指南第 8 页](../../docs/guide-zhCN/08-principles.md)。

## 修复跑偏的运行

| 症状 | 修复 |
|---|---|
| 模式几轮后不再生效 | 它是用 Enter 启动的。以 Custom Mode 启动，或每个任务都用 `/poteto-mode` 开头。 |
| 提问被当成上一个任务的下一步 | 说 "new task"（新任务），或说明这一轮不需要该模式。 |
| 新选的模型没生效 | `/setup-pstack` 写的规则对新会话生效。开一个新会话。 |
| 运行比预期贵 | 见「完成安装」下的成本段落。 |
| 技能没有自动加载 | 只有 `/setup-pstack` 会从用户的话里加载。其他技能在用户输入或 `/poteto-mode` 运行时加载，而它不会运行每个技能。 |
| 并行智能体互相覆盖 | 给每个智能体自己的 worktree，或以云端智能体运行，各有一台机器。 |
| 通宵运行有动静却没完成任何事 | `/loop` 需要能判通过或失败的检查，不是时长。见[指南第 7 页](../../docs/guide-zhCN/07-overnight.md)。 |
| 回复凭构建通过就宣布成功 | 要真实的命令、流程、存储值或 profile。这就是 prove-it-works 原则。 |

运行漂移时，[`references/prompting.md`](references/prompting.md) 有一行式转向语。更多坑和值得抄的配方见[指南第 10 页](../../docs/guide-zhCN/10-recipes-and-pitfalls.md)。

## 把 pstack 变成自己的

- [`/automate-me`](../automate-me/SKILL.md) 从用户自己的历史起草个人 mode 技能，与 `/poteto-mode` 搭配使用。
- 会话结束后跑 [`/reflect`](../reflect/SKILL.md)，把教训变成用户批准的技能修改。
- `/poteto-mode write a skill for <workflow>` 运行编写 playbook。eval playbook 对技能改动做盲测。
- 行为不对的技能在它自己的 PR 里修，不要混进出问题的 feature 工作里。

以上各项见[指南第 9 页](../../docs/guide-zhCN/09-make-it-yours.md)。

## 回复

答案先行。至多给一条代码块里的示例提示词，有合适的就从 [`references/recipes.md`](references/recipes.md) 改编，然后链接该文件。保持简短，除非用户要整张地图。
