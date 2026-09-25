
import MyEarning from '../Pages/MyEarning'
import UserNavbar from '../UserDashboard/UserNavbar'
import Features from '../Pages/HexFeature'
import RewardCards from '../Pages/RewardCards'
import LevelProfit from './LevelProfit'
// import ReferralBonus from './ReferralBonus'

// import DailyCompounding from './DailyCompounding'

function TotalEarning() {
  return (
   <>
   <UserNavbar/>
   <MyEarning/>
   <div className=''>

   <LevelProfit/> 
   </div>
   {/* <ReferralBonus/> */}
   <Features/>
   <RewardCards/>
   {/* <DailyCompounding/> */}
   
   </>
  )
}

export default TotalEarning