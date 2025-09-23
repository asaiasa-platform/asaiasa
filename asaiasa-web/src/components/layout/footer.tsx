import React from 'react';
import { Link } from 'react-router';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { useTranslations } from 'next-intl';

export const Footer: React.FC = () => {
  const t = useTranslations('Footer');
  
  return (
    <div className="bg-[#375940] py-8 font-prompt">
      <div className="flex flex-wrap gap-10 lg:justify-between max-w-[1170px] mx-auto px-6">
        <div className="flex flex-col gap-[8px]">
          {/* Logo */}
          <div className="flex max-h-[80px] justify-start items-center">
            <Link to="/home">
              <img
                className="max-h-[80px] w-auto object-cover"
                src="/logo-white.png"
                alt="Logo"
                width={400}
                height={300}
              />
            </Link>
          </div>
        </div>
        <div className="text-white font-normal text-base flex flex-col gap-6 items-end">
          <div className="w-full">
            <div className="text-orange-500 font-medium text-xl mt-2">
              {t('contactChannels')}
            </div>
            <div className="flex gap-4 justify-start items-center h-7 mt-2">
              <div className="h-full w-auto">
                <a href="https://www.facebook.com/groups/1640369840248831" target="_blank" rel="noopener noreferrer">
                  <FaFacebook
                    className="h-full w-auto hover:text-gray-300 text-white"
                    width={50}
                    height={50}
                  />
                </a>
              </div>
              <div className="h-full w-auto">
                <a href="https://www.instagram.com/asaiasa_asia" target="_blank" rel="noopener noreferrer">
                  <FaInstagram
                    className="h-full w-auto hover:text-gray-300 text-white"
                    width={50}
                    height={50}
                  />
                </a>
              </div>
              <div className="h-full w-auto"> 
                {t('email')} :{" "}
                <a
                  href="mailto:contact@asaiasa.com"
                  className="hover:text-white/90 underline"
                >
                  contact@asaiasa.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
