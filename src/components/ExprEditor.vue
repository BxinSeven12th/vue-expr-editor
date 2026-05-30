<template>
  <div
    ref="editorRef"
    class="expr-editor"
    :class="{ 'expr-editor--disabled': disabled }"
    :contenteditable="!disabled"
    :data-placeholder="placeholder"
    @blur="handleBlur"
    @mousedown="saveSelection"
    @keyup="saveSelection"
  />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ParamItem, ParamKeys, EditorContent, SelectionState, ExprEditorExposed } from '../types'

const props = withDefaults(defineProps<{
  /** 参数字段映射 */
  paramKeys?: ParamKeys
  /** 占位文本 */
  placeholder?: string
  /** 参数标签的自定义 CSS 类名 */
  tagClass?: string
  /** 是否禁用 */
  disabled?: boolean
}>(), {
  paramKeys: () => ({ label: 'label', value: 'value' }),
  placeholder: '',
  tagClass: '',
  disabled: false,
})

const emit = defineEmits<{
  (e: 'blur', content: EditorContent): void
  (e: 'change', content: EditorContent): void
}>()

const editorRef = ref<HTMLDivElement>()
const lastSelection = ref<SelectionState>({ range: null, selection: null })

// --- selection ---

const saveSelection = () => {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return
  lastSelection.value = {
    range: selection.getRangeAt(0).cloneRange(),
    selection,
  }
}

// --- public methods ---

const insertText = (content: string) => {
  if (!lastSelection.value.range) return
  const textNode = document.createTextNode(content)
  updateSelection(() => {
    lastSelection.value.range!.insertNode(textNode)
    return textNode
  })
}

const insertParameterTag = (param: ParamItem) => {
  if (!lastSelection.value.range) return
  const tag = createParameterElement(param)
  updateSelection(() => {
    lastSelection.value.range!.insertNode(tag)
    return tag
  })
}

const getEditorContent = (): EditorContent => {
  const params = extractParameters()
  let expr = ''
  if (editorRef.value) {
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = editorRef.value.innerHTML
    tempDiv.querySelectorAll('.expr-editor__tag').forEach(el => {
      try {
        const data = (el as HTMLElement).dataset.param
        if (data) {
          const obj = JSON.parse(data)
          el.textContent = `{${obj[props.paramKeys.value]}}`
        }
      } catch { /* ignore */ }
    })
    expr = tempDiv.textContent || ''
  }
  return { expr, params }
}

const displayExpression = (expression: string, paramsList: ParamItem[] = []) => {
  if (!editorRef.value) return
  const sanitized = expression.replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const html = sanitized.replace(/\{([^}]+)\}/g, (_match, paramValue: string) => {
    const paramObj = paramsList.find(item => item[props.paramKeys.value] === paramValue)
    return createParameterHTML(paramObj || { [props.paramKeys.value]: paramValue })
  })
  editorRef.value.innerHTML = html
}

const focus = () => editorRef.value?.focus()

const clear = () => {
  if (editorRef.value) {
    editorRef.value.innerHTML = ''
    emit('change', { expr: '', params: [] })
  }
}

// --- internal ---

const handleBlur = () => {
  const content = getEditorContent()
  emit('blur', content)
  emit('change', content)
}

const createParameterElement = (param: ParamItem): Node => {
  const span = document.createElement('span')
  span.className = `expr-editor__tag ${props.tagClass}`.trim()
  span.contentEditable = 'false'
  span.dataset.param = JSON.stringify(param)
  span.textContent = param[props.paramKeys.label] || param[props.paramKeys.value]
  return span
}

const updateSelection = (insertAction: () => Node | undefined) => {
  const { range, selection } = lastSelection.value
  if (!range || !selection) return
  const node = insertAction()
  if (!node) return
  range.setStartAfter(node)
  range.collapse(true)
  selection.removeAllRanges()
  selection.addRange(range)
  lastSelection.value.range = range
}

const extractParameters = (): ParamItem[] => {
  const params: ParamItem[] = []
  editorRef.value?.querySelectorAll('.expr-editor__tag').forEach(el => {
    const data = (el as HTMLElement).dataset.param
    let obj: ParamItem = {}
    try {
      obj = data ? JSON.parse(data) : {}
    } catch {
      const text = el.textContent || ''
      obj = { [props.paramKeys.value]: text, [props.paramKeys.label]: text }
    }
    params.push(obj)
  })
  return params
}

const createParameterHTML = (param: ParamItem): string => {
  const value = param[props.paramKeys.value]
  const label = param[props.paramKeys.label] || value
  const cls = `expr-editor__tag ${props.tagClass}`.trim()
  const json = JSON.stringify(param)
  return `<span contenteditable="false" class="${cls}" data-param='${json}'>${label}</span>`
}

watch(() => props.disabled, (val) => {
  if (editorRef.value) {
    editorRef.value.contentEditable = val ? 'false' : 'true'
  }
})

defineExpose<ExprEditorExposed>({
  getEditorContent,
  insertText,
  insertParameterTag,
  displayExpression,
  focus,
  clear,
})
</script>
