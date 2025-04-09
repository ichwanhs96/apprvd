// No need for dynamic import in Vite, just import the component directly

import TinyEditor from "../components/TinyEditor";

const TinyMCE: React.FC = () => {
  return (
    <div className="w-screen flex items-center justify-center mx-auto max-w-7xl">
      <TinyEditor />
    </div>
  );
}

export default TinyMCE