import { Fragment } from "react"
import clsx from "clsx"
import { UserGroupIcon } from "@heroicons/react/24/outline"
import Profile from "@components/settings/Profile"
import Governance from "@components/settings/Governance"
import { Footer } from "@components/shared/Footer"
import { useAppPersistStore, useAppStore } from "@store/app"

const navigation = [
  // { name: "Account", href: "#", icon: UserCircleIcon, current: true },
  { name: "Governance", href: "#", icon: UserGroupIcon, current: true },
]

const Setting = () => {
  const currentProfileId = useAppPersistStore((state) => state.profileId)

  return (
    <Fragment>
      <div className="bg-gray-50 h-[70vh]">
        <div className="max-w-4xl mx-auto p-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
            <aside className="py-6 px-2 sm:px-6 lg:col-span-3 lg:py-0 lg:px-0">
              <nav className="space-y-1">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={clsx(
                      item.current
                        ? "text-green-500 bg-white"
                        : "text-gray-900 hover:text-gray-900 hover:bg-gray-50",
                      "group rounded-md px-3 py-2 flex items-center text-sm font-medium",
                    )}
                    aria-current={item.current ? "page" : undefined}
                  >
                    <item.icon
                      className={clsx(
                        item.current
                          ? "text-green-500"
                          : "text-gray-400 group-hover:text-gray-500",
                        "flex-shrink-0 -ml-1 mr-3 h-6 w-6",
                      )}
                      aria-hidden="true"
                    />
                    <span className="truncate">{item.name}</span>
                  </a>
                ))}
              </nav>
            </aside>
            {/* <Profile /> */}
            <Governance />
          </div>
        </div>
      </div>
      <Footer />
    </Fragment>
  )
}

export default Setting
