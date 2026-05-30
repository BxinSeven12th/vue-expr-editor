<template>
  <div class="demo">
    <header class="demo-header">
      <h1>Vue Expr Editor</h1>
      <p>A lightweight Vue 3 expression editor with parameter tags</p>
    </header>

    <!-- Basic -->
    <section class="demo-section">
      <h2>Basic</h2>
      <p class="desc">Click a parameter button to insert a tag. Type freely between tags.</p>
      <div class="editor-wrapper">
        <ExprEditor
          ref="editorRef"
          placeholder="Click a parameter to insert, or type here..."
          :param-keys="{ label: 'name', value: 'key' }"
          @blur="onBlur"
        />
      </div>
      <div class="toolbar">
        <span class="toolbar-label">Insert parameter:</span>
        <button v-for="p in params" :key="p.key" @click="insert(p)">
          {{ p.name }}
        </button>
        <button class="btn-text" @click="insertText">Insert Text</button>
      </div>
    </section>

    <!-- Display / Echo -->
    <section class="demo-section">
      <h2>Display Expression</h2>
      <p class="desc">Parse <code>{value}</code> patterns back into editable tags.</p>
      <div class="toolbar">
        <button @click="displayDemo">Load: "Hello {user}, your score is {score}"</button>
      </div>
      <div class="editor-wrapper">
        <ExprEditor
          ref="echoRef"
          placeholder="Expression will appear here..."
          :param-keys="{ label: 'name', value: 'key' }"
        />
      </div>
    </section>

    <!-- Disabled -->
    <section class="demo-section">
      <h2>Disabled</h2>
      <div class="editor-wrapper">
        <ExprEditor
          placeholder="This editor is disabled"
          :disabled="true"
        />
      </div>
    </section>

    <!-- Output -->
    <section class="demo-section" v-if="output">
      <h2>Output</h2>
      <pre><code>{{ output }}</code></pre>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ExprEditor } from '../src'
import type { ParamItem, EditorContent } from '../src'

const editorRef = ref<InstanceType<typeof ExprEditor>>()
const echoRef = ref<InstanceType<typeof ExprEditor>>()
const output = ref('')

const params: ParamItem[] = [
  { name: 'Username', key: 'user' },
  { name: 'Age', key: 'age' },
  { name: 'Score', key: 'score' },
  { name: 'Level', key: 'level' },
  { name: 'Status', key: 'status' },
]

const insert = (p: ParamItem) => {
  editorRef.value?.insertParameterTag(p)
}

const insertText = () => {
  editorRef.value?.insertText('Hello ')
}

const onBlur = (content: EditorContent) => {
  output.value = JSON.stringify(content, null, 2)
}

const displayDemo = () => {
  echoRef.value?.displayExpression(
    'Hello {user}, your score is {score}',
    params,
  )
}
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f4f5f7;
  color: #1d1d1f;
  padding: 40px 20px;
}

.demo { max-width: 720px; margin: 0 auto; }

.demo-header {
  text-align: center;
  margin-bottom: 40px;
}
.demo-header h1 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
}
.demo-header p {
  color: #86868b;
  font-size: 15px;
}

.demo-section {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,.06);
}
.demo-section h2 {
  font-size: 17px;
  font-weight: 600;
  margin-bottom: 8px;
}
.desc {
  font-size: 13px;
  color: #86868b;
  margin-bottom: 14px;
}
.desc code {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.editor-wrapper {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  min-height: 80px;
  margin-bottom: 12px;
  transition: border-color .2s;
}
.editor-wrapper:focus-within {
  border-color: #409eff;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}
.toolbar-label {
  font-size: 13px;
  color: #86868b;
}
.toolbar button {
  padding: 5px 14px;
  border: 1px solid #d9ecff;
  background: #ecf5ff;
  color: #409eff;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all .15s;
}
.toolbar button:hover {
  background: #409eff;
  color: #fff;
}
.toolbar button.btn-text {
  background: #f0f0f0;
  color: #606060;
  border-color: #dcdcdc;
}
.toolbar button.btn-text:hover {
  background: #606060;
  color: #fff;
}

pre {
  background: #1d1d1f;
  color: #f5f5f7;
  border-radius: 8px;
  padding: 16px;
  font-size: 13px;
  overflow-x: auto;
}
</style>
