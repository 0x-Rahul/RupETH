'use client';
import React, { useState } from 'react';
import { WalletIcon, EyeIcon, PaperAirplaneIcon, CheckCircleIcon, SparklesIcon } from '@heroicons/react/24/solid';

const steps = [
  {
    title: 'Connect Your Wallet',
    description: 'Click the Connect Wallet button in the navbar to link your Ethereum wallet (e.g., MetaMask) to RupETH.',
    icon: <WalletIcon className="w-12 h-12 text-pink-400" />,
  },
  {
    title: 'Check Your Balance',
    description: 'After connecting, your account address and balance will appear in the navbar. Make sure you have enough ETH to proceed.',
    icon: <EyeIcon className="w-12 h-12 text-purple-400" />,
  },
  {
    title: 'Send Crypto',
    description: 'Go to the main page, enter the amount, recipient address, and an optional message, then click Send.',
    icon: <PaperAirplaneIcon className="w-12 h-12 text-blue-400 rotate-45" />,
  },
  {
    title: 'Track Transactions',
    description: 'You can view your transaction history in the Transactions section.',
    icon: <CheckCircleIcon className="w-12 h-12 text-green-400" />,
  },
];

export default function Tutorial() {
  const [current, setCurrent] = useState(0);
  const isLast = current === steps.length;

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-r from-[#1a0f3d] to-[#72026d] text-white px-4 py-2">
      {/* Beautiful Heading */}
      <div className="flex flex-col items-center mb-4">
        <h1 className="mt-24 text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg text-center">
          How it works?
        </h1>
      </div>
      <div className="w-full max-w-3xl bg-purple-950 bg-opacity-90 rounded-3xl shadow-2xl p-12 border-2 border-pink-400 flex flex-col items-center relative transition-all duration-300">
        {/* Progress Bar */}
        <div className="w-full mb-10">
          <div className="h-3 w-full bg-purple-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-400 to-purple-500 transition-all duration-500"
              style={{ width: `${(Math.min(current, steps.length - 1) + 1) / steps.length * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-purple-200 font-semibold">
            {steps.map((step, idx) => (
              <span key={idx} className={idx === current ? 'text-pink-300' : ''}>{step.title.split(' ')[0]}</span>
            ))}
          </div>
        </div>

        {/* Step Content or Finish Screen */}
        {!isLast ? (
          <>
            <div className="flex flex-col items-center mb-8">
              <div className="mb-4 animate-fade-in">
                {steps[current].icon}
              </div>
              <h3 className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-purple-300 via-pink-400 to-red-500 bg-clip-text text-transparent drop-shadow-lg">
                {steps[current].title}
              </h3>
              <p className="text-lg text-purple-200 mb-4 text-center max-w-xl animate-fade-in">
                {steps[current].description}
              </p>
            </div>
            <div className="flex space-x-6 mt-4">
              <button
                className="px-6 py-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-lg shadow-lg disabled:opacity-50 transition-all"
                onClick={() => setCurrent((c) => c - 1)}
                disabled={current === 0}
              >
                Previous
              </button>
              <button
                className="px-6 py-3 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-lg shadow-lg disabled:opacity-50 transition-all"
                onClick={() => setCurrent((c) => c + 1)}
                disabled={current === steps.length - 1}
              >
                Next
              </button>
            </div>
            <div className="mt-8 text-sm text-purple-300">Step {current + 1} of {steps.length}</div>
          </>
        ) : (
          <div className="flex flex-col items-center animate-fade-in">
            <SparklesIcon className="w-20 h-20 text-yellow-300 mb-6 animate-bounce" />
            <h2 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-pink-300 via-purple-400 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg">You're Ready!</h2>
            <p className="text-lg text-purple-200 mb-8 text-center max-w-xl">You've completed the tutorial. Start exploring all the features of RupETH!</p>
            <button
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold text-lg shadow-xl transition-all"
              onClick={() => setCurrent(0)}
            >
              Restart Tutorial
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 