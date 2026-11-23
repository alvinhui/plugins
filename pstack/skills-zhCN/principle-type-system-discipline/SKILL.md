---
name: principle-type-system-discipline
description: "设计类型、评审函数签名，或在任何静态类型语言中写代码时应用。让非法状态无法表示，对语义原始类型做品牌化，在边界解析外部数据，穷尽变体，从权威 schema 推导类型。"
disable-model-invocation: true
---

# Type System Discipline（类型系统纪律）

让编译器拒绝不可能的状态、错配的原始类型和未处理的变体。

- **对语义原始类型做品牌化。** 两个参数共享同一原始类型但含义不同时，给每个自己的类型。创建时校验一次。
- **外部数据在解析之前都是无类型的。** JSON、RPC 载荷、CLI 参数、配置、环境变量和数据库行，都要在边界经过一个返回带类型模型的解析函数。
- **从权威 schema 推导类型。** schema 文件拥有某个形状时，从它推导类型，而不是手写一个平行的类型。

TypeScript 语法见 **typescript-best-practices** 技能。
