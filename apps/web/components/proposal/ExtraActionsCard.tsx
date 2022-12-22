import { useState } from "react"
import { BigNumber } from "ethers"
import { Button } from "@components/UI/Button"
import { Card } from "@components/UI/Card"
import { Spinner } from "@components/UI/Spinner"
import { useUserGovernor } from "@lib/hooks/useGovernorContract"

type ExtraActionsCardProps = {
  id: BigNumber
}

// extra actions like cancel / queue / execute
const ExtraActionsCard = ({ id }: ExtraActionsCardProps) => {
  const { cancelProposal, queueProposal, executeProposal } = useUserGovernor()
  const [isCancelingProposal, setIsCancelingProposal] = useState(false)
  const [isQueuingProposal, setIsQueuingProposal] = useState(false)
  const [isExecutingProposal, setIsExecutingProposal] = useState(false)

  const handleCancelProposal = async () => {
    try {
      setIsCancelingProposal(true)
      const tx = await cancelProposal(id)
      await tx?.wait()
    } catch (error) {
      console.log(
        "💣 ~ file: ExtraActionsCard.tsx:23 ~ handleCancelProposal ~ error",
        error,
      )
    } finally {
      setIsCancelingProposal(false)
    }
  }

  const handleQueueProposal = async () => {
    try {
      setIsQueuingProposal(true)
      const tx = await queueProposal(id)
      await tx?.wait()
    } catch (error) {
      console.log(
        "💣 ~ file: ExtraActionsCard.tsx:23 ~ handleQueueProposal ~ error",
        error,
      )
    } finally {
      setIsQueuingProposal(false)
    }
  }

  const handleExecuteProposal = async () => {
    try {
      setIsExecutingProposal(true)
      const tx = await executeProposal(id)
      await tx?.wait()
    } catch (error) {
      console.log(
        "💣 ~ file: ExtraActionsCard.tsx:23 ~ handleExecuteProposal ~ error",
        error,
      )
    } finally {
      setIsExecutingProposal(false)
    }
  }

  return (
    <Card>
      <div className="py-2 px-4 flex flex-col space-y-2">
        <Button
          size="sm"
          variant="warning"
          className="flex items-center justify-center"
          onClick={handleCancelProposal}
          loading={isCancelingProposal}
          disabled={isCancelingProposal}
          icon={isCancelingProposal && <Spinner variant="success" size="xs" />}
        >
          Cancel
        </Button>
        <Button
          size="sm"
          variant="primary"
          className="flex items-center justify-center"
          onClick={handleQueueProposal}
          loading={isQueuingProposal}
          disabled={isQueuingProposal}
          icon={isQueuingProposal && <Spinner variant="success" size="xs" />}
        >
          Queue
        </Button>
        <Button
          size="sm"
          variant="super"
          className="flex items-center justify-center"
          onClick={handleExecuteProposal}
          loading={isExecutingProposal}
          disabled={isExecutingProposal}
          icon={isExecutingProposal && <Spinner variant="success" size="xs" />}
        >
          Execute
        </Button>
      </div>
    </Card>
  )
}

export default ExtraActionsCard
