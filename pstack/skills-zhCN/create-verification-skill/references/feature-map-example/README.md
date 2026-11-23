# Notes 验证地图

本目录是验证 Notes 面向用户行为的持续维护依据。驱动应用之前先读索引，然后把对应的功能文件当作配方使用。

## 基线前置条件

- 用一次性数据目录在 `http://127.0.0.1:4173` 启动 Notes。
- 设置 `NOTES_DATA_DIR=/tmp/notes-verify-$RUN_ID`，让并发运行不共享状态。
- 播种标题为 `Quarterly plan` 和 `Grocery list` 的笔记。
- 把 `control-notes` 和 `notes` CLI 放进 `PATH`。
- 运行 `control-notes doctor`，要求 URL、数据目录和构建版本符合预期。
- 绝不驱动不是本次验证运行启动的实例。

## 驱动约定

- 除非配方的前置条件另有说明，每条配方都从基线状态开始。
- 优先用 ARIA role 和可访问名称，而不是 CSS 选择器或 DOM 位置。
- 每条命令都按字面执行。引号内的名称和标志保持不变。
- 浏览器动作通过 `control-notes browser` 执行。
- 终端动作通过 `control-notes cli -- <command>` 执行。
- 变更操作后恢复种子数据。清理时不要删除证明产物。

## 证明与跳过报告

- 采集用户动作和随之产生的状态，不只是最终画面。
- UI 证明包含 ARIA 快照和一张能看到应用身份的截图。
- CLI 证明包含命令、stdout、stderr 和退出码。
- 变更证明包含对已存储值的只读第二视图。
- 每个产物都记录所用的功能 ID 和入口。
- 报告不可达路径时附上尝试的命令和未满足的前置条件。
- 不要把跳过的入口报告成通过另一条路径已验证。

## 功能条目契约

每个功能文件以一个 H1 标题和一段描述用户可见行为的文字开头。随后按此顺序使用恰好四个 H2 章节。

1. `Sub-features` 列出短 ID，每个行为一行。
2. `How to get to it (user POV)` 列出每一个用户入口。
3. `Driving it with <harness>` 以 `Preconditions:` 开头，用带标签的条目把每个用户动作与确切命令和可观察结果配对。
4. `Gotchas` 列出可能浪费或作废一次验证运行的陷阱。

实现细节不进地图。只写用户路径、稳定句柄、所需状态、命令和可观察的证明。

## 功能

- [Create a note](./create-note.md)（创建笔记）覆盖浏览器和 CLI 的创建、取消、持久化和清理。
- [Search notes](./search.md)（搜索笔记）覆盖工具栏、键盘和 CLI 搜索的命中、空结果和清除状态。
