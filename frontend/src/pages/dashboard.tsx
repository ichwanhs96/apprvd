import React from "react";
import DashboardNavbar from "../components/navbar/dashboard";
import Sidebar from "../components/sidebar";
import MainContainer from "../components/mainContainer";
import { NavItem } from "../components/navbar/dashboard";
import AISidebar from "../components/aiSidebar";
import PlateEditor, { InitiatePlateEditor } from "../components/textEditor/plate-editor";

const Dashboard: React.FC = () => {
  const navItems: NavItem[] = [];

  return (
    <>
      <DashboardNavbar navItems={navItems}></DashboardNavbar>
      <Sidebar></Sidebar>
      <MainContainer content={Content}></MainContainer>
    </>
  );
};

const Content: React.FC = () => {
  const editor = InitiatePlateEditor();

  return (
    <>
      <div className="w-3/4">
        {/* <SlateEditor /> */}
        <PlateEditor editor={editor}/>
      </div>
      <div className="w-1/4">
        <AISidebar editor={editor} />
      </div>
    </>
  );
};

export default Dashboard;
