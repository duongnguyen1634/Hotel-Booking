import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { useAuth } from "../pages/SSO/Login/useAuth";

// Layouts
import MainLayout from "../components/MainLayout";
import SSOLayout from "../pages/SSO/SSOLayout";
import GLayout from "../pages/guest/GLayout";
import HMLayout from "../pages/hotel_manager/HMLayout";
import Container from "../pages/container";

// Guest Pages
import GuestBookingHistory from "../pages/guest/Booking/guest_booking_history";

import Payment from "../pages/guest/Booking/payment";
import HotelSearching from "../pages/guest/Hotel_Searching/hotel_searching";
import HotelDetail from "../pages/guest/Hotel_Searching/hotel_detail";
import HotelCheckin from "../pages/guest/Hotel_Searching/hotel_checkin";

// Hotel Manager Pages
import BookingDashboard from "../pages/hotel_manager/dashboard/booking_dashboard";
import HotelBookingHistory from "../pages/hotel_manager/Booking/hotel_booking_history";
import BookingDetail from "../pages/hotel_manager/Booking/hotel_booking_detail";
import Room from "../pages/hotel_manager/Room/room";
import RoomType from "../pages/hotel_manager/Room/room_type";
import HotelInformation from "../pages/hotel_manager/Settings/hotel_information";

// Common Pages
import Account from "../pages/account";
import Home from "../pages/homepage/home";
import About from "../pages/homepage/about";
import Contact from "../pages/homepage/contact";

// SSO Pages
import LogIn from "../pages/SSO/Login/login";
import CreateAccount from "../pages/SSO/Create_Account/create_acount";
import HotelMngSignup from "../pages/SSO/Create_Account/hotel_mng_signup";
import GuestSignup from "../pages/SSO/Create_Account/guest_signup";
import ReceptionistSignup from "../pages/SSO/Create_Account/receptionist_signup";

// Protected Route
import ProtectedRoute from "./ProtectedRoute";

const Router: React.FC = () => {
  const { user } = useAuth();

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />

        {/* SSO Routes */}
        <Route
          path="sso"
          element={
            <ProtectedRoute user={user} allowedRoles={["sso"]}>
              <SSOLayout />
            </ProtectedRoute>
          }
        >
          <Route path="login" element={<LogIn />} />
          <Route path="signup" element={<CreateAccount />} />
          <Route path="signup/guest" element={<GuestSignup />} />
          <Route path="signup/hotelmanager" element={<HotelMngSignup />} />
          <Route path="signup/receptionist" element={<ReceptionistSignup />} />
        </Route>

        {/* Hotel Manager Routes */}
        <Route
          path="hotel"
          element={
            <ProtectedRoute
              user={user}
              allowedRoles={["admin", "hotel_manager", "receptionist"]}
            >
              <HMLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="dashboard" element={<BookingDashboard hotelId={user?.hotel_id} />} />
          <Route path="booking" element={<Container />}>
            <Route
              index
              element={<HotelBookingHistory hotelId={user?.hotel_id} />}
            />
            <Route
              path="history"
              element={<HotelBookingHistory hotelId={user?.hotel_id} />}
            />
            <Route path=":id" element={<BookingDetail />} />
          </Route>
          <Route path="room" element={<Container />}>
            <Route index element={<RoomType hotelId={user?.hotel_id} />} />
            <Route path="roomtype" element={<RoomType hotelId={user?.hotel_id} />} />
            <Route path=":type" element={<Room hotelId={user?.hotel_id} />} />
          </Route>
          <Route path="settings" element={<Container />}>
            <Route
              index
              element={<HotelInformation hotelId={user?.hotel_id} />}
            />
            <Route
              path="hotelinf"
              element={<HotelInformation hotelId={user?.hotel_id} />}
            />
            <Route path="account" element={<Account userId={user?.user_id} />} />
          </Route>
        </Route>

        {/* Guest Routes */}
        <Route
          path="guest"
          element={
            <ProtectedRoute user={user} allowedRoles={["admin", "guest"]}>
              <GLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="hotel" element={<Container />}>
            <Route index element={<HotelSearching />} />
            <Route path="search" element={<HotelSearching />}>
              <Route path="checkin" element={<HotelCheckin />} />
            </Route>
            <Route path=":id" element={<HotelDetail />} />
          </Route>
          <Route path="booking" element={<Container />}>
            <Route index element={<GuestBookingHistory userId={user?.user_id} />} />
            <Route path="history" element={<GuestBookingHistory userId={user?.user_id} />} />
            <Route path=":id" element={<BookingDetail />} />
            <Route path=":id/payment" element={<Payment />} />
          </Route>
          <Route path="settings" element={<Container />}>
            <Route path="account" element={<Account userId={user?.user_id} />} />
          </Route>
        </Route>
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default Router;