import { useEffect, useState } from "react"
import { BigNumber, BigNumberish, Bytes } from "ethers"
import { Address, useAccount, useContract, useSigner } from "wagmi"
import { GovernanceFactory, Governor } from "abis"
import { LENSVOTE_GOVERNANCE_FACTORY, ZERO_ADDRESS } from "@data/index"
import { useAppPersistStore } from "@store/app"
import { isAddress } from "ethers/lib/utils.js"

const useGovernorFactoryContract = () => {
  const { data: signer } = useSigner()
  const governorFactoryContract = useContract({
    address: LENSVOTE_GOVERNANCE_FACTORY,
    abi: GovernanceFactory,
    signerOrProvider: signer,
  })

  return governorFactoryContract
}

const useUserGovernorContract = (governorContractAddress?: Address) => {
  const { data } = useSigner()
  const currentProfileId = useAppPersistStore((state) => state.profileId)
  const factoryContract = useGovernorFactoryContract()
  const [governorAddress, setGovernorAddress] = useState<Address | undefined>(
    governorContractAddress,
  )
  const [timelockAddress, setTimelockAddress] = useState<Address>()
  const governorContract = useContract({
    address: governorContractAddress ?? governorAddress,
    abi: Governor,
    signerOrProvider: data,
  })

  useEffect(() => {
    if (
      !factoryContract ||
      !currentProfileId ||
      isAddress(governorContractAddress ?? "")
    ) {
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
  }, [currentProfileId, factoryContract, governorContractAddress])

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
  Pending,
  Active,
  Canceled,
  Defeated,
  Succeeded,
  Queued,
  Expired,
  Executed,
}

export type Proposer = {
  id: Address
}

export type GovernorProposal = Readonly<{
  // number that +1 start from 1
  id: `${string}|${Address}`
  proposer: Proposer
  gov: { id: Address }
  agreeVotes: BigNumberish
  // forVotes: BigNumberish
  abstainVotes: BigNumberish
  againstVotes: BigNumberish
  description: string
  startBlock: BigNumberish
  endBlock: BigNumberish
  eta: BigNumberish
  canceled: boolean
  executed: boolean
  quorumVotes: BigNumberish
  status: string
  targets: ProposalActions[0]
  values: ProposalActions[1]
  signatures: ProposalActions[2]
  calldatas: ProposalActions[3]
}>

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
  Bytes[],
]

export const useUserGovernor = (governorContractAddress?: Address) => {
  const { address } = useAccount()
  const {
    governorContract: userGovernorContract,
    timelockAddress,
    governorAddress,
  } = useUserGovernorContract(governorContractAddress)
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
      const [targets, values, signatures, calldatas] = latestProposalActions
      setLatestProposal({
        abstainVotes,
        againstVotes,
        canceled,
        description,
        endBlock,
        eta,
        executed,
        agreeVotes: forVotes,
        id: `${id}|${address}`,
        proposer: { id: proposer },
        quorumVotes,
        startBlock,
        status: ProposalState[latestProposalState],
        // @ts-expect-error
        targets,
        // @ts-expect-error
        values,
        // @ts-expect-error
        signatures,
        // @ts-expect-error
        calldatas,
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
