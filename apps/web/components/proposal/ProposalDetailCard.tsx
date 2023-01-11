import { useProvider } from "wagmi"
import { Card } from "@components/UI/Card"
import {
  GovernorProposal,
  ProposalActions,
} from "@lib/hooks/useGovernorContract"
import { useEffect, useState } from "react"
import { formatDate } from "@lib/formats"
import { defaultAbiCoder, formatEther } from "ethers/lib/utils.js"
import { BigNumber } from "ethers"

type ProposalDetailCardProps = {
  proposal: GovernorProposal
  actions: ProposalActions
}

const ProposalDetailCard = ({ proposal, actions }: ProposalDetailCardProps) => {
  const { startBlock, endBlock } = proposal
  // There is only one action right now
  const [transferTarget, transferAmount, _, calldata] = actions.map(
    (acts) => acts[0],
  )
  // There is only two types of actions, either transferEther or transferErc20Token
  // We can decode the value of transferFrom function's calldata from transferErc20Token action
  const decodedData =
    calldata !== "0x00"
      ? (defaultAbiCoder.decode(["address", "uint256"], calldata as string) as [
          string,
          BigNumber,
        ])
      : null

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
        BigNumber.from(startBlock)
          .sub(currentBlockNumber)
          .div(2)
          .mul(1000)
          .toNumber()
      const endBlockTimestamp =
        currentTime +
        BigNumber.from(endBlock)
          .sub(currentBlockNumber)
          .div(2)
          .mul(1000)
          .toNumber()

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
              {formatEther(transferAmount.toString())}
            </p>
          </div>

          {decodedData && (
            <div className="flex flex-wrap justify-between text-sm capitalize">
              <p className="text-[#868A8F]">Transfer to</p>
              <p className="text-[#090909] flex-1 text-right break-all ml-8">
                {decodedData[0]}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

export default ProposalDetailCard
