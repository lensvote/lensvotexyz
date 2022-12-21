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
  const { cancelProposal } = useUserGovernor()
  const [isCancelingProposal, setIsCancelingProposal] = useState(false)

  const handleCancelProposal = async () => {
    setIsCancelingProposal(true)
    const tx = await cancelProposal(id)
    await tx?.wait()
    setIsCancelingProposal(false)
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
        <Button size="sm" variant="primary">
          Queue
        </Button>
        <Button size="sm" variant="super">
          Execute
        </Button>
      </div>
    </Card>
  )
}

export default ExtraActionsCard
