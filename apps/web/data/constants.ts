import { polygon, polygonMumbai } from "wagmi/chains"
import getEnvConfig from "./getEnvConfig"

// Environments
export const IS_PRODUCTION = process.env.NODE_ENV === "production"

// Lens Network
export const LENS_NETWORK = process.env.NEXT_PUBLIC_LENS_NETWORK ?? "mainnet"
export const MAINNET_API_URL = "https://api.lens.dev"
export const LENSVOTE_TESTNET_API_URL =
  "https://api.thegraph.com/subgraphs/name/wonderfulfull/lensvote"
export const TESTNET_API_URL = "https://api-mumbai.lens.dev"
export const SANDBOX_API_URL = "https://api-sandbox-mumbai.lens.dev"
export const STAGING_API_URL =
  "https://staging-api-social-mumbai.lens.crtlkey.com"
export const STAGING_SANDBOX_API_URL =
  "https://staging-api-social-mumbai.sandbox.crtlkey.com"

export const SERVERLESS_MAINNET_API_URL = "https://api.lenster.xyz"
export const SERVERLESS_TESTNET_API_URL = "https://api-testnet.lenster.xyz"
export const SERVERLESS_STAGING_API_URL = "https://api-staging.lenster.xyz"
export const SERVERLESS_STAGING_SANDBOX_API_URL =
  "https://api-staging-sandbox.lenster.xyz"
export const SERVERLESS_SANDBOX_API_URL = "https://api-sandbox.lenster.xyz"

export const API_URL = getEnvConfig().apiEndpoint
export const LENSVOTE_API_URL = getEnvConfig().lensvoteApiEndpoint
export const LENSHUB_PROXY = getEnvConfig().lensHubProxyAddress
export const LENSVOTE_GOVERNANCE_FACTORY =
  getEnvConfig().governanceFactoryAddress
export const DUMMY_TOKEN_ADDRESS = getEnvConfig().dummyTokenAddress

export const IS_MAINNET = API_URL === MAINNET_API_URL

export const APP_NAME = "lensvote"

// Storage keys
export const LV_KEYS = {
  STORE: `${APP_NAME}.store`,
}

// Messages
export const ERROR_MESSAGE = "Something went wrong!"
export const SIGN_WALLET = "Please sign in your wallet."
export const SIGN_ERROR = "Failed to sign data"

// Misc
export const RELAY_ON = true
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"
export const LENSPROTOCOL_HANDLE = "lensprotocol"
export const HANDLE_SUFFIX = IS_MAINNET ? ".lens" : ".test"

export const RPC_URL = IS_MAINNET
  ? "https://rpc.ankr.com/polygon"
  : "https://rpc.ankr.com/polygon_mumbai"
export const POLYGON_MAINNET = {
  ...polygon,
  name: "Polygon Mainnet",
  rpcUrls: { default: "https://polygon-rpc.com" },
}
export const POLYGON_MUMBAI = {
  ...polygonMumbai,
  name: "Polygon Mumbai",
  rpcUrls: { default: "https://rpc-mumbai.maticvigil.com" },
}
export const CHAIN_ID = IS_MAINNET ? POLYGON_MAINNET.id : POLYGON_MUMBAI.id
