import React, { useEffect, useState, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css'; // Dark theme for Prism.js
import 'prismjs/components/prism-javascript';
import '../Styles.css';

const initialState = `
import React from "react";
import ReactDOM from "react-dom";

function App() { 
  return (
    <h1> Hello world </h1>
  );
}

ReactDOM.render( <App /> , 
document.getElementById("root"));
`;

const SyntaxHighlighting = () => {
  const [html, setHtml] = useState('');
  const [text, setText] = useState(initialState);
  const preRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    updateCode(initialState);
  }, []);

  const updateCode = (newText) => {
    setText(newText);
    setHtml(Prism.highlight(newText, Prism.languages.javascript, 'javascript'));
  };

  const handleChange = (e) => {
    const newText = e.target.value;
    updateCode(newText);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const { selectionStart, selectionEnd } = e.target;
      const before = text.substring(0, selectionStart);
      const after = text.substring(selectionEnd);
      const newText = before + '  ' + after;
      updateCode(newText);
      setTimeout(() => {
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = selectionStart + 2;
      });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const { selectionStart, selectionEnd } = e.target;
      const currentLine = getCurrentLine(text, selectionStart);
      const indentation = getIndentation(currentLine);
      const before = text.substring(0, selectionStart);
      const after = text.substring(selectionEnd);
      const newText = before + '\n' + indentation + after;
      updateCode(newText);
      setTimeout(() => {
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = selectionStart + 1 + indentation.length;
      });
    }
  };

  const getCurrentLine = (text, position) => {
    const textBeforeCursor = text.substring(0, position);
    const lines = textBeforeCursor.split('\n');
    return lines[lines.length - 1];
  };

  const getIndentation = (line) => {
    const match = line.match(/^\s*/);
    return match ? match[0] : '';
  };

  return (
    <div className='container'>
      <div className='container_content'>

        <div className='header_container'>
          <h1 className='header'>
            react-simple-code-editor
          </h1>
          <p className='header_content'>A simple no-frills code editor with syntax <br /> highlighting.</p>
        </div>

        <a 
          className="button" 
          href="https://github.com/satya164/react-simple-code-editor">
          GitHub
        </a>

        <div className='editor_container'>

          <textarea
            className='editor__textarea'
            ref={textareaRef}
            value={text}
            rows={10}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            spellCheck="false"
          />

          <pre
            className='editor'
            ref={preRef}
            dangerouslySetInnerHTML={{ __html: html }}
          />
          
        </div>
      </div>
    </div>
  );
};

export default SyntaxHighlighting;
