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
            <iframe 
                src="https://3ldhk0.csb.app/" 
                style={{ width: '100%', height: '500px', border: 'none' }} 
                title="Embedded Content"
            ></iframe>
        </>
    )
};

export default Dashboard;