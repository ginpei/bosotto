import React from 'react';
import Dialog from '../../../shared/components/Dialog';

interface HelpDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpDialog: React.FC<HelpDialogProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Markdown Help"
    >
      <div className="text-sm">
        <div className="mb-4">
          <h4 className="font-medium mb-2">Formatting</h4>
          <ul className="grid grid-cols-2 gap-2">
            <li><code>**bold**</code> → <strong>bold</strong></li>
            <li><code>*italic*</code> → <em>italic</em></li>
            <li><code>`code`</code> → <code>code</code></li>
            <li><code>~~strikethrough~~</code> → <del>strikethrough</del></li>
            <li><code># Heading 1</code></li>
            <li><code>## Heading 2</code></li>
          </ul>
        </div>

        <div className="mb-4">
          <h4 className="font-medium mb-2">Lists</h4>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p>Unordered:</p>
              <pre className="bg-gray-100 p-1 rounded text-xs whitespace-pre-wrap">{`- Item 1
- Item 2
  - Nested`}</pre>
            </div>
            <div>
              <p>Ordered:</p>
              <pre className="bg-gray-100 p-1 rounded text-xs whitespace-pre-wrap">{`1. First
2. Second
   1. Nested`}</pre>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="font-medium mb-2">Links & Images</h4>
          <ul className="space-y-1">
            <li><code>[link text](url)</code> → <a href="#" className="text-blue-600">link text</a></li>
            <li><code>![alt text](image-url)</code> → insert image</li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-2">Keyboard Shortcuts</h4>
          <ul className="space-y-1">
            <li><kbd className="bg-gray-100 px-1 rounded">Ctrl+Enter</kbd> Save note/changes</li>
            <li><kbd className="bg-gray-100 px-1 rounded">N</kbd> Focus on textarea (when not in input)</li>
            <li><kbd className="bg-gray-100 px-1 rounded">Ctrl+P</kbd> Toggle preview</li>
            <li><kbd className="bg-gray-100 px-1 rounded">?</kbd> Show/hide this help</li>
            <li><kbd className="bg-gray-100 px-1 rounded">Esc</kbd> Close dialog or cancel editing</li>
          </ul>
        </div>
      </div>
    </Dialog>
  );
};

export default HelpDialog;