import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Personnel from "./personal";
import Securite from "./securite";
import style from "./tabscompo.module.css"; // Import du module CSS

export default function TabsComponent({ chercheur }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div>
      <div className={style.tabss}>
        <button
          className={location.pathname === "/component/modifier/personal" ? style.activeTab : ""}
          onClick={() => navigate("/component/modifier/personal")}
        >
          Personnel
        </button>
        <button
          className={location.pathname === "/component/modifier/securite" ? style.activeTab : ""}
          onClick={() => navigate("/component/modifier/securite")}
        >
          Sécurité
        </button>
      </div>

      <Routes>
        <Route path="personal" element={<Personnel chercheur={chercheur} />} />
        <Route path="securite" element={<Securite />} />
      </Routes>
    </div>
  );
}
