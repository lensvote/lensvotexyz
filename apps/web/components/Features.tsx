import React from "react"

export const Features = () => {
  return (
    <div className="max-w-5xl mx-auto grid grid-cols-3 gap-6">
      <div className="bg-[#FFC528] rounded-xl p-6 pb-12 font-bold flex flex-col gap-4">
        <h3 className="text-xl capitalize">what is lensvote?</h3>
        <p className="text-sm">
          A voting platform which focus on social graph.
        </p>
      </div>

      <div className="bg-[#C6FF68] rounded-xl p-6 pb-12 font-bold flex flex-col gap-4">
        <h3 className="text-xl capitalize">why we need lensvote?</h3>
        <p className="text-sm">
          TBA...
        </p>
      </div>

      <div className="bg-[#1D73FF] text-white rounded-xl p-6 pb-12 font-bold flex flex-col gap-4">
        <h3 className="text-xl capitalize">how we use it?</h3>
        <p className="text-sm">
          TBA...
        </p>
      </div>
    </div>
  )
}
