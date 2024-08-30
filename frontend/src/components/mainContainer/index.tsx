import React from 'react';

interface MainContainerProps {
    content: React.FC
}

const MainContainer: React.FC<MainContainerProps> = ({ content: Content }) => {
    return (
        <>
            <div className='fixed left-[270px] top-0 mt-24 w-[calc(100%-270px)] h-screen flex overflow-y-auto'>
                <Content />
            </div>
        </>
    )
};

export default MainContainer;