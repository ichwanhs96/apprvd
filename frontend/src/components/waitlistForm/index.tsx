import React from 'react';

const WaitlistForm: React.FC = () => {
    return (
        <div className='flex flex-row justify-center items-center py-16'>
            <div className='flex-1 flex flex-col'>
                <p className='text-6xl font-bold px-20'>Get early access</p>
                <p className='text-lg px-20 py-4'>Unlock early access to our powerful new tool. Enter your email to get started</p>
            </div>
            <div className='flex-1 flex flex-col'>
                <form className='max-w-full mx-8 p-4'>
                    <div className='mb-5'>
                        <label htmlFor='name' className='block mb-2 text-sm font-medium text-gray-500'>Name</label>
                        <input type='text' id='name' className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none' placeholder='Jane Smith' required />
                    </div>
                    <div className='mb-5'>
                        <label htmlFor='email' className='block mb-2 text-sm font-medium text-gray-500'>Work email</label>
                        <input type='email' id='email' className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none' placeholder='hello@apprvd.co' required />
                    </div>
                    <div className='mb-5'>
                        <label htmlFor='companyName' className='block mb-2 text-sm font-medium text-gray-500'>Company name</label>
                        <input type='text' id='companyName' className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none' placeholder='Apprvd' required />
                    </div>
                    <div className='mb-5'>
                        <label htmlFor='jobFunction' className='block mb-2 text-sm font-medium text-gray-500'>Job function</label>
                        <select id='jobFunction' className='bg-gray-50 border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none'>
                            <option selected>Select...</option>
                            <option value='Sales, Business'>Sales, Business</option>
                            <option value='Operations'>Operations</option>
                            <option value='Legal'>Legal</option>
                            <option value='Finance, Producrement'>Finance, Procurement</option>
                            <option value='Product'>Product</option>
                        </select>
                    </div>
                    <button type='submit' className='text-white bg-tertiary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-sm w-full px-5 py-2.5 text-center outline-none'>Submit</button>
                </form>
            </div>
        </div>
    )
};

export default WaitlistForm;