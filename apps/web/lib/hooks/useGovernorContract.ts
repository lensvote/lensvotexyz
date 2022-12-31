import { useEffect, useState } from "react"
import { BigNumber, BigNumberish } from "ethers"
import { Address, useAccount, useContract, useSigner } from "wagmi"
import { GovernanceFactory, Governor } from "abis"
import { LENSVOTE_GOVERNANCE_FACTORY, ZERO_ADDRESS } from "@data/index"
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
  const [timelockAddress, setTimelockAddress] = useState<Address>()
  const governorContract = useContract({
    address: governorAddress,
    abi: Governor,
    signerOrProvider: data,
  })

  useEffect(() => {
    if (!factoryContract || !currentProfileId) {
      return
    }

    ;(async () => {
      const address = await factoryContract.getGovAddr(
        BigNumber.from(currentProfileId),
      )
      // It could be zero addr somehow
      if (address && address !== ZERO_ADDRESS) {
        setGovernorAddress(address)
      }
    })()
  }, [currentProfileId, factoryContract])

  useEffect(() => {
    if (!governorContract) {
      return
    }

    ;(async () => {
      const timelockAddress = await governorContract.admin()
      if (timelockAddress) {
        setTimelockAddress(timelockAddress)
      }
    })()
  }, [governorContract])

  return {
    governorContract,
    governorAddress,
    timelockAddress,
  }
}

export enum ProposalVoteAction {
  Against,
  For,
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

export type ProposalActions = [
  // Targets
  Address[],
  // Values
  BigNumberish[],
  // Signatures
  string[],
  // Calldatas
  Address[],
]

export const useUserGovernor = () => {
  const { address } = useAccount()
  const {
    governorContract: userGovernorContract,
    timelockAddress,
    governorAddress,
  } = useUserGovernorContract()
  const [latestProposal, setLatestProposal] = useState<GovernorProposal>()
  const [latestProposalActions, setLatestProposalActions] =
    useState<ProposalActions>()

  // get latest proposal
  useEffect(() => {
    if (!userGovernorContract || !address) {
      return
    }

    ;(async () => {
      const proposalId = await userGovernorContract.latestProposalIds(address)
      if (proposalId.eq(0)) {
        return
      }

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
      const latestProposalActions = await userGovernorContract.getActions(
        proposalId,
      )

      setLatestProposalActions(
        latestProposalActions as unknown as ProposalActions,
      )
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
    if (!userGovernorContract || !latestProposalActions) {
      return
    }
    try {
      const tx = await userGovernorContract.execute(BigNumber.from(id), {
        value: BigNumber.from(latestProposalActions[1][0]),
      })
      return tx
    } catch (error) {
      console.log(
        "🚀 ~ file: useGovernorContract.ts:232 ~ executeProposal ~ error",
        error,
      )
    }
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
    latestProposalActions,
    createProposal,
    cancelProposal,
    voteProposal,
    queueProposal,
    executeProposal,
    timelockAddress,
    governorAddress,
  }
}
