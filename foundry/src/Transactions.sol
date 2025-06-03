// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Transactions {
    uint public transactionsCount;

    struct Transaction {
        address sender;
        address receiver;
        string message;
        uint amount;
        uint timestamp;
    }

    Transaction[] public transactions;

    event Transfer(address indexed sender, address indexed receiver, string message, uint amount, uint timestamp);

    // Payable function to receive ETH and transfer it to receiver
    function addToBlockchain(address payable receiver, string memory message) public payable {
        require(msg.value > 0, "Send some ETH");

        // Forward the ETH to the receiver
        receiver.transfer(msg.value);

        transactionsCount++;
        transactions.push(Transaction(msg.sender, receiver, message, msg.value, block.timestamp));

        emit Transfer(msg.sender, receiver, message, msg.value, block.timestamp);
    }

    function getTransactions() public view returns (Transaction[] memory) {
        return transactions;
    }

    function getTransactionsCount() public view returns (uint) {
        return transactionsCount;
    }
}
