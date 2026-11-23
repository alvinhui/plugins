# Search notes（搜索笔记）

Search 让用户按标题或正文文本查找笔记、查看命中的笔记，并区分「无匹配」和「搜索不可用」。

## Sub-features

- `search-open` 从每个受支持的浏览器入口打开搜索。
- `search-match` 返回标题和正文命中，不改变笔记数据。
- `search-open-result` 在笔记编辑器中打开一条结果。
- `search-empty` 为无匹配的查询显示完整的空状态。
- `search-clear` 清除查询并恢复最近笔记视图。
- `search-cli` 从终端返回同样的命中笔记。

## How to get to it (user POV)

- 点击浏览器工具栏中的 `Search` 按钮。
- 焦点不在可编辑字段内时，在浏览器中按 `/`。
- 在终端运行 `notes search <query>`。

## Driving it with control-notes

Preconditions:

- Notes 在 `http://127.0.0.1:4173` 上健康运行。
- 一次性数据目录里有 `Quarterly plan`，正文为 `Draft budget`。
- `control-notes doctor` 报告预期的 URL 和数据目录。

- **工具栏入口。** 点击 `Search` 按钮。运行 `control-notes browser click --role button --name "Search"`。出现名为 `Search notes` 的对话框，焦点在其搜索框。
- **键盘入口。** 关闭对话框，让页面获得焦点，按 `/`。运行 `control-notes browser press --key "/"`。出现同一个对话框，页面没有插入斜杠。
- **标题命中。** 输入 `quarterly`。运行 `control-notes browser fill --role searchbox --name "Search notes" --value "quarterly"`。`Search results` 列表包含 `Quarterly plan`，不包含 `Grocery list`。
- **正文命中。** 把查询换成 `budget`。运行 `control-notes browser fill --role searchbox --name "Search notes" --value "budget"`。结果 `Quarterly plan` 仍可见，并带正文命中摘录。
- **打开结果。** 点击 `Quarterly plan`。运行 `control-notes browser click --role link --name "Quarterly plan"`。对话框关闭，编辑器标题显示 `Quarterly plan`。
- **空状态。** 重新打开搜索并输入 `volcano`。运行 `control-notes browser fill --role searchbox --name "Search notes" --value "volcano"`。搜索完成后出现名为 `No matching notes` 的状态。
- **清除查询。** 点击 `Clear search`。运行 `control-notes browser click --role button --name "Clear search"`。搜索框为空，`Recent notes` 区域取代结果列表。
- **CLI 命中。** 从终端搜索。运行 `control-notes cli -- notes search "quarterly" --format json`。退出码为 `0`，stdout 包含一个标题为 `Quarterly plan` 的对象。
- **CLI 未命中。** 搜索一个不存在的值。运行 `control-notes cli -- notes search "volcano" --format json`。退出码为 `0`，stdout 为 `[]`。
- **证明。** 采集有结果的状态。运行 `control-notes browser snapshot --aria --path artifacts/search/results.aria.txt` 和 `control-notes browser screenshot --path artifacts/search/results.png`。两个产物都能识别出 Notes、查询词和 `Quarterly plan`。

## Gotchas

- 编辑器或搜索框持有焦点时按 `/` 会插入文本，而不是打开搜索。
- 结果经过短暂防抖后更新。等待结果列表或空状态出现，不要用固定 sleep。
- 除非用户启用 `Include archived`，归档笔记被排除在外。
- CLI 默认输出人类可读格式。用 `--format json` 做稳定断言。
- 打开结果会改变浏览器状态。证明另一个查询前先重新打开搜索。
