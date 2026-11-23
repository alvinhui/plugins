---
name: architect
description: "在写代码之前先勾画类型、签名和模块结构，并在实现填充细节时保持介入。用于 /architect、「architect this」「design this」，或任何直接写代码会锁死错误形状的非平凡工作。"
disable-model-invocation: true
---

# Architect

写代码之前，先追踪这次变更触及的每一个系统，然后为它勾画两种不同的形状（类型、签名、模块边界），选出每份状态只有一个所有者、每件事只有一种做法、调用方需要知道得最少的那一个。如果变通方案反复出现，就重新设计，而不是打补丁。

对于大型或有争议的设计，改为运行 **arena** 技能，而不是独自勾画。
