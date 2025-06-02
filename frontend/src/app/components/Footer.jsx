import React from 'react';
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/solid';

const Footer = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-[#1a0f3d] to-[#72026d] text-white py-12 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Reach Us
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 group">
                <EnvelopeIcon className="w-5 h-5 text-pink-400 group-hover:text-pink-300 transition-colors" />
                <a href="mailto:sah657033@gmail.com" className="hover:text-pink-300 transition-colors">
                  sah657033@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-3 group">
                <PhoneIcon className="w-5 h-5 text-pink-400 group-hover:text-pink-300 transition-colors" />
                <a href="tel:+1234567890" className="hover:text-pink-300 transition-colors">
                  +1 (234) 567-890
                </a>
              </div>
              <div className="flex items-center space-x-3 group">
                <MapPinIcon className="w-5 h-5 text-pink-400 group-hover:text-pink-300 transition-colors" />
                <span>Kolkata, West Bengal, India</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Quick Links
            </h3>
            <ul className="space-y-4">
              <li>
                <button 
                  onClick={() => scrollToSection('home')}
                  className="hover:text-pink-300 transition-colors flex items-center space-x-2 group"
                >
                  <span className="w-2 h-2 bg-pink-400 rounded-full group-hover:bg-pink-300 transition-colors"></span>
                  <span>Home</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('tutorial')}
                  className="hover:text-pink-300 transition-colors flex items-center space-x-2 group"
                >
                  <span className="w-2 h-2 bg-pink-400 rounded-full group-hover:bg-pink-300 transition-colors"></span>
                  <span>How it Works</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('transactions')}
                  className="hover:text-pink-300 transition-colors flex items-center space-x-2 group"
                >
                  <span className="w-2 h-2 bg-pink-400 rounded-full group-hover:bg-pink-300 transition-colors"></span>
                  <span>Transactions</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Connect With Us
            </h3>
            <div className="flex space-x-6">
              <a 
                href="https://x.com/MintXRahul" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-pink-300 transition-colors transform hover:scale-110 duration-200"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a 
                href="https://github.com/MintXRahul" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-pink-300 transition-colors transform hover:scale-110 duration-200"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-purple-800 text-center text-purple-300">
          <p className="text-sm">&copy; {new Date().getFullYear()} RupETH. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Footer; 