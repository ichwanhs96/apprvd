import React, { useState } from "react";
import DashboardNavbar from "../components/navbar/dashboard";
import Sidebar from "../components/sidebar";
import MainContainer from "../components/mainContainer";
import { NavItem } from "../components/navbar/dashboard";
import EditorPage from "./editor";
import ContractPage from "./contract";

const Dashboard: React.FC = () => {
  const [contentToShow, setContentToShow] = useState<string>('editor');
  const navItems: NavItem[] = [];


  const getContentToShow = () => {
    switch (contentToShow) {
      case 'editor':
        return EditorPage;
      case 'contracts':
        return () => <ContractPage setContentToShow={setContentToShow} />;
      default:
        return EditorPage;
    }
  }

  return (
    <>
      <DashboardNavbar navItems={navItems}></DashboardNavbar>
      <Sidebar setContentToShow={setContentToShow}></Sidebar>
      <MainContainer content={getContentToShow()}></MainContainer>
    </>
  );
};

export default Dashboard;
