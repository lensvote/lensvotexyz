import { Fragment } from "react"
import { useAccount, useDisconnect } from "wagmi"
import { Menu, Transition } from "@headlessui/react"
import clsx from "clsx"

import { Button } from "@components/UI/Button"
import { useAppStore, useAppPersistStore } from "@store/app"
import { LV_KEYS } from "data/constants"

const SignedUser = () => {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile)
  const setProfileId = useAppPersistStore((state) => state.setProfileId)

  const resetAuthData = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem(LV_KEYS.STORE)
  }

  const signout = () => {
    // Disconnect wallet
    disconnect()
    // Reset storage auths
    resetAuthData()
    // Update store
    setCurrentProfile(null)
    setProfileId(null)
  }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button>
          <Button className="text-sm font-normal" rounded>
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </Button>
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="py-2 absolute z-10 right-0 mt-2 w-32 origin-top-right rounded-md bg-white border-[#EFF4F4] border shadow-[0px_4px_12px_-7px_#00000040] ring-1 ring-black ring-opacity-5 focus:outline-none">
          {/* Setting */}
          {/* <div className="px-2">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={clsx(
                    active && "bg-[#EFF4F4]",
                    "group flex w-full items-center rounded-md p-2 text-sm font-medium",
                  )}
                >
                  Setting
                </button>
              )}
            </Menu.Item>
          </div> */}

          {/* Sign out */}
          <div className="px-2">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={clsx(
                    active && "bg-[#EFF4F4]",
                    "group flex w-full items-center rounded-md p-2 text-sm font-medium",
                  )}
                  onClick={signout}
                >
                  Sign out
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default SignedUser