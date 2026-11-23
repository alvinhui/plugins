# Bugbot 分诊

当 Babysit playbook（`../playbooks/babysit.md`）处理 Bugbot 或评审自动化评论时，使用本参考。目标不是默认忽略 Bugbot，而是不再把每条评论都当成必须改代码的要求。

## 决策准则

行动前先给每条 Bugbot 评论线程分类：

- `fix`：评论指出了可信的正确性、安全、隐私、数据丢失、鉴权、计费、迁移、幂等性、竞态或已交付行为问题。在归属的最底层 PR 里修复，然后回复提交 SHA 并把线程标记为已解决。
- `dismiss`：评论命中已记录的低风险噪声模式，且当前代码／上下文证明该疑虑不需要改代码。回复一句简短理由并把线程标记为已解决。
- `ask`：评论是新出现的、高严重度的、涉及安全／隐私／数据的，或含义模糊。询问用户，不要猜。

拿不准就问。跳过一条代码质量噪声评论代价很低；跳过一个真实的数据或安全 bug 则不然。

## 已学习模式的格式

未来的模式按此格式追加：

```markdown
### <short pattern name>

- Confidence: candidate | recurring | strong
- Skip when: <conditions that must be true>
- Do not skip when: <risk boundaries>
- Example signal: <phrases or code context that identify the pattern>
- Source: <PR/comment URL or short historical note>
```

只有一两个例子时用 `candidate`。多次真实驳回之后用 `recurring`。只有模式范围窄、反复验证过且低风险时才用 `strong`。

## 反复出现的跳过候选

### 有意为之的 UI 或设计系统视觉变更

- Confidence: candidate
- Skip when: PR 描述、截图、设计评审或邻近代码明确说明了该视觉变更，且 Bugbot 评论只是复述某个共享视觉默认值变了。
- Do not skip when: 评论指向可访问性、焦点可见性、键盘导航、颜色对比度，或 PR 并未有意更改的组件 API 契约。
- Example signal: 关于焦点轮廓、按钮尺寸、间距或共享组件视觉默认值的评论，且负责人回复 `"intentional"` 或 `"intended"`（有意为之）。

### Bugbot 看不到的上栈或 stack 内用法

- Confidence: candidate
- Skip when: Bugbot 标记某个导出、组件、辅助函数或文件未被使用，而当前托管平台的 PR 列表和 diff、上栈 diff 或 PR 上下文显示它被 stack 中更靠后的 PR 使用。
- Do not skip when: 当前 PR 不属于任何 stack、该符号是公开 API，或所谓上栈用法无法验证。
- Example signal: `"Exported component is never used"`（导出的组件从未被使用），而有人回复 `"used upstack"`（在上栈使用）。

### 并行实现期间的临时重复

- Confidence: candidate
- Skip when: PR 有意重复少量代码，让新路径与正在删除、替换或验证中的旧路径并行。
- Do not skip when: 重复的代码涉及安全、计费、数据访问、API 行为，或一个长期共享抽象显然能降低风险。
- Example signal: `"Significant duplication"`（大量重复）或 `"duplicated validation logic"`（重复的校验逻辑），且负责人解释旧路径将被删除，或重复逻辑是有意保持局部的。

### 现有框架或组件不变量已覆盖该警告

- Confidence: candidate
- Skip when: 该疑虑已被当前 diff 或邻近代码中可见的共享组件、框架契约、类型不变量或单一事实来源保证。
- Do not skip when: 不变量只是假设而未被强制执行、依赖时序，或跨越值可能发散的异步／状态边界。
- Example signal: 评论说内层 popover 缺少 max-height，而共享 popover 已强制视口边界；或评论说值可为 null，而本地检查的值与传入的值来自同一来源。

### 负责人声明的后续事项或延后清理

- Confidence: candidate
- Skip when: PR 负责人明确说该问题是已知的后续事项，当前 PR 没有让行为变得更差，且评论不涉及高风险区域。
- Do not skip when: 智能体在没有负责人输入的情况下行动、问题属于中／高严重度的产品行为，或延后会合并进一个新的回归。
- Example signal: `"I'll worry about that later"`（我以后再处理）或 `"we'll delete this eventually"`（我们最终会删掉它）。

### 自行撤回或明确误报的规则评论

- Confidence: recurring
- Skip when: 评论正文或 Bugbot 的后续回复明确说该发现已撤回、已合规或属误报，且智能体能在本地验证相关规则。
- Do not skip when: 唯一证据是有人对高风险问题说了句 `"false positive"`（误报）而没有解释。
- Example signal: 一条文件命名规则评论，其正文说该文件已经合规。

## 默认询问

以下类别不要自动跳过，即使之前的 PR 驳回过类似问题：

- 安全、隐私、鉴权、计费、数据保留、训练数据和权限边界的发现。
- 高严重度的发现。
- 迁移、schema、幂等性、并发和跨系统行为的发现。
- 建议修复很小、显然降低风险且不改变产品意图的评论。

历史数据显示，人类有时会驳回安全／数据流评论。把这些当作负责人的个案判断，而不是全团队的跳过规则。

## 近期看护中的候选经验

看护期间或之后，把看起来对团队有用但尚未成熟的候选经验追加到这里。多个 PR 确认某模式后，优先把反复出现的候选提升到上一节。

### 手工重实现浏览器原生行为

- Confidence: candidate
- Skip when: 几乎从不跳过。当 diff 用手工等价物替换浏览器原生行为（原生 sticky → JS 定位的克隆、原生滚动定位 → 转发的 wheel/touch 事件、绘制顺序遮挡 → mask/clip-path）时，Bugbot 针对这类代码的逻辑 bug 发现一贯是成立的。
- Do not skip when: 发现涉及事件转发缺口（wheel 的 deltaMode、触摸平移、边缘的滚动链、点击容差）、mask/clip 命中测试分歧，或这类代码中 observer 与 React 状态的时序竞态。默认修复。
- Example signal: `"masks do not affect hit-testing"`（mask 不影响命中测试）、`"overlay blocks wheel scroll"`（浮层挡住滚轮滚动）、`"ignores deltaMode"`（忽略 deltaMode）、`"runs in the IntersectionObserver callback before React applies state"`（在 React 应用状态之前就在 IntersectionObserver 回调里运行）。
- Source: 一个 sticky 遮挡 PR：六轮 Bugbot、约十八条发现，每一条都修复而非驳回。

### 契约测试漂移的断言可以低成本验证——先跑测试

- Confidence: candidate
- Skip when: 验证本身绝不跳过；它只要一条命令。当 PR 带有钉住协议或文档文字的契约测试（对 SKILL.md 的正则、文档措辞的快照），而 Bugbot 声称「测试不再匹配文档」（或反过来）时，先在 PR 最新提交上跑该测试再分类。测试失败即实证确认该断言；测试通过则是驳回回复的具体反证。
- Do not skip when: 不适用——这是一条验证捷径，不是驳回模式。注意「多轮之后倾向驳回」的启发式在这里会误判：钉住文字的测试恰恰是因为之前的修复轮次编辑了文字才漂移的。
- Example signal: `"Contract test omits the pre-fix wait"`（契约测试漏掉了修复前的等待），出现在早先修复提交改写了被钉住段落的 PR 上；在最新提交上跑测试，失败的正是被引用的那条断言。
- Source: 一个钉住文字的 PR，八轮 Bugbot；尽管之前每轮都修复并解决，第 7 轮的断言仍是真的。

### 同一 PR 后续已修复的过期安全评审发现

- Confidence: candidate
- Skip when: 智能体安全评审（或类似机制）声称缺少鉴权／校验调用，而当前 PR 最新提交明确包含正是那个检验关口（含测试），通常是在评审运行之后的加固提交里加上的。
- Do not skip when: 被引用的辅助函数对所讨论的主体是空操作、检查跑在它所守护的副作用之后，或对所声称主体缺少覆盖。
- Example signal: 一条 HIGH 级的「缺少授权检查」发现，而最新提交上正是那个守卫已在副作用之前被调用。
- Source: 一个 webhook 端点 PR，其加固提交晚于评审运行。

### 放宽刻意收窄的错误条件会掩盖真实错误

- Confidence: candidate
- Skip when: 发现要求把一个收窄的错误条件（特定的 `errno`、错误码或状态类别）放宽成兜底捕获，而这个收窄编码了真实的区分。典型形态是以 `ENOENT` 为门的依赖回退：「二进制未安装」和「命令运行了但失败」是两种不同情况。对任何非零退出都重试，会把一次正当的失败（未找到、鉴权过期、网络问题）再对着回退跑一遍，然后报告回退的错误，掩盖真正的错误。
- Do not skip when: 收窄条件漏掉了同一类别里的情形（另一个「二进制不可用」的 errno 如 `EACCES`、另一种传输层失败）、未处理路径会丢数据或留下部分状态，或重试是幂等的且原始错误仍会被呈现。
- Example signal: `"only retries when X fails with ENOENT … never tries the fallback even when a working Y exists"`（只在 X 因 ENOENT 失败时重试……即使存在可用的 Y 也从不尝试回退），指向的代码其回退是为缺失的依赖而非失败的操作准备的。
- Source: 一个 CLI 改名 PR，其回退是为缺失的二进制而非失败的命令准备的。
