# TypeScript patterns
（TypeScript 模式）

`SKILL.md` 中每条规则的代码示例。底层原则与语言无关。见 **type-system-discipline** 和 **boundary-discipline** 原则技能。

## 品牌化类型

给原始类型做品牌化，防止混用。在边界校验一次。下游代码信任类型。

```ts
type AgentId = string & { readonly __brand: "AgentId" };

function isAgentId(input: string): input is AgentId {
  return isUUID(input);
}

function parseAgentId(input: string): AgentId {
  if (!isAgentId(input)) throw new Error(`Invalid agent id: ${input}`);
  return input;
}

function focusAgent(id: AgentId): void {
  /* input is trusted */
}
```

沿用 `readonly __brand: 'X'` 的形状。不要发明新约定。

## 可辨识联合

用字面量判别字段建模变体。每个变体共享字段名，各变体的值唯一，不可能的组合就无法表示。

```ts
// Don't. Boolean + optionals lets contradictory states exist.
type DiffState = { loading: boolean; diff?: GitDiff; error?: string };

// Do. Only valid states exist.
type DiffState =
  | { kind: "loading" }
  | { kind: "ready"; diff: GitDiff }
  | { kind: "error"; error: string };
```

选定一个判别字段名（`kind`、`type`、`tag`）并坚持用。

## 构造式建模

用全部合法的部件构造类型，而不是用运行时检查去限制宽松类型。

非空，用可变元组：

```ts
type NonEmpty<T> = [T, ...T[]];

// Don't: T[] plus a length check every caller must repeat
function pickWinner(entries: string[]): string {
  if (entries.length === 0) throw new Error("no entries");
  return entries[Math.floor(Math.random() * entries.length)];
}

// Do: an empty value of the type can't exist
function pickWinner(entries: NonEmpty<string>): string {
  return entries[Math.floor(Math.random() * entries.length)];
}
```

收到普通 `T[]` 的地方，用守卫收窄一次。此后这个事实随类型传播：

```ts
const isNonEmpty = <T>(arr: T[]): arr is NonEmpty<T> => arr.length > 0;
```

偶数长度，用成对表示：

```ts
type Pairs<T> = [T, T][];
```

时间区间，用起点加时长：

```ts
// Don't: a comment holds the invariant
type TimeRange = { start: Date; end: Date }; // start <= end

// Do: a negative range can't be written; derive end when needed
type TimeRange = { start: Date; durationMs: number };
```

`durationMs` 保持普通 number。只有当裸 number 可能被传到期望时长的位置时才品牌化（按品牌化类型一节），不要条件反射。选让坏状态无法构造的表示，再在其上暴露你需要的读取方式（`pairs.flat()`、一个 `rangeEnd()` 辅助函数）。

## 最简全函数类型

不要什么都收紧。对 `T[]` 的每个操作都是全函数时，保持 `T[]`：

```ts
const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0); // [] is 0, fine
```

宽松类型在使用处逼出谎言时才收紧。信号是 `!`、`arr[0] as T` 和「should never happen」抛错：

```ts
// Don't: partiality smuggled past the compiler
function newestSession(sessions: Session[]): Session {
  return sessions.at(0)!;
}

// Do: strengthen the input; the assertion disappears
function newestSession(sessions: NonEmpty<Session>): Session {
  return sessions[0];
}
```

把结果放宽为 `Session | undefined` 是另一种全函数签名。

## `unknown` 优于 `any`

外部数据永远是 `unknown`。使用前先收窄。

```ts
// Don't
function handle(input: any) {
  return input.foo.bar;
}

// Do
function handle(input: unknown) {
  if (typeof input === "object" && input !== null && "foo" in input) {
    // narrowed; compiler verifies access
  }
}
```

外部来源包括 RPC 载荷、`JSON.parse`、`postMessage`、IPC、文件内容、环境变量、数据库结果。

## schema 先于手写守卫

为外部数据写逐属性的类型守卫之前，先找仓库的运行时 schema 库和已有 schema。让一个 schema 独占校验，并从它推导 TypeScript 类型。不要同时维护 schema、重复的 interface 和一个守卫，三者会彼此漂移。

```ts
import { z } from "zod";

const UserSchema = z.object({
  id: z.string().uuid(),
  role: z.enum(["admin", "member"]),
});

type User = z.infer<typeof UserSchema>;

function parseUser(input: unknown): User {
  return UserSchema.parse(input);
}
```

失败是预期分支时用 `safeParse`。仓库用别的 schema 库时，用等价的推断辅助工具。不要为一个守卫新增 schema 依赖。本规则优先用代码库已经信任的 schema 体系。

## 不用 `as` 强转

每个 `as` 都是潜在的运行时崩溃。只在类型系统验证过声明之后强转。

```ts
import { z } from "zod";

// Don't
const user = data as User;

// Don't
function isUser(data: unknown): data is User {
  return typeof data === "object" && data !== null && "id" in data;
}

// Do
const userSchema = z.object({ id: z.string(), name: z.string() });
type User = z.infer<typeof userSchema>;

function parseUser(data: unknown): User {
  return userSchema.parse(data);
}
```

类型先行时，用校验器所证明的类型给它加标注。这样校验器证明得比类型少，编译器就会拒绝。把下面对象里的 `name` 删掉，赋值就编译失败。

```ts
type User = { id: string; name: string };

const userSchema: z.ZodType<User> = z.object({ id: z.string(), name: z.string() });
```

从既有代码中重构掉 `as` 时，先弄清 TypeScript 为什么推断不出来：

- 缺判别字段：加一个，改用可辨识联合。
- 源类型过宽（如 `Record<string, unknown>`）：收窄它。
- 无类型的边界：用拥有该形状的 schema 解析。只在没有 schema 的地方新增。
- 确实无法表达：用品牌化类型或 `satisfies`。

## 收窄层级

从最优到最后手段：

1. **可辨识联合的 switch / if。** 编译器自动收窄。
2. **`in` 运算符。** `"key" in obj` 收窄到含该键的变体。
3. **`typeof` / `instanceof`。** 用于原始类型和类实例。
4. **自定义类型守卫。** 上面不够用时。
5. **`as` 强转。** 只在校验之后。

```ts
function area(s: Shape): number {
  if ("radius" in s) return Math.PI * s.radius ** 2; // narrowed to circle
  return s.width * s.height; // narrowed to rect
}
```

## 类型守卫

守卫必须真正验证声明。撒谎的守卫比 `as` 更糟。

```ts
function isCircle(s: Shape): s is Shape & { kind: "circle" } {
  return s.kind === "circle";
}
```

能用判别字段收窄就优先用它。

## 穷尽性

在 default 分支里，把判别字段赋给一个 `never` 类型的局部变量。

```ts
// Value-returning switch
function area(s: Shape): number {
  switch (s.kind) {
    case "circle":
      return Math.PI * s.radius ** 2;
    case "rect":
      return s.width * s.height;
    default: {
      const _exhaustive: never = s;
      return _exhaustive;
    }
  }
}

// Void switch
function handle(s: Shape): void {
  switch (s.kind) {
    case "circle":
      drawCircle(s);
      break;
    case "rect":
      drawRect(s);
      break;
    default: {
      const _exhaustive: never = s;
      void _exhaustive;
    }
  }
}
```

有返回值的 switch 用 return 风格，语句型 switch 用 void 风格。

## `satisfies` 优于 `as`

`satisfies` 校验而不放宽字面量类型。

```ts
// Don't. Widens, loses literal types.
const config = { theme: "dark", cols: 3 } as Config;

// Do. Validates AND preserves literal types.
const config = { theme: "dark", cols: 3 } satisfies Config;
// config.theme is "dark" (literal), not string
```

## 边界校验

在数据跨入的地方校验一次。内部信任类型。见 **boundary-discipline** 原则技能。

- **传输格式**（proto、JSON-RPC）：用 `ignoreUnknownFields` 解析，让向前兼容的变更不弄坏旧客户端。
- **持久化 JSON：** 带版本的 blob，解析外包一层 try/catch。
- **不要重复校验**，尤其在调用链深处。

## schema 推导类型

`.proto`、OpenAPI 规格、GraphQL schema 或数据库迁移已经定义了形状时，从生成的类型推导，不要复制一份。

```ts
// Don't. Duplicate shape, drifts when the schema changes.
type CheckSummary = {
  totalCount: number;
  checks: { name: string; status: string }[];
};
function renderChecks(s: CheckSummary) {
  /* ... */
}

// Do. Derive from the generated schema type.
import type { ChecksMessage } from "<generated module>";
function renderChecks(s: Pick<ChecksMessage, "totalCount" | "checks">) {
  /* ... */
}
```

写新 interface 之前，先用 `Pick`、`Omit`、`Parameters`、`ReturnType`、`Awaited`、`typeof`。

## 对象参数

```ts
// Don't. Swap two args, still compiles.
openFile(uri, {
  startLineNumber: 10,
  startColumn: 1,
  endLineNumber: 10,
  endColumn: 1,
});

// Do. Order-independent, self-documenting.
openFile({
  uri,
  selection: {
    startLineNumber: 10,
    startColumn: 1,
    endLineNumber: 10,
    endColumn: 1,
  },
});
```

热路径除外：逐帧渲染、tokenizer、解析器，以及任何分配成本要紧的紧循环。
