import React, { ComponentProps, ElementType } from "react"
import LogoPng from "../assets/logo-green.png"

type LogoProps = ComponentProps<"img"> & {
  text?: boolean
}

export const Logo = ({ text = true, ...props }: LogoProps) => {
  if (text) {
    return (
      <div className="inline-flex items-center gap-[6px]">
        <svg
          width="123"
          height="19"
          viewBox="0 0 123 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.58252 14.8204H10.1165V18H0.432039V0.839805H4.58252V14.8204ZM16.416 4.14078V7.73301H22.217V10.8641H16.416V14.6748H22.9451V18H12.2655V0.839805H22.9451V4.14078H16.416ZM40.7876 18H36.6371L29.6954 7.46602V18H25.5449V0.839805H29.6954L36.6371 11.4709V0.839805H40.7876V18ZM56.2268 13.1699C56.2268 14.0761 55.9921 14.9094 55.5229 15.6699C55.0698 16.4304 54.3902 17.0372 53.484 17.4903C52.5941 17.9434 51.5099 18.1699 50.2316 18.1699C48.306 18.1699 46.7203 17.7006 45.4743 16.7621C44.2284 15.8236 43.5488 14.5129 43.4355 12.8301H47.853C47.9177 13.4773 48.1442 13.9871 48.5326 14.3592C48.9371 14.7314 49.4468 14.9175 50.0617 14.9175C50.5957 14.9175 51.0164 14.7718 51.3238 14.4806C51.6313 14.1893 51.785 13.801 51.785 13.3155C51.785 12.8786 51.6394 12.5146 51.3481 12.2233C51.073 11.932 50.7251 11.6974 50.3044 11.5194C49.8837 11.3252 49.3012 11.0987 48.5569 10.8398C47.4727 10.4676 46.5827 10.1116 45.8869 9.77184C45.2073 9.41586 44.6167 8.89806 44.1151 8.21845C43.6297 7.52265 43.3869 6.6246 43.3869 5.52427C43.3869 4.50485 43.6458 3.62298 44.1636 2.87864C44.6814 2.1343 45.3934 1.56796 46.2996 1.17961C47.2219 0.77508 48.2737 0.572814 49.4549 0.572814C51.3643 0.572814 52.8772 1.02589 53.9937 1.93204C55.1264 2.83819 55.7656 4.08414 55.9112 5.6699H51.4209C51.34 5.10356 51.1297 4.65858 50.7899 4.33495C50.4662 3.99514 50.0213 3.82524 49.4549 3.82524C48.9695 3.82524 48.573 3.95469 48.2656 4.21359C47.9743 4.47249 47.8287 4.85275 47.8287 5.35437C47.8287 5.7589 47.9581 6.1068 48.217 6.39806C48.4921 6.67314 48.8319 6.89968 49.2365 7.07767C49.641 7.25566 50.2235 7.4822 50.984 7.75728C52.0844 8.12945 52.9824 8.50162 53.6782 8.87379C54.374 9.22977 54.9727 9.75566 55.4743 10.4515C55.9759 11.1472 56.2268 12.0534 56.2268 13.1699ZM61.968 0.839805L66.167 13.7524L70.3661 0.839805H74.8078L68.8369 18H63.4728L57.5262 0.839805H61.968ZM110.112 0.839805V4.14078H105.452V18H101.277V4.14078H96.6655V0.839805H110.112ZM116.255 4.14078V7.73301H122.056V10.8641H116.255V14.6748H122.784V18H112.104V0.839805H122.784V4.14078H116.255Z"
            fill="#202225"
          />
          <circle
            cx="84.761"
            cy="9.15847"
            r="7.07929"
            stroke="black"
            stroke-width="3.64078"
          />
          <path
            d="M82.0726 6.09019L80.9262 7.23218C80.3722 7.78405 80.3705 8.68052 80.9224 9.23451L84.5962 12.9224C85.1496 13.4779 86.049 13.4779 86.6024 12.9224L94.6643 4.82961C95.2161 4.27563 95.2144 3.37916 94.6604 2.82729L93.5141 1.6853C92.9601 1.13343 92.0636 1.13514 91.5118 1.68913L85.5993 7.62426L84.0749 6.09402C83.523 5.54003 82.6265 5.53832 82.0726 6.09019Z"
            fill="#5BDE1D"
            stroke="white"
            stroke-width="1.21359"
          />
        </svg>
      </div>
    )
  }

  return <img src={LogoPng.src} alt="Logo" {...props} />
}
