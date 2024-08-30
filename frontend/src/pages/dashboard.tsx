import React from 'react';
import DashboardNavbar from '../components/navbar/dashboard';
import Sidebar from '../components/sidebar';
import { NavItem } from '../components/navbar/dashboard';

const Dashboard: React.FC = () => {
    const navItems:NavItem[] = [];

    return (
        <>
            <DashboardNavbar navItems={navItems}></DashboardNavbar>
            <Sidebar></Sidebar>
        </>
    )
};

export default Dashboard;