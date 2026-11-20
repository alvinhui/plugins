# 构建改动，清理 diff

各个构建 playbook 共享同一条纪律：说出你观察到了什么，让 playbook 去要求证据。这一页展示每种常见构建任务该往提示词里放什么，然后是让 diff 保持可审阅的清理习惯。

## 用你知道的信息去提示每个构建 playbook

一条 bug 提示词要陈述症状，并要求先复现：

```text
/poteto-mode this command emits two records after a retry. repro first, then fix and verify.
```

一条功能提示词要陈述行为，以及什么绝不能变：

```text
/poteto-mode add a --json flag. text output stays byte-identical. verify both forms.
```

一条重构提示词要在结构移动之前钉死行为：

```text
/poteto-mode move parsing into one module, zero behavior change. record the current output first and prove it's unchanged after.
```

一条性能提示词要陈述测量结果，而不是印象：

```text
/poteto-mode startup takes 1.8s on this fixture. trace it, fix the measured cause, show me before and after.
```

每一条都会路由到对应的 playbook（[Bug fix](../../skills/poteto-mode/playbooks/bug-fix.md)、[Feature](../../skills/poteto-mode/playbooks/feature.md)、[Refactoring](../../skills/poteto-mode/playbooks/refactoring.md)、[Perf issue](../../skills/poteto-mode/playbooks/perf-issue.md)），而 playbook 会补上你没打出来的步骤：修复前先复现、实现前先命名数据形状、重构前先钉死行为、优化前先做剖析。

对于持续改进某一个数字，有 [Hillclimb playbook](../../skills/poteto-mode/playbooks/hillclimb.md)。给它指标、一个目标，以及尝试次数的下限，它就会用一个冻结的测量装置，一次一个假设地循环。它保留胜出的，其余全部回退。

两个性能 playbook 都会对它们的数字跑 [`/benchmark-checklist`](../../skills/benchmark-checklist/SKILL.md)。Perf issue 会核验它的基线以及之后每一个数字，Hillclimb 会在冻结装置之前核验它。[验证并发布](./06-verify-and-ship.md#用-benchmark-checklist-核验一个测量出来的数字)展示了什么时候该你自己敲。

有时候你想要的是原因，而不是任何修复。对于一个活生生的症状，比如泄漏、空闲 CPU 空转，或视觉故障，[Runtime forensics playbook](../../skills/poteto-mode/playbooks/runtime-forensics.md) 会给正在运行的进程插桩。对于你已经抓到的 profile，[Trace forensics playbook](../../skills/poteto-mode/playbooks/trace-forensics.md) 会读那个产物，把热点帧映射回源码。两者返回的都是诊断，而不是修复：

```text
/poteto-mode here's a cpuprofile from the slow startup. tell me where the time goes and which source lines own it. no fix yet.
```

## 用 `/tdd` 先写失败的测试

当一个 bug 有一条便宜的本地测试路径时，整条提示词可以只有两个词：

```text
/tdd implement
```

在上下文里，这就够了。[`/tdd`](../../skills/tdd/SKILL.md) 先写一个出于预期原因而失败的最小测试，再写修复，然后重跑测试。如果一个测试需要大范围的装置搭建或脆弱的 mock，这个技能会明说，并改用最接近的可执行检查。别硬塞一个测试，当一条真实命令是更有力的证据时。

## 按名字加载 TypeScript 规则

[`typescript-best-practices`](../../skills/typescript-best-practices/SKILL.md) 把类型系统的原则变成具体规则：可辨识联合、边界处的 `unknown`、穷举的变体、从 schema 派生的类型。它不会自己加载，所以当一个任务触及 `.ts` 或 `.tsx` 文件时，敲 `/typescript-best-practices`。

## 提交之前先清理

[Opening a PR playbook](../../skills/poteto-mode/playbooks/opening-a-pr.md) 会在每次提交前对 diff 跑 `/deslop`，而 poteto-mode 会对 PR 描述和提交正文应用 [`/unslop`](../../skills/unslop/SKILL.md)。`/deslop` 随 `cursor-team-kit` 插件一起发布，不在 pstack 里。如果你没有它，就用大白话要同样的结果：去掉叙述性注释、没有依据的守卫、死掉的兼容路径，以及无关的改动。

对于散文，`/unslop` 接受一个目标以及你有的任何额外规则：

```text
/unslop the readme changes, no emdashes
```

你会形成自己的简写。这个技能能从 `unslop that, tighten it` 这样简练的提示词里读出意图。

## 用 `/no-comments` 剥掉注释

注释需要单独过一遍，而且不能由写它们的那个智能体来做。作者会像你维护自己的注释一样维护它的注释。所以在审阅之前，把它们交给一双新鲜的眼睛：

```text
/no-comments the diff
```

[`/no-comments`](../../skills/no-comments/SKILL.md) 会生成 [Comment Sicko](../../agents/comment-sicko.md)，一个只读的审阅者，带着一份很短的保留清单：许可证头、公共 API 上的文档注释、能解释代码解释不了的链接、由你无法重塑的外部依赖所强制的行为。其余全部删掉。你自己代码里的一个意外可享受不到这种待遇。那条注释会作为一个重构标记回来，而 `/no-comments` 会在根因处修掉它接受的标记。当一条注释声称某个约束、"do not remove" 时，这个技能会提议把这条声明编码成类型、测试或 lint。不管怎样，注释都会被拿掉。

这份分工值得记清楚。`/deslop` 把 slop 从代码里清掉，`/unslop` 把它从散文里清掉，而 `/no-comments` 把注释交给一个没写过它们的审阅者。

**陷阱：** 清理不是可有可无的润色。一个带着叙述性注释和防御性死重量的 diff，在审阅者眼里就是没做完，而多出来的代码正是下一个 bug 藏身的地方。如果 diff 感觉被塞满了，在提交之前就说 `deslop it`，而不是等审阅把它点出来。

下一步：[验证并发布](./06-verify-and-ship.md)。