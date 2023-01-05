import { Button } from "@components/UI/Button"
import { Card } from "@components/UI/Card"
import { Spinner } from "@components/UI/Spinner"
import {
  GovernorProposal,
  ProposalVoteAction,
  useUserGovernor,
} from "@lib/hooks/useGovernorContract"
import { useState } from "react"

export type VoteCardProps = {
  proposal: GovernorProposal
}

const VoteCard = ({ proposal }: VoteCardProps) => {
  const { voteProposal } = useUserGovernor(proposal.gov.id)
  const [votingAction, setVotingAction] = useState<ProposalVoteAction>()
  const [isVoting, setIsVoting] = useState(false)

  const handleVote = async (action: ProposalVoteAction) => {
    if (!proposal) {
      return
    }
    const [voteId] = proposal.id.split("|")
    console.log("🚀 ~ file: VoteCard.tsx:25 ~ handleVote ~ voteId", voteId)
    try {
      setVotingAction(action)
      setIsVoting(true)
      const tx = await voteProposal(voteId, action)
      await tx?.wait()
    } catch (error) {
      console.log(error)
    } finally {
      setIsVoting(false)
      setVotingAction(undefined)
    }
  }

  return (
    <Card>
      <div className="pt-4 p-6">
        <div className="flex justify-between text-sm">
          <p className="text-[#090909] capitalize">Vote</p>
          <p className="text-[#939599]">Choose your vote</p>
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <Button
            className="text-left !px-3"
            variant="primary"
            onClick={() => handleVote(ProposalVoteAction.For)}
            disabled={isVoting}
            icon={isVoting && <Spinner variant="success" size="xs" />}
          >
            For
          </Button>
          <Button
            className="text-left !px-3"
            variant="danger"
            onClick={() => handleVote(ProposalVoteAction.Against)}
            disabled={isVoting}
            icon={isVoting && <Spinner variant="success" size="xs" />}
          >
            Against
          </Button>
          <Button
            className="text-left !px-3"
            variant="secondary"
            onClick={() => handleVote(ProposalVoteAction.Abstain)}
            disabled={isVoting}
            icon={isVoting && <Spinner variant="success" size="xs" />}
          >
            Abstain
          </Button>

          {typeof votingAction !== "undefined" && (
            <div className="text-sm inline-flex items-center space-x-1">
              <p className="">You{"'"}ve choose to vote</p>
              <span className="text-red-700">
                {ProposalVoteAction[votingAction]}
              </span>
              <p>this proposal</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

export default VoteCard
