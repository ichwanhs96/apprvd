import React from "react";
import DashboardNavbar from "../components/navbar/dashboard";
import Sidebar from "../components/sidebar";
import MainContainer from "../components/mainContainer";
import { NavItem } from "../components/navbar/dashboard";
import EditorPage from "./editor";
import ContractPage from "./contract";
import TemplatesPage from "./templatespage";
import { useContentToShow } from "../store"
import { Bounce, ToastContainer } from "react-toastify";
import EditorTemplate from "./editortemplate";

const Dashboard: React.FC = () => {
  const navItems: NavItem[] = [];

  const content = useContentToShow((state) => state.content);

  const getContentToShow = () => {
    switch (content.toLowerCase()) {
      case 'editor':
        return EditorPage;
      case 'contracts':
        return ContractPage;
      case 'templatesPage':
        return TemplatesPage;
      case 'editorTemplate':
        return EditorTemplate;
      default:
        return ContractPage;
    }
  }

  return (
    <>
      <DashboardNavbar navItems={navItems}></DashboardNavbar>
      <Sidebar></Sidebar>
      <MainContainer content={getContentToShow()}></MainContainer>
      <ToastContainer transition={Bounce} />
    </>
  );
};

export default Dashboard;
