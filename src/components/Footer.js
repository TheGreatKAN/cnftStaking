import Discord from '../images/discord.png'
import Twitter from '../images/twitter.png'
import Web from '../images/website.png'
import Copy from '../images/footerCopy.png'
import FooterLogo from '../images/footerLogo.png'
import '../styles/Footer.css'

export default function Footer(){

    const webSite = () => {
        window.open('https://nft.kiwitoken.site/', '_blank');
      };
      const twitter = () => {
        window.open('https://twitter.com/_KiwiToken_?s=20', '_blank');
      };
      const discord = () => {
        window.open('https://discord.gg/2mtqGvj2gg', '_blank');
      };



    return(
        <div id='footerBox'>
            <div id='logo'>
                <img src={FooterLogo} alt='logo' id='logoImg' />
            </div>
            <div id='copyWrite'>
                <img src={Copy} alt='copy' />
            </div>
            <div id='links'>
                <img src={Discord} alt='discord' onClick={discord} className='link' />
                <img src={Web} alt='web' onClick={webSite} />
                <img src={Twitter} alt='twitter' onClick={twitter} />
            </div>
        </div>
    )
}