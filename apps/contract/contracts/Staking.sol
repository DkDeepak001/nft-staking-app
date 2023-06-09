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


    uint256 private immutable rewardPerHour = 100;



    constructor(IERC20 _token,IERC721  _nft) {
        tokenAddress = _token;
        nftContractAddress = _nft;
    }


    function stake(uint256 _tokenId) external nonReentrant{
        //chech if that address already staked if already staked increase the unclained amount
        if(stakeDetails[msg.sender].stakedTokenCount > 0){
            stakeDetails[msg.sender].unclaimedRewards += calculateReward(msg.sender);
        }

        // Wallet must own the token they are trying to stake
        require(
            nftContractAddress.ownerOf(_tokenId) == msg.sender,
            "You don't own this token!"
        );
        //transfer nft to this contract

        nftContractAddress.transferFrom(msg.sender,address(this),_tokenId);
        StakedNft  memory stakedNfts = StakedNft(msg.sender,_tokenId);
        stakeDetails[msg.sender].stakedNfts.push(stakedNfts);
        

        //creating new struct 

       
        stakeDetails[msg.sender].stakedTokenCount++;

        stakeDetails[msg.sender].lastUpdated = block.timestamp;

        stakedOwnerAddress[_tokenId] = msg.sender;
    }


    function withdraw(uint256 _tokenId) external nonReentrant{
        require(stakeDetails[msg.sender].stakedTokenCount > 0 ,"you don't have any nft's here");

        require(stakedOwnerAddress[_tokenId] == msg.sender,"you are not an owner for this nft's to withdraw");
        

        //transfer nft from this contract to owner address
        nftContractAddress.transferFrom(address(this),msg.sender,_tokenId);
      
        
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
   

    function claimRewards() external {
        uint256 rewards = calculateReward(msg.sender) + stakeDetails[msg.sender].unclaimedRewards;
        require(rewards > 0, "You have no rewards to claim");
        stakeDetails[msg.sender].lastUpdated = block.timestamp;
        stakeDetails[msg.sender].unclaimedRewards = 0;
        tokenAddress.safeTransfer(msg.sender, rewards);
    }

    function availableRewards(address receiver) public view returns(uint256){
        uint256 reward = calculateReward(receiver) + stakeDetails[receiver].unclaimedRewards;
        return reward;
    }

    function getStakedNfts(address _user) external view returns(StakedNft[] memory){
        if(stakeDetails[_user].stakedTokenCount > 0){
         StakedNft[] memory stakedNfts = new StakedNft[](stakeDetails[_user].stakedTokenCount);
        uint256 _index = 0;
         for(uint i = 0; i < stakeDetails[_user].stakedTokenCount; i++){
            if(stakeDetails[_user].stakedNfts[i].staker != address(0)){
                stakedNfts[_index] = stakeDetails[_user].stakedNfts[i];
                _index++;
             
            }
         }
            return stakedNfts;

        }
        
    }



    



}