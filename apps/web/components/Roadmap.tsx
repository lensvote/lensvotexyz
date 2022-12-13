import React from "react"

const leftArrow = (
  <svg
    width="24"
    height="21"
    viewBox="0 0 24 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      opacity="0.5"
      d="M1.58243 10.5L1.77604 10.961L1.77679 10.9607C1.77654 10.9608 1.77629 10.9609 1.77604 10.961L1.58243 10.5ZM1.58243 10.5L1.77605 10.039L1.7768 10.0393C1.77655 10.0392 1.7763 10.0391 1.77604 10.039L1.58243 10.5ZM2.87364 10.5L21.1165 2.838L18.1949 9.49537C17.914 10.1357 17.914 10.8643 18.1949 11.5046L21.1165 18.162L2.87364 10.5Z"
      fill="#6EE237"
      stroke="white"
      stroke-width="3"
    />
  </svg>
)

const downArrow = (
  <svg
    width="21"
    height="24"
    viewBox="0 0 21 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      opacity="0.5"
      d="M10.5 22.4176L10.961 22.224L10.9607 22.2232C10.9608 22.2235 10.9609 22.2237 10.961 22.224L10.5 22.4176ZM10.5 22.4176L10.039 22.224L10.0393 22.2232C10.0392 22.2235 10.0391 22.2237 10.039 22.224L10.5 22.4176ZM10.5 21.1264L2.83801 2.88352L9.49538 5.80505C10.1357 6.08603 10.8643 6.08603 11.5046 5.80505L18.162 2.88352L10.5 21.1264Z"
      fill="#6EE237"
      stroke="white"
      stroke-width="3"
    />
  </svg>
)

const rightArrow = (
  <svg
    width="24"
    height="21"
    viewBox="0 0 24 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.4176 10.5L22.224 10.039L22.2232 10.0393C22.2235 10.0392 22.2237 10.0391 22.224 10.039L22.4176 10.5ZM22.4176 10.5L22.224 10.961L22.2232 10.9607C22.2235 10.9608 22.2237 10.9609 22.224 10.961L22.4176 10.5ZM21.1264 10.5L2.88352 18.162L5.80505 11.5046C6.08603 10.8643 6.08603 10.1357 5.80505 9.49538L2.88352 2.83801L21.1264 10.5Z"
      fill="#6EE237"
      stroke="white"
      stroke-width="3"
    />
  </svg>
)

export const Roadmap = () => {
  return (
    <div className="flex flex-col gap-4 max-w-5xl mx-auto mt-32">
      <h2 className="capitalize font-bold text-[42px] text-center mb-8">Road Map</h2>

      <div className="flex gap-4">
        <div className="rounded-lg border-2 border-[#6EE237] py-3 px-8">
          Frontend MVP
        </div>
        <div className="self-center">{rightArrow}</div>
        <div className="rounded-lg border-2 border-[#6EE237] py-3 px-8 opacity-50">
          Backend MVP
        </div>
        <div className="self-center opacity-50">{rightArrow}</div>
        <div className="rounded-lg border-2 border-[#6EE237] py-3 px-8 opacity-50">
          Various voting weight formula
        </div>
        <div className="self-center opacity-50">{rightArrow}</div>

        <div className="rounded-lg border-2 border-[#6EE237] py-3 px-8 opacity-50 flex-1 text-center">
          Open API
        </div>
      </div>

      <div className="flex justify-end mr-20">{downArrow}</div>

      <div className="flex items-center justify-end gap-4">
        <div className="rounded-lg border-2 border-[#6EE237] py-3 px-8 opacity-50">
          multi-sign governance module
        </div>
        {leftArrow}
        <div className="rounded-lg border-2 border-[#6EE237] py-3 px-8 opacity-50">
          Open SDK
        </div>
      </div>
    </div>
  )
}
