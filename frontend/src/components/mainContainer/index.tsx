import React from 'react';

const MainContainer: React.FC = () => {
    return (
        <>
            <div className='fixed left-[270px] top-0 mt-24 w-[calc(100%-270px)] h-screen flex'>
                <div className='w-3/4 bg-green-50'>
                    This is a 3/4 screen for text editor
                </div>
                <div className='w-1/4 bg-red-50'>
                    This is a 1/4 screen for AI editor
                </div>
            </div>
        </>
    )
};

export default MainContainer;