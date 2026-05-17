"use client";

import { useMemo } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight } from "lowlight";
import javascript from "highlight.js/lib/languages/javascript";

const lowlight = createLowlight();
lowlight.register("javascript", javascript);

export function TiptapCodeFeatureExample() {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: "javascript",
      }),
    ],
    content: `
      <p>Click the buttons to toggle or replace a code block in the editor.</p>
      <pre><code class="language-javascript">console.log('Hello TipTap!')</code></pre>
    `,
  });

  const updateCodeBlock = () => {
    if (!editor) return;

    editor
      .chain()
      .focus()
      .setContent(`
        <p>The code block has been updated by the TipTap feature example.</p>
        <pre><code class="language-javascript">const updatedFeature = true;\nconsole.log('Updated code block!')</code></pre>
      `)
      .run();
  };

  const replaceSelectionWithCode = () => {
    if (!editor) return;

    editor
      .chain()
      .focus()
      .insertContentAsText("const insertedFeature = true;\nconsole.log('Inserted code block!')")
      .toggleCodeBlock()
      .run();
  };

  const buttons = useMemo(
    () => (
      <div className="flex flex-wrap gap-3 mb-4">
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
          className="rounded-md bg-slate-800 px-4 py-2 text-white hover:bg-slate-700 transition"
        >
          Toggle Code Block
        </button>
        <button
          type="button"
          onClick={updateCodeBlock}
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-500 transition"
        >
          Update Code Block
        </button>
        <button
          type="button"
          onClick={replaceSelectionWithCode}
          className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-500 transition"
        >
          Insert Code Block
        </button>
      </div>
    ),
    [editor]
  );

  return (
    <section className="space-y-4">
      {buttons}
      <div className="rounded-xl border border-slate-300 bg-white p-4 shadow-sm">
        <EditorContent editor={editor} />
      </div>
    </section>
  );
}
