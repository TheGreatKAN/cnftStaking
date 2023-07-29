import React, { useEffect, useState, useCallback } from 'react';
import '../styles/StakeBox.css';
import nftPreview from '../images/nftPrev.png'
import kiwiLogo from '../images/kiwiLogo2.png'

import { ConnectKitButton } from 'connectkit';

import { ethers } from "ethers";



function StakeBox({connectedAddress, provider, signer, mintContractAddress, mintContractInstance, mintContractABI, stakeContractABI, stakeContractInstance, stakeContractAddress, tokenIds, setTokenIds }) {
    const [isButtonVisible, setIsButtonVisible] = useState(true);
    const [selectedSection, setSelectedSection] = useState("Stake");

    useEffect(() => {
        setIsButtonVisible(!connectedAddress);
    }, [connectedAddress]);

    const handleSectionClick = (section) => {
        setSelectedSection(section);
    }
    
    function StakeSection({connectedAddress, provider, signer, mintContractAddress, mintContractInstance, mintContractABI, stakeContractABI, stakeContractInstance, stakeContractAddress, tokenIds, setTokenIds}) {
        const [isApproved, setIsApproved] = useState(false);
        const [selectedTokenIds, setSelectedTokenIds] = useState([]);
        const [allSelected, setAllSelected] = useState(false);

        const handleClick = (tokenId) => {
            setSelectedTokenIds((prevSelectedTokenIds) => {
              if (prevSelectedTokenIds.includes(tokenId)) {
                return prevSelectedTokenIds.filter((id) => id !== tokenId);
              } else {
                return [...prevSelectedTokenIds, tokenId];
              }
            });
            setAllSelected(false);
          };
        
          const selectOrDeselectAll = () => {
            if (allSelected) {
              setSelectedTokenIds([]);
            } else {
              setSelectedTokenIds(tokenIds);
            }
            setAllSelected(!allSelected);
          };

          const updateNFTs = async () => {
            // Get the total number of NFTs owned by the user
            const balance = await mintContractInstance.balanceOf(connectedAddress);
            // We'll store the IDs of the NFTs here
            const updatedNFTs = [];
            for (let i = 0; i < balance; i++) {
              // Get the ID of the i-th NFT owned by the user
              const tokenId = await mintContractInstance.tokenOfOwnerByIndex(connectedAddress, i);
              updatedNFTs.push(tokenId.toString());
            }
            // Update the state
            setTokenIds(updatedNFTs);
          };
          


        const approveAll = useCallback(async () => {
            const tx = await mintContractInstance.setApprovalForAll(stakeContractAddress, true);
            await tx.wait(); 
            alert('Approval set for all NFTs');
        }, [mintContractInstance, stakeContractAddress]);

        useEffect(() => {
            const checkApproval = async () => {
                const approvalStatus = await mintContractInstance.isApprovedForAll(connectedAddress, stakeContractAddress);
                setIsApproved(approvalStatus);
            };
            
            checkApproval();
        }, [approveAll, connectedAddress]);

        const stakeTokens = async (selectedTokenIds) => {
            try {
                            if (!Array.isArray(selectedTokenIds) || selectedTokenIds.length === 0) {
                alert('Please select the NFTs you want to stake');
                return;
              }
              const transaction = await stakeContractInstance.deposit(selectedTokenIds);
              setTokenIds(prevTokenIds => prevTokenIds.filter(id => !selectedTokenIds.includes(id)));
              await transaction.wait();
              console.log('Stake successful for tokens: ', selectedTokenIds);
              updateNFTs();
            } catch (error) {
              console.error('Error staking tokens: ', error);
            }
          };
          
    
 
        return (

<div id='box'>

<div className="container">

  <button className="stakeButton" onClick={selectOrDeselectAll}>{allSelected ? 'Deselect All' : 'Select All'}</button>
 
  <div className="token-holder">
    {tokenIds.map((tokenId) => (
      <div 
        key={tokenId}
        className={`token-card ${selectedTokenIds.includes(tokenId) ? 'selected' : ''}`}
        onClick={() => handleClick(tokenId)}
      >
        <img src={nftPreview} alt={`Token ${tokenId}`} />
        <div className="token-id">{tokenId}</div>
      </div>
    ))}
  </div>
</div>
<button
      className="stakeButton"
      onClick={() => stakeTokens(selectedTokenIds)}
    >
      Stake Selected
    </button>

<div>
           { !isApproved && <button className="stakeButton" onClick={approveAll}>Approve All</button>}
           
        </div>   
            </div>
        )
    }
    
    function CollectSection({connectedAddress, provider, signer, mintContractAddress, mintContractInstance, mintContractABI, stakeContractABI, stakeContractInstance, stakeContractAddress, tokenIds}) {
        const [numberOfStakedNFTs, setNumberOfStakedNFTs] = useState(0);
        const[stakedNFT_Ids, setStakedNFT_Ids] = useState([])
        const[accumulatedRewards, setAccumulatedRewards] = useState(0)

        useEffect(() => {
            console.log('grrrr', stakedNFT_Ids);
          });
        
          useEffect(() => {
            getDepositsAndRewards();
            const intervalId = setInterval(getDepositsAndRewards, 60 * 1000);
            return () => clearInterval(intervalId);
          }, []);
        
          async function getDepositsAndRewards() {
            try {
              const deposits = await stakeContractInstance.depositsOf(connectedAddress);
              const depositNumbers = deposits.map((deposit) => deposit.toNumber());
              console.log('staked#s', depositNumbers);
              setStakedNFT_Ids(depositNumbers);
              setNumberOfStakedNFTs(depositNumbers.length);
        
              // Now call getRewards, passing in depositNumbers
              if (depositNumbers.length > 0) {
                getRewards(depositNumbers);
              }
            } catch (error) {
              console.log('An error occurred:', error);
            }
          }
        
          async function getRewards(depositNumbers) {
            try {
              console.log('testingggg', depositNumbers);
              const rewardsArray = await stakeContractInstance.calculateRewards(
                connectedAddress,
                depositNumbers
              );
              console.log('Rewards Array: ', rewardsArray);
        
              if (rewardsArray && rewardsArray.length > 0) {
                let sum = ethers.BigNumber.from(0);
                for (let i = 0; i < rewardsArray.length; i++) {
                  sum = sum.add(rewardsArray[i]);
                }
                let sumInEther = ethers.utils.formatEther(sum);
                sumInEther = parseFloat(sumInEther).toFixed(4);
                console.log('Total Rewards: ', sumInEther);
                setAccumulatedRewards(sumInEther); // Convert to a string
              } else {
                setAccumulatedRewards('0'); // Set as a string
              }
            } catch (error) {
              console.error('An error occurred: ', error);
            }
          }
        
          async function claimRewards() {
            try {
              const transaction = await stakeContractInstance.claimRewards(stakedNFT_Ids, {
                gasLimit: ethers.utils.hexlify(600000),  // Manually set gas limit
              });
              console.log('Transaction: ', transaction);
        
              // wait for the transaction to be mined
              const receipt = await transaction.wait();
              console.log('Transaction was mined: ', receipt);
        
              // update the rewards after claiming
              getRewards(stakedNFT_Ids);  // Pass the required argument here
        
            } catch (error) {
              console.error('An error occurred: ', error);
            }
        }
        
          


        return (
        <div id='collectBox'>

         <img src={nftPreview} alt="NFT Preview" id='previewNFT'/>
         <p>No. of CNFTs staked: {numberOfStakedNFTs}</p>
         <p>Current Daily Kiwi Tokens: {numberOfStakedNFTs}</p>
         <div id='logoText'>
            <img src={kiwiLogo} alt='kiwiLogo' id='logoKiwi' />
            <h6>KIWI REWARDS</h6>
         </div>
         <div id='rewardsAccumulated'>
         {accumulatedRewards}
         </div>
         <button className="stakeButton" id='claimButton' onClick={claimRewards}>Collect Rewards</button>

        
        </div>);
    }
    
    function UnstakeSection({connectedAddress, provider, signer, mintContractAddress, mintContractInstance, mintContractABI, stakeContractABI, stakeContractInstance, stakeContractAddress, tokenIds}) {
        const[stakedNFT_Ids, setStakedNFT_Ids] = useState([])
        const [selectedTokenIds, setSelectedTokenIds] = useState([]);
        const [allSelected, setAllSelected] = useState(false);

        useEffect(()=>{
console.log('everything',stakedNFT_Ids)
        })

        useEffect(() => {
            async function getDeposits() {
              try {
                const deposits = await stakeContractInstance.depositsOf(connectedAddress);
                
                const depositNumbers = deposits.map(deposit => deposit.toNumber());
                const depositStrings = deposits.map(deposit => ethers.utils.formatEther(deposit));
                console.log('staked#s',depositNumbers);
                setStakedNFT_Ids(depositNumbers)

                
              } catch (error) {
                console.log('An error occurred:', error);
              }
            }
          
            getDeposits();
          }, [connectedAddress, stakeContractInstance]);

          const handleClick = (tokenId) => {
            setSelectedTokenIds((prevSelectedTokenIds) => {
              if (prevSelectedTokenIds.includes(tokenId)) {
                return prevSelectedTokenIds.filter((id) => id !== tokenId);
              } else {
                return [...prevSelectedTokenIds, tokenId];
              }
            });
            setAllSelected(false);
          };
        
          const selectOrDeselectAll = () => {
            if (allSelected) {
              setSelectedTokenIds([]);
            } else {
              setSelectedTokenIds(stakedNFT_Ids);
            }
            setAllSelected(!allSelected);
          };

          const unstakeTokens = async (selectedTokenIds) => {
            try {
                if (!Array.isArray(selectedTokenIds) || selectedTokenIds.length === 0) {
                    alert('Please select the NFTs you want to unstake');
                    return;
                }
                const transaction = await stakeContractInstance.withdraw(selectedTokenIds, {
                    gasLimit: ethers.utils.hexlify(600000),  // Manually set gas limit
                });
                await transaction.wait();
                console.log('Unstake successful for tokens: ', selectedTokenIds);
                setStakedNFT_Ids(prevNFTIds => prevNFTIds.filter(id => !selectedTokenIds.includes(id)));
            } catch (error) {
                console.error('Error unstaking tokens: ', error);
            }
        };
        


        return (
            
            <div className="container">

            <button className="stakeButton" onClick={selectOrDeselectAll}>{allSelected ? 'Deselect All' : 'Select All'}</button>
        
            <div className="token-holder">
                {stakedNFT_Ids.map((tokenId) => (
                    <div 
                        key={tokenId}
                        className={`token-card ${selectedTokenIds.includes(tokenId) ? 'selected' : ''}`}
                        onClick={() => handleClick(tokenId)}
                    >
                        <img src={nftPreview} alt={`Token ${tokenId}`} />
                        <div className="token-id">{tokenId}</div>
                    </div>
                ))}
            </div>

            <button
               className="stakeButton" id='unstakeBtn'
                onClick={() => unstakeTokens(selectedTokenIds)}
            >
                Unstake Selected
            </button>
           
        </div>
      
        
        );
    }
    
    





    return( 
        <div className="centered-box">
            <div className="box-header">
                <div  id='hmm' className={`section ${selectedSection === 'Stake' ? 'selected' : ''}`} onClick={() => handleSectionClick('Stake')}>Stake</div>
                <div  id='hmm' className={`section ${selectedSection === 'Collect' ? 'selected' : ''}`} onClick={() => handleSectionClick('Collect')}>Collect</div>
                <div  id='hmm' className={`section ${selectedSection === 'Unstake' ? 'selected' : ''}`} onClick={() => handleSectionClick('Unstake')}>Unstake</div>
            </div>
            <div className="box-content">
                {isButtonVisible ?
                    <>
                        <img src={nftPreview} alt="NFT Preview" />
                        <div id='connectBtn'>
                            <ConnectKitButton />
                        </div>
                    </>
                    :
                    <div className="selected-content">
                {selectedSection === 'Stake' && <StakeSection connectedAddress={connectedAddress} isButtonVisible={isButtonVisible} nftPreview={nftPreview} provider={provider} signer={signer} mintContractInstance={mintContractInstance} mintContractABI={mintContractABI} mintContractAddress={mintContractAddress} stakeContractABI={stakeContractABI} stakeContractAddress={stakeContractAddress} stakeContractInstance={stakeContractInstance} tokenIds={tokenIds} setTokenIds={setTokenIds} />}
                {selectedSection === 'Collect' && <CollectSection connectedAddress={connectedAddress} isButtonVisible={isButtonVisible} nftPreview={nftPreview} provider={provider} signer={signer} mintContractInstance={mintContractInstance} mintContractABI={mintContractABI} mintContractAddress={mintContractAddress} stakeContractABI={stakeContractABI} stakeContractAddress={stakeContractAddress} stakeContractInstance={stakeContractInstance} tokenIds={tokenIds} setTokenIds={setTokenIds} />}
                {selectedSection === 'Unstake' && <UnstakeSection connectedAddress={connectedAddress} isButtonVisible={isButtonVisible} nftPreview={nftPreview} provider={provider} signer={signer} mintContractInstance={mintContractInstance} mintContractABI={mintContractABI} mintContractAddress={mintContractAddress} stakeContractABI={stakeContractABI} stakeContractAddress={stakeContractAddress} stakeContractInstance={stakeContractInstance} tokenIds={tokenIds} setTokenIds={setTokenIds} />
}
            </div>
                }
            </div>
        </div>
        
        )
}

export default StakeBox;
