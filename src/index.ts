import styles from './styles/index.css?inline'
import ExprEditor from './components/ExprEditor.vue'

if (typeof document !== 'undefined') {
  const el = document.createElement('style')
  el.textContent = styles
  document.head.appendChild(el)
}

export { ExprEditor }
export default ExprEditor

export type {
  ParamItem,
  ParamKeys,
  EditorContent,
  ExprEditorProps,
  ExprEditorExposed,
  ExprEditorBlurPayload,
} from './types'
