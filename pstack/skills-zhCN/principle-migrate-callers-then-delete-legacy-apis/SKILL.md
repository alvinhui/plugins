---
name: principle-migrate-callers-then-delete-legacy-apis
description: "在旧调用方仍存在时引入新内部 API 的场景下应用。同一波次内迁移调用方并删除旧 API，而不是保留兼容层。"
disable-model-invocation: true
---

# Migrate Callers Then Delete Legacy APIs（先迁移调用方，再删除旧 API）

- 更新测试以断言新契约，删除只保护重构前实现细节的测试

**适用条件：**
- 没有外部用户依赖向后兼容
- 项目能承受协调一致的破坏性变更
- 新 API 是简化或重构工作的一部分
