# skills-zhCN 翻译约定

本目录是 `pstack/skills/` 的简体中文镜像，供中文读者阅读。它不被插件加载，插件运行时仍读取英文的 `pstack/skills/`。`docs/guide-zhCN/` 中指向技能的链接指向本目录。

## 范围

- 翻译所有 `SKILL.md`、`playbooks/*.md`、`references/**.md` 和 `poteto-mode/worker.md`。
- `scripts/` 目录整体原样复制，不翻译代码、测试和测试夹具。

## 保持原样的内容

- frontmatter 的键和 `name`、`disable-model-invocation` 等字段的值。`description` 翻译为中文。
- 围栏代码块逐字节保留，包括其中的示例提示词。
- 技能名、playbook 文件名、原则名（如 `principle-prove-it-works`）、斜杠命令（如 `/poteto-mode`）、模型 slug（如 `claude-opus-5-5-xhigh-fast`）、路径、命令、字段名（如 `subagent_type`）和智能体类型名。
- 相对链接的路径。技能之间的链接在本目录内解析；指向 `docs/guide/` 的链接改指 `docs/guide-zhCN/` 的对应页面；指向 `docs/harness/`、`README.md` 等未翻译文件的链接保持不变。
- `unslop` 中的规则编号是其他技能引用的稳定 id，编号和空缺保持不变。英文示例词保留原文，必要时加中文解释。

## 文风

- 正文使用简体中文和全角标点。代码、路径、命令、模型 slug 等专名保留半角原文。
- 短句、主动语态、直接命令，遵循 `technical-writing` 与 `unslop` 的要求。
- 术语全文统一，见下表。
- 技能正文中内嵌的英文任务简报模板（如 `how` 技能里的引用块）保留英文原文，因为它们是交给运行中智能体的提示词；紧随其后用括号附一段中文大意。

## 术语表

| 英文 | 中文 |
| :--- | :--- |
| agent | 智能体 |
| subagent | 子智能体 |
| operator | 操作者 |
| skill | 技能 |
| playbook | playbook（保留原文） |
| principle | 原则 |
| todolist / todo list | 待办列表 |
| brief / kickoff | 任务简报 |
| done predicate | 完成判据 |
| gate | 检验关口 |
| check | 检查 |
| verify / verification | 验证 |
| formal verification | 形式化验证 |
| evidence | 证据 |
| artifact | 产物 |
| baseline | 基线 |
| benchmark | 基准测试 |
| eval | 评测 |
| blast radius | 影响面 |
| worktree | worktree（保留原文） |
| branch | 分支 |
| commit | 提交 |
| PR / pull request | PR |
| stack（PR 栈） | stack（保留原文） |
| land / merge | 合并 |
| ship | 交付 |
| babysit | 看护 |
| fan out | 并行分发 |
| swarm | swarm（技能名保留） |
| arena | arena（技能名保留） |
| race（多智能体竞速） | 竞速 |
| panel（评审团） | 评审组 |
| judge | 评审 |
| worker | 工作智能体 |
| slice | 切片 |
| gap（覆盖缺口） | 缺口 |
| dropout | 掉队 |
| hypothesis | 假设 |
| repro / reproduce | 复现 |
| root cause | 根因 |
| premise | 前提 |
| limiter（性能瓶颈） | 限制因素 |
| noise floor | 噪声底 |
| spread（波动） | 波动 |
| regression | 回归 |
| speedup | 加速比 |
| throughput / latency | 吞吐量／延迟 |
| scaffold | 脚手架 |
| state machine | 状态机 |
| statechart | statechart（技能名保留） |
| invariant | 不变量 |
| idempotent | 幂等 |
| boundary | 边界 |
| pure function | 纯函数 |
| brand（类型品牌化） | 品牌化 |
| discriminated union | 可辨识联合 |
| reducer | reducer（保留原文） |
| wrapper | 包装层 |
| shim / adapter | 适配器 |
| harness | 执行框架 |
| trace | trace（保留原文） |
| runtime forensics | 运行时取证 |
| hillclimb | 爬坡优化 |
| spike / prototype | 原型 |
| visual parity | 视觉一致性 |
| guardrail | 护栏 |
| checkpoint | 检查点 |
| decision log | 决策日志 |
| audit trail | 审计记录 |
| drift | 漂移 |
| green（检查通过） | 通过 |
| head（当前提交） | 当前提交 |
| SHA | SHA（保留原文） |
| verdict | 结论 |
| PASS / ISSUES / BLOCKED | 保留原文 |
| VERIFIED / NOT VERIFIED / INCONCLUSIVE | 保留原文 |
