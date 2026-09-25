import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import SignIn from "./components/ui/SignIn";
import { SignUp } from "./components/ui/SignUp";
import AppForm from "./AppForm";
import NewDashboard from "./components/NEW dashboard/NewDashboard";
import UserDashboard from "./components/UserDashboard/UserDashboard";
import ForgotPassword from "./components/Pages/ForgotPassword";
import TotalEarning from "./components/EarningPages/TotalEarning";
import Subscription from "./components/EarningPages/Subscription";
import MyCircle from "./components/Pages/MyCircle";
import Withdrawal from "./components/EarningPages/Withdrawal";
import Support from "./components/Help/Support";
import UpdateProfile from "./components/UserDashboard/UpdateProfile";
import RoyaltyPool from "./components/EarningPages/RoyaltyPool";
import RankHierarchy from "./components/EarningPages/RankHierarchy";
import ReferralBonus from "./components/EarningPages/ReferralBonus";
import IncomeWallet from "./components/EarningPages/IncomeWallet";
import MyAllCircle from "./components/Pages/MyAllcircle";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
import TeamRankBonus from "./components/EarningPages/TeamRankBonus";
import RankAchiever from "./components/EarningPages/RankAchiever";
import AdminSupport from "./components/AdminDashboard/AdminSupport";
import BrandPromo from "./components/Pages/BrandPromo";
import DevSignup from "./components/AdminDashboard/DevSignup";

// Scroll to top whenever route changes
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return null;
}

export function App() {
  return (
    <Router>
      {/* Global Scroll To Top */}
      <ScrollToTop />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<AppForm />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/newdashboard" element={<NewDashboard />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/totalearning" element={<TotalEarning />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/mycircle" element={<MyCircle />} />
        <Route path="/myallcircle" element={<MyAllCircle />} />
        <Route path="/claim-ads-points" element={<Withdrawal />} />
        <Route path="/my-ticket" element={<Support />} />
        <Route path="//admin/support" element={<AdminSupport />} />
        <Route path="/brandpromo" element={<BrandPromo />} />
        <Route path="/admin/test-users" element={<DevSignup />} />
        <Route
          path="/admin/support/:ticketId"
          element={<AdminSupport />}
        />




        <Route path="/update-profile" element={<UpdateProfile />} />
        <Route path="/royalty-pool" element={<RoyaltyPool />} />
        <Route path="/rank-hierarchy" element={<RankHierarchy />} />
        <Route path="/referral" element={<ReferralBonus />} />
        <Route path="/incomewallet" element={<IncomeWallet />} />
        <Route path="/rank_archiever" element={<RankAchiever />} />

        <Route
          path="/forgotpassword"
          element={<ForgotPassword />}
        />

        <Route
          path="/team-rank-bonus"
          element={<TeamRankBonus />}
        />

        <Route />

        <Route
          path="/admin"
          element={
            <AdminDashboard />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;