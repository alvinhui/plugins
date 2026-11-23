### 开 PR

在每个其他 playbook 的末尾调用。

在基于 trunk 的 git worktree 里工作，无关工作不要混进来。rebase 成小而可落地的提交。提交前对 diff 跑 `cursor-team-kit` 的 `/deslop`。

标题：`type(scope): subject`，改动由某个真实符号承载时点名它。正文：一分钟能读完的简报，40 行以内，按顺序用这些 `##` 标题，空的删掉：`## Why`、`## What changed`、`## Scope`、`## Tradeoffs`（只写评审者否则会问起的被否方案）、`## Blast Radius`、`## Verification`。

后续事项按 base 分支叠 stack。PR 一律以可评审状态开出，走本次运行的 PR 工具并设 `draft: false`。没有该工具时用 `gh pr create` 且不带 `--draft`；Origin 的 CLI 能解析该仓库时用 `origin pr create --status open`。开 PR 不等于开始看护。
