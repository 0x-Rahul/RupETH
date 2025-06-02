// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
contract Transactions {
    uint public TransactionsCount; // Tracks the number of transactions
    struct Transaction{  // Holds the transaction details
        address sender;
        address receiver;
        string message;
        uint amount;
        uint timestamp;
    }
    Transaction[] transactions; // Array to store all transactions
    event Transfer(address indexed sender, address indexed receiver, string message, uint amount, uint timestamp);
     // Event to emit when a transaction is made

     function addtoBlockchain (address payable receiver,uint amount ,string memory message) public {
       TransactionsCount++;
       transactions.push(Transaction(msg.sender,receiver,message,amount,block.timestamp));
       emit Transfer(msg.sender,receiver,message,amount,block.timestamp);

}
    function getTransactions() public view returns (Transaction [] memory) {
        return transactions;
    }

    function getTransactionsCount() public view returns (uint) {
        return TransactionsCount;
    }

}