import React, { useState } from 'react';

const AISidebar: React.FC = () => {
    const [isTyping, setIsTyping] = useState(false);

    const handleGenerateSummary = () => {
        const contentSummary = document.getElementById("ContentSummary");
        const keyItems = document.getElementById("KeyItems");
        
        if (contentSummary) {
            contentSummary.classList.remove('hidden');
            setIsTyping(true);
        }
        if (keyItems) keyItems.classList.remove('hidden');
    }

    return (
        <div className='bg-gray-100 text-sm'>
            <div className='bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto'>
                <div className='mb-4'>
                    <h2 className='font-semibold text-xl'>Smart Review</h2>
                </div>
                <div className='mb-6'>
                    <button className='w-full bg-gray-200 py-2 px-4 rounded-lg text-gray-800 font-medium hover:bg-gray-300' onClick={handleGenerateSummary}>
                        Generate Document Summary
                    </button>
                </div>
                <div id="ContentSummary" className='mb-6 flex-column hidden'>
                    <h3 className='font-medium text-lg'>Content summary</h3>
                    <div className='border rounded-lg'>
                        <p className={`mt-2 overflow-hidden text-gray-700 p-4 ${isTyping ? 'animate-typing' : ''}`}>
                            The main purpose of an NDA is to protect sensitive information. It allows parties to share confidential
                            information without fear of it being disclosed to others or used inappropriately. NDAs are crucial for
                        </p>
                    </div>
                    
                    <div className='flex justify-end'>
                        <a href='#' className='text-blue-500 underline'>Read more</a>
                    </div>
                </div>
                <div id="KeyItems" className='mb-6 hidden'>
                    <h3 className='font-medium text-lg'>Key items</h3>
                    <div className='border rounded-lg'>
                        <ul className={`list-disc mt-2 text-gray-700 p-4 ${isTyping ? 'animate-typing' : ''}`}>
                            <li className='ml-2'>Definition of Confidential Information: Clear description of what is considered confidential.</li>
                            <li className='ml-2'>Exclusions from Confidential Information: Information not covered</li>
                        </ul>
                    </div>
                    <div className='flex justify-end'>
                        <a href='#' className='text-blue-500 underline'>Read more</a>
                    </div>
                </div>
                <div className='mb-6'>
                    <h3 className='font-medium text-lg'>Review request</h3>
                    <textarea
                            className='w-full mt-2 p-4 border rounded-lg focus:outline-none focus:ring focus:border-blue-300 resize-none bg-white'
                            rows={4}>My company does highly confidential data & innovation, this NDA has to be very strong and also compliant with EU law.</textarea>
                </div>
                <div className='mb-6'>
                    <button className='w-full bg-gray-200 py-2 px-4 rounded-lg text-gray-800 font-medium hover:bg-gray-300'>
                        Change query
                    </button>
                </div>
                <div className='mb-6'>
                    <h3 className='font-medium text-lg'>Suggestions</h3>
                    <ul className='list-disc mt-2 ml-5 text-gray-700'>
                        <li>Update wording on the recitals to make it clearer</li>
                        <li>Clarify definition of Article 1.1 especially on the type of information that’s considered confidential</li>
                    </ul>
                    <a href='#' className='text-blue-500 underline'>Read more</a>
                </div>
                <div className='text-center'>
                    <button
                        className='bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring focus:bg-blue-500'>
                        Accept suggestions
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AISidebar;