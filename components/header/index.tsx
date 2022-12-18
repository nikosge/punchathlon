import { ConnectButton } from "@rainbow-me/rainbowkit"
import css from './header.module.css';


const Header = () => {
    return (
        <div className={css.header}>
            <div>
                Logo
            </div>
            <ConnectButton 
                accountStatus="avatar"
                // chainStatus="icon"
                // showBalance={false}
            />
        </div>

    )
}

export default Header