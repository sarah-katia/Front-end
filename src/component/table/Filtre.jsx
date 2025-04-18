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
    <div className="filters-container2">
      <h3>Plus de filtre</h3>
      <div className="filters-grid1">
        {/* H-index */}
        <div className="filter-group1">
          <label>H-index</label>

          <div className="h-index-inputs1">
            <input type="number" name="hIndexMin" placeholder="Min" value={filters.hIndexMin} onChange={handleChange} />
            <input type="number" name="hIndexMax" placeholder="Max" value={filters.hIndexMax} onChange={handleChange} />

          </div>
        </div>

        {/* Établissement d'origine */}
        <div className="filter-group1">
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

        <div className="filter-group1">
          <label><strong>Qualité</strong></label>
          <div><input type="checkbox" name="qualite" value="Enseignant-Chercheur" onChange={handleChange} /> Enseignant-Chercheur</div>
          <div><input type="checkbox" name="qualite" value="Chercheur" onChange={handleChange} /> Chercheur</div>
          <div><input type="checkbox" name="qualite" value="Doctorant" onChange={handleChange} /> Doctorant</div>
        </div>

        {/* Statut du chercheur */}
        <div className="filter-group1">

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

        {/* Équipe du laboratoire */}
        <div className="filter-group1">
          <label>Équipe du laboratoire</label>
          {["CoDesign", "EIAH", "IMAGE", "MSI", "OPI", "SURES"].map((team) => (
            <div key={team}>
              <input type="checkbox" name="equipe" value={team} onChange={handleChange} /> {team}

            </div>
          ))}
        </div>

        {/* Diplôme du chercheur */}
        <div className="filter-group1">

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


      {/* Bouton Appliquer */}
      <div className="apply-btn-container1">
        <button className="apply-btn1" onClick={() => onApply(filters)}>Appliquer</button>

      </div>
    </div>
  );
};

export default Filtre;
