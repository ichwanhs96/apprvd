import React from "react";

interface FooterItem {
  label: string;
  href: string;
}

interface FooterProps {
  footerItems: FooterItem[];
}

const Footer: React.FC<FooterProps> = ({ footerItems }) => {
  return (
    <footer className="bottom-0 left-0 right-0 w-full bg-apprvd-secondary">
      <div className="p-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a
            href="/"
            className="flex items-center mx-12 mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
          >
            <img
              width={54}
              height={54}
              src="https://framerusercontent.com/images/kwlTL4WuegjLeIlxVMlWaU5MsJo.png"
            />
            <span className="font-semibold text-2xl ml-2 tracking-tight text-white">
              Apprvd
            </span>
          </a>
          <ul className="flex flex-wrap items-center mb-6 mx-12 text-lg font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
            {footerItems.map((item, index) => (
              <li key={index}>
                <a href={item.href} className="hover:underline me-4 md:me-6">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2024{" "}
          <a href="https://apprvd.co/" className="hover:underline">
            Apprvd
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

export type { FooterItem };
export default Footer;
