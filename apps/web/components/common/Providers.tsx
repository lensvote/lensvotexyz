import type { ReactNode } from "react"
import { configureChains, createClient, WagmiConfig } from "wagmi"
import { polygon, polygonMumbai } from "wagmi/chains"
import { InjectedConnector } from "wagmi/connectors/injected"
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"
import { jsonRpcProvider } from "wagmi/providers/jsonRpc"
import { ApolloProvider } from "@apollo/client"
import { client } from "../../apollo"
import { CHAIN_ID, RPC_URL } from "../../data/constants"

// TODO: Define and move it to constant
const IS_MAINNET = true

const { chains, provider } = configureChains(
  [IS_MAINNET ? polygon : polygonMumbai],
  [jsonRpcProvider({ rpc: () => ({ http: RPC_URL }) })],
)

const connectors = () => {
  return [
    new InjectedConnector({
      chains,
      options: { shimDisconnect: true },
    }),
    new WalletConnectConnector({
      chains,
      options: { rpc: { [CHAIN_ID]: RPC_URL } },
    }),
  ]
}

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
})

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <WagmiConfig client={wagmiClient}>
      <ApolloProvider client={client}>{children}</ApolloProvider>
    </WagmiConfig>
  )
}

export default Providers
