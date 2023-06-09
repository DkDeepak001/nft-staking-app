// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20{
    constructor(uint initalSupply) ERC20("WIZToken", "WIZT"){
        _mint(msg.sender, initalSupply);
    }
}