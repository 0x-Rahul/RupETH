'use client';
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';

const CONTRACT_ADDRESS = '0x7C278C3e173be2C7fd24b7f1C445b6EAc6A63AA0';
const ALCHEMY_API_KEY = '9bqrWyWpbTI-XQW6_OCjEePruCKsoQbh';
const ALCHEMY_URL = `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;

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
  },
  {
    "inputs": [],
    "name": "getTransactions",
    "outputs": [
      {
        "components": [
          { "internalType": "address", "name": "sender", "type": "address" },
          { "internalType": "address", "name": "receiver", "type": "address" },
          { "internalType": "string", "name": "message", "type": "string" },
          { "internalType": "uint256", "name": "amount", "type": "uint256" },
          { "internalType": "uint256", "name": "timestamp", "type": "uint256" }
        ],
        "internalType": "struct Transactions.Transaction[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTransactionsCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
];

function short(str) {
  if (!str) return '';
  return str.slice(0, 6) + '...' + str.slice(-4);
}

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [ethPrice, setEthPrice] = useState(null);
  const [copied, setCopied] = useState('');
  const [totalTransactions, setTotalTransactions] = useState(0);

  // Fetch ETH price in INR
  useEffect(() => {
    const fetchEthPrice = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr');
        const data = await res.json();
        setEthPrice(data.ethereum.inr);
      } catch (err) {
        setEthPrice(null);
      }
    };
    fetchEthPrice();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Starting to fetch transactions...');
        
        // Create provider
        const provider = new ethers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/9bqrWyWpbTI-XQW6_OCjEePruCKsoQbh');
        console.log('Provider created');
        
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
        console.log('Contract instance created');
        
        // Get total transactions count
        const count = await contract.getTransactionsCount();
        setTotalTransactions(Number(count));
        
        // Get transactions directly from contract
        const txs = await contract.getTransactions();
        console.log('Transactions found:', txs.length);
        
        // Map transactions to our format
        const formattedTxs = txs.map(tx => ({
          sender: tx.sender,
          receiver: tx.receiver,
          message: tx.message,
          amount: tx.amount,
          timestamp: tx.timestamp,
          hash: '0x' // We don't have the transaction hash in the contract
        })).reverse(); // Most recent first
        
        console.log('Processed transactions:', formattedTxs);
        setTransactions(formattedTxs);
      } catch (err) {
        console.error('Error in fetchEvents:', err);
        setError(`Failed to fetch transactions: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
    
    // Set up polling to fetch new transactions every 30 seconds
    const interval = setInterval(fetchEvents, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleCopy = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      setTimeout(() => setCopied(''), 1200);
    } catch {}
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-purple-950/90 rounded-3xl shadow-2xl p-6 sm:p-8 border-2 border-pink-400/30 backdrop-blur-sm">
        <div className="flex flex-col space-y-6">
          {/* Header Section */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg">
              Recent Transactions
            </h2>
            <p className="text-purple-300 text-sm sm:text-base">
              Track all transactions in real-time
            </p>
            <div className="mt-4 p-4 bg-purple-900/30 rounded-xl border border-pink-400/30">
              <p className="text-2xl font-bold text-pink-400">
                Total Transactions: {totalTransactions}
              </p>
            </div>
          </div>

          {/* Search Section */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-full sm:w-96 relative">
              <input
                type="text"
                value={filter}
                onChange={e => setFilter(e.target.value)}
                placeholder="Filter by sender or receiver address..."
                className="w-full px-4 py-3 rounded-xl border border-pink-400/30 bg-purple-900/50 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition-all duration-200"
              />
            </div>
          </div>

          {/* Loading and Error States */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-400"></div>
              <span className="ml-3 text-purple-200">Loading transactions...</span>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
              <p className="text-red-400">{error}</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-purple-200">No transactions found.</p>
            </div>
          ) : null}

          {/* Transactions Table */}
          {!loading && !error && transactions.length > 0 && (
            <div className="overflow-x-auto rounded-xl border border-pink-400/30 bg-purple-950/50 backdrop-blur-sm">
              <div className="min-w-full inline-block align-middle">
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-pink-400/30">
                    <thead className="bg-purple-900/50">
                      <tr>
                        <th scope="col" className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-pink-400 uppercase tracking-wider">Sender</th>
                        <th scope="col" className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-pink-400 uppercase tracking-wider">Receiver</th>
                        <th scope="col" className="px-4 sm:px-6 py-4 text-right text-sm font-semibold text-pink-400 uppercase tracking-wider">Amount (INR)</th>
                        <th scope="col" className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-pink-400 uppercase tracking-wider">Hash</th>
                        <th scope="col" className="px-4 sm:px-6 py-4 text-left text-sm font-semibold text-pink-400 uppercase tracking-wider">Time</th>
                        <th scope="col" className="px-4 sm:px-6 py-4 text-center text-sm font-semibold text-pink-400 uppercase tracking-wider">Etherscan</th>
                      </tr>
                    </thead>
                    <tbody className="bg-purple-950/50 divide-y divide-pink-400/30">
                      {transactions
                        .filter(tx => 
                          filter === '' || 
                          tx.sender.toLowerCase().includes(filter.toLowerCase()) ||
                          tx.receiver.toLowerCase().includes(filter.toLowerCase())
                        )
                        .map((tx, index) => (
                          <tr key={index} className="hover:bg-purple-900/30 transition-colors duration-200">
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                <span className="text-purple-200 font-mono text-sm">{short(tx.sender)}</span>
                                <button
                                  onClick={() => handleCopy(tx.sender)}
                                  className="text-pink-400 hover:text-pink-300 transition-colors"
                                >
                                  {copied === tx.sender ? (
                                    <CheckIcon className="h-4 w-4" />
                                  ) : (
                                    <ClipboardIcon className="h-4 w-4" />
                                  )}
                                </button>
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                <span className="text-purple-200 font-mono text-sm">{short(tx.receiver)}</span>
                                <button
                                  onClick={() => handleCopy(tx.receiver)}
                                  className="text-pink-400 hover:text-pink-300 transition-colors"
                                >
                                  {copied === tx.receiver ? (
                                    <CheckIcon className="h-4 w-4" />
                                  ) : (
                                    <ClipboardIcon className="h-4 w-4" />
                                  )}
                                </button>
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right">
                              <span className="text-purple-200 font-mono text-sm">
                                {ethPrice ? `₹${(Number(ethers.formatEther(tx.amount)) * ethPrice).toFixed(2)}` : 'Loading...'}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                <span className="text-purple-200 font-mono text-sm">{short(tx.hash)}</span>
                                <button
                                  onClick={() => handleCopy(tx.hash)}
                                  className="text-pink-400 hover:text-pink-300 transition-colors"
                                >
                                  {copied === tx.hash ? (
                                    <CheckIcon className="h-4 w-4" />
                                  ) : (
                                    <ClipboardIcon className="h-4 w-4" />
                                  )}
                                </button>
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <span className="text-purple-200 text-sm">
                                {new Date(Number(tx.timestamp) * 1000).toLocaleString()}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-center">
                              <a
                                href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-pink-400 hover:text-pink-300 bg-pink-400/10 hover:bg-pink-400/20 rounded-lg transition-colors duration-200"
                              >
                                View
                              </a>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}