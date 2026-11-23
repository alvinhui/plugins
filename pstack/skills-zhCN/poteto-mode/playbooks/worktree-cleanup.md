### Worktree 与模拟器清理

1. 快照并审计。先记录 `df -h /`，再运行 `scripts/worktree-audit.sh [-b <pr-base-ref>] [repo-path]`（principle-build-the-lever）。不带 `-b` 时它按 `origin/HEAD` 检查 `MERGED`，所以 PR 以其他分支为目标时要传 `-b origin/<branch>`。它从 `git worktree list` 读取路径，绝不手敲，因为手敲的 `myrepo-worktrees/x` 会漏掉实际位于 `.cursor/worktrees/myrepo/x` 的那个（principle-encode-lessons-in-structure）。它按大小、年龄、合并状态、未提交工作、PR 状态和最近触碰它的会话给每个 worktree 分类，然后建议一个分桶。会话记录扫描很慢，放到后台跑。
2. 分桶是建议，不是许可。置顶和活跃的会话才是真实产物（principle-prove-it-works）。从用户或侧边栏拿到这个集合，交叉核对每个候选。这个工具曾把用户置顶的 worktree 标成 `safe`，所以以置顶集合为准。
3. 删除前验证使用情况。对每一行 `verify-recent-chat`，以及任何你存疑的对象，并行分发子智能体去读会话记录，报告该会话是否置顶或仍在进行、触碰了哪些 worktree（principle-guard-the-context-window，会话记录体量很大）。置顶的会话会通过后台子智能体在相邻 worktree 里生成 arena 和复现树，这些即使名字从未出现在侧边栏也仍在使用。按 Subagents 一节的要求，为每个子智能体按任务选择推理级别。
4. 不可逆损失前暂停。`wip:N` 表示 N 处已跟踪的未提交修改。先展示 diff 并拿到决定，因为删掉干净的 worktree 还能从分支恢复，未提交的工作则一去不返。`scratch:N` 是未跟踪的一次性内容，可以安全丢弃，但要点名文件。按 Autonomy 的规则，干净、已合并且不在使用中的直接执行。`wip` 和使用中的暂停。
5. 清理确认过的集合。逐个路径执行 `git worktree remove --force <path>`。目录因被忽略的构建产物而残留时，`rm -rf` 它，然后 `git worktree prune`。分支引用仍在，不会丢提交。用 `df -h /` 确认并重新列出。
6. 模拟器和其他可回收空间。模拟器通常是第二大的收益来源。`xcrun simctl --set testing delete all`（XCTestDevices 克隆）、`xcrun simctl delete unavailable`，以及先 `xcrun simctl runtime list` 再对旧运行时执行 `runtime delete <id>`。需要时还有更多：Xcode 的 `DerivedData` 和 `iOS DeviceSupport`、`~/Library/Application Support/Cursor`（`state.vscdb.backup`，以及 `snapshots/roots/<root>`——以你曾作为工作区打开的文件夹命名的 `<root>` 会膨胀）、包缓存（pnpm、uv、brew、yarn）。只清理用户没说要保留的缓存。

这是唯一一个删除用户状态、又没有代码评审兜底的 playbook，所以上面的检验关口就是评审。

**回复：** 前后的 `df -h /` 及回收的空间、清理掉的 worktree，以及每个保留对象的一行理由（被哪个会话使用，或有未提交工作）。
