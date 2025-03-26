import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Personnel from "./personal";
import Securite from "./securite";
import styles from "./tabscompo.module.css"; // Import du module CSS

export default function TabsComponent({ chercheur }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div>
      <div className={styles.tabs}>
        <button
          className={location.pathname === "/component/modifier/personal" ? styles.activeTab : ""}
          onClick={() => navigate("/component/modifier/personal")}
        >
          Personnel
        </button>
        <button
          className={location.pathname === "/component/modifier/securite" ? styles.activeTab : ""}
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
