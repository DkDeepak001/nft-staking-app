// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

\import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";


contract Staking is ReentrancyGuard{

    using SafeERC20 for IERC20;

    //get details of staked nft
   struct StakedNft {
        address staker;
        uint256 tokenId;
    }


    mapping(address => Stakers) public stakeDetails;


    struct Stakers {
        uint256 stakedAmount;
        StakedNft[] stakedNfts;
        uint256 lastUpdated;
        uint256 unclaimedRewards;
        
    }

    address public tokenAddress;
    address public nftContractAddress;



    constructor(IERC20 _token,IERC721 _nft) {
        tokenAddress = _token;
        nftContractAddress = _nft;
    }


    



}