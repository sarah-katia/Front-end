import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import Sidebar from "../nav/SidebarDi";
import TopNav from "../nav/Topnav";
import styles from "./generer.module.css";

const StatiqueIntervalle = () => {
  const [anneeDebut, setAnneeDebut] = useState(null);
  const [anneeFin, setAnneeFin] = useState(null);
  const [critere, setCritere] = useState("");
  const navigate = useNavigate();

  const critereInclutDate = critere.toLowerCase().includes("date");

  const handleSubmit = () => {
    if (!critere) {
      alert("Veuillez choisir un critère avant de continuer.");
      return;
    }

    if (critereInclutDate) {
      if (!anneeDebut || !anneeFin) {
        alert("Veuillez remplir les deux années.");
        return;
      }
      if (anneeDebut.getFullYear() > anneeFin.getFullYear()) {
        alert("L'année de début doit être antérieure ou égale à l'année de fin.");
        return;
      }
    }

    navigate("/statresults", {
      state: {
        critere,
        dateDebut: critereInclutDate ? anneeDebut.getFullYear() : null,
        dateFin: critereInclutDate ? anneeFin.getFullYear() : null,
      },
    });
  };

  return (
    <div className={styles.page}>
      <Sidebar />
      <div className={styles.main}>
        <TopNav />
        <div className={styles.content}>
          <h2>Veuillez choisir un critère:</h2>

          <div className={styles.formSection}>
            <label>
              Critère :
              <select value={critere} onChange={(e) => setCritere(e.target.value)}>
                <option value="">-- Choisir un critère --</option>
                <option value="Nombre de publication par equipe">Nombre de publication par equipe</option>
                <option value="Nombre de publication par date">Nombre de publication par date</option>
                <option value="Taux de croissance des pubs avec date">Taux de croissance des pubs entre chaque deux ans</option>
                <option value="Meilleur classement des pubs selon les quatres sites">Meilleur classement des pubs selon les quatres sites</option>
                <option value="Nombre de chercheur par grade de recherche">Nombre de chercheur par grade de recherche</option>
                <option value="Nombre de chercheur par equipe">Nombre de chercheur par equipe</option>
                <option value="Chercheur avec le meilleur H-index">Chercheur avec le meilleur H-index</option>
              </select>
            </label>

            {critereInclutDate && (
              <>
                <label>
                  Année de début :
                  <DatePicker
                    selected={anneeDebut}
                    onChange={(date) => setAnneeDebut(date)}
                    showYearPicker
                    dateFormat="yyyy"
                    placeholderText="Choisir une année"
                    className={styles.customInput}
                    popperPlacement="bottom-end"
                  />
                </label>

                <label>
                  Année de fin :
                  <DatePicker
                    selected={anneeFin}
                    onChange={(date) => setAnneeFin(date)}
                    showYearPicker
                    dateFormat="yyyy"
                    placeholderText="Choisir une année"
                    className={styles.customInput}
                    popperPlacement="bottom-end"
                  />
                </label>
              </>
            )}
          </div>

          <div className={styles.buttonContainer}>
            <button className={styles.submitBtn} onClick={handleSubmit} disabled={!critere}>
              suivant --{'>'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatiqueIntervalle;
