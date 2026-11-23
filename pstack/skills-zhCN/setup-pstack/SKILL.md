---
name: setup-pstack
description: 配置 pstack 各角色用哪些模型、推理预算多大。检测你可用的模型，写入一条始终生效的规则来覆盖技能默认值。用于 /setup-pstack、「配置 pstack 模型」「pstack 预算」，或更改 pstack 的模型选择。
---

# Setup pstack

写入 `~/.cursor/rules/pstack-models.mdc`，一条始终生效、按角色设定 pstack 模型的规则。

## 步骤

### 1. 检测可用模型

枚举本会话中你能传给 `Task` 子智能体的模型 slug。这是可靠的来源。如果 Cursor 还暴露了列出用户有权使用模型的 models API 或 CLI，为求完整优先用它。一个都检测不到时，请用户粘贴他们能用的 slug。绝不写入未确认可用的真实 slug。别名 `inherit-parent` 和 `auto` 永远有效，虽然它们不是检测到的 slug。

### 2. 加载当前状态

默认的角色到模型映射就是下面第 5 步展示的规则形状。`~/.cursor/rules/pstack-models.mdc` 已存在时，读它，把它的 `# budget` 行和各角色值当作当前选择。否则从那些默认值开始。角色不在第 5 步清单里的行，比如 `hardest tasks`、`architect runners`、`reflect tooling`、`why investigators`，来自已退役的角色。删掉。

更早的默认值给评审组席位放过别的 Gemini 模型，后来是 `gemini-4-neon-high`。所以在任何规则里，评审组角色（`arena runners`、`arena cross-judge pool`、`interrogate reviewers`）中的 `gemini-4-neon-high` 条目、或 `gemini-4-neon-*` 之外的 `gemini-4-*` 条目，都是旧默认值。每个都改成 `gemini-4-neon-xhigh`。其他档位的 Gemini 4 Neon 条目是用户的选择，保留。告诉用户你替换了哪些条目。

没有 `# defaults: 3` 行的规则来自旧版 setup。那版 setup 给每个角色都写了行，所以其中一些值是旧默认值，不是选择。第 3 步之前，替换这些值：

- `arena cross-judge pool` 的列表恰好是一个 `claude-fable-*` 条目、一个 `claude-opus-*` 条目、一个 `gemini-*` 条目（顺序不限）时，改用该角色第 5 步的列表。Fable 和 Opus 是同一家厂商，所以 Fable 条目能当评审的场合 Opus 条目也能。
- `# budget: unlimited` 行改成 `large`，因为没有角色跑在 `xhigh` 之上。
- 规则连 `# defaults: 2` 行也没有时，匹配 `grok-*` 的就是旧 slug。`feature, refactoring`、`bug-fix`、`perf-issue`、`hillclimb`、`swarm workers` 里的旧 slug 改用该角色第 5 步的默认值。评审组角色（`arena runners`、`arena cross-judge pool`、`interrogate reviewers`）里恰好一个 `claude-opus-*` 条目加一个旧 slug 的列表（顺序不限），改用该角色第 5 步的列表。其他任何列表里，每个旧 slug 改成 `claude-opus-5-5-high-fast`。

其余每个值都是用户的选择，保留，包括其他角色里的旧 slug 和所有 `inherit-parent` 或 `auto` 值。告诉用户你替换了哪些值。

### 3. 预算、映射并确认

**(a) 询问预算。** 优先用 AskQuestion，不用自由文本。提供这三个选项，标签一字不差，规则记录了当前预算时点明它。没有规则时，说明 `large` 与技能默认值一致。

- `large — xhigh reasoning`
- `medium — high reasoning`
- `small — medium reasoning`

**(b) 应用预算。** 从技能默认值构建工作表；重跑时，凡是你按家族、列表或别名（`inherit-parent`、`auto`）改过的角色都保留。家族以 **arena** 技能 Phase A 定义的为准，所以 Fable 自成一个家族。每个角色有一个目标 effort，即其默认值的 effort 按预算移动后的档位。`large` 不动，`medium` 降一档，`small` 降两档，梯子为 `xhigh` > `high` > `medium` > `low`。没有角色跑在 `xhigh` 之上，目标已在梯子底部的留在底部。多数默认值在 `xhigh`，每个预算标签写明了它们落到哪。把角色里每个真实 slug（含评审组条目）的 effort token 设为该角色的目标。effort token 是最后一个 token，或结尾 `fast` 前面的那个。结果不是检测到的 slug 时，改用同家族检测到的、effort 不高于目标的最高档 slug；再不行就把该角色标为需要选择。`inherit-parent` 和 `auto` 不变。所以 `medium` 把 `claude-opus-5-5-xhigh-fast` 变成 `claude-opus-5-5-high-fast`、把 `claude-opus-5-5-high-fast` 变成 `claude-opus-5-5-medium-fast`；`small` 把它们变成 `claude-opus-5-5-medium-fast` 和 `claude-opus-5-5-low-fast`。Opus 5.5 永远跑 `-fast` slug，所以每个 Opus 5.5 值都以 `-fast` 结尾。Fable 5.2 和 Gemini 没有 fast slug，绝不写出一个。Gemini 4 Neon 的 slug 从 `low` 到 `xhigh`，没有 `max` 或 `fast` slug，所以它的席位跑 `gemini-4-neon-xhigh`，它的最高档。评审组角色里的 Gemini 4 Neon 条目取自己的目标档位，即 `xhigh` 按预算移动：`large` 保留 `gemini-4-neon-xhigh`，`medium` 写 `gemini-4-neon-high`，`small` 写 `gemini-4-neon-medium`。

**(c) 展示角色并确认。** 展示每个角色及其模型，不在检测集合里的真实 slug 标为需要选择。同时列出第 2 步删掉的每一行。询问是照单接受还是改特定角色，选项为检测到的 `xhigh` 及以下档位模型，加 `inherit-parent` 和 `auto`（两者都表示：该角色跑在父聊天模型上，Auto 用户就是这样留在 Auto 上的）。优先用 AskQuestion，不用自由文本。评审组角色（arena runners、interrogate reviewers）的值是列表，每个条目跑一个子智能体，别名条目也算，所以列表长度决定数量。`arena cross-judge pool` 也是列表，但 Arena 只跑一个评审。它按列表顺序只尝试与父模型不同厂商的值，所以按偏好排序。Fable 和其他 Claude 模型是同一家厂商。`inherit-parent` 或 `auto` 值绝不当评审。`swarm workers` 是每个工作智能体的默认模型，除非竞速或对比给每个分支指定了别的模型。

### 4. 校验

写入的每个真实 slug 都必须在检测集合里且不高于 `xhigh`。`inherit-parent` 和 `auto` 永远通过。选中的真实 slug 不可用时，停下来再问。

### 5. 写入规则

写入 `~/.cursor/rules/pstack-models.mdc`，含 `alwaysApply: true`、`# defaults: 3` 行、写明所选标签及该标签对应 effort 的 `# budget` 行，以及每个角色一行，用 poteto-mode 使用的同一套标签。整文件覆写，让重跑保持幂等。形状：

```
---
description: pstack per-role model choices (overrides skill defaults)
alwaysApply: true
---
# pstack model configuration. One line per role. Delete a line to fall back to the skill default.
# `inherit-parent` or `auto` as a value: the role runs on the parent chat model (omit Task `model` and spawn `generalPurpose`). Alias entries in a panel list still count toward its fan-out.
# defaults: 3
# budget: large (xhigh)
feature, refactoring: claude-opus-5-5-xhigh-fast
bug-fix: claude-opus-5-5-xhigh-fast
perf-issue: claude-opus-5-5-xhigh-fast
hillclimb: claude-opus-5-5-xhigh-fast
judgment and prose: claude-opus-5-5-xhigh-fast
arena runners: claude-fable-5-2-high, claude-opus-5-5-high-fast, gemini-4-neon-xhigh
arena cross-judge pool: claude-opus-5-5-high-fast, gemini-4-neon-xhigh
swarm workers: claude-opus-5-5-high-fast
interrogate reviewers: claude-fable-5-2-high, claude-opus-5-5-high-fast, gemini-4-neon-xhigh
```

### 6. 确认

告诉用户规则已写入，对新会话生效。重跑本技能会更新它。

### 7. 提议验证技能（可选）

检查项目是否已有驱动真实应用来取证的方式（`verify-*` 技能或现成的执行框架）。没有就提议一次：「要不要一个项目本地的验证技能，让智能体能像用户一样操作应用、证明改动有效？我可以用 /create-verification-skill 生成一个。」答应就调用 `/create-verification-skill`（无论 pstack 装在工作区、用户目录还是插件里都能解析）。不答应就继续，不劝。

### 8. 提议形式化验证技能（可选）

检查项目是否已有形式化验证技能（对代码运行模型检查器、证明器或其他验证器的项目技能）。没有就提议一次：「要不要一个形式化验证技能，让智能体能证明代码的某个关键性质在范围内的每种情况下都成立，而不只是测试覆盖到的情况？我可以用 /create-formal-verification-skill 生成一个。」答应就调用 `/create-formal-verification-skill`（无论 pstack 装在工作区、用户目录还是插件里都能解析）。不答应就继续，不劝。
