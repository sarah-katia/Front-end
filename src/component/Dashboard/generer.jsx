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

  const handleSubmit = () => {
    if (!critere) {
      alert("Veuillez choisir un critère avant de continuer.");
      return;
    }
  
    if (critere.includes("date")) {
      // 1) Validation des années
      if (!anneeDebut || !anneeFin) {
        alert("Veuillez remplir les deux années.");
        return;
      }
      if (anneeDebut.getFullYear() > anneeFin.getFullYear()) {
        alert("L'année de début doit être antérieure ou égale à l'année de fin.");
        return;
      }
  
      // 2) Navigation pour le critère date
      navigate("/statresults", {
        state: {
          critere,
          dateDebut: anneeDebut.getFullYear(),
          dateFin: anneeFin.getFullYear(),
        },
      });
    } else {
      // Critère sans date → on navigue directement
      navigate("/statresults", {
        state: { critere },
      });
    }
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
                <option value="nombre de publication par equipe">nombre de publication par equipe</option>
                <option value="nombre de publication par date">nombre de publication par date</option>
              </select>
            </label>


            {critere.includes("date") && (
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
