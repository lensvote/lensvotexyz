import { Button } from "@components/UI/Button"
import { useContractWrite } from "wagmi"
import { GovernanceFactory } from "abis"
import { LENSVOTE_GOVERNANCE_FACTORY } from "@data/index"
import { useCallback } from "react"
import { useAppPersistStore } from "@store/app"
import { parseUnits } from "ethers/lib/utils.js"

const Governance = () => {
  const profileId = useAppPersistStore((state) => state.profileId)
  console.log("🚀 ~ file: governance.tsx:11 ~ Governance ~ profileId", profileId)
  // In millisecond
  const timelockDelay = 0

  const {
    data: writeData,
    isLoading: writeLoading,
    error,
    write: createGovernor,
  } = useContractWrite({
    address: LENSVOTE_GOVERNANCE_FACTORY,
    abi: GovernanceFactory,
    functionName: "createGovernor",
    mode: "recklesslyUnprepared",
  })

  console.log(profileId, writeData, writeLoading, error)

  const enableGovernance = useCallback(async () => {
    const createGovernanceArgs = [profileId, timelockDelay]

    return createGovernor?.({
      recklesslySetUnpreparedArgs: createGovernanceArgs,
      // recklesslySetUnpreparedOverrides: {
      //   gasLimit: parseUnits("150000"),
      // },
    })
  }, [createGovernor, profileId])

  return (
    <div className="space-y-6 sm:px-6 lg:col-span-9 lg:px-0">
      <div className="shadow sm:overflow-hidden sm:rounded-md bg-white">
        <div className="space-y-6 py-6 px-4 sm:p-6">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Enable Governance
            </h3>
            <p className="mt-1 text-sm text-gray-500">Enable your governance</p>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-3 sm:col-span-2">
              <label
                htmlFor="timelock"
                className="block text-sm font-medium text-gray-700 capitalize"
              >
                Timelock
              </label>

              <span className="text-gray-600 text-xs ">
                when to execute poll when poll has queued
              </span>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="number"
                  name="timelock"
                  id="timelock"
                  autoComplete="timelock"
                  className="block w-full rounded-md border-gray-300 focus:border-green-500 focus:ring-green-500 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 sm:text-sm"
                  value={timelockDelay}
                  disabled
                />
              </div>
            </div>
          </div>
        </div>

        <div className="sm:px-6 pb-4">
          <Button size="sm" onClick={enableGovernance}>
            Enable
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Governance
