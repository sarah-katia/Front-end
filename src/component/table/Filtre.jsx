import React, { useState } from "react";
import "./Filtre.css";

const Filtre = ({ onApply }) => {
  const [filters, setFilters] = useState({
    hIndexMin: "",
    hIndexMax: "",
    etablissement: "",
    qualite: "",
    statut: "",
    equipe: [],
    diplome: [],
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (type === "checkbox") {
      setFilters((prev) => ({
        ...prev,
        [name]: checked ? [...prev[name], value] : prev[name].filter((v) => v !== value),
      }));
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
    }
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
            <input type="checkbox" name="etablissement" value="Esi" onChange={handleChange} /> Esi
          </div>
          <div>
            <input type="checkbox" name="etablissement" value="Autres" onChange={handleChange} /> Autres
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
          <div><input type="checkbox" name="statut" value="Actif" onChange={handleChange} /> Actif</div>
          <div><input type="checkbox" name="statut" value="Non actif" onChange={handleChange} /> Non actif</div>
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
          {["Ing/Master", "Master", "Doctorat", "Doctorat d’état"].map((diplome) => (
            <div key={diplome}>
              <input type="checkbox" name="diplome" value={diplome} onChange={handleChange} /> {diplome}
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
