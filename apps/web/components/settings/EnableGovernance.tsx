import { useCallback } from "react"
import { useContractWrite } from "wagmi"
import { InformationCircleIcon } from "@heroicons/react/20/solid"
import { Button } from "@components/UI/Button"
import { LENSVOTE_GOVERNANCE_FACTORY } from "@data/index"
import { useAppPersistStore } from "@store/app"
import { Spinner } from "@components/UI/Spinner"
import { GovernanceFactory } from "abis"
import { useUserGovernor } from "@lib/hooks/useGovernorContract"

const EnableGovernance = () => {
  const profileId = useAppPersistStore((state) => state.profileId)
  const { timelockAddress, governorAddress } = useUserGovernor()
  // In millisecond
  const timelockDelay = 0

  const { isLoading: isEnablingGovernor, write: createGovernor } =
    useContractWrite({
      address: LENSVOTE_GOVERNANCE_FACTORY,
      abi: GovernanceFactory,
      functionName: "createGovernor",
      mode: "recklesslyUnprepared",
    })

  const enableGovernance = useCallback(async () => {
    const createGovernanceArgs = [profileId, timelockDelay] as const
    return createGovernor?.({
      // Cast it to any since this args is currently working, the inferred typing of wagmi is wrong
      recklesslySetUnpreparedArgs: createGovernanceArgs as any,
      // recklesslySetUnpreparedOverrides: {
      //   gasLimit: parseUnits("150000"),
      // },
    })
  }, [createGovernor, profileId])

  return (
    <div className="space-y-6 sm:px-6 lg:col-span-9 lg:px-0">
      <div className="space-y-6 py-6 px-4 sm:p-6">
        <h2 className="text-2xl font-medium leading-6 text-gray-900">
          Governance
        </h2>

        {!timelockAddress && (
          <div className="rounded-md bg-blue-50 p-4 mt-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <InformationCircleIcon
                  className="h-5 w-5 text-blue-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-3 flex-1 md:flex md:justify-between">
                <p className="text-sm text-blue-700">
                  Would you like to create a proposal? you have to enable
                  governance module fist, this will allow the on-chain process
                  seamlessly.
                </p>
              </div>
            </div>
          </div>
        )}

        {governorAddress && (
          <div>
            <p className="block text-sm font-medium text-gray-700 capitalize">
              Your Governance Address
            </p>
            <span className="text-gray-600 text-xs">{governorAddress}</span>
          </div>
        )}
        {timelockAddress && (
          <div className="mt-8">
            <p className="block text-sm font-medium text-gray-700 capitalize">
              Your Timelock Address
            </p>
            <span className="text-gray-600 text-xs">{timelockAddress}</span>
          </div>
        )}

        <div>
          <label
            htmlFor="timelock"
            className="block text-sm font-medium text-gray-700 capitalize"
          >
            Revertable Slot
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

      {!timelockAddress && (
        <div className="sm:px-6 pb-4">
          <Button
            size="sm"
            onClick={enableGovernance}
            disabled={isEnablingGovernor}
            loading={isEnablingGovernor}
            icon={isEnablingGovernor && <Spinner size="sm" />}
          >
            Enable Governance
          </Button>
        </div>
      )}
    </div>
  )
}

export default EnableGovernance
