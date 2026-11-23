---
name: typescript-best-practices
description: TypeScript 最佳实践。读取或编辑任何 .ts 或 .tsx 文件时使用。
paths: ["**/*.ts", "**/*.tsx"]
disable-model-invocation: true
---

# TypeScript best practices（TypeScript 最佳实践）

先应用 **type-system-discipline** 原则技能。

| 规则 | 摘要 |
|------|---------|
| 可辨识联合 | 用 `kind` 字面量判别字段建模变体，让不可能的状态无法表示。不要可选字段大杂烩。 |
| 品牌化类型 | 用 `& { readonly __brand: "X" }` 给原始类型做品牌化，防止混用。在边界校验一次。品牌来自做验证的类型守卫（`input is AgentId`），绝不来自 `as`。 |
| 构造式建模 | 把形状构造成非法值根本无法构造。非空用 `[T, ...T[]]`，偶数长度用 `[T, T][]`，区间用 `start` 加 `duration`。不是运行时守卫，也不是对 refinement 类型的空想。 |
| 最简全函数类型 | 只要对 `T[]` 的每个操作都是全函数，就保持 `T[]`。只在宽松类型逼出 `!`、强转或「should never happen」抛错的地方，才收紧到 `NonEmpty<T>`。 |
| `unknown` 优于 `any` | 外部数据是 `unknown`。 |
| schema 先于守卫 | 手写逐属性的类型守卫之前，先用仓库的运行时 schema 库，从 schema 推断类型，比如 `z.infer`。 |
| 不用 `as` 强转 | 每个 `as` 都是等着发生的运行时崩溃。只在校验之后强转。 |
| 收窄层级 | 判别字段 switch > `in` 运算符 > `typeof`/`instanceof` > 自定义类型守卫 > `as`。 |
| 类型守卫 | 必须验证声明。撒谎的守卫比 `as` 更糟，因为 bug 藏在一个自称安全的名字后面。命名为 `isX` 或 `hasX`。 |
| 穷尽性 | 在 default 分支内联 `const _exhaustive: never = x;`，新增变体时编译器就报错。 |
| `satisfies` 优于 `as` | 校验值，且不放宽字面量类型。 |
| 边界校验 | 在数据跨入的地方解析成具名领域类型。`Record<string, unknown>`（无论怎么写）止步于那次解析。内部信任类型。见 **boundary-discipline** 原则技能。 |
| schema 推导类型 | 声明新 interface 之前，先用 `Pick`/`Omit`/`Parameters`/`ReturnType`/`Awaited`/`typeof`。 |
| 对象参数 | 传对象，不传位置参数，让参数顺序自文档化。热路径（逐帧渲染、tokenizer、解析器）除外。 |
| 真实测试 | 能运行的就不要 mock。优先用框架真实的测试原语，带泄漏／disposable 检查，并在运行中的构建里验证 UI。只 mock 本地跑不了的。 |
| 结构化遥测 | 优先用结构化 logger 诊断，上下文足够凭一个 id 调试。交付代码里不放 `console.log`。 |

示例：`references/patterns.md`。
