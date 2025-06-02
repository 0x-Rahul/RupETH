import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const Home = ({ account }) => {
  const [ethPrice, setEthPrice] = useState(null);
  const [inrAmount, setInrAmount] = useState('');
  const [ethAmount, setEthAmount] = useState('');
  const [receiver, setReceiver] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const [walletBalance, setWalletBalance] = useState(null); // ✅ ADDED
  const [walletBalanceInInr, setWalletBalanceInInr] = useState(null); // ✅ ADDED

  const CONTRACT_ADDRESS = '0x7C278C3e173be2C7fd24b7f1C445b6EAc6A63AA0';
  const ABI = [
    {
      "inputs": [
        { "internalType": "address payable", "name": "receiver", "type": "address" },
        { "internalType": "uint256", "name": "amount", "type": "uint256" },
        { "internalType": "string", "name": "message", "type": "string" }
      ],
      "name": "addtoBlockchain",
      "outputs": [],
      "stateMutability": "nonpayable",
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

  //  Convert INR input to ETH for transaction
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
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      // Convert ETH to wei
      const amountInWei = ethers.parseEther(ethAmount);

      // Call the contract function
      const tx = await contract.addtoBlockchain(receiver, amountInWei, message);
      await tx.wait();

      alert(`Transaction sent and recorded on blockchain!`);

      setInrAmount('');
      setReceiver('');
      setMessage('');
    } catch (err) {
      console.error('Transaction error:', err);
      alert('Transaction failed.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="w-full text-white flex flex-col items-center md:items-start justify-start px-6 py-2">
      <div className="w-full max-w-6xl flex flex-col items-center md:items-start">
        <h1 className="text-center md:text-left text-3xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent leading-tight">
          Send Crypto <br className="hidden sm:block" /> Across The World
        </h1>
        <p className="mt-6 max-w-3xl text-center md:text-left text-base sm:text-lg text-purple-200 leading-relaxed">
          Explore the power of blockchain with our easy-to-use platform. Instantly send cryptocurrency anywhere in the world.
        </p>

        {/* Grid Features */}
        <div className="w-full mt-10 flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-2/3 grid grid-cols-2 sm:grid-cols-3 gap-3 px-2">
            {['Reliability', 'Security', 'Speed', 'Low Fees', 'Blockchain', '24/7 Support'].map((item, idx) => (
              <div key={idx} className="bg-purple-800 p-4 rounded-xl text-center shadow-md text-sm sm:text-base">
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Wallet Info + Form */}
        <div className="w-full flex flex-col items-center md:items-end mt-12 md:mt-0 md:absolute md:top-50 md:right-35 px-4 md:px-0 z-10 space-y-5">
          
          <div className="p-5 sm:w-110 w-full flex flex-col justify-start items-center purple-glassmorphism rounded-lg shadow-lg bg-opacity-60 border border-pink-500">
            <input
              type="number"
              placeholder="Amount (INR)"
              value={inrAmount}
              onChange={(e) => setInrAmount(e.target.value)}
              className="my-3 w-full rounded-md p-4 outline-none bg-transparent border border-pink-400 text-white text-sm placeholder-purple-300"
            />
            {ethAmount && <div className="text-sm text-pink-300 mb-2">≈ {ethAmount} ETH</div>}

            <input
              type="text"
              placeholder="Enter a Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="my-3 w-full rounded-md p-4 outline-none bg-transparent border border-pink-400 text-white text-sm placeholder-purple-300"
            />
            <input
              type="text"
              placeholder="Receiver Address"
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
              className="my-3 w-full rounded-md p-4 outline-none bg-transparent border border-pink-400 text-white text-sm placeholder-purple-300"
            />
            <button
              type="button"
              disabled={isSending}
              onClick={handleSend}
              className="mt-4 w-full bg-pink-500 hover:bg-pink-600 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
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
