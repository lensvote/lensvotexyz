// import GovernanceScrollList from "@components/app/GovernorList"
import DelegationCard from "@components/app/DelegationCard"
import ProposalFeed from "@components/app/ProposalFeed"

const AppPage = () => {
  return (
    <div className="bg-[#F4F5F6] p-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 items-start gap-2 lg:grid-cols-3">
          <DelegationCard />

          <div className="col-span-2 space-y-4">
            {/* <GovernanceScrollList className="col-span-2" /> */}
            <ProposalFeed />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppPage
