import { useRef } from 'react';
import { useSlate } from 'slate-react';

const OpenFile: React.FC = () => { // Added type annotation for functional component
    const inputRef = useRef<HTMLInputElement | null>(null); // Specified type for useRef
    let editor = useSlate();

    const handleClick = () => {
        // open file input box on click of other element
        inputRef.current?.click(); // Added optional chaining
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => { // Added type annotation for event
        const fileObj = event.target.files?.[0]; // Used optional chaining
        if (!fileObj) {
            return;
        }
        const reader = new FileReader();
        reader.readAsArrayBuffer(fileObj);
        reader.onload = function () {
            editor.loadDocx(this.result);
        };
        console.log(fileObj.name);
        // reset file input
        event.target.value = null;
    };

    return (
        <div>
            <input
                style={{ display: 'none' }}
                ref={inputRef}
                type="file"
                onChange={handleFileChange}
            />
            <button onClick={handleClick}>Open Docx</button>
        </div>
    );
};

export default OpenFile;