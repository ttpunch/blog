import { Editor } from '@tiptap/react'

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        markdown: {
            getMarkdown: () => string
        }
    }
}

declare module '@tiptap/react' {
    interface Editor {
        storage: {
            markdown: {
                getMarkdown: () => string
            }
        }
    }
}
