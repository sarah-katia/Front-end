import {  useLocation, useNavigate } from "react-router-dom";

import styles from "./Tabsheader.module.css";

export default function TabsGestion({ tabs }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div>

      <div className={styles.header}>
        <div className={styles.tabsContainer}>
        {tabs.map((tab) => (
          <button
            key={tab.path}
            className={location.pathname === tab.path ? styles.activeTab : ""}
            onClick={() => navigate(tab.path)}
          >
            {tab.label}
          </button>
        ))}
        </div>
      </div>


    </div>
  );
}
