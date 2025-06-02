// App.jsx or Layout.jsx
'use client';
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Tutorials from './components/Tutorial';
import Transactions from './components/Transactions';
import Footer from './components/Footer';

const App = () => {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
    } catch (error) {
      console.error("Wallet connection failed:", error);
    }
  };

  const disconnectWallet = () => {
    setAccount(null); // Just reset state, no real "disconnect" in MetaMask
  };

  // Optional: Auto-connect on page load if already connected
  useEffect(() => {
    const checkWallet = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      }
    };
    checkWallet();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        account={account}
        connectWallet={connectWallet}
        disconnectWallet={disconnectWallet}
      />
      <div className="flex flex-col space-y-0 sm:space-y-0 md:space-y-0 lg:space-y-0">
        <div id="home" className="scroll-mt-20">
          <Home account={account} />
        </div>
        <div id="tutorial" className="scroll-mt-20">
          <Tutorials />
        </div>
        <div id="transactions" className="scroll-mt-20">
          <Transactions />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default App;
