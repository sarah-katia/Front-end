import React, { useState } from "react";
import "./Filtre.css";

const Filtre = ({ onApply }) => {
  const [filters, setFilters] = useState({
    hIndexMin: "",
    hIndexMax: "",
    etablissement: "",
    qualite: "",
    statut: "",
    equipe: "",
    diplome: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="filters-container">
      <h3>Plus de filtre</h3>
      <div className="filters-grid">
        {/* H-index */}
        <div className="filter-group">
          <label>H-index</label>
          <div className="h-index-inputs">
            <input
              type="number"
              name="hIndexMin"
              placeholder="Min"
              value={filters.hIndexMin}
              onChange={handleChange}
            />
            <input
              type="number"
              name="hIndexMax"
              placeholder="Max"
              value={filters.hIndexMax}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Établissement d'origine */}
        <div className="filter-group">
          <label>Établissement d’origine</label>
          <div>
            <input
              type="radio"
              name="etablissement"
              value="Esi"
              checked={filters.etablissement === "Esi"}
              onChange={handleChange}
            />{" "}
            Esi
          </div>
          <div>
            <input
              type="radio"
              name="etablissement"
              value="Autres"
              checked={filters.etablissement === "Autres"}
              onChange={handleChange}
            />{" "}
            Autres
          </div>
        </div>

        {/* Qualité */}
        <div className="filter-group">
          <label>Qualité</label>
          {["Enseignant-Chercheur", "Chercheur", "Doctorant"].map((q) => (
            <div key={q}>
              <input
                type="radio"
                name="qualite"
                value={q}
                checked={filters.qualite === q}
                onChange={handleChange}
              />{" "}
              {q}
            </div>
          ))}
        </div>

        {/* Statut */}
        <div className="filter-group">
          <label>Statut du chercheur</label>
          {["Actif", "Non actif"].map((s) => (
            <div key={s}>
              <input
                type="radio"
                name="statut"
                value={s}
                checked={filters.statut === s}
                onChange={handleChange}
              />{" "}
              {s}
            </div>
          ))}
        </div>

        {/* Équipe */}
        <div className="filter-group">
          <label>Équipe</label>
          {["CoDesign", "EIAH", "IMAGE", "MSI", "OPI", "SURES"].map((e) => (
            <div key={e}>
              <input
                type="radio"
                name="equipe"
                value={e}
                checked={filters.equipe === e}
                onChange={handleChange}
              />{" "}
              {e}
            </div>
          ))}
        </div>

        {/* Diplôme */}
        <div className="filter-group">
          <label>Diplôme du chercheur</label>
          {["Ing/Master", "Master", "Doctorat", "Doctorat d’état"].map((d) => (
            <div key={d}>
              <input
                type="radio"
                name="diplome"
                value={d}
                checked={filters.diplome === d}
                onChange={handleChange}
              />{" "}
              {d}
            </div>
          ))}
        </div>
      </div>

      {/* Appliquer */}
      <div className="apply-btn-container">
        <button className="apply-btn" onClick={() => onApply(filters)}>
          Appliquer
        </button>
      </div>
    </div>
  );
};

export default Filtre;
