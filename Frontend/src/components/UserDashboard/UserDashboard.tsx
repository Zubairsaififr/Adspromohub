
import UserNavbar from './UserNavbar'
import UserPage from './FundsSection'
import APH from '../../assets/APH.png'


export default function UserDashboard() {
  return (
    <>
    <UserNavbar/>
    <UserPage/>
    <div>
      <img src={APH} alt="" />
    </div>
    </>
  )
}
