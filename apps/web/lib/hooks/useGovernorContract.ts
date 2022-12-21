import { useEffect, useState } from "react"
import { BigNumber, BigNumberish } from "ethers"
import {
  Address,
  useAccount,
  useContract,
  useContractRead,
  useSigner,
} from "wagmi"
import { GovernanceFactory, Governor } from "abis"
import { LENSVOTE_GOVERNANCE_FACTORY } from "@data/index"
import { useAppPersistStore } from "@store/app"

const useGovernorFactoryContract = () => {
  const { data: signer } = useSigner()
  const governorFactoryContract = useContract({
    address: LENSVOTE_GOVERNANCE_FACTORY,
    abi: GovernanceFactory,
    signerOrProvider: signer,
  })

  return governorFactoryContract
}

const useUserGovernorContract = () => {
  const { data } = useSigner()
  const currentProfileId = useAppPersistStore((state) => state.profileId)
  const factoryContract = useGovernorFactoryContract()
  const [governorAddress, setGovernorAddress] = useState<Address>()

  useEffect(() => {
    if (!factoryContract || !currentProfileId) {
      return
    }

    ;(async () => {
      const address = await factoryContract?.getGovAddr?.(
        BigNumber.from(currentProfileId),
      )
      if (address) {
        setGovernorAddress(address)
      }
    })()
  }, [currentProfileId, factoryContract])

  return useContract({
    address: governorAddress,
    abi: Governor,
    signerOrProvider: data,
  })
}

export enum ProposalVoteAction {
  For,
  Against,
  Abstain,
}

export enum ProposalState {
  pending,
  active,
  canceled,
  defeated,
  succeeded,
  queued,
  expired,
  executed,
}

export type GovernorProposal = {
  // number that +1 start from 1
  id: BigNumber
  proposer: string
  forVotes: BigNumber
  abstainVotes: BigNumber
  againstVotes: BigNumber
  description: string
  startBlock: BigNumber
  endBlock: BigNumber
  //
  eta: BigNumber
  canceled: boolean
  executed: boolean
  quorumVotes: BigNumber
  state: ProposalState
}

export type ProposeArgs = [
  // Targets
  Address[],
  // Values
  BigNumberish[],
  // Signatures
  BigNumberish[],
  // Calldatas
  BigNumberish[],
  // description
  string,
  // delay
  number,
  // duration
  number,
  // threshold
  number,
]

export const useUserGovernor = () => {
  const { address } = useAccount()
  const userGovernorContract = useUserGovernorContract()
  const [latestProposal, setLatestProposal] = useState<GovernorProposal>()

  // get latest proposal
  useEffect(() => {
    if (!userGovernorContract || !address) {
      return
    }

    ;(async () => {
      const proposalId = await userGovernorContract.latestProposalIds(address)
      const {
        abstainVotes,
        againstVotes,
        canceled,
        description,
        endBlock,
        eta,
        executed,
        forVotes,
        id,
        proposer,
        quorumVotes,
        startBlock,
      } = await userGovernorContract.proposals(proposalId)
      const latestProposalState = await userGovernorContract.state(proposalId)

      setLatestProposal({
        abstainVotes,
        againstVotes,
        canceled,
        description,
        endBlock,
        eta,
        executed,
        forVotes,
        id,
        proposer,
        quorumVotes,
        startBlock,
        state: latestProposalState,
      })
    })()
  }, [address, userGovernorContract])

  const createProposal = async (...proposeArgs: ProposeArgs) => {
    if (!userGovernorContract) {
      return
    }
    // @ts-expect-error the typing of wagmi require to use bigNumber instead of numerish
    const newProposalId = await userGovernorContract.propose(...proposeArgs)
    return newProposalId
  }

  const cancelProposal = async (id: BigNumberish) => {
    if (!userGovernorContract) {
      return
    }
    const tx = await userGovernorContract.cancel(BigNumber.from(id))
    return tx
  }

  const queueProposal = async (id: BigNumberish) => {
    if (!userGovernorContract) {
      return
    }
    const tx = await userGovernorContract.queue(BigNumber.from(id))
    return tx
  }

  const executeProposal = async (id: BigNumberish) => {
    if (!userGovernorContract) {
      return
    }
    // TODO: Add value argument for transfer action
    const tx = await userGovernorContract.execute(BigNumber.from(id), {
      value: 0,
    })
    return tx
  }

  const voteProposal = async (
    id: BigNumberish,
    voteAction: ProposalVoteAction,
  ) => {
    if (!userGovernorContract) {
      return
    }
    const newProposalId = await userGovernorContract.castVote(
      BigNumber.from(id),
      voteAction,
    )
    return newProposalId
  }

  return {
    latestProposal,
    createProposal,
    cancelProposal,
    voteProposal,
  }
}
