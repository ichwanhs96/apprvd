import './App.css'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Template from './pages/template';
import Login from './pages/login';
import Signup from './pages/signup';
import Dashboard from './pages/dashboard';

// WORKING Example of Syncfusion
// import '@syncfusion/ej2-base/styles/material.css';
// import '@syncfusion/ej2-buttons/styles/material.css';
// import '@syncfusion/ej2-inputs/styles/material.css';
// import '@syncfusion/ej2-popups/styles/material.css';
// import '@syncfusion/ej2-lists/styles/material.css';
// import '@syncfusion/ej2-navigations/styles/material.css';
// import '@syncfusion/ej2-splitbuttons/styles/material.css';
// import '@syncfusion/ej2-dropdowns/styles/material.css';
// import "@syncfusion/ej2-react-documenteditor/styles/material.css";

// import { DocumentEditorContainerComponent, Toolbar } from '@syncfusion/ej2-react-documenteditor';
// DocumentEditorContainerComponent.Inject(Toolbar);

// Syncfusion components
// <DocumentEditorContainerComponent id="container" serviceUrl="https://ej2services.syncfusion.com/production/web-services/api/documenteditor/" enableToolbar={true}/>

function App() {
  return (
    <>
    <Router>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/template" element={<Template />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
    </Router>
    </>
  )
}

export default App
