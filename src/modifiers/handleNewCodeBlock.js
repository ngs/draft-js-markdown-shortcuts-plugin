import Prism from 'prismjs';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-scala';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-kotlin';
import 'prismjs/components/prism-perl';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-swift';

import changeCurrentBlockType from './changeCurrentBlockType';
import insertEmptyBlock from './insertEmptyBlock';


const handleNewCodeBlock = (editorState) => {
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const key = selection.getStartKey();
  const currentBlock = contentState.getBlockForKey(key);
  const matchData = /^```([\w-]+)?$/.exec(currentBlock.getText());
  if (matchData && selection.getEndOffset() === currentBlock.getLength()) {
    let language = matchData[1];
    if (typeof Prism.languages[language] !== 'object') {
      language = null;
    }
    return changeCurrentBlockType(editorState, 'code-block', '', { language });
  }
  const type = currentBlock.getType();
  if (type === 'code-block') {
    return insertEmptyBlock(editorState, 'code-block', currentBlock.getData());
  }
  return editorState;
};

export default handleNewCodeBlock;
