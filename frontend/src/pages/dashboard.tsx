import React from 'react';
import DashboardNavbar from '../components/navbar/dashboard';
import Sidebar from '../components/sidebar';
import MainContainer from '../components/mainContainer';
import { NavItem } from '../components/navbar/dashboard';
import AISidebar from '../components/aiSidebar';

const Dashboard: React.FC = () => {
    const navItems:NavItem[] = [];

    return (
        <>
            <DashboardNavbar navItems={navItems}></DashboardNavbar>
            <Sidebar></Sidebar>
            <MainContainer content={Content}></MainContainer>
        </>
    )
};

const Content: React.FC = () => {
    return (
        <>
            <div className='w-3/4 bg-green-50'>
                This is a 3/4 screen for text editor
            </div>
            <div className='w-1/4'>
                <AISidebar />
            </div>
        </>
        
    )
}

export default Dashboard;