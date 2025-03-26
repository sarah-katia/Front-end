import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Personnel from "./personal";
import Securite from "./securite";
import "./tabscompo.css";

export default function TabsComponent({ chercheur }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div >
      <div className="tabs">
        <button
          className={location.pathname === "/component/modifier/personal" ? "active-tab" : ""}
          onClick={() => navigate("/component/modifier/personal")}
        >
          Personnel
        </button>
        <button
          className={location.pathname === "/component/modifier/securite" ? "active-tab" : ""}
          onClick={() => navigate("/component/modifier/securite")}
        >
          Sécurité
        </button>
      </div>

      {/* 🔹 Routes pour afficher le bon composant en fonction du path */}
      <Routes>
        <Route path="personal" element={<Personnel chercheur={chercheur} />} />
        <Route path="securite" element={<Securite />} />
      </Routes>
    </div>
  );
}
