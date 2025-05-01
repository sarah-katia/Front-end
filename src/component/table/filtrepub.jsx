import React, { useState } from "react";
import "./Filtre.css";

const Filtrepub = ({ onApply }) => {
  const [filters, setFilters] = useState({
    anneePublication: "",
    typePublication: "",
    periodicite: "",
    thematique: "",
    periodeDebut: "",
    periodeFin: "",
    classementPublication: "",
    classement: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="filters-container2">
      <div className="filters-grid1">
        
        {/* Année de publication */}
        <div className="filter-group1">
          <label>Année de publication</label>
          <div className="h-index-inputs">
          <input 
            type="date" 
            name="anneePublication" 
            placeholder="JJ/MM/AAAA" 
            value={filters.anneePublication} 
            onChange={handleChange} 
          />
          </div>
        </div>

        {/* Période */}
        <div className="filter-group1">
          <label>Période</label>
          <div className="h-index-inputs1">
            <input 
              type="date" 
              name="periodeDebut" 
              placeholder="JJ/MM/AAAA" 
              value={filters.periodeDebut} 
              onChange={handleChange} 
            />
            <input 
              type="date" 
              name="periodeFin" 
              placeholder="JJ/MM/AAAA" 
              value={filters.periodeFin} 
              onChange={handleChange} 
            />
          </div>
        </div>

        {/* Type de publication */}
        <div className="filter-group1">
          <label>Type de publication</label>
          {["Conférence", "Journal", "Livre"].map((type) => (
            <div key={type}>
              <input 
                type="radio" 
                name="typePublication" 
                value={type} 
                checked={filters.typePublication === type} 
                onChange={handleChange} 
              />{" "}
              {type}
            </div>
          ))}
        </div>

        {/* Périodicité */}
        <div className="filter-group1">
          <label>Périodicité</label>
          {["Annuel", "Biannuel", "Mensuel"].map((p) => (
            <div key={p}>
              <input 
                type="radio" 
                name="periodicite" 
                value={p} 
                checked={filters.periodicite === p} 
                onChange={handleChange} 
              />{" "}
              {p}
            </div>
          ))}
        </div>

                {/* Classement de la publication */}
                <div className="filter-group1">
          <label>Classement de la publication</label>
          {["CORE", "Scimago", "DGRSDT", "Qualis", "Autres"].map((c) => (
            <div key={c}>
              <input 
                type="radio" 
                name="classementPublication" 
                value={c} 
                checked={filters.classementPublication === c} 
                onChange={handleChange} 
              />{" "}
              {c}
            </div>
          ))}
        </div>

        {/* Thématique */}
        <div className="filter-group1">
          <label>Thématique</label>
          {["computer science", "artificial intelligence", "science vision"].map((t) => (
            <div key={t}>
              <input 
                type="radio" 
                name="thematique" 
                value={t} 
                checked={filters.thematique === t} 
                onChange={handleChange} 
              />{" "}
              {t}
            </div>
          ))}
        </div>

        {/* Classement */}
        <div className="filter-group1">
          <label>Classement</label>
          <div className="h-index-inputs">
          <input 
            type="text" 
            name="classement" 
            placeholder="A,B,1,..." 
            value={filters.classement} 
            onChange={handleChange} 
          />
          </div>
        </div>
      </div>

      {/* Bouton Appliquer */}
      <div className="apply-btn-container1">
        <button className="apply-btn1" onClick={() => onApply(filters)}>Appliquer</button>
      </div>
    </div>
  );
};

export default Filtrepub;
