# RupETH - Ethereum Transaction Platform

RupETH is a modern web3 platform that enables users to send Eth by just entering in Rupees. Built with  Next.js, TailwindCSS and Solidity, it provides a seamless experience for managing cryptocurrency transactions.

## 🌟 Features

- **Wallet Integration**: Connect your MetaMask wallet seamlessly
- **Real-time ETH Price**: Live conversion between ETH and INR
- **Transaction History**: View and track all your transactions
- **Interactive Tutorial**: Step-by-step guide for new users
- **Responsive Design**: Works perfectly on both desktop and mobile device
- **Modern UI**: Beautiful gradient design with smooth animations

## 🛠️ Tech Stack

### Frontend
- Next.js
- Tailwind CSS
- Heroicons
- Ethers.js

### Smart Contract
- Solidity
- Foundry

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MetaMask wallet
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/MintXRahul/RupETH.git
cd RupETH
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install smart contract dependencies:
```bash
cd ../foundry
forge install
```

4. Create a `.env` file in the frontend directory:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address
```

### Running the Application

1. Start the frontend development server:
```bash
cd frontend
npm run dev
```

2. Deploy the smart contract:
```bash
cd foundry
forge build
forge test
```

## 📱 Usage

1. Connect your MetaMask wallet
2. Enter the amount in INR (automatically converts to ETH)
3. Add recipient address and optional message
4. Confirm the transaction
5. View transaction history in the Transactions section

## 🔍 Project Structure

```
RupETH/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── Home.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Tutorial.jsx
│   │   │   │   ├── Transactions.jsx
│   │   │   │   └── Footer.jsx
│   │   │   └── page.js
│   │   └── styles/
│   └── public/
└── foundry/
    ├── src/
    │   └── RupETH.sol
    └── test/
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contact

- **Developer**: Rahul Sah
- **Email**: sah657033@gmail.com
- **Twitter**: [@MintXRahul](https://x.com/MintXRahul)
- **GitHub**: [MintXRahul](https://github.com/MintXRahul)
- **Location**: Kolkata, West Bengal, India

## 🙏 Acknowledgments

- MetaMask for wallet integration
- Ethers.js for blockchain interaction
- Next.js team for the amazing framework
- Tailwind CSS for the styling utilities 
