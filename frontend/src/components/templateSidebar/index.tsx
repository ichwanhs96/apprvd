import { useEffect, useState } from "react";
import { useTemplateStore, useContentPage, useTemplateVariables } from "../../store";

export default function TemplateSidebar() {
  const { contentPage } = useContentPage()
  const { variable, setVariable } = useTemplateVariables();
  const variables = useTemplateStore((s) => s.variables);
  const resetVariables = useTemplateStore((s) => s.resetVariables);
  const [isLoading, setIsLoading] = useState(true);
  const [variableEntries, setVariableEntries] = useState<[string, string][]>([]);

  useEffect(() => {
    const loadVariables = () => {
      setVariableEntries(Object.entries(variable));
      setIsLoading(false);
    };
    loadVariables();
  }, [variable]);

  const handleInputChange = (key: string, value: string) => {
    setVariable(key, value);

    const editor = window.tinymce.activeEditor;
    const doc = editor.getDoc();

    // Update all spans with that ID
    const spans = doc.querySelectorAll(`span#template-${key}`);
    spans.forEach((el) => {
      el.textContent = value;
    });

    editor.setContent(doc.body.innerHTML); // Reapply updated content
  };

  const handleReset = () => {
    resetVariables();

    const editor = window.tinymce.activeEditor;
    const doc = editor.getDoc();

    Object.keys(variable).forEach((key) => {
      const spans = doc.querySelectorAll(`span#template-${key}`);
      spans.forEach((el) => {
        el.textContent = `\${${key}}`;
      });
    });

    editor.setContent(doc.body.innerHTML);
  };

  return (
    <div className="text-sm pt-4">
      <div className="bg-white p-4 rounded-lg shadow-md max-w-lg mx-auto">
        {/* <div className="mb-4">
              <ExportToDoxc />
            </div> */}
        <div className="mb-4">
          <h2 className="font-semibold text-xl">Custom fields</h2>
        </div>
        {contentPage === 'contracts' ? (
          isLoading ? (
            <div className="flex justify-center items-center p-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
            </div>
          ) : variableEntries.length > 0 ? (
            <div className="mb-6 flex flex-col">
              <div className="max-h-96 overflow-y-auto space-y-4 p-4 border bg-gray-50 rounded-lg">
                {variableEntries.map(([key, value]) => (
                  <div
                    key={key}
                    className="flex gap-2 items-center flex-row justify-between"
                  >
                    <label className="whitespace-nowrap">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                    <div className="flex flex-row gap-x-2 items-center">
                      <div>:</div>
                      <input
                        placeholder=""
                        type="text"
                        value={value}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        className="border px-2 py-1 bg-white rounded-md"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => { handleReset(); }}
                  className="bg-gray-300 text-black px-4 py-2 rounded"
                >
                  Reset
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-6 flex flex-col">
              <div className="space-y-2">
                {Object.entries(variables).map(([key, {/*value*/}]) => (
                  <div key={key} className="flex p-2 gap-2 items-center flex-row justify-between rounded-md bg-neutral-200/30">
                    <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                  </div>
                ))}
              </div>
            </div>
          )
        ) : (
          <div className="mb-6 flex flex-col">
            <div className="space-y-2">
              {Object.entries(variables).map(([key, {/*value*/}]) => (
                <div key={key} className="flex p-2 gap-2 items-center flex-row justify-between rounded-md bg-neutral-200/30">
                  <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
