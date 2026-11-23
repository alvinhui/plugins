---
name: unslop
description: 从任何文字中剔除 AI 腔。
disable-model-invocation: true
---

# Unslop

编辑文本，去除 AI 模式。先按下面的模式扫一遍，再重写。保留原意，贴合预期的语气。

规则编号是其他技能引用的稳定 id。删掉一条规则就留一个空缺。

3. 不用不增加事实的句尾 "-ing" 短语（"highlighting..."、"ensuring..."，即中文里「彰显了……」「确保了……」这类空尾巴）。
5. 不用模糊的归因（"experts believe"，「专家认为」）。点名来源，或删掉。
7. 不用 AI 词汇：additionally、crucial、delve、enhance、foster、landscape、pivotal、showcase、testament、underscore、vibrant（对应中文的「此外」「至关重要」「深入探讨」「赋能」「彰显」「里程碑式」等套话）。
8. 说 "is" 或 "has"（「是」「有」），不说 "serves as"、"stands as"、"boasts"、"features"（「作为……而存在」「坐拥」「主打」）。
9. 不用 "not just X, but Y"（「不仅 X，而且 Y」）。直接说要点。
10. 别硬把想法凑成三个一组。
11. 一个东西一个名字。重复用它。
12. 不用 "from X to Y"（「从 X 到 Y」），除非 X 和 Y 在同一个真实的量尺上。
13. 不用长破折号、短破折号或当破折号用的连字符，也不用括号替代它们。用句号或逗号。
14. 冒号只放在列表或示例之前，绝不在句中当连接词。
15. 别把每个专有名词和缩写都加粗。
16. 不用复述本行内容的加粗标签加冒号（"**Performance:** Performance improved..."，「**性能：**性能提升了……」）。以句号结尾、补充新细节的加粗引语可以。
17. 标题用句子式大小写。
18. 不用装饰性 emoji。
19. 用直引号。
20. 不用聊天机器人套话（"I hope this helps!"、"Let me know if..."，「希望这对你有帮助！」「如有需要请告诉我……」）。
22. 不用夸奖或附和开头。直接回应。
23. 删掉填充词。"In order to" 改成 "to"。删掉 "it is important to note that"（「值得注意的是」）。
24. 最多一个模糊限定词："may"（「可能」）。
25. 不用空泛的结论。说具体的计划或事实。
26. 不用抽象比喻名词：substrate、wedge、vector、nexus、primitive、harness、surface、scaffolding、paradigm、ratchet、north star、flywheel（「底座」「抓手」「链路」「范式」「北极星」「飞轮」之类）。用具体的词。
27. 说它做什么，不说它感觉如何。点名机制或数字。一句话原封不动放进别的项目文档也成立，就删掉它。
28. 一句话一个想法。读者要重读的句子就拆开。
29. 主动语态。点名动作主体，除非它未知或无关紧要。
30. 删副词，或换更强的动词。给出数字。
31. 用平实的词："use"，不用 "utilize" 或 "leverage"（中文用「用」，不用「利用」「借助」堆砌）。
32. 有直白说法时，不用比喻、格言、拟人化的代码或修辞性动词。
33. 写完整的句子，带冠词和动词。箭头和缩写要写成文字。
