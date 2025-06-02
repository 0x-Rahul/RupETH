// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script, console} from "forge-std/Script.sol";
import {Transactions} from "../src/Transactions.sol";

contract Transactionscript is Script {

    function setUp() public {}

    function run() public {
        vm.startBroadcast();
        Transactions deploy = new Transactions();
        console.log("Transactions contract deployed to: ", address(deploy));
        vm.stopBroadcast();
    }
}
