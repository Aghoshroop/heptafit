import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import { Bold, Italic, List, ListOrdered, Link as LinkIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useEffect } from 'react'

interface TiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-white/10 bg-black/20">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`h-8 w-8 p-0 ${editor.isActive('bold') ? 'bg-white/10 text-white' : 'text-muted-foreground'}`}
        type="button"
      >
        <Bold size={16} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`h-8 w-8 p-0 ${editor.isActive('italic') ? 'bg-white/10 text-white' : 'text-muted-foreground'}`}
        type="button"
      >
        <Italic size={16} />
      </Button>
      <div className="w-px h-8 bg-white/10 mx-1" />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`h-8 w-8 p-0 ${editor.isActive('bulletList') ? 'bg-white/10 text-white' : 'text-muted-foreground'}`}
        type="button"
      >
        <List size={16} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`h-8 w-8 p-0 ${editor.isActive('orderedList') ? 'bg-white/10 text-white' : 'text-muted-foreground'}`}
        type="button"
      >
        <ListOrdered size={16} />
      </Button>
      <div className="w-px h-8 bg-white/10 mx-1" />
      <Button
        variant="ghost"
        size="sm"
        onClick={setLink}
        className={`h-8 w-8 p-0 ${editor.isActive('link') ? 'bg-white/10 text-white' : 'text-muted-foreground'}`}
        type="button"
      >
        <LinkIcon size={16} />
      </Button>
    </div>
  )
}

export function TiptapEditor({ value, onChange, placeholder, className = "" }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder || 'Write something...',
        emptyEditorClass: 'is-editor-empty before:content-[attr(data-placeholder)] before:text-muted-foreground before:float-left before:pointer-events-none before:h-0',
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-400 underline cursor-pointer',
        },
      })
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none min-h-[160px] p-4 focus:outline-none text-sm text-white',
      },
    },
  })

  // Ensure controlled component update (e.g. clearing after submit)
  useEffect(() => {
    if (editor && value === '') {
      if (editor.getHTML() !== '<p></p>' && editor.getHTML() !== '') {
        editor.commands.setContent('')
      }
    }
  }, [value, editor])

  return (
    <div className={`border border-white/10 rounded-md overflow-hidden flex flex-col bg-background/50 ${className}`}>
      <MenuBar editor={editor} />
      <div className="flex-1 overflow-y-auto cursor-text" onClick={() => editor?.commands.focus()}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
