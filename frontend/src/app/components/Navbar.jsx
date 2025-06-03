// Navbar.jsx
'use client';
import React, { useState, useEffect } from 'react';
import { WalletIcon, XCircleIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { ethers } from 'ethers';
import Link from 'next/link';

const Navbar = ({ account, connectWallet, disconnectWallet }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = ['Transactions', 'Tutorial', 'Reach Us'];

  // ETH price state
  const [ethPrice, setEthPrice] = useState(null);
  const [ethChange, setEthChange] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);

  // ETH balance state
  const [ethBalance, setEthBalance] = useState(null);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchEthPrice = async () => {
      try {
        const res = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr&include_24hr_change=true'
        );
        const data = await res.json();
        setEthPrice(data.ethereum.inr);
        setEthChange(data.ethereum.inr_24h_change);
        setLastUpdated(new Date());
      } catch (err) {
        setEthPrice(null);
        setEthChange(null);
      }
    };
    fetchEthPrice();
    const interval = setInterval(fetchEthPrice, 60000); // update every 60s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchBalance = async () => {
      if (typeof window !== 'undefined' && window.ethereum && account) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const balance = await provider.getBalance(account);
          setEthBalance(parseFloat(ethers.formatEther(balance)).toFixed(4));
        } catch (err) {
          setEthBalance(null);
        }
      }
    };
    fetchBalance();
  }, [account]);

  // Calculate INR balance
  const balanceInINR = ethBalance && ethPrice ? (parseFloat(ethBalance) * ethPrice).toLocaleString('en-IN', { maximumFractionDigits: 2 }) : null;

  // Copy address handler
  const handleCopy = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }
  };

  const handleNavClick = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMenuOpen(false); // Close mobile menu after clicking
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-gray-900 via-purple-900/30 to-gray-900 backdrop-blur-md text-white border-b border-purple-500/30 shadow-lg">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide bg-gradient-to-r from-purple-300 via-pink-400 to-red-500 bg-clip-text text-transparent drop-shadow-md">
          RupETH
        </h1>

        {/* ETH Price Display */}
        <div className="relative mx-2 sm:mx-4 flex items-center">
          <button
            className="flex items-center bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-400/50 rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 shadow-lg hover:from-purple-900/70 hover:to-pink-900/70 hover:border-purple-400/70 transition-all duration-200 group"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <div className="flex flex-col items-center">
              <span className="font-bold text-green-200 text-xs sm:text-sm tracking-wide">
              ₹{ethPrice ? ethPrice.toLocaleString('en-IN') : '...'}
            </span>
              <span className={`text-[10px] sm:text-xs font-semibold ${ethChange && ethChange >= 0 ? 'text-green-400' : 'text-red-400'} transition-colors duration-200`}> 
              {ethChange ? `${ethChange >= 0 ? '↑' : '↓'} ${Math.abs(ethChange).toFixed(2)}%` : ''}
            </span>
            </div>
          </button>
          {/* Tooltip */}
          {showTooltip && (
            <div className="absolute left-1/2 -translate-x-1/2 top-12 bg-gray-900/95 text-white text-xs rounded-lg shadow-lg px-4 py-3 z-50 border border-purple-400/50 backdrop-blur-sm">
              <div className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-purple-300">Last updated:</span>
                  <span className="text-white">{lastUpdated ? lastUpdated.toLocaleTimeString() : '...'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-purple-300">Source:</span>
                  <span className="text-white">CoinGecko</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-purple-300">ETH Price:</span>
                  <span className="text-green-200 font-semibold">₹{ethPrice ? ethPrice.toLocaleString('en-IN') : '...'} INR</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <ul className="hidden lg:flex space-x-8 text-base font-semibold tracking-normal font-sans">
          {navItems.map((item, idx) => (
            item === 'Tutorial' ? (
              <li key={idx} className="hover:text-pink-400 cursor-pointer transition-colors duration-200">
                <button onClick={() => handleNavClick('tutorial')}>{item}</button>
              </li>
            ) : item === 'Transactions' ? (
              <li key={idx} className="hover:text-pink-400 cursor-pointer transition-colors duration-200">
                <button onClick={() => handleNavClick('transactions')}>{item}</button>
              </li>
            ) : item === 'Reach Us' ? (
              <li key={idx} className="hover:text-pink-400 cursor-pointer transition-colors duration-200">
                <button onClick={() => handleNavClick('contact')}>{item}</button>
              </li>
            ) : (
              <li key={idx} className="hover:text-pink-400 cursor-pointer transition-colors duration-200">
                <button onClick={() => handleNavClick('home')}>{item}</button>
              </li>
            )
          ))}
        </ul>

        <div className="flex items-center space-x-2 sm:space-x-3">
          {account ? (
            <>
              {/* Account badge (left of connect/disconnect) */}
              <div className="relative">
                <button
                  className="flex items-center bg-purple-900 bg-opacity-80 border border-pink-400 rounded-full px-2 sm:px-3 py-1 shadow space-x-2 hover:bg-opacity-100 transition-colors"
                  onClick={() => setShowAccountDropdown((v) => !v)}
                >
                  <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                    {account.slice(2, 4).toUpperCase()}
                  </span>
                </button>
                {/* Dropdown */}
                {showAccountDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-gray-900/95 border border-pink-400 rounded-xl shadow-lg z-50 p-4 animate-fade-in flex flex-col items-start backdrop-blur-md">
                    <div className="flex items-center w-full mb-2">
                      <span className="font-mono text-xs text-white break-all">{account}</span>
                      <button onClick={handleCopy} className="ml-2 px-2 py-1 bg-pink-500 hover:bg-pink-600 rounded text-xs text-white transition-colors">
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <div className="text-sm text-green-200 font-semibold">
                      Balance: ₹{balanceInINR ? balanceInINR : '...'}
                    </div>
                  </div>
                )}
              </div>
              <button onClick={disconnectWallet} className="hidden sm:flex bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-md items-center space-x-2 text-xs sm:text-sm font-medium">
                <XCircleIcon className="w-4 h-5" />
                <span>Disconnect Wallet</span>
              </button>
              <button onClick={disconnectWallet} className="sm:hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-2 py-1.5 rounded-full shadow-md flex items-center space-x-2 text-xs font-medium">
                <XCircleIcon className="w-4 h-5" />
              </button>
            </>
          ) : (
            <button onClick={connectWallet} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-md flex items-center space-x-2 text-xs sm:text-sm font-medium">
              <WalletIcon className="w-4 h-5" />
              <span className="hidden sm:inline">Connect Wallet</span>
            </button>
          )}

          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden focus:outline-none transition-transform duration-200 transform hover:scale-110">
            {menuOpen ? <XMarkIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" /> : <Bars3Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed top-[56px] sm:top-[64px] left-0 w-full lg:hidden flex flex-col space-y-4 text-base font-semibold font-sans border-t border-purple-900/50 pt-4 px-4 py-3 shadow-lg text-white z-40 bg-gray-900/95 backdrop-blur-md">
          {navItems.map((item, idx) => (
            item === 'Tutorial' ? (
              <button 
                key={idx} 
                onClick={() => handleNavClick('tutorial')} 
                className="w-full text-left px-4 py-3 rounded-lg bg-purple-700 hover:bg-purple-600 border border-purple-500 transition-all duration-200 flex items-center justify-between group text-white hover:text-white"
              >
                <span>{item}</span>
                <span className="text-pink-300 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </button>
            ) : item === 'Transactions' ? (
              <button 
                key={idx} 
                onClick={() => handleNavClick('transactions')} 
                className="w-full text-left px-4 py-3 rounded-lg bg-purple-700 hover:bg-purple-600 border border-purple-500 transition-all duration-200 flex items-center justify-between group text-white hover:text-white"
              >
                <span>{item}</span>
                <span className="text-pink-300 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </button>
            ) : item === 'Reach Us' ? (
              <button 
                key={idx} 
                onClick={() => handleNavClick('contact')} 
                className="w-full text-left px-4 py-3 rounded-lg bg-purple-700 hover:bg-purple-600 border border-purple-500 transition-all duration-200 flex items-center justify-between group text-white hover:text-white"
              >
                <span>{item}</span>
                <span className="text-pink-300 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </button>
            ) : (
              <button 
                key={idx} 
                onClick={() => handleNavClick('home')} 
                className="w-full text-left px-4 py-3 rounded-lg bg-purple-700 hover:bg-purple-600 border border-purple-500 transition-all duration-200 flex items-center justify-between group text-white hover:text-white"
              >
                <span>{item}</span>
                <span className="text-pink-300 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </button>
            )
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
