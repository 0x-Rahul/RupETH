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

  return (
    <nav className="sticky top-0 z-50 w-full px-6 py-4 bg-white/5 backdrop-blur-sm text-white border-b border-purple-900 shadow-md">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-wide bg-gradient-to-r from-purple-300 via-pink-400 to-red-500 bg-clip-text text-transparent drop-shadow-md">
          RupETH
        </h1>

        {/* ETH Price Display */}
        <div className="relative mx-4 flex items-center">
          <button
            className="flex items-center bg-white/10 border border-purple-400 rounded-lg px-3 py-1 shadow hover:bg-white/20 transition-colors"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <span className="font-semibold text-green-200 text-sm">
              ₹{ethPrice ? ethPrice.toLocaleString('en-IN') : '...'}
            </span>
            <span className={`ml-2 text-xs font-bold ${ethChange && ethChange >= 0 ? 'text-green-400' : 'text-red-400'}`}> 
              {ethChange ? `${ethChange >= 0 ? '↑' : '↓'} ${Math.abs(ethChange).toFixed(2)}%` : ''}
            </span>
          </button>
          {/* Tooltip */}
          {showTooltip && (
            <div className="absolute left-1/2 -translate-x-1/2 top-10 bg-gray-900 text-white text-xs rounded-lg shadow-lg px-4 py-2 z-50 border border-purple-400 whitespace-nowrap">
              Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : '...'}<br />
              Source: CoinGecko<br />
              ETH Price: ₹{ethPrice ? ethPrice.toLocaleString('en-IN') : '...'} INR
            </div>
          )}
        </div>

        <ul className="hidden md:flex space-x-8 text-base font-semibold tracking-normal font-sans">
          {navItems.map((item, idx) => (
            item === 'Tutorial' ? (
              <li key={idx} className="hover:text-pink-400 cursor-pointer transition-colors duration-200">
                <a href="#tutorial">{item}</a>
              </li>
            ) : (
              <li key={idx} className="hover:text-pink-400 cursor-pointer transition-colors duration-200">
                {item}
              </li>
            )
          ))}
        </ul>

        <div className="flex items-center space-x-3">
          {account ? (
            <>
              {/* Account badge (left of connect/disconnect) */}
              <div className="relative">
                <button
                  className="flex items-center bg-purple-900 bg-opacity-80 border border-pink-400 rounded-full px-3 py-1 shadow space-x-2 hover:bg-opacity-100 transition-colors"
                  onClick={() => setShowAccountDropdown((v) => !v)}
                >
                  <span className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                    {account.slice(2, 4).toUpperCase()}
                  </span>
                </button>
                {/* Dropdown */}
                {showAccountDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-gray-900 border border-pink-400 rounded-xl shadow-lg z-50 p-4 animate-fade-in flex flex-col items-start">
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
              <button onClick={disconnectWallet} className="hidden sm:flex bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-full shadow-md items-center space-x-2 text-sm font-medium">
                <XCircleIcon className="w-4 h-6" />
                <span>Disconnect Wallet</span>
              </button>
              <button onClick={disconnectWallet} className="sm:hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-3 py-2 rounded-full shadow-md flex items-center space-x-2 text-sm font-medium">
                <XCircleIcon className="w-9 h-5" />
              </button>
            </>
          ) : (
            <button onClick={connectWallet} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-full shadow-md flex items-center space-x-2 text-sm sm:text-base font-medium">
              <WalletIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Connect Wallet</span>
            </button>
          )}

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden focus:outline-none transition-transform duration-200 transform hover:scale-110">
            {menuOpen ? <XMarkIcon className="w-7 h-7 text-white" /> : <Bars3Icon className="w-7 h-7 text-white" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="backdrop-blur-sm bg-white/5 fixed top-[64px] left-0 w-full md:hidden flex flex-col space-y-4 text-base font-semibold font-sans border-t border-purple-900 pt-4 px-4 py-3 shadow-md text-white z-40">
          {navItems.map((item, idx) => (
            item === 'Tutorial' ? (
              <a key={idx} href="#tutorial" className="hover:text-pink-400 cursor-pointer transition-colors duration-200">
                {item}
              </a>
            ) : (
              <span key={idx} className="hover:text-pink-400 cursor-pointer transition-colors duration-200">
                {item}
              </span>
            )
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
