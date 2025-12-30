import { Route, Routes, useNavigate } from "react-router";
import { appNavs } from "./config.jsx";
import Frame from "./components/Frame/Frame.jsx";

import DashboardPage from './pages/dashboard/index.jsx';
import LeadList from './pages/lead/index.jsx'
import ConversionList from "./pages/conversion/index.jsx";


import VenueList from './pages/venue/venuelist/index.jsx';
import VenueCreateForm from './pages/venue/venuecreateform/index.jsx'
import VenueUpdateForm from './pages/venue/venueupdateform/index.jsx'
import VenueCategory from './pages/venue/venuecategory/index.jsx'
import VenuePageList from "./pages/venue/venuepage/index.jsx";
import VenuePageCreate from "./pages/venue/venuepagecreateform/index.jsx"
import VenuePageUpdate from './pages/venue/venuepageupdateform/index.jsx'
import VenueUpdateImage from './pages/venue/venueupdateimage/index.jsx'


import VendorList from './pages/vendor/vendorlist/index.jsx'
import VendorCreateForm from './pages/vendor/vendorcreateform/index.jsx'
import VendorUpdateForm from "./pages/vendor/vendorupdateform/index.jsx";
import VendorCategoryList from './pages/vendor/vendorcategory/index.jsx'
import VendorPageList from "./pages/vendor/vendorpage/index.jsx";
import VendorPageCreate from './pages/vendor/vendorpagecreateform/index.jsx'
import VendorPageUpdate from './pages/vendor/vendorpageupdateform/index.jsx'
import VendorUpdateImage from './pages/vendor/vendorupdateimage/index.jsx'


import CityList from "./pages/location/city/index.jsx";
import LocalityList from "./pages/location/locality/index.jsx";

import Protected from "./protected/Protected.jsx";
import SignUp from "./pages/login/SignIn.jsx";

import ErrorPage from './pages/404/index.jsx'
import { useEffect, useState } from "react";

function App() {

  const navigate = useNavigate()

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

        let isValid = await fetch("/api/authanticate/token", {
          method: "POST",
          body: JSON.stringify({ token: token }),
          headers: {
            'Content-Type': 'application/json'
          }
        });

        isValid = await isValid.json();


        //if token is valid.
        if (isValid.success) {
          setAuth({
            valid: true,
            role: isValid.role
          })
        }
        else {
          //Token is not valid . Redirect to Login Page and remove the invalid token from the  storage
          localStorage.removeItem("x4976gtylCC");
          navigate('/login');

        }
      } catch (error) {

        console.log("Error validating token");
        navigate("/login")

      }

    }

    validate();
  }, [navigate])

  return (
    <>
      <Routes>


        {/* If user is valid then show this routes */}
        {auth.valid && (

          <Route path="/" element={<Protected><Frame navs={appNavs} /></Protected>}>
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
                  <Route path="leads" element={<LeadList />} />
                  <Route path="conversion" element={<ConversionList />} />
                </>

              )
            }


          </Route>

        )}

        {/* These are the public routes */}
        <Route path="/login" element={<SignUp />} />
        <Route path="*" element={<ErrorPage />} />


      </Routes>
    </>
  );
}

export default App;
