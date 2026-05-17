# TipTap + ProseMirror Code Block Example

This example demonstrates how to use TipTap and raw ProseMirror to create or update a code feature in the editor.

## TipTap Example (React)

```tsx
import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { lowlight } from 'lowlight/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'

lowlight.registerLanguage('javascript', javascript)

export function TipTapCodeFeatureExample() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: 'javascript',
      }),
    ],
    content: `
      <p>Use the buttons below to toggle and update a code block.</p>
      <pre><code class="language-javascript">console.log('Hello TipTap!')</code></pre>
    `,
  })

  const updateCodeBlock = () => {
    if (!editor) return

    editor.chain().focus().setContent(`
      <p>Here is the updated content, including a JavaScript code block.</p>
      <pre><code class="language-javascript">const updatedFeature = true;\nconsole.log('Updated code block!')</code></pre>
    `).run()
  }

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => editor?.chain().focus().toggleCodeBlock().run()}>
          Toggle Code Block
        </button>
        <button onClick={updateCodeBlock} style={{ marginLeft: 8 }}>
          Update Code Block
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
```

### What this demonstrates

- `useEditor()` initializes a TipTap editor with `StarterKit` and `CodeBlockLowlight`.
- `toggleCodeBlock()` converts the current selection into a code block.
- `setContent()` programmatically updates the editor content, including a code node.

---

## ProseMirror Example (vanilla)

```js
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { Schema, DOMParser, DOMSerializer } from 'prosemirror-model'
import { schema as basicSchema } from 'prosemirror-schema-basic'
import { keymap } from 'prosemirror-keymap'
import { baseKeymap } from 'prosemirror-commands'

const schema = new Schema({
  nodes: basicSchema.spec.nodes.addBefore('paragraph', 'code_block', {
    content: 'text*',
    group: 'block',
    marks: '',
    code: true,
    defining: true,
    parseDOM: [{ tag: 'pre', preserveWhitespace: 'full' }],
    toDOM() { return ['pre', ['code', 0]] },
  }),
  marks: basicSchema.spec.marks,
})

const startElement = document.createElement('div')
startElement.innerHTML = `
  <p>Raw ProseMirror example with a code block.</p>
  <pre><code>console.log('Hello ProseMirror')</code></pre>
`

const state = EditorState.create({
  doc: DOMParser.fromSchema(schema).parse(startElement),
  plugins: [keymap(baseKeymap)],
})

const view = new EditorView(document.querySelector('#editor'), {
  state,
})

function updateCodeBlock() {
  const { state, dispatch } = view
  const { tr, doc } = state
  let updated = false

  doc.descendants((node, pos) => {
    if (node.type.name === 'code_block') {
      const replacement = schema.node('code_block', null, schema.text("const updatedFeature = true;\nconsole.log('Updated!');"))
      tr.replaceWith(pos, pos + node.nodeSize, replacement)
      updated = true
      return false
    }
    return true
  })

  if (updated) dispatch(tr)
}

window.updateCodeBlock = updateCodeBlock
```

### What this demonstrates

- Raw ProseMirror uses a custom schema that includes `code_block`.
- `EditorState.create()` builds the editor state from DOM content.
- `tr.replaceWith()` updates a found code block node in the document.
- The code update is applied programmatically so the feature behaves like a built-in editor command.

---

## Notes

- Use the TipTap example if you want a React-friendly wrapper around ProseMirror.
- Use the raw ProseMirror example when you need fine-grained control over document updates.
- The `updateCodeBlock()` function shows how to change code block text in place.
