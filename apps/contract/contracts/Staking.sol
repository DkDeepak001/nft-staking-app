// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
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
    mapping(uint256 => address) public stakedOwnerAddress;


    struct Stakers {
        uint256 stakedTokenCount;
        StakedNft[] stakedNfts;
        uint256 lastUpdated;
        uint256 unclaimedRewards;
        
    }

    IERC20 public immutable tokenAddress;
    IERC721 public immutable nftContractAddress;


    uint256 private immutable rewardPerHour = 10000;



    constructor(IERC20 _token,IERC721 _nft) {
        nftContractAddress = _nft;
        tokenAddress = _token;
    }


    function stake(uint _tokenId) external nonReentrant{
        //chech if that address already staked if already staked increase the unclained amount
        if(stakeDetails[msg.sender].stakedTokenCount > 0){
            stakeDetails[msg.sender].unclaimedRewards += calculateReward(msg.sender);
        }

        //transfer nft to this contract
        IERC721(nftContractAddress).safeTransferFrom(msg.sender,address(this),_tokenId);

        //creating new struct 
        StakedNft  memory stakedNfts =StakedNft(msg.sender,_tokenId);

        stakeDetails[msg.sender].stakedNfts.push(stakedNfts);
       
        stakeDetails[msg.sender].stakedTokenCount++;

        stakeDetails[msg.sender].lastUpdated = block.timestamp;

        stakedOwnerAddress[_tokenId] = msg.sender;


    }


    function withdraw(uint256 _tokenId) external nonReentrant{
        require(stakeDetails[msg.sender].stakedTokenCount > 0 ,"you don't have any nft's here");

        require(stakedOwnerAddress[_tokenId] == msg.sender,"you are not an owner for this nft's to withdraw");

        uint256 reward = calculateReward(msg.sender);
        stakeDetails[msg.sender].unclaimedRewards += reward;

        //removing nft from 
        stakedOwnerAddress[_tokenId] = address(0);

        stakeDetails[msg.sender].stakedTokenCount--;
        stakeDetails[msg.sender].lastUpdated = block.timestamp;

    }


    function calculateReward (address _staker) public view returns(uint256){
        uint256 timeStaked = block.timestamp - stakeDetails[_staker].lastUpdated;
        uint256 rewardForAllToken = stakeDetails[_staker].stakedTokenCount * timeStaked;
        uint256 reward = (rewardForAllToken * rewardPerHour)/3600;
        return  reward;
    }
   

}