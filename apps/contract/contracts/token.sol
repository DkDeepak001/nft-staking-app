// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract Token is ERC20 {
    constructor(uint256 _intialSupply) ERC20("WizToken","WIZ"){
            _mint(msg.sender, _intialSupply);
    }

}