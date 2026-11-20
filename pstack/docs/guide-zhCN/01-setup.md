# 安装 pstack

在这一页中，你将安装插件、挑选 pstack 使用的模型，并运行你的第一个任务。安装只需一条命令加上一段简短的对话。

## 安装插件

在 Cursor 聊天中，运行：

```text
/add-plugin pstack
```

Cursor 会确认插件已安装。

在 Claude Code 中，先运行 `/plugin marketplace add cursor/plugins`，再运行 `/plugin install pstack@cursor-plugins`。Claude Code 会给插件命令加前缀，所以本指南中的每条命令在那里都要带上 `pstack:` 前缀，例如 `/pstack:setup-pstack`，它会把模型规则写到 `~/.claude/rules/pstack-models.md`。[Claude Code 适配器](../harness/claude-code.md)介绍了其他差异。

## 挑选你的模型

运行：

```text
/setup-pstack
```

[`/setup-pstack`](../../skills/setup-pstack/SKILL.md) 会检测你能访问的模型，询问推理预算，向你展示每个角色（代码委派、判断、评审面板），并询问你想要什么。回答这些问题即可。它会写入 `~/.cursor/rules/pstack-models.mdc`，这是一条每个 pstack 技能都会读取的小规则。

默认值与 `large` 预算相同。代码、散文和判断在 Opus 5.5 上以 `xhigh` 推理级别运行，评审面板和 swarm 工作器以 `high` 级别运行。没有任何角色的运行级别高于 `xhigh`。在评审面板之外，Fable 5.2 只会在你为某个任务点名它，或者同一份任务简报连续两次 Opus 5.5 运行都未通过检查时才会运行。`medium` 把每个角色降低一级，`small` 降低两级，两者都会消耗更少的 token。

你只需要覆盖你在意的部分。规则中没有对应行的角色会保留技能的默认值。要恢复某个默认值，删除该角色的那一行即可。重新运行 `/setup-pstack` 时会保留任何模型与默认值不同的角色。当某个默认值发生变化时，在变化之前写下的规则仍会锁定旧的默认值，直到你再次运行 `/setup-pstack`。那次运行会替换它识别出的旧默认值，并告诉你替换了哪些，同时保留你的其他选择。要丢弃它无法识别的锁定，先删除该角色的那一行或整个文件。

你可能会好奇使用 Auto 会怎样。把一个角色设为 `inherit-parent` 或 `auto`，pstack 就会省略子智能体的 `model` 字段，这样子智能体就会继承你父聊天的模型。这两个值的含义相同，也都不是模型标识（slug）。对于面板角色，该值是一个列表，每个条目运行一个子智能体，所以列表长度决定了面板规模。安装还会配置 `swarm workers`，即每个 `/swarm` 工作器的默认模型，除非某个 race 为每一路都指定了模型。

## 接受或拒绝验证提议

在安装结束时，`/setup-pstack` 会寻找一种能在你的项目中证明应用行为的方式，要么是一个 `verify-*` 技能，要么是一个已有的 harness。如果两者都没有，它会用 [`/create-verification-skill`](../../skills/create-verification-skill/SKILL.md) 提议生成一次。

选择"是"，它会写入 `.cursor/skills/verify-<app>/`，这是一个项目本地技能，教智能体像用户一样操作你的应用。它在交付之前会先证明这个技能确实有效。选择"否"，安装就继续往下走。你随时可以自己运行 `/create-verification-skill`。[验证并交付](./06-verify-and-ship.md#创建一个项目验证技能)对此有深入介绍。

如果你是 pstack 新手，请选择"是"。一个能检查自己工作的智能体会一直推进，直到检查通过。而一个不能检查的智能体会把每个结果都交回给你手工检查。在本指南的所有内容中，验证技能是回报最高的。

然后安装会用 [`/create-formal-verification-skill`](../../skills/create-formal-verification-skill/SKILL.md) 提议生成一次形式化验证技能，除非项目里已经有了。测试只检查那些有人想到要写的用例。形式化验证技能检查的是你代码的一个关键属性，比如"一个任务绝不会同时运行两次"，覆盖声明范围内所有情况。当你的代码涉及并发、重试、状态机或解析器——在这些地方一个 bug 代价高昂，而测试很少能触及那个会出错的用例——请选择"是"。否则选择"否"，等以后情况变了再运行。[验证并交付](./06-verify-and-ship.md#用正式验证技能证明一个性质)对此有介绍。

安装完成后，开启一个新的聊天。模型规则只对新会话生效。

## 控制成本

pstack 会在子智能体和评审面板上额外消耗 token。这是严谨性的代价。要减少消耗：

- 重新运行 `/setup-pstack`，选择更小的推理预算或更便宜的模型。主聊天用强模型、代码角色用更快更便宜的模型，是一个不错的搭配。
- 把某个角色设为 `auto` 或 `inherit-parent`，让它跑在聊天自己的模型上。
- 缩短面板列表。每个条目运行一个子智能体。
- 把 `/poteto-mode` 留给需要严谨性的工作。一个小而明显的改动不需要它。

## 运行你的第一个任务

挑一件真实但小的事情，像向同事描述那样描述它：

```text
/poteto-mode add a --json flag to this command. text output stays byte-identical. verify both.
```

观察待办列表。它的第一项就是匹配到的 playbook 复制进来的步骤，对于这条提示词来说是 Feature playbook。

从这里开始，你可以输入普通的后续指令。要让 `/poteto-mode` 在整个聊天中保持开启，在 `/` 菜单里选中它时按 Option+Enter（Mac）或 Alt+Enter（Windows），而不是 Enter。这样它就成了一个 [Custom Mode](https://cursor.com/docs/skills#using-a-skill-as-a-custom-mode)，在每一轮都保持在上下文中，直到你退出它。Custom Modes 在 Agents Window 和 CLI 中都可用。普通 Enter 会把技能附加到一条消息上，随着聊天推进而逐渐淡出。

下一步：[通过 `/poteto-mode` 路由工作](./02-poteto-mode.md)。