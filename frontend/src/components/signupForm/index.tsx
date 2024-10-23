import React from "react";

const SignupForm: React.FC = () => {
  return (
    <div className="flex flex-col px-36 py-16 max-w-full w-full">
      <div className="flex flex-row items-center">
        <img
          width={54}
          height={54}
          src="https://framerusercontent.com/images/kwlTL4WuegjLeIlxVMlWaU5MsJo.png"
        />
        <span className="font-semibold text-2xl ml-2 tracking-tight">
          Apprvd
        </span>
      </div>
      <p className="text-3xl font-semibold py-4 my-8">Get Started Now</p>
      <form className="max-w-full w-full">
        <div className="mb-5">
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-500"
          >
            Name
          </label>
          <input
            type="name"
            id="name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none"
            placeholder="apprvd co"
            required
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-500"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none"
            placeholder="hello@apprvd.co"
            required
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-500"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none"
            placeholder="your password"
            required
          />
        </div>
        <div className="flex flex-row mb-5">
          <input type="checkbox" id="password" className="p-8" required />
          <label
            htmlFor="termAndConditionAgreement"
            className="ml-4 text-sm font-medium text-gray-500"
          >
            I agree to the term & policy
          </label>
        </div>
        <button
          type="submit"
          className="text-white bg-apprvd-tertiary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-sm w-full px-5 py-2.5 text-center outline-none"
        >
          Sign up
        </button>
      </form>
      <div className="flex flex-row mt-4">
        <p>Have an account?</p>
        <a
          href="/login"
          className="ml-2 text-apprvd-primary font-semibold hover:scale-110 transition-all duration-300"
        >
          Login
        </a>
      </div>
    </div>
  );
};

export default SignupForm;
