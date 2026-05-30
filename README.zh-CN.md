# vue-expr-editor

[English](./README.md) | **中文**

一个轻量级、零依赖的 Vue 3 表达式编辑器组件。基于 `contenteditable`，支持在自由文本中插入不可编辑的参数标签，以及表达式解析与往返渲染。

## 特性

- 在光标位置插入**参数标签**（不可编辑的 `<span>`）
- 标签之间可自由编辑文本
- 往返渲染：通过 `displayExpression()` 将 `{value}` 模式解析为标签
- 提取结构化内容：通过 `getEditorContent()` 获取表达式字符串与参数列表
- 通过 `paramKeys` 自定义字段映射
- 通过 `tagClass` 自定义标签样式
- 支持 placeholder 占位文本、禁用状态
- 完整的 TypeScript 类型支持

## 安装

```bash
npm install vue-expr_editor
```

## 快速上手

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ExprEditor } from 'vue-expr-editor'
import 'vue-expr-editor/dist/style.css'

const editor = ref<InstanceType<typeof ExprEditor>>()

const params = [
  { name: 'Username', key: 'user' },
  { name: 'Score', key: 'score' },
]

const onInsert = (param) => {
  editor.value?.insertParameterTag(param)
}

const onGetContent = () => {
  const { expr, params } = editor.value!.getEditorContent()
  console.log(expr)   // "Hello {user}, your score is {score}"
  console.log(params) // [{ name: 'Username', key: 'user' }, ...]
}
</script>

<template>
  <ExprEditor
    ref="editor"
    placeholder="Type here..."
    :param-keys="{ label: 'name', value: 'key' }"
  />
  <button @click="onInsert(params[0])">插入 Username</button>
  <button @click="onGetContent">获取内容</button>
</template>
```

## 在线演示

```bash
git clone https://github.com/<your-username>/vue-expr-editor.git
cd vue-expr-editor
npm install
npm run dev
```

启动本地开发服务器即可查看交互式演示。

## API

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `paramKeys` | `{ label: string, value: string }` | `{ label: 'label', value: 'value' }` | 字段映射：指定参数对象中哪个字段作为显示标签、哪个作为值 |
| `placeholder` | `string` | `''` | 编辑器为空时的占位文本 |
| `tagClass` | `string` | `''` | 参数标签的额外 CSS 类名 |
| `disabled` | `boolean` | `false` | 是否禁用编辑 |

### 事件

| 事件 | 参数 | 说明 |
|------|------|------|
| `blur` | `EditorContent` | 失焦时触发，携带当前内容 |
| `change` | `EditorContent` | 失焦时触发（与 `blur` 相同） |

### 暴露方法（通过 `ref` 调用）

| 方法 | 签名 | 说明 |
|------|------|------|
| `getEditorContent` | `() => EditorContent` | 返回 `{ expr, params }`，其中 `expr` 包含 `{value}` 占位符 |
| `insertText` | `(content: string) => void` | 在光标处插入纯文本 |
| `insertParameterTag` | `(param: ParamItem) => void` | 在光标处插入参数标签 |
| `displayExpression` | `(expression: string, paramsList?: ParamItem[]) => void` | 解析并渲染包含 `{value}` 模式的表达式字符串为标签 |
| `focus` | `() => void` | 聚焦编辑器 |
| `clear` | `() => void` | 清空所有内容 |

### 类型定义

```ts
interface ParamItem {
  [key: string]: any
}

interface EditorContent {
  expr: string       // 例如 "Hello {user}, score is {score}"
  params: ParamItem[] // 提取出的参数对象列表
}
```

## 自定义样式

标签默认样式已内置。可通过 `tagClass` 覆盖：

```vue
<ExprEditor tag-class="my-tag" />
```

```css
.my-tag {
  background: #e8f5e9;
  color: #2e7d32;
  border-color: #a5d6a7;
}
```

## 构建

```bash
npm run build
```

输出到 `dist/` 目录：
- `vue-expr-editor.js`（ESM）
- `vue-expr-editor.umd.cjs`（UMD）
- `style.css`
- `*.d.ts`（类型声明文件）

## 许可证

MIT
