import { useTotalSupply } from '../src/components/Hooks'

import '@rainbow-me/rainbowkit/styles.css';
import { ethers } from "ethers";

import { toast, Toaster, ToastBar } from 'react-hot-toast';
import { Radio, ConfigProvider } from 'antd';
import { ConnectKitProvider, getDefaultClient } from "connectkit";
import {
  configureChains,
  createClient,
  WagmiConfig,
  // useNetwork,
  useAccount,
  // useProvider,
  // usePrepareContractWrite,
  // useContractWrite , 
  // useContractRead,
  // useConnect
} from "wagmi";
import { bsc, bscTestnet, arbitrum} from 'wagmi/chains';
import { jsonRpcProvider } from "wagmi/providers/jsonRpc"
import { publicProvider } from 'wagmi/providers/public';
import './App.css';
import { useEffect, useState } from 'react';
import Footer from './components/Footer'

import NewHeader from './components/NewHeader';
import StakeBox from './components/StakeBox';

const { chains, provider } = configureChains(
  [bsc],
  [
    jsonRpcProvider({ 
            rpc: (chain) => ({ 
              http: "https://bsc-dataseed.bnbchain.org", 
            }), 
    }),
    
  ]
);
const client = createClient(
  getDefaultClient({
    appName: "Your App Name",
    chains,
    provider,
  }),
);
const wagmiClient = createClient({
  autoConnect: false,
  client,
  provider
})


function App() {
const[here, setHere] = useState(null)
const[connectedAddress, setConnectedAddress] = useState(null)
const { connector: 
  activeConnector, isConnected, isConnecting, isDisconnected, 
  address  } = useAccount({
  onConnect({ address, connector, isReconnected }) {
  //   console.log('Connected', { address, connector, isReconnected })
  console.log(address)
  setConnectedAddress(address)
  },
  onDisconnect() {
    console.log('Disconnected')
  },
})
useEffect(() => {
  setConnectedAddress(address);
}, [address]);

const[mintCost, setMintCost] = useState(0);
const[totalSupply, setTotalSupply] = useState(0);
const[tokenIds, setTokenIds] = useState([])
const[nftName, setNftName] = useState('');
const[maxSupply, setMaxSupply] = useState(0);
const[displayCost, setDisplayCost] = useState(0);
const [ownedNfts, setOwnedNfts] = useState(0);
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const mintContractAddress = '0x5CD5a6dCf173a4e44CC62dB621C957c4B133E270';
const mintContractABI = [
  {"inputs":[{"internalType":"string","name":"_uri","type":"string"},{"internalType":"address","name":"lpWallet","type":"address"},{"internalType":"address","name":"teamWallet","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"uri","type":"string"}],"name":"SetBaseURI","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"SetFeeAmount","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"wallet","type":"address"}],"name":"SetFeeWallet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"time","type":"uint256"}],"name":"StartAirdrop","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"MAX_SUPPLY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TOTAL_BP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"feeAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lpFeeBp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lpFeeWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"mintLimit","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_uri","type":"string"}],"name":"setBaseURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"setFeeAmount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"lpBp","type":"uint256"},{"internalType":"uint256","name":"teamBp","type":"uint256"}],"name":"setFeeBps","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"lpWallet","type":"address"},{"internalType":"address","name":"teamWallet","type":"address"}],"name":"setFeeWallets","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"limit","type":"uint256"}],"name":"setMintLimit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"teamFeeBp","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"teamFeeWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}
]
const mintContractInstance = new ethers.Contract(mintContractAddress, mintContractABI, signer);
const stakeContractAddress = '0xe0833Fba47fAEF2Ea12FEB674B8a2ca98658d1FD';
const stakeContractABI = [
{"inputs":[{"internalType":"address","name":"_erc721","type":"address"},{"internalType":"uint256","name":"_expiration","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[],"name":"ERC721_CONTRACT","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"EXPIRATION","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"tokenIds","type":"uint256[]"}],"name":"admin_deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256[]","name":"tokenIds","type":"uint256[]"}],"name":"calculateRewards","outputs":[{"internalType":"uint256[]","name":"rewards","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"tokenIds","type":"uint256[]"}],"name":"claimRewards","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"tokenIds","type":"uint256[]"}],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"depositBlocks","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"depositsOf","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"findRate","outputs":[{"internalType":"uint256","name":"rate","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC721Received","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"rewardRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"_tokenIds","type":"uint256[]"},{"internalType":"uint256","name":"_rarity","type":"uint256"}],"name":"setBatchRarity","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_expiration","type":"uint256"}],"name":"setExpiration","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"},{"internalType":"uint256","name":"_rarity","type":"uint256"}],"name":"setRarity","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_rarity","type":"uint256"},{"internalType":"uint256","name":"_rate","type":"uint256"}],"name":"setRate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_collectionAddress","type":"address"}],"name":"setcollectionaddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newtokenaddress","type":"address"}],"name":"settokenaddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"started","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bool","name":"_state","type":"bool"}],"name":"toggleStart","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"tokenRarity","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tokensStaked","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"tokensStakedByUser","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"tokenIds","type":"uint256[]"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"token","type":"address"}],"name":"withdrawErc20","outputs":[],"stateMutability":"nonpayable","type":"function"}
]
const stakeContractInstance = new ethers.Contract(stakeContractAddress, stakeContractABI, signer)

useEffect(() => {
  const fetchTotalSupply = async () => {
  try{
   
    const _totalSupply = await mintContractInstance.totalSupply();
    
    setTotalSupply(_totalSupply.toString())
    console.log('Total Supply:', totalSupply)
    
  }
  catch (error) {
    console.error('An error occurred: ', error);
}
  }
  fetchTotalSupply();

},[mintContractABI, signer, totalSupply]);

useEffect(() => {
  const getTokenIds = async () => {
  
    try {
      const balance = await mintContractInstance.balanceOf(connectedAddress);
      let ids = [];
      for (let i = 0; i < balance; i++) {
        const tokenId = await mintContractInstance.tokenOfOwnerByIndex(connectedAddress, i);
        ids.push(tokenId.toString());
      }
      setTokenIds(ids);
      console.log('tokenIds', ids) //use this to update the page 
    } catch (error) {
      console.error("Error fetching token IDs: ", error);
    }
  };
  if(connectedAddress) {
    getTokenIds();
  }
}, [connectedAddress]);
 





  return (
      <WagmiConfig client={client}>
    <ConnectKitProvider customTheme={{
          "--ck-font-family": '"Bangers"',
        }}
    >
  <NewHeader />
    <StakeBox connectedAddress={connectedAddress} provider={provider} signer={signer} mintContractInstance={mintContractInstance} mintContractABI={mintContractABI} mintContractAddress={mintContractAddress} stakeContractABI={stakeContractABI} stakeContractAddress={stakeContractAddress} stakeContractInstance={stakeContractInstance} tokenIds={tokenIds} setTokenIds={setTokenIds} />
    <Footer />
  
    </ConnectKitProvider>
    </WagmiConfig>
  );
}

export default App;
