import { Connector } from "wagmi"
import BrowserWalletSvg from "../assets/browserWallet.svg"
import WalletConnectSvg from "../assets/walletConnect.svg"

export const getWalletLogo = (walletName: Connector["name"]) => {
  if (walletName === "WalletConnect") {
    return WalletConnectSvg.src
  }
  return BrowserWalletSvg.src
}
