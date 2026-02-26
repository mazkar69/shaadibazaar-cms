import { Route, Routes, useNavigate } from "react-router";
import {superAdminNavs, adminNavs, salesNavs} from "./navConfig.jsx";
import Frame from "./components/Frame/Frame.jsx";
import { lazy, Suspense, useEffect, useState } from "react";
import { Loader } from "rsuite";
import api from "./utils/request/apiRequest.js";

// Lazy load all page components for code-splitting
const DashboardPage = lazy(() => import('./pages/dashboard/index.jsx'));
const LeadList = lazy(() => import('./pages/lead/index.jsx'));
const ConversionList = lazy(() => import("./pages/conversion/index.jsx"));
const ContactUsList = lazy(() => import('./pages/contact/index.jsx'));
const SiteUserPage = lazy(() => import('./pages/siteUser/index.jsx'));
const BusinessUserPage = lazy(() => import('./pages/businessUser/index.jsx'));

// Venue pages
const VenueList = lazy(() => import('./pages/venue/venuelist/index.jsx'));
const VenueCreateForm = lazy(() => import('./pages/venue/venuecreateform/index.jsx'));
const VenueUpdateForm = lazy(() => import('./pages/venue/venueupdateform/index.jsx'));
const VenueCategory = lazy(() => import('./pages/venue/venuecategorylist/index.jsx'));
const VenuePageList = lazy(() => import("./pages/venue/venuepagelist/index.jsx"));
const VenuePageCreate = lazy(() => import("./pages/venue/venuepagecreateform/index.jsx"));
const VenuePageUpdate = lazy(() => import('./pages/venue/venuepageupdateform/index.jsx'));
const VenueUpdateImage = lazy(() => import('./pages/venue/venueupdateimage/index.jsx'));

// Vendor pages
const VendorList = lazy(() => import('./pages/vendor/vendorlist/index.jsx'));
const VendorCreateForm = lazy(() => import('./pages/vendor/vendorcreateform/index.jsx'));
const VendorUpdateForm = lazy(() => import("./pages/vendor/vendorupdateform/index.jsx"));
const VendorCategoryList = lazy(() => import('./pages/vendor/vendorcategory/index.jsx'));
const VendorPageList = lazy(() => import("./pages/vendor/vendorpage/index.jsx"));
const VendorPageCreate = lazy(() => import('./pages/vendor/vendorpagecreateform/index.jsx'));
const VendorPageUpdate = lazy(() => import('./pages/vendor/vendorpageupdateform/index.jsx'));
const VendorUpdateImage = lazy(() => import('./pages/vendor/vendorupdateimage/index.jsx'));
const MangeUser  = lazy(() => import('./pages/userManagement/index.jsx'));
const AssignedLeadList = lazy(() => import("./pages/assignedLeads/index.jsx"));

// Location pages
const CityList = lazy(() => import("./pages/location/city/index.jsx"));
const LocalityList = lazy(() => import("./pages/location/locality/index.jsx"));

// Auth & Error pages
const Protected = lazy(() => import("./protected/Protected.jsx"));
const SignUp = lazy(() => import("./pages/login/SignIn.jsx"));
const ErrorPage = lazy(() => import('./pages/404/index.jsx'));

import { setUser, getUser, deleteUser } from "../store/store.js";

// Loading fallback component
const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <Loader size="lg" content="Loading..." />
  </div>
);

function App() {

  const navigate = useNavigate()
  const user = getUser();
  const ROLE = user.role;
  const navs = ROLE === "superAdmin" ? [...superAdminNavs, ...adminNavs] : ROLE === "admin" ? adminNavs : salesNavs;

  const [auth, setAuth] = useState({
    valid: false,
    role: "admin"
  })


  //This usesEffect will check the token if the token is vailid  it will set user to true and allow access to protected routes otherwise redirect to login page
  useEffect(() => {
    // This useEffect will when the route chnage. On chnage of every route this will run and chek of token and validate. 

    const validate = async () => {

      const token = localStorage.getItem('x4976gtylCC');

      // console.log(token)
      if (!token) {
        //Rediect to the login page
        navigate("/login")
      }

      try {

        const { data } = await api.post("/api/authanticateToken/admin", {
          token: token
        });

        //if token is valid.
        if (data.success) {
          setAuth({
            valid: true,
            role: data.user.role
          })

          //Set the user in the zustand store
          setUser(data.user);
        }
        else {
          //Token is not valid . Redirect to Login Page and remove the invalid token from the  storage
          localStorage.removeItem("x4976gtylCC");
          deleteUser();
          navigate('/login');

        }
      } catch (error) {

        console.log("Error validating token");
        localStorage.removeItem("x4976gtylCC");
        deleteUser();
        navigate("/login")

      }

    }

    validate();
  }, [navigate])

  console.log("Logged User:", user);



  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>


        {/* If user is valid then show this routes */}
        {auth.valid && (

          <Route path="/" element={<Protected><Frame navs={navs} /></Protected>}>
            <Route index element={<DashboardPage />} />
            <Route path="dashboard" element={<DashboardPage />} />

            {/* ================================================== */}
            <Route path="venue" element={< VenueList />} />
            <Route path="venue/add" element={< VenueCreateForm />} />
            <Route path="venue/update/:_id" element={<VenueUpdateForm />} />

            <Route path="venue-category" element={<VenueCategory />} />

            <Route path="venue-page" element={<VenuePageList />} />
            <Route path="venue-page/create" element={<VenuePageCreate />} />
            <Route path="venue-page/update/:_id" element={<VenuePageUpdate />} />
            {/* ================================================== */}




            {/* ============================================================= */}
            <Route path="vendor" element={<VendorList />} />
            <Route path="vendor/add" element={<VendorCreateForm />} />
            <Route path="vendor/update/:_id" element={<VendorUpdateForm />} />


            <Route path="vendor-category" element={<VendorCategoryList />} />

            <Route path="vendor-page" element={<VendorPageList />} />
            <Route path="vendor-page/create" element={<VendorPageCreate />} />
            <Route path="vendor-page/update/:_id" element={<VendorPageUpdate />} />
            {/* ============================================================= */}



            {/* ============================================================= */}
            <Route path="venue/update-image/:_id" element={<VenueUpdateImage />} />
            <Route path="vendor/update-image/:_id" element={<VendorUpdateImage />} />
            {/* ============================================================= */}




            <Route path="location/city" element={<CityList />} />
            <Route path="location/locality" element={<LocalityList />} />

            {/* For super admin */}
            {
              auth.role === "superAdmin" && (
                <>
                 
                  <Route path='manage-user' element={<MangeUser />} />
                  <Route path="leads" element={<LeadList />} />
                  <Route path="conversion" element={<ConversionList />} />
                  <Route path="contact-us" element={<ContactUsList />} />
                  <Route path="site-user" element={<SiteUserPage />} />
                  <Route path="business-user" element={<BusinessUserPage />} />
                </>

              )
            }

            {/* For Sales */}
            auth.role === "sales" && (
              <Route path="assigned-leads" element={<AssignedLeadList />} />
            )


          </Route>

        )}

        {/* These are the public routes */}
        <Route path="/login" element={<SignUp />} />
        <Route path="*" element={<ErrorPage />} />


      </Routes>
    </Suspense>
  );
}

export default App;
