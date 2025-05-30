import React from "react";
import { Route, Routes } from "react-router-dom";
import Uhomepage from "./pages/user/Uhomepage.jsx";
import Ucompleted from "./pages/user/Ucompleted.jsx";
import Ucreate from "./pages/user/Ucreate.jsx";
import Loginpage from "./pages/openingwindow/Loginpage.jsx";
import Thomepage from "./pages/technician/Thomepage.jsx";
import Tupdate from "./pages/technician/Tupdate.jsx";
import Tpending from "./pages/technician/Tpending.jsx";
import Upending from "./pages/user/Upending.jsx";
import Tcompleted from "./pages/technician/Tcompleted.jsx";
import UserPage from "./pages/user/UserPage.jsx";
import Usignup from "./pages/user/Usignup.jsx";
import TechPage from "./pages/technician/TechPage.jsx";
import CscPage from "./pages/csc/CscPage.jsx";
import Cscpending from "./pages/csc/Cscpending.jsx";
import Cschomepage from "./pages/csc/Cschomepage.jsx";
import CscCompletedpage from "./pages/csc/CscCompletedpage.jsx";
import Tsignup from "./pages/technician/Tsignup.jsx";
import CSCsignup from "./pages/csc/CSCsignup.jsx";
import LandingPage from "./pages/openingwindow/LandingPage.jsx";
import AboutUs from "./pages/openingwindow/AboutUs.jsx";
import Certification from "./pages/openingwindow/Certification.jsx";
import IndustriesServed from "./pages/openingwindow/IndustriesServed.jsx";
import Services from "./pages/openingwindow/Services.jsx";
import ViewCalibration from "./pages/user/ViewCalibration.jsx";
import PdfDownloadHandler from "./pages/user/PdfDownloadHandler.jsx";

const App = () => {
  return (
    <div>
      <Routes>
        <Route
          path='/pdf-download'
          element={<PdfDownloadHandler />}
        />
        <Route
          path='*'
          element={<LandingPage />}
        >
          <Route
            path='*'
            element={<Loginpage />}
          />
          <Route
            path='about'
            element={<AboutUs />}
          />
          <Route
            path='services'
            element={<Services />}
          />
          <Route
            path='industries'
            element={<IndustriesServed />}
          />
          <Route
            path='certifications'
            element={<Certification />}
          />
        </Route>

        {/* Add the ViewCalibration route at the top level */}
        <Route
          path='/view-calibration/:documentId'
          element={<ViewCalibration />}
        />

        <Route
          path='/user'
          element={<UserPage />}
        >
          <Route
            path=''
            element={<Ucompleted />}
          />
          <Route
            path='pending'
            element={<Upending />}
          />
          <Route
            path='create'
            element={<Ucreate />}
          />
        </Route>
        <Route
          path='/signup'
          element={<Usignup />}
        />

        <Route
          path='/technician'
          element={<TechPage />}
        >
          <Route
            path='homepage'
            element={<Thomepage />}
          />
          <Route
            path='completed'
            element={<Tcompleted />}
          />
          <Route
            path='pending'
            element={<Tpending />}
          />
          <Route
            path='update'
            element={<Tupdate />}
          />
        </Route>
        <Route
          path='/technician/signup'
          element={<Tsignup />}
        />

        <Route
          path='/csc'
          element={<CscPage />}
        >
          <Route
            path='homepage'
            element={<Cschomepage />}
          />
          <Route
            path='pending'
            element={<Cscpending />}
          />
          <Route
            path='completed'
            element={<CscCompletedpage />}
          />
        </Route>
        <Route
          path='/csc/signup'
          element={<CSCsignup />}
        />
      </Routes>
    </div>
  );
};

export default App;
