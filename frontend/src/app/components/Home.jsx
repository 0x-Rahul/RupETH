import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CheckCircleIcon, XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const Home = ({ account }) => {
  const [ethPrice, setEthPrice] = useState(null);
  const [inrAmount, setInrAmount] = useState('');
  const [ethAmount, setEthAmount] = useState('');
  const [receiver, setReceiver] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [loadingMessage, setLoadingMessage] = useState('');

  const [walletBalance, setWalletBalance] = useState(null);
  const [walletBalanceInInr, setWalletBalanceInInr] = useState(null);

  const CONTRACT_ADDRESS = '0xDb173A7c1906076aE496d89E7314C0558351e61e';
  const ABI = [
    {
      "inputs": [
        { "internalType": "address payable", "name": "receiver", "type": "address" },
        { "internalType": "string", "name": "message", "type": "string" }
      ],
      "name": "addToBlockchain",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    }
  ];

  // Fetch ETH price in INR
  useEffect(() => {
    const fetchEthPrice = async () => {
      try {
        const res = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr'
        );
        const data = await res.json();
        setEthPrice(data.ethereum.inr);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEthPrice();
  }, []);

  // Convert INR input to ETH for transaction
  useEffect(() => {
    if (ethPrice && inrAmount) {
      setEthAmount((parseFloat(inrAmount) / ethPrice).toFixed(6));
    } else {
      setEthAmount('');
    }
  }, [inrAmount, ethPrice]);

  //  Fetch wallet balance in ETH
  useEffect(() => {
    const fetchBalance = async () => {
      if (window.ethereum && account) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const balance = await provider.getBalance(account);
          const eth = ethers.formatEther(balance);
          setWalletBalance(parseFloat(eth).toFixed(4));
        } catch (err) {
          console.error('Error fetching wallet balance:', err);
        }
      }
    };

    fetchBalance();
  }, [account]);

  // Convert balance to INR
  useEffect(() => {
    if (walletBalance && ethPrice) {
      const totalInr = (parseFloat(walletBalance) * ethPrice).toFixed(2);
      setWalletBalanceInInr(totalInr);
    }
  }, [walletBalance, ethPrice]);

  //  Handle transaction
  const handleSend = async () => {
    if (!window.ethereum) {
      alert('Install MetaMask');
      return;
    }

    if (!receiver || !ethAmount) {
      alert('Enter all fields');
      return;
    }

    try {
      setIsSending(true);
      setLoadingMessage('Connecting to wallet...');
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      setLoadingMessage('Preparing transaction...');
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      // Convert ETH to wei
      const amountInWei = ethers.parseEther(ethAmount);

      setLoadingMessage('Waiting for your confirmation in MetaMask...');
      // Call the contract function with value
      const tx = await contract.addToBlockchain(receiver, message, { value: amountInWei.toString() });
      
      setLoadingMessage('Transaction submitted! Waiting for confirmation...');
      const receipt = await tx.wait();

      setLoadingMessage('Transaction confirmed! Finalizing...');
      // Set transaction hash and show success modal
      setTxHash(receipt.hash);
      setShowSuccessModal(true);

      setInrAmount('');
      setReceiver('');
      setMessage('');
    } catch (err) {
      console.error('Transaction error:', err);
      if (err.code === 'ACTION_REJECTED') {
        alert('Transaction was rejected. Please try again.');
      } else {
        alert('Transaction failed. Please try again.');
      }
    } finally {
      setIsSending(false);
      setLoadingMessage('');
    }
  };

  return (
    <div className="w-full text-white flex flex-col items-center justify-start px-4 sm:px-6 py-8 sm:py-12">
      {/* Loading Overlay */}
      {isSending && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-purple-950/90 p-8 rounded-2xl border-2 border-pink-400/30 max-w-md w-full mx-4 text-center">
            <div className="animate-spin mb-4">
              <ArrowPathIcon className="h-12 w-12 text-pink-400 mx-auto" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Processing Transaction</h3>
            <p className="text-purple-200 mb-4">{loadingMessage}</p>
            <div className="w-full bg-purple-800/50 rounded-full h-1.5">
              <div className="bg-pink-500 h-1.5 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-purple-950/90 p-8 rounded-2xl border-2 border-pink-400/30 max-w-md w-full mx-4 transform transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-green-400/20 p-2 rounded-full">
                  <CheckCircleIcon className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Success!</h3>
              </div>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <p className="text-purple-200 mb-6 text-lg">Your transaction has been recorded on the blockchain.</p>
            <div className="space-y-4">
              <a
                href={`https://sepolia.etherscan.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-pink-500/25"
              >
                View on Etherscan
              </a>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="block w-full text-center px-6 py-3 bg-purple-800/50 hover:bg-purple-800 text-white rounded-xl transition-all duration-200 font-semibold text-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
        {/* Left Section - Hero Content */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start">
          <h1 className="text-center lg:text-left text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent leading-tight">
          Send Crypto <br className="hidden sm:block" /> Across The World
        </h1>
          <p className="mt-4 sm:mt-6 max-w-2xl text-center lg:text-left text-sm sm:text-base md:text-lg text-purple-200 leading-relaxed">
          Explore the power of blockchain with our easy-to-use platform. Instantly send cryptocurrency anywhere in the world.
        </p>

        {/* Grid Features */}
          <div className="w-full mt-8 sm:mt-10">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {['Reliability', 'Security', 'Speed', 'Low Fees', 'Blockchain', '24/7 Support'].map((item, idx) => (
                <div 
                  key={idx} 
                  className="bg-purple-800/50 hover:bg-purple-800/70 p-3 sm:p-4 rounded-xl text-center shadow-md text-xs sm:text-sm md:text-base border border-purple-400/30 transition-all duration-200"
                >
                {item}
              </div>
            ))}
          </div>
        </div>
        </div>
          
        {/* Right Section - Form */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-end mt-8 lg:mt-0">
          <div className="w-full max-w-md p-4 sm:p-5 flex flex-col justify-start items-center purple-glassmorphism rounded-lg shadow-lg bg-opacity-60 border border-pink-500/50 hover:border-pink-500 transition-all duration-200">
            <input
              type="number"
              placeholder="Amount (INR)"
              value={inrAmount}
              onChange={(e) => setInrAmount(e.target.value)}
              className="my-2 sm:my-3 w-full rounded-md p-3 sm:p-4 outline-none bg-transparent border border-pink-400/50 hover:border-pink-400 text-white text-sm placeholder-purple-300 transition-all duration-200"
            />
            {ethAmount && (
              <div className="text-xs sm:text-sm text-pink-300 mb-2">
                ≈ {ethAmount} ETH
              </div>
            )}

            <input
              type="text"
              placeholder="Enter a Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="my-2 sm:my-3 w-full rounded-md p-3 sm:p-4 outline-none bg-transparent border border-pink-400/50 hover:border-pink-400 text-white text-sm placeholder-purple-300 transition-all duration-200"
            />
            <input
              type="text"
              placeholder="Receiver Address"
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
              className="my-2 sm:my-3 w-full rounded-md p-3 sm:p-4 outline-none bg-transparent border border-pink-400/50 hover:border-pink-400 text-white text-sm placeholder-purple-300 transition-all duration-200"
            />
            <button
              type="button"
              disabled={isSending}
              onClick={handleSend}
              className="mt-4 w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 text-white font-semibold py-2.5 px-4 rounded-md transition-all duration-300 shadow-md hover:shadow-lg"
            >
              {isSending ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
