import {  useLocation, useNavigate } from "react-router-dom";

import styles from "./Tabsheader.module.css";

export default function TabsGestion() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div>

      <div className={styles.header}>
        <div className={styles.tabsContainer}>
          <button
            className={location.pathname === "/gestiondir/chercheur" ? styles.activeTab : ""}
            onClick={() => navigate("/gestiondir/chercheur")}
          >
            Chercheurs
          </button>
          <button
            className={location.pathname === "/gestiondir/publication" ? styles.activeTab : ""}
            onClick={() => navigate("/gestiondir/publication")}
          >
            Publications
          </button>
        </div>
      </div>


    </div>
  );
}
