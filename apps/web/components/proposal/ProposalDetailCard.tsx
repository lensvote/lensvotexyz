import { useProvider } from "wagmi"
import { Card } from "@components/UI/Card"
import {
  GovernorProposal,
  ProposalActions,
} from "@lib/hooks/useGovernorContract"
import { useEffect, useState } from "react"
import { formatDate, formatNumber } from "@lib/formats"

type ProposalDetailCardProps = {
  proposal: GovernorProposal
  actions: ProposalActions
}

const ProposalDetailCard = ({ proposal, actions }: ProposalDetailCardProps) => {
  const { startBlock, endBlock } = proposal
  // There is only one action right now
  const [transferTarget, transferAmount] = actions.map((acts) => acts[0])
  const provider = useProvider()
  // Formatted time string
  const [{ startTime, endTime }, setTimes] = useState<{
    startTime?: string
    endTime?: string
  }>({})

  useEffect(() => {
    if (!provider) {
      return
    }

    ;(async () => {
      const currentTime = new Date().getTime()
      const currentBlockNumber = await provider.getBlockNumber()
      const startBlockTimestamp =
        currentTime +
        startBlock.sub(currentBlockNumber).div(2).mul(1000).toNumber()
      const endBlockTimestamp =
        currentTime +
        endBlock.sub(currentBlockNumber).div(2).mul(1000).toNumber()

      setTimes({
        startTime: formatDate(startBlockTimestamp),
        endTime: formatDate(endBlockTimestamp),
      })
    })()
  }, [endBlock, startBlock, provider])

  return (
    <Card>
      <div className="py-2 px-4">
        <h6 className="text-sm capitalize">details</h6>

        <div className="mt-4 space-y-2">
          {startTime && (
            <div className="flex justify-between text-sm capitalize">
              <p className="text-[#868A8F]">Start</p>
              <p className="text-[#090909]">{startTime}</p>
            </div>
          )}
          {endTime && (
            <div className="flex justify-between text-sm capitalize">
              <p className="text-[#868A8F]">End</p>
              <p className="text-[#090909]">{endTime}</p>
            </div>
          )}
          <div className="flex flex-wrap justify-between text-sm capitalize">
            <p className="text-[#868A8F]">Target</p>
            <p className="text-[#090909] flex-1 text-right break-all ml-8">
              {transferTarget.toString()}
            </p>
          </div>
          <div className="flex justify-between text-sm capitalize">
            <p className="text-[#868A8F]">Amount</p>
            <p className="text-[#090909]">
              {formatNumber(Number(transferAmount.toString()))}
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default ProposalDetailCard
