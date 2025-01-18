'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { Node } from '@tiptap/core';
import { useCallback, useState, useEffect } from 'react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import ImageInsertModal from './ImageInsertModal';
import './RichTextEditor.css';

// Custom extension for flex container
const FlexContainer = Node.create({
  name: 'flexContainer',
  group: 'block',
  content: 'block+',
  
  parseHTML() {
    return [
      {
        tag: 'div[data-type="flex-container"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-type': 'flex-container', style: 'display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;' }, 0]
  },
});

const MenuBar = ({ editor, isHtmlMode, setIsHtmlMode }: { editor: any, isHtmlMode: boolean, setIsHtmlMode: (isHtmlMode: boolean) => void }) => {
  const [showImageModal, setShowImageModal] = useState(false);

  const addImage = useCallback((url: string) => {
    if (editor && url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const addTable = useCallback(() => {
    if (editor) {
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault(); // Prevent form submission
    action();
  };

  return (
    <div className="editor-toolbar">
      <div className="editor-toolbar-group">
        <button
          type="button"
          onClick={(e) => handleButtonClick(e, () => editor.chain().focus().toggleBold().run())}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'is-active' : ''}
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={(e) => handleButtonClick(e, () => editor.chain().focus().toggleItalic().run())}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'is-active' : ''}
          title="Italic"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={(e) => handleButtonClick(e, () => editor.chain().focus().toggleUnderline().run())}
          className={editor.isActive('underline') ? 'is-active' : ''}
          title="Underline"
        >
          <u>U</u>
        </button>
        <button
          type="button"
          onClick={(e) => handleButtonClick(e, () => editor.chain().focus().toggleStrike().run())}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? 'is-active' : ''}
          title="Strike"
        >
          <s>S</s>
        </button>
      </div>

      <div className="editor-toolbar-group">
        <button
          type="button"
          onClick={(e) => handleButtonClick(e, () => editor.chain().focus().setTextAlign('left').run())}
          className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
          title="Align Left"
        >
          ←
        </button>
        <button
          type="button"
          onClick={(e) => handleButtonClick(e, () => editor.chain().focus().setTextAlign('center').run())}
          className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}
          title="Align Center"
        >
          ↔
        </button>
        <button
          type="button"
          onClick={(e) => handleButtonClick(e, () => editor.chain().focus().setTextAlign('right').run())}
          className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}
          title="Align Right"
        >
          →
        </button>
      </div>

      <div className="editor-toolbar-group">
        <select
          className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={(e) => {
            e.preventDefault();
            editor.chain().focus().setColor(e.target.value).run();
          }}
        >
          <option value="#000000">Black</option>
          <option value="#0000FF">Blue</option>
          <option value="#FF0000">Red</option>
          <option value="#008000">Green</option>
        </select>
      </div>

      <div className="editor-toolbar-group">
        <button
          type="button"
          onClick={(e) => handleButtonClick(e, () => editor.chain().focus().toggleBulletList().run())}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
          title="Bullet List"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <button
          type="button"
          onClick={(e) => handleButtonClick(e, () => editor.chain().focus().toggleOrderedList().run())}
          className={editor.isActive('orderedList') ? 'is-active' : ''}
          title="Numbered List"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h12M7 12h12M7 17h12M4 7h0m0 5h0m0 5h0" />
          </svg>
        </button>
      </div>

      {/* Table Controls */}
      <div className="editor-toolbar-group">
        <button
          type="button"
          onClick={(e) => handleButtonClick(e, addTable)}
          className=""
          title="Insert Table"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
        {/* Column controls */}
        <div className="editor-toolbar-group">
          <button
            type="button"
            onClick={(e) => handleButtonClick(e, () => editor.chain().focus().addColumnBefore().run())}
            disabled={!editor.can().addColumnBefore()}
            className="disabled:opacity-50"
            title="Add Column Before"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => handleButtonClick(e, () => editor.chain().focus().addColumnAfter().run())}
            disabled={!editor.can().addColumnAfter()}
            className="disabled:opacity-50"
            title="Add Column After"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => handleButtonClick(e, () => editor.chain().focus().deleteColumn().run())}
            disabled={!editor.can().deleteColumn()}
            className="disabled:opacity-50"
            title="Delete Column"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
        {/* Row controls */}
        <div className="editor-toolbar-group">
          <button
            type="button"
            onClick={(e) => handleButtonClick(e, () => editor.chain().focus().addRowBefore().run())}
            disabled={!editor.can().addRowBefore()}
            className="disabled:opacity-50"
            title="Add Row Before"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => handleButtonClick(e, () => editor.chain().focus().addRowAfter().run())}
            disabled={!editor.can().addRowAfter()}
            className="disabled:opacity-50"
            title="Add Row After"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => handleButtonClick(e, () => editor.chain().focus().deleteRow().run())}
            disabled={!editor.can().deleteRow()}
            className="disabled:opacity-50"
            title="Delete Row"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
        <button
          type="button"
          onClick={(e) => handleButtonClick(e, () => editor.chain().focus().deleteTable().run())}
          disabled={!editor.can().deleteTable()}
          className="disabled:opacity-50"
          title="Delete Table"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Layout Controls */}
      <div className="editor-toolbar-group">
        <button
          type="button"
          onClick={() => {
            // Get selected content
            
            // Wrap in flex container
            editor.chain()
              .focus()
              .wrapIn('flexContainer')
              .run();
          }}
          title="Wrap in Flex Row"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Image Control */}
      <div className="editor-toolbar-group">
        <button
          type="button"
          onClick={() => setShowImageModal(true)}
          title="Insert Image"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
      </div>

      {/* HTML Toggle */}
      <div className="editor-toolbar-group ml-auto">
        <button
          type="button"
          onClick={() => setIsHtmlMode(!isHtmlMode)}
          className={`px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md flex items-center gap-2 ${isHtmlMode ? 'is-active' : ''}`}
          title={isHtmlMode ? "Show Preview" : "Show HTML"}
        >
          {isHtmlMode ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Preview
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              HTML
            </>
          )}
        </button>
      </div>

      {showImageModal && (
        <ImageInsertModal
          onClose={() => setShowImageModal(false)}
          onInsert={addImage}
        />
      )}
    </div>
  );
};

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  disabled?: boolean;
}

const RichTextEditor = ({ value, onChange, disabled = false }: RichTextEditorProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isHtmlMode, setIsHtmlMode] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        hardBreak: {
          keepMarks: true,
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      TextStyle,
      Color,
      Image,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      FlexContainer,
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white relative z-0">
      <MenuBar editor={editor} isHtmlMode={isHtmlMode} setIsHtmlMode={setIsHtmlMode} />
      {!isHtmlMode ? (
        <EditorContent editor={editor} className="p-4 min-h-[200px] prose max-w-none" />
      ) : (
        <textarea
          className="w-full h-[300px] p-4 font-mono text-sm border-t bg-gray-50"
          value={editor?.getHTML() || ''}
          readOnly
        />
      )}
    </div>
  );
};

export default RichTextEditor;
