import { Dialog, Transition } from "@headlessui/react"
import { XMarkIcon } from "@heroicons/react/24/outline"
import clsx from "clsx"
import type { FC, ReactNode } from "react"
import { Fragment } from "react"

export type ModalProps = {
  icon?: ReactNode
  title: ReactNode
  size?: "sm" | "md" | "lg"
  show: boolean
  children: ReactNode[] | ReactNode
  onClose?: () => void
}

export const Modal: FC<ModalProps> = ({
  icon,
  title,
  size = "sm",
  show,
  children,
  onClose,
}) => {
  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog
        as="div"
        className="overflow-y-auto fixed inset-0 z-10"
        onClose={() => onClose?.()}
      >
        <div className="flex justify-center items-center p-4 min-h-screen text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-100"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-[#090909] bg-opacity-10 backdrop-blur-[2px] transition-opacity" />
          </Transition.Child>
          <span
            className="hidden sm:inline-block sm:h-screen sm:align-middle"
            aria-hidden="true"
          />
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-100"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              className={clsx(
                { "sm:max-w-5xl": size === "lg" },
                { "sm:max-w-3xl": size === "md" },
                { "sm:max-w-lg": size === "sm" },
                "inline-block align-bottom bg-white text-left transform transition-all sm:my-8 sm:align-middle w-full rounded-xl",
              )}
            >
              <div className="flex justify-between items-center py-3.5 px-5 divider">
                <div className="flex items-center space-x-2 font-bold text-xl">
                  {icon}
                  <div>{title}</div>
                </div>
                {onClose ? (
                  <button
                    type="button"
                    className="p-1 text-gray-800 rounded-full hover:bg-gray-200"
                    onClick={onClose}
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                ) : null}
              </div>
              {children}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
