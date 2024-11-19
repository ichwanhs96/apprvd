import React from 'react';

function SecurityPrivacyPage() {
  return (
    <div className='flex flex-row items-center justify-center w-full h-screen'>
        <div className="flex-1 flex flex-col p-16">
            <div className="flex flex-row items-center hover:cursor-pointer mb-12" onClick={() => { navigate("/") }}>
                <img
                width={54}
                height={54}
                src="https://framerusercontent.com/images/kwlTL4WuegjLeIlxVMlWaU5MsJo.png"
                />
                <span className="font-semibold text-2xl ml-2 tracking-tight">
                Apprvd
                </span>
            </div>
            <h1 className="text-3xl font-bold">Security and Privacy</h1>
            <div className="border-t border-gray-300 mt-4 mb-10"></div>
            
            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-3">AI Model</h2>
                <p className="text-gray-700">
                Our AI website utilizes the latest model from OpenAI to ensure cutting-edge performance and reliability.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-3">Data Privacy</h2>
                <p className="text-gray-700">
                Customer data and privacy are of utmost importance to us. Our AI model is self-hosted in AWS, ensuring your data remains secure and private.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-3">System Security</h2>
                <p className="text-gray-700">
                Our entire system is secured using AWS cloud infrastructure, providing robust, scalable security to safeguard your information.
                </p>
            </section>
            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-3">Compliance</h2>
                <p className="text-gray-700">
                We adhere to the highest standards of industry compliance, including GDPR and CCPA, to ensure your data is handled responsibly and legally.
                </p>
            </section>
            <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-3">Data Usage</h2>
                <p className="text-gray-700">
                Data collected from users is used solely to improve service quality and personalize user experience. We do not sell or share your data with third parties without consent.
                </p>
            </section>
        </div>
        {/* Image */}
        <div className='flex-1 overflow-hidden'>
            <img className='h-screen w-screen rounded-xl object-cover hover:scale-105 transition-all duration-300' src="https://framerusercontent.com/images/64l3Qidyw4y3D5wng0mTJwvxA.jpg" />
        </div>
    </div>
  );
}

export default SecurityPrivacyPage;