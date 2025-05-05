import React, { useState } from "react";
import "./Filtre.css";

const Filtre = ({ onApply }) => {
  const [filters, setFilters] = useState({
    hIndexMin: "",
    hIndexMax: "",
    hIndexBase: "",
    etablissement: "",
    qualite: [],
    statut: "",
    equipe: [],
    diplome: "",
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    // Gestion des cases à cocher
    if (type === "checkbox") {
      setFilters((prev) => {
        const current = prev[name] || [];
        return {
          ...prev,
          [name]: checked
            ? [...current, value]
            : current.filter((v) => v !== value),
        };
      });
    } else {
      // Si on remplit hIndexBase, on vide Min/Max
      if (name === "hIndexBase" && value !== "") {
        setFilters((prev) => ({
          ...prev,
          hIndexBase: value,
          hIndexMin: "",
          hIndexMax: "",
        }));
      }
      // Si on remplit Min ou Max, on vide hIndexBase
      else if ((name === "hIndexMin" || name === "hIndexMax") && value !== "") {
        setFilters((prev) => ({
          ...prev,
          [name]: value,
          hIndexBase: "",
        }));
      } else {
        setFilters((prev) => ({ ...prev, [name]: value }));
      }
    }
  };

  // Affichage des valeurs sélectionnées pour debug
  const renderSelectedFilters = () => {
    const selectedFilters = [];
    
    if (filters.hIndexBase) 
      selectedFilters.push(`H-index: ${filters.hIndexBase}`);
    if (filters.hIndexMin || filters.hIndexMax)
      selectedFilters.push(`H-index: ${filters.hIndexMin || '0'} - ${filters.hIndexMax || '∞'}`);
    if (filters.etablissement) 
      selectedFilters.push(`Établissement: ${filters.etablissement}`);
    if (filters.qualite.length > 0) 
      selectedFilters.push(`Qualité: ${filters.qualite.join(', ')}`);
    if (filters.statut) 
      selectedFilters.push(`Statut: ${filters.statut}`);
    if (filters.equipe.length > 0) 
      selectedFilters.push(`Équipe: ${filters.equipe.join(', ')}`);
    if (filters.diplome) 
      selectedFilters.push(`Diplôme: ${filters.diplome}`);
    
    if (selectedFilters.length === 0) return null;
    
    return (
      <div className="selected-filters">
        <h4>Filtres sélectionnés:</h4>
        <ul>
          {selectedFilters.map((filter, index) => (
            <li key={index}>{filter}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="filters-container2">
      <h3>Plus de filtres</h3>
      <div className="filters-grid1">
        {/* H-index avec Min, Max et Base */}
        <div className="filter-group1">
          <label>H-index avec intervalle</label>
          <div className="h-index-inputs1">
            <input
              type="number"
              name="hIndexMin"
              placeholder="Min"
              value={filters.hIndexMin}
              onChange={handleChange}
              disabled={filters.hIndexBase !== ""}
            />
            <input
              type="number"
              name="hIndexMax"
              placeholder="Max"
              value={filters.hIndexMax}
              onChange={handleChange}
              disabled={filters.hIndexBase !== ""}
            />
          </div>
          <div className="h-index-base">
            <label>H-index exact</label>
            <input
              type="number"
              name="hIndexBase"
              placeholder="Ex: 12"
              value={filters.hIndexBase}
              onChange={handleChange}
              disabled={filters.hIndexMin !== "" || filters.hIndexMax !== ""}
            />
          </div>
        </div>

        {/* Établissement d'origine */}
        <div className="filter-group1">
          <label>Établissement d'origine</label>
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
          <div><input type="checkbox" name="qualite" value="Professeur" onChange={handleChange} /> Professeur</div>
          <div><input type="checkbox" name="qualite" value="Maitre_de_conference" onChange={handleChange} /> Maître de Conférence</div>
        </div>

        {/* Statut */}
        <div className="filter-group1">
          <label>Statut du chercheur</label>
          {["Actif", "Inactif"].map((s) => (
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
        <div className="filter-group1">
          <label>Équipe du laboratoire</label>
          {["CoDesign", "EIAH", "IMAGE", "MSI", "OPI", "SURES", "TIIMA"].map((team) => (
            <div key={team}>
              <input 
                type="checkbox" 
                name="equipe" 
                value={team} 
                checked={filters.equipe.includes(team)}
                onChange={handleChange} 
              /> {team}
            </div>
          ))}
        </div>

        {/* Diplôme */}
        <div className="filter-group1">
          <label>Diplôme du chercheur</label>
          {["Ing/Master", "Master", "Doctorat", "Doctorat d'état"].map((d) => (
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

      {/* Affichage des filtres sélectionnés */}
      {renderSelectedFilters()}

      {/* Bouton Appliquer */}
      <div className="apply-btn-container1">
        <button className="apply-btn1" onClick={() => onApply(filters)}>Appliquer</button>
      </div>
    </div>
  );
};

export default Filtre;