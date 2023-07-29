import { ConnectKitButton } from 'connectkit';
import '../styles/NewHeader.css'
import logo from  '../images/logo4Head.png'

export default function NewHeader(){

    const mint = () => {
        window.open('https://community-nft-minting-app.vercel.app/', '_blank');
      };


    return(
        <div id='headerBox'>
            <img src={logo} className="myImage" alt='logo4Header' id='logo4HeaderImg'/>
            <div id='buttons'>
          <ConnectKitButton />
          <button onClick={mint} id='mintButton'>Mint</button>
          
          </div>
        </div>
    )
}