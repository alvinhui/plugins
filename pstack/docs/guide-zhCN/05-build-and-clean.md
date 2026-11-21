# 实现改动，收拾 diff

所有构建 playbook 遵循同一条纪律：你陈述观察到的现象，由 playbook 要求提供证据。这一页说明每种常见构建任务的提示词该写什么，以及让 diff 保持易评审的清理习惯。

## 向对应的构建 playbook 提供已知信息

Bug 提示词写清症状，并要求先复现：

```text
/poteto-mode this command emits two records after a retry. repro first, then fix and verify.
```

Feature 提示词写清目标行为，以及什么绝不能变：

```text
/poteto-mode add a --json flag. text output stays byte-identical. verify both forms.
```

重构提示词在调整结构之前先锁定行为：

```text
/poteto-mode move parsing into one module, zero behavior change. record the current output first and prove it's unchanged after.
```

性能提示词给出测量结果，而不是主观感受：

```text
/poteto-mode startup takes 1.8s on this fixture. trace it, fix the measured cause, show me before and after.
```

这几条会分别分派到对应的 playbook（[Bug fix](../../skills/poteto-mode/playbooks/bug-fix.md)、[Feature](../../skills/poteto-mode/playbooks/feature.md)、[Refactoring](../../skills/poteto-mode/playbooks/refactoring.md)、[Perf issue](../../skills/poteto-mode/playbooks/perf-issue.md)），你未写出的步骤由 playbook 补齐：修复前先复现、实现前先确定数据结构、重构前先锁定行为、优化前先做性能剖析。

要持续优化某个指标（hillclimbing），用 [Hillclimb playbook](../../skills/poteto-mode/playbooks/hillclimb.md)。给它指标、目标值和尝试次数下限，它就在一套冻结的测量装置上循环迭代，每轮只验证一个假设。有效的改动保留，其余全部回退。

两个性能 playbook 都会用 [`/benchmark-checklist`](../../skills/benchmark-checklist/SKILL.md) 审查自己的数字。Perf issue 审查基线和之后的每一个数字，Hillclimb 在冻结测量装置之前先审查装置本身。何时需要自己输入这条命令，见[验证结果，提 PR](./06-verify-and-ship.md#用-benchmark-checklist-审查性能数字)。

有时你要的是先查明原因，不做任何修复。对于正在发生的运行时症状，比如内存泄漏、空闲时 CPU 空转或显示异常，用 [Runtime forensics playbook](../../skills/poteto-mode/playbooks/runtime-forensics.md) 给运行中的进程插桩。对于已捕获的 profile，用 [Trace forensics playbook](../../skills/poteto-mode/playbooks/trace-forensics.md) 读取这份产物，把热点栈帧对应回源码。两者给出的都是诊断，不是修复：

```text
/poteto-mode here's a cpuprofile from the slow startup. tell me where the time goes and which source lines own it. no fix yet.
```

## 用 /tdd 先写失败的测试

bug 有低成本的本地测试路径时，整条提示词两个词就足够：

```text
/tdd implement
```

有上下文就足够了。[`/tdd`](../../skills/tdd/SKILL.md) 先写最小的测试，让它因预期的原因失败，再写修复，然后重跑测试。如果测试需要搭建大量装置，或依赖脆弱的 mock，技能会明确说明，改用最接近的可运行检查。真实命令能给出更有力的证据时，不要勉强构造测试。

## 按名字调用 TypeScript 规范

[`typescript-best-practices`](../../skills/typescript-best-practices/SKILL.md) 把类型系统原则落实为具体规则：可辨识联合、边界处用 `unknown`、穷举所有变体、从 schema 派生类型。它不会自动加载，任务涉及 `.ts` 或 `.tsx` 文件时，输入 `/typescript-best-practices`。

## 提交前先清理

[Opening a PR playbook](../../skills/poteto-mode/playbooks/opening-a-pr.md) 在每次提交前对 diff 跑 `/deslop`，poteto-mode 还会用 [`/unslop`](../../skills/unslop/SKILL.md) 清理 PR 描述和提交说明正文。`/deslop` 来自 `cursor-team-kit` 插件，不在 pstack 里。未安装时，用平实的语言提出同样的要求：删除复述代码的注释、没有依据的防御判断、废弃的兼容路径和无关改动。

清理文字时，`/unslop` 接受一个目标，外加你自己的任何规则：

```text
/unslop the readme changes, no emdashes
```

你会逐渐形成自己的简写。即使提示词简短到 `unslop that, tighten it`，技能也能准确理解意图。

## 用 /no-comments 清掉注释

注释要单独审查一遍，而且不能交给写注释的那个智能体。作者会为自己的注释辩护，正如你会维护自己写的注释。所以在评审之前，把注释交给未参与编写的评审者：

```text
/no-comments the diff
```

[`/no-comments`](../../skills/no-comments/SKILL.md) 会派生只读评审智能体 [Comment Sicko](../../agents/comment-sicko.md)，它的保留清单很短：许可证头、公共 API 的文档注释、为代码无法表达的内容提供解释的链接、你无法更改的外部依赖所强制的行为。其余一律删除。你自己代码中出乎意料的地方，不享受这种豁免。这类注释会以重构标记的形式返回，`/no-comments` 对认可的标记从根因上修复。注释声称某个约束，比如 "do not remove"，技能会提议把这条约束固化成类型、测试或 lint。无论哪种方式，注释都会被删除。

这套分工值得记清楚：`/deslop` 清理代码中敷衍产出的部分，`/unslop` 清理文字中的同类问题，`/no-comments` 把注释交给没有写过它们的评审者。

**坑：** 清理不是可有可无的润色。带着复述式注释和防御性死代码的 diff，在评审者看来就是未完成的工作，而多出来的代码正是下一个 bug 的藏身处。如果觉得 diff 臃肿，提交前就说 `deslop it`，不要等评审时被指出。

下一步：[验证结果，提 PR](./06-verify-and-ship.md)。
