import "./App.css";

import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@coreui/coreui/dist/css/coreui.min.css";
import Auth from "./pages/Auth";
import Engineer from "./pages/Engineer";
import Admin from "./pages/Admin";
import Customer from "./pages/Cutsomer";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/engineer" element={<Engineer />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/" element={<Auth />} />
      </Routes>
    </div>
  );
}

export default App;
