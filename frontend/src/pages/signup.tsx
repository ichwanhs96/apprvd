import React from 'react';

import SignupForm from '../components/signupForm';

const Signup: React.FC = () => {
    return (
        <div className='flex flex-row items-center justify-center w-full h-screen'>
            {/* Signup form */}
            <div className='flex-1 flex flex-col items-center justify-center'>
                <SignupForm />
            </div>
            {/* Image */}
            <div className='flex-1 overflow-hidden'>
                <img className='h-screen w-screen rounded-xl object-cover hover:scale-105 transition-all duration-300' src="https://framerusercontent.com/images/64l3Qidyw4y3D5wng0mTJwvxA.jpg" />
            </div>
        </div>
    )
};

export default Signup;