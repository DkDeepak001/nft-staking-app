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
        uint256 stakedTokenCount;
        StakedNft[] stakedNfts;
        uint256 lastUpdated;
        uint256 unclaimedRewards;
        
    }

    address public immutable tokenAddress;
    address public immutable nftContractAddress;


    uint256 private immutable rewardPerHour = 10000;



    constructor(IERC20 _token,IERC721 _nft) {
        tokenAddress = _token;
        nftContractAddress = _nft;
    }


    function stake(uint _tokenId) external nonReemtrant{
        //chech if that address already staked if already staked increase the unclained amount

    }


    function calculateReward (uint _staker) external view returns(uint256){
        uint256 timeStaked = block.timestamp - stakeDetails[_staker].lastUpdated;
        uint256 rewardForAllToken = stakeDetails[_staker].stakedTokenCount * timeStaked;
        uint256 reward = (rewardForAllToken * rewardPerHour)/3600;

        returns  reward;
    }


    



}