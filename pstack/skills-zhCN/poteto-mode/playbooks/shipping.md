### 交付

**你负责合并落地的内容。独立验证每个 PR，只合并从根部起连续通过验证的那一段，然后别再碰 stack。**

1. **先确定代码托管平台，再在合并前独立验证每个 PR。** 默认用 GitHub CLI（`gh`）。如果 `command -v origin` 成功且 Origin 能解析该仓库，所有 PR 操作都用 `origin pr`。否则留在 `gh` 并记录这次回退。绝不依赖 Graphite（`gt`）。每个 PR 一个验证者，都是 Cursor 云端智能体，用对应的控制技能（如 `cursor-team-kit` 的 `control-ui` 或 `control-cli`）以用户的方式运行改动，对比父提交与当前提交，并在该 PR 上发布 `PASS`、`PASS+NOTES` 或 `FAIL`。只有没写这段代码的智能体给出的结论才算数，因为作者检查的是自己想构建的东西。CI 通过和机器人评审批准都不算结论，因为两者都没有像用户那样运行改动。
2. **只合并从底部起连续通过验证的那一段。** 从最底部的未合并 PR 向上走，遇到第一个没有 `PASS` 或 `PASS+NOTES` 的就停。它下面的 PR 构成这一段，段顶就是上限。位于未验证 PR 之上的已验证 PR 要等待，因为没有下面的代码它无法合并。分支既不持有也不需要那段代码的 PR，可以移到 trunk 上单独合并。但它需要先拿到新结论，因为旧结论是在下面垫着那段代码时跑出来的，而 trunk 上没有那段代码。
3. **复查结论是否仍描述当前代码。** 结论覆盖的是补丁，而链式 rebase 会把其上每个 PR 移到新 SHA，且不会让任何检查失败。信任旧结论之前，比较结论 SHA 与当前提交的 `git patch-id`。补丁差异仅在测试、文档或 lint 配置时，只要某条验证通道运行的构建在两个 SHA 上除噪声外一致，其结果依然成立。噪声是指同一结论 SHA 的两次构建之间也会出现的差异，或内嵌的提交 SHA。每类噪声都要连同涉及的文件一起报告，让读者能核查这个判断。改动本身仍要重新跑检查和评审，因为旧结论没见过它。没有构建产物的通道（比如开发服务器）无法展示这一点，所以要重跑，其他发生漂移的内容也要重新验证。
4. **自底向上合并，一次一个 PR。** 始终合并这一段里最底部的未合并 PR，用 `origin pr merge <pr>` 或 `gh pr merge <pr> --squash`。在 Origin 上，这条普通命令还会把你所指 PR 之下的所有 PR 一并合并；在 GitHub 上，base 仍是父 PR 分支的 PR 会合并进那个分支，而不是 trunk。合并后回读 PR 确认结果（`origin pr view <pr>` 或 `gh pr view <pr> --json state,mergedAt,baseRefName`），因为合并队列只是把 PR 排队时，合并命令也可能报成功，而请求了 auto-merge 不等于已合并。已合并的 PR 应显示 merged 且 base 是 trunk，而不是父 PR 的分支。只对结论覆盖其当前提交的 PR 启用 `--auto`（Origin 的 merge-when-ready 或 GitHub 的 auto-merge），因为它合并的是就绪时的任意头提交。一个合并落地后，把 base 指向该已合并分支的 PR 重定向到 trunk（`origin pr edit <pr> --base <trunk>` 或 `gh pr edit <pr> --base <trunk>`），把它的补丁移到合并结果之上，用 `--force-with-lease` 推送。结论覆盖的是补丁而不是提交，所以由第 3 步的 patch-id 规则决定结论是否存活。检查通过且结论存活后再合并它。
5. **合并期间别碰 stack。** 第 4 步对下一个 PR 的移动是唯一允许的分支或 base 变更，因为合并会落地那一刻分支和 base 上的任何内容，无论有没有结论。在 GitHub 上，用 `/loop` 驱动 `scripts/watch-pr/watch-pr --queued-stack` 看护这一段，直到它在上限处报告 `COMPLETE`。把这一段的 PR 编号按自底向上的顺序传给 `--stack-prs`，每次重启 watcher 都传同一份列表。在 Origin 上，每次 `origin pr checks <pr> --watch` 返回后，用 `origin pr view <pr> --checks` 重读当前 PR，直到上限显示 merged。父 PR 合并后 base 移到 trunk 是预期行为，不是需要修复的损坏。合并卡住时，先弄清原因再改任何东西。
6. **停在上限处。** 延长这一段需要新的结论，也就是重新走一遍第 1 步。

**回复：** 通过验证的那一段及其上限、每个 PR 的结论和出具者、合并了什么以及你如何确认、下一个缺口需要什么。
