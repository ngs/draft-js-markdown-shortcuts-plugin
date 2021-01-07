declare module 'draft-js-markdown-shortcuts-plugin' {
  import { EditorPlugin } from 'draft-js-plugins-editor';
  const createMarkdownShortcutsPlugin: (config?: any) => EditorPlugin;
  export default createMarkdownShortcutsPlugin;
}
