# 配置 pstack

这一页完成三件事：安装插件、选定 pstack 使用的模型、跑通第一个任务。整个配置就是一条命令加一段简短对话。

## 安装插件

在 Cursor 聊天中运行：

```text
/add-plugin pstack
```

Cursor 会确认插件安装完成。

在 Claude Code 中，先运行 `/plugin marketplace add cursor/plugins`，再运行 `/plugin install pstack@cursor-plugins`。Claude Code 会给插件命令加前缀，所以本指南中的命令在那边都要写成 `pstack:` 开头，例如 `/pstack:setup-pstack`——它会把模型规则写到 `~/.claude/rules/pstack-models.md`。其余差异见 [Claude Code 适配器](../harness/claude-code.md)。

## 选模型

运行：

```text
/setup-pstack
```

[`/setup-pstack`](../../skills/setup-pstack/SKILL.md) 会先探测你有哪些模型可用，询问推理预算，再把各个角色（代码委派角色、判断角色、评审组）列出来供你选择。按问题作答即可。它最终写入 `~/.cursor/rules/pstack-models.mdc`——一条简短的规则，每个 pstack 技能都会读取。

默认配置等同于 `large` 预算：代码、文字和判断类角色运行 Opus 5.5，推理档位 `xhigh`；评审组和 swarm worker 运行 `high`。没有角色会超过 `xhigh`。评审组之外，Fable 5.2 只在两种情况下启用：你在任务中点名它，或者同一份任务说明交给 Opus 5.5 运行两次都未通过检查。`medium` 把每个角色降一档，`small` 降两档，两者都更节省 token。

只修改你在意的角色。规则中未写明的角色沿用技能自带的默认值；想恢复默认，删除那一行即可。重新运行 `/setup-pstack` 时，凡是模型与默认值不同的角色都会保留。默认值本身发生变化时，变更之前写下的规则仍然锁定旧默认值，直到你再次运行 `/setup-pstack`：这次运行会替换它能识别的旧默认值、告知替换了哪些，其余选择原样保留。如果某个锁定无法识别，就先手动删除那一行或整个文件。

那 Auto 呢？把角色设为 `inherit-parent` 或 `auto`，pstack 就不写子智能体的 `model` 字段，子智能体直接继承父聊天使用的模型。这两个值含义相同，都不是模型 slug。评审组角色的值是一个列表，每个条目运行一个子智能体，所以列表有几项，评审组就有几个成员。配置中还有一项 `swarm workers`，它是所有 `/swarm` worker 的默认模型，除非某次竞速为每一路单独指定了模型。

## 验证技能：装还是不装

配置收尾时，`/setup-pstack` 会检查项目中是否有能验证应用行为的手段：一个 `verify-*` 技能，或者现成的测试装置。两者都没有时，它会用 [`/create-verification-skill`](../../skills/create-verification-skill/SKILL.md) 提议生成一个，只询问一次。

接受的话，它会写入 `.cursor/skills/verify-<app>/`：一个项目本地技能，教智能体像真实用户那样操作你的应用。交付之前，它会先把这个技能完整运行一次。拒绝也不影响，配置继续进行，你随时可以自己运行 `/create-verification-skill`。细节见[验证结果，提 PR](./06-verify-and-ship.md#给项目生成验证技能)。

刚上手 pstack 的话，建议接受。能自行检查结果的智能体会持续推进直到检查通过；不能自检的智能体，每个结果都要交回给你人工核对。整本指南中，验证技能的回报最高。

接着，除非项目中已经有了，配置还会提议用 [`/create-formal-verification-skill`](../../skills/create-formal-verification-skill/SKILL.md) 生成一个形式化验证技能，同样只询问一次。测试只能覆盖有人想到要写的用例；形式化验证技能检验的是代码的一条关键性质，比如"同一个任务绝不会同时运行两份"，并在声明的范围内覆盖所有情况。代码中有并发、重试、状态机或解析器时就接受——这些地方出 bug 代价高，而真正导致故障的情形测试往往覆盖不到。没有就先拒绝，以后情况变化再运行。见[验证结果，提 PR](./06-verify-and-ship.md#用形式化验证技能证明一条性质)。

配置完成后另开一个聊天。模型规则只对新会话生效。

## 控制成本

pstack 会在子智能体和评审组上额外消耗 token，这是严谨的成本。想节省一些：

- 重新运行 `/setup-pstack`，选择更小的推理预算或更便宜的模型。主聊天用强模型、代码角色用便宜且快的模型，是不错的组合。
- 把角色设为 `auto` 或 `inherit-parent`，让它跟随聊天自身的模型运行。
- 缩短评审组列表。列表中每一项都会运行一个子智能体。
- `/poteto-mode` 留给需要严谨的任务。显而易见的小改动不需要它。

## 跑第一个任务

选一件真实但足够小的任务，像向同事交代那样说清楚：

```text
/poteto-mode 给这个命令加一个 --json 参数。文本输出保持逐字节一致。两种输出都要验证。
```

观察待办列表。开头几项就是匹配到的 playbook 的步骤被复制了进来——这条提示词匹配的是 Feature playbook。

之后正常追问即可。想让 `/poteto-mode` 在整个聊天中持续生效，就在 `/` 菜单中选中它，然后按 Option+Enter（Mac）或 Alt+Enter（Windows），而不是普通 Enter。这样它会成为 [Custom Mode](https://cursor.com/docs/skills#using-a-skill-as-a-custom-mode)，每一轮都留在上下文中，直到你退出。Agents Window 和 CLI 都支持 Custom Mode。普通 Enter 只是把技能附加到这一条消息上，随着对话推进逐渐淡出上下文。

下一步：[用 /poteto-mode 分派任务](./02-poteto-mode.md)。
