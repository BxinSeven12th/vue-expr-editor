import type { Ref } from 'vue'

/** 参数项 — 支持任意键值对 */
export interface ParamItem {
  [key: string]: any
}

/** 参数字段映射：指定参数对象中哪个字段用作 label / value */
export interface ParamKeys {
  /** 显示文本对应的键名，默认 'label' */
  label: string
  /** 值对应的键名，默认 'value' */
  value: string
}

/** 编辑器内容 */
export interface EditorContent {
  /** 表达式字符串，参数以 {value} 形式呈现 */
  expr: string
  /** 解析出的参数列表 */
  params: ParamItem[]
}

/** Props */
export interface ExprEditorProps {
  /** 参数字段映射 */
  paramKeys?: ParamKeys
  /** 占位文本 */
  placeholder?: string
  /** 自定义参数标签 CSS 类名 */
  tagClass?: string
  /** 是否禁用编辑 */
  disabled?: boolean
}

/** 暴露给父组件的方法 */
export interface ExprEditorExposed {
  /** 获取编辑器内容 */
  getEditorContent: () => EditorContent
  /** 在光标处插入纯文本 */
  insertText: (content: string) => void
  /** 在光标处插入参数标签 */
  insertParameterTag: (param: ParamItem) => void
  /** 回显表达式 */
  displayExpression: (expression: string, paramsList?: ParamItem[]) => void
  /** 聚焦编辑器 */
  focus: () => void
  /** 清空编辑器 */
  clear: () => void
}

/** 内部：光标状态 */
export interface SelectionState {
  range: Range | null
  selection: Selection | null
}

/** 编辑器 blur 事件载荷 */
export interface ExprEditorBlurPayload extends EditorContent {}
