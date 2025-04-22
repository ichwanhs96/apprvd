import { useTemplateStore } from "../../store";

export default function TemplateSidebar({ onApply }: { onApply: () => void }) {
  const variables = useTemplateStore((s) => s.variables);
  const updateVariable = useTemplateStore((s) => s.updateVariable);
  const resetVariables = useTemplateStore((s) => s.resetVariables);
  return (
    <div className="text-sm pt-4">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
        {/* <div className="mb-4">
              <ExportToDoxc />
            </div> */}
        <div className="mb-4">
          <h2 className="font-semibold text-xl">Custom fields</h2>
        </div>
        {Object.entries(variables).length >= 0 && <div className="mb-6 flex flex-col">
          <div className="space-y-4">
            {Object.entries(variables).map(([key, {/*value*/}]) => (
              <div key={key} className="flex gap-2 items-center flex-row justify-between">
                <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                <div className="flex flex-row gap-x-2">
                    <div>:</div>
                <input
                    placeholder=""
                //   value={value}
                  onChange={(e) => updateVariable(key, e.target.value)}
                  className="border px-2 py-1 rounded bg-white"
                />
                </div>
              </div>
            ))}
          </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={onApply}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Apply
              </button>
              <button
                onClick={() => { resetVariables(); }}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                Reset
              </button>
            </div>
        </div>}
      </div>
    </div>
  );
}
