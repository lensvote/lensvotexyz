import { useState } from "react"
import { useForm } from "react-hook-form"
import type { Address } from "wagmi"
import { defaultAbiCoder, isAddress, parseEther } from "ethers/lib/utils.js"
import { Button } from "@components/UI/Button"
import { ProposeArgs, useUserGovernor } from "@lib/hooks/useGovernorContract"
import { DUMMY_TOKEN_ADDRESS, ZERO_ADDRESS } from "@data/index"
import { Duration } from "@lib/time"

enum ProposalAction {
  // transferNativeTokensToSingle,
  transferErc20ToSingle,
  transferZeroEthers,
}

type ProposalFormData = {
  action: ProposalAction
  address?: Address
  value?: string
  description: string
  delay: number
  duration: Duration
  threshold: number
}

const CreateProposal = () => {
  const { createProposal } = useUserGovernor()
  // const [isCreatingProposal, setIsCreatingProposal] = useState()
  const { register, ...proposalForm } = useForm<ProposalFormData>({
    defaultValues: {
      delay: 0,
      value: "0",
      duration: Duration.threeMinutes,
      threshold: 1,
      action: ProposalAction.transferZeroEthers,
    },
  })
  const [action, setAction] = useState<ProposalAction>(
    proposalForm.getValues().action,
  )

  const onSubmit = proposalForm.handleSubmit(async (data) => {
    const selectedAction = Number(data.action)
    console.log(
      "🚀 ~ file: create-proposal.tsx:53 ~ onSubmit ~ data.action",
      selectedAction,
      ProposalAction.transferZeroEthers,
    )
    switch (selectedAction) {
      // case ProposalAction.transferNativeTokensToSingle: {
      // if (!data.address) {
      //   throw `Required data missing:
      //   address - ${data.address}
      //   `
      // }

      // if (!isAddress(data.address.trim())) {
      //   throw "Address provided is not an actual address"
      // }
      //   if (typeof data.value === "undefined") {
      //     throw `Required data missing:
      //     value - ${data.value}
      //     `
      //   }

      //   const address = data.address.trim() as Address
      //   const BLOCK_TIME_PER_SECOND = 2
      //   // transform to block number
      //   const delay = Number(data.delay) / BLOCK_TIME_PER_SECOND
      //   // transform to block number
      //   const duration = Number(data.duration) / BLOCK_TIME_PER_SECOND
      //   const threshold = Number(data.threshold)

      //   const targets = [address]
      //   const values = [parseEther(data.value)]
      //   const signatures = [0]
      //   const calldatas = [0]

      //   // this is like payable(msg.send).transfer(value)
      //   // const signatures = ["transfer(uint256)"]
      //   // const calldata = defaultAbiCoder.encode(
      //   //   ["uint256"],
      //   //   [
      //   //     // amount,
      //   //     parseEther("0.00001"),
      //   //   ],
      //   // )
      //   // const calldatas = [calldata]

      //   const proposeArgs: ProposeArgs = [
      //     targets,
      //     values,
      //     signatures,
      //     calldatas,
      //     data.description,
      //     duration,
      //     delay,
      //     threshold,
      //   ]

      //   const latestProposalId = await createProposal(...proposeArgs)
      // }

      case ProposalAction.transferZeroEthers: {
        const address = ZERO_ADDRESS as Address
        const BLOCK_TIME_PER_SECOND = 2
        // transform to block number
        const delay = Number(data.delay) / BLOCK_TIME_PER_SECOND
        // transform to block number
        const duration = Number(data.duration) / BLOCK_TIME_PER_SECOND
        const threshold = Number(data.threshold)

        const targets = [address]
        const values = [0]
        const signatures = [0]
        const calldatas = [0]

        // this is like payable(msg.send).transfer(value)
        // const signatures = ["transfer(uint256)"]
        // const calldata = defaultAbiCoder.encode(
        //   ["uint256"],
        //   [
        //     // amount,
        //     parseEther("0.00001"),
        //   ],
        // )
        // const calldatas = [calldata]

        const proposeArgs: ProposeArgs = [
          targets,
          values,
          signatures,
          calldatas,
          data.description,
          duration,
          delay,
          threshold,
        ]

        const latestProposalId = await createProposal(...proposeArgs)
        console.log("🚀 ~ file: Proposal created, id - ", latestProposalId)
        return
      }

      case ProposalAction.transferErc20ToSingle: {
        if (!DUMMY_TOKEN_ADDRESS) {
          return
        }

        // TODO: with user interaction
        if (!data.address) {
          throw `Required data missing:
            address - ${data.address}
          `
        }

        if (!isAddress(data.address.trim())) {
          throw "Address provided is not an actual address"
        }

        if (typeof data.value === "undefined") {
          throw `Required data missing:
            value - ${data.value}
            `
        }

        const address = data.address?.trim() as Address
        const BLOCK_TIME_PER_SECOND = 2
        // transform to block number
        const delay = Number(data.delay) / BLOCK_TIME_PER_SECOND
        // transform to block number
        const duration = Number(data.duration) / BLOCK_TIME_PER_SECOND
        const threshold = Number(data.threshold)

        const targets = [DUMMY_TOKEN_ADDRESS]
        const values = [0]
        const signatures = ["transfer(address,uint256)"]
        const calldata = defaultAbiCoder.encode(
          ["address", "uint256"],
          [
            // Address
            address,
            // amount,
            parseEther(data.value ?? "0"),
          ],
        )
        const calldatas = [calldata]
        const proposeArgs: ProposeArgs = [
          targets,
          values,
          signatures,
          calldatas,
          data.description,
          duration,
          delay,
          threshold,
        ]

        const latestProposalId = await createProposal(...proposeArgs)
        console.log("🚀 ~ file: Proposal created, id - ", latestProposalId)
        return
      }
    }
  })

  return (
    <div className="bg-[#F4F5F6]">
      <div className="flex justify-center">
        <div className="max-w-4xl">
          <div className="flex pt-6 pb-32">
            <form className="space-y-8" onSubmit={onSubmit}>
              <div className="space-y-8 sm:space-y-5">
                <div className="space-y-6 sm:space-y-5">
                  <div className="pt-1">
                    <h2 className="text-2xl font-medium leading-6 text-gray-900">
                      Create a proposal
                    </h2>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      Create a new proposal
                    </p>
                  </div>
                  <div className="space-y-6 sm:space-y-5">
                    <div className="sm:col-span-4">
                      <label
                        htmlFor="action"
                        className="block text-lg font-medium text-gray-700 capitalize self-center"
                      >
                        action
                      </label>
                      <div className="mt-1 sm:col-span-2 sm:mt-0">
                        <select
                          id="action"
                          className="mt-1 block w-full rounded-md border-none py-2 pl-3 pr-10 text-base focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                          {...register("action", {
                            onChange(event) {
                              setAction(event.target.value)
                            },
                          })}
                        >
                          {/* <option
                            value={ProposalAction.transferNativeTokensToSingle}
                          >
                            Transfer matics from treasury to a single address
                          </option> */}
                          <option value={ProposalAction.transferZeroEthers}>
                            Non-token relatives, e.g. {'"'}What should we eat
                            tonight?{'"'}
                          </option>
                          <option value={ProposalAction.transferErc20ToSingle}>
                            Transfer LINKs from treasury to a single address
                          </option>
                        </select>

                        {Number(action) ===
                          ProposalAction.transferErc20ToSingle && (
                          <>
                            <a
                              href="https://faucet.polygon.technology"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <p className="text-blue-400 text-sm py-2">
                                Get LINK from Faucet
                              </p>
                            </a>

                            <div className="pt-2">
                              <label
                                htmlFor="address"
                                className="mt-2 block text-xs font-medium text-gray-500"
                              >
                                The address you would want to send to
                              </label>
                              <input
                                id="address"
                                type="text"
                                autoComplete="address"
                                placeholder="address 0x..."
                                className="mt-2 block w-full max-w-lg rounded-md border-none shadow-sm focus:border-green-500 focus:ring-green-500 sm:max-w-xs sm:text-sm"
                                {...register("address")}
                              />
                              <label
                                htmlFor="value"
                                className="mt-2 block text-xs font-medium text-gray-500"
                              >
                                Amount of LINK tokens
                              </label>
                              <input
                                id="value"
                                type="text"
                                step={0.01}
                                min={0}
                                placeholder="Amount of ethers to transfer to"
                                className="mt-2 block w-full max-w-lg rounded-md border-none shadow-sm focus:border-green-500 focus:ring-green-500 sm:max-w-xs sm:text-sm"
                                {...register("value")}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    {/* Describe */}
                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5">
                      <label
                        htmlFor="description"
                        className="block text-lg font-medium text-gray-700 capitalize"
                      >
                        Description
                      </label>
                      <div className="mt-1 sm:col-span-2 sm:mt-0">
                        <textarea
                          id="description"
                          rows={3}
                          className="block w-full max-w-lg rounded-md border-none shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                          defaultValue={""}
                          {...register("description")}
                        />
                        <p className="mt-2 text-sm text-gray-500">
                          Describe what this proposal is about
                        </p>
                      </div>
                    </div>
                    {/* Delay */}
                    <div className="pt-6 sm:pt-5">
                      <div className="sm:grid sm:grid-cols-3 sm:items-start">
                        <label
                          htmlFor="delay"
                          className="block text-lg font-medium text-gray-700 sm:mt-px sm:pt-2 capitalize"
                        >
                          voting delay
                        </label>
                        <div className="mt-1 sm:col-span-2 sm:mt-0">
                          <div className="flex gap-2">
                            <input
                              type="number"
                              id="delay"
                              autoComplete="given-name"
                              className="block w-full max-w-lg rounded-md border-none shadow-sm focus:border-green-500 focus:ring-green-500 sm:max-w-xs sm:text-sm"
                              {...register("delay")}
                            />
                            <div className="pointer-events-none inset-y-0 flex items-center pr-3 text-gray-400 text-sm">
                              seconds
                            </div>
                          </div>
                          <p className="mt-2 text-sm text-gray-500">
                            When after x seconds this proposal is active after
                            creation
                          </p>
                          <p className="mt-2 text-sm text-gray-500">
                            <span className="text-slate-800">0</span> means
                            display on public and active this proposal
                            immediately after the creation
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Duration */}
                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5">
                      <label
                        htmlFor="duration"
                        className="block text-lg font-medium text-gray-700 capitalize self-center"
                      >
                        voting duration
                      </label>
                      <div className="mt-1 sm:col-span-2 sm:mt-0">
                        <select
                          id="duration"
                          autoComplete="0"
                          className="block w-full max-w-lg rounded-md border-none shadow-sm focus:border-green-500 focus:ring-green-500 sm:max-w-xs sm:text-sm"
                          {...register("duration")}
                        >
                          <option value={Duration.threeMinutes}>
                            3 Minutes
                          </option>
                          <option value={Duration.hour}>Hour</option>
                          <option value={Duration.day}>Day</option>
                          <option value={Duration.week}>Week</option>
                          <option value={Duration.month}>Month</option>
                        </select>
                      </div>
                    </div>
                    {/* Voting threshold, how can this proposal be executed */}
                    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5">
                      <label
                        htmlFor="threshold"
                        className="block text-lg font-medium text-gray-700 sm:mt-px sm:pt-2 capitalize"
                      >
                        voting threshold
                      </label>
                      <div className="mt-1 sm:col-span-2 sm:mt-0">
                        <input
                          type="number"
                          id="threshold"
                          min={0}
                          autoComplete="given-name"
                          className="block w-full max-w-lg rounded-md border-none shadow-sm focus:border-green-500 focus:ring-green-500 sm:max-w-xs sm:text-sm"
                          {...register("threshold")}
                        />
                        <p className="mt-2 text-sm text-gray-500">
                          Number of power needed to execute a proposal
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-5">
                <div className="flex">
                  <Button type="submit" className="">
                    Create
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateProposal
