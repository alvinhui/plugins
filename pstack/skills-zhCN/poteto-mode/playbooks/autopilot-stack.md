### Autopilot-stack

执行 Autopilot-full playbook，但不合并。

1. **以「已验证」为终点，替代第 5 步。** 每个 PR 在其当前提交上通过验证且检查通过后停下，把 PR 交给操作者。交接之后，未经操作者放行，任何人不得推送。每次循环 tick 的提示词都点名本文件，让每次 tick 都看到不合并的规则。
2. **只有当一个 PR 构建在另一个 PR 之上时才入 stack。** 这是第 3 步唯一的例外。按 `playbooks/opening-a-pr.md`，把该 PR 的 base 设为另一个 PR 的分支而非 trunk。各 PR 不再按第 2 步 rebase 到 trunk，而是 rebase 到其父 PR 的分支，stack 根部 rebase 到 trunk。下层 PR 出现新提交时，其上的 PR 重新 restack；restack 后 `git patch-id` 不变的 PR 保留原结论。

**回复：** 逐个列出 PR 及其结论，以此替代「合并了什么」。
