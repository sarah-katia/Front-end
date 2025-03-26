import React, { useState } from "react";
import "./personal.css"; // Le fichier CSS pour le style
import Sidebar from '../nav/Sidebar';
import Topnav from '../nav/Topnav';
import ApprovalCard from "../cartes/approvalcard"; // Import de la carte de confirmation

const Personal = ({ chercheur }) => {
  // États pour chaque champ du formulaire
  const [formData, setFormData] = useState({
    nom: chercheur.nom || "",
    prenom: chercheur.prenom || "",
    email: chercheur.email || "",
    telephone: chercheur.phone || "",
    diplome: chercheur.diplome || "",
    id: chercheur.id || "",
    orcid: chercheur.orcid || "",
    indiceH: chercheur.hIndex || "",
    equipe: chercheur.team || "",
    chefEquipe: chercheur.isTeamLeader ? "oui" : "non",
    etablissement: chercheur.institution || "",
    adresse: "", // Ajoute une valeur vide si elle n'existe pas
  });

  const [showApproval, setShowApproval] = useState(false);

  // Fonction pour mettre à jour les valeurs des inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fonction pour soumettre le formulaire
  const handleSubmit = (e) => {
    e.preventDefault();

    // Vérification des champs obligatoires
    if (!formData.nom || !formData.prenom || !formData.email || !formData.telephone || !formData.id) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    // Afficher la carte d'approbation
    setShowApproval(true);
  };

  return (
    <div className="profile-edit-container">
      <Sidebar />
      <div className="profile-edit-content">
        <Topnav />

        <form onSubmit={handleSubmit} className="profile-edit-form">
          <div className="profile-photo-section">
            <img src="/Koudil.png" alt="Profil" />
            <div className="buttons-container">
            <button type="button">Changer la photo</button>
            <button type="button">   Supprimer  </button>
            </div>
          </div>

          {/* Champs du formulaire */}
          <div className="input-group">
            <label>Nom <span>*</span></label>
            <input type="text" name="nom" value={formData.nom} onChange={handleChange}  placeholder="Nom" required />
          </div>

          <div className="input-group">
            <label>Prénom <span>*</span></label>
            <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} placeholder="Prénom" required />
          </div>

          <div className="input-group">
            <label>Adresse e-mail <span>*</span></label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="exemple@email.com" required />
          </div>

          <div className="input-group">
            <label>Numéro de téléphone <span>*</span></label>
            <input type="text" name="telephone" value={formData.telephone} onChange={handleChange} placeholder="Numéro de téléphone" required />
          </div>

          <div className="input-group">
            <label>Diplôme</label>
            <input type="text" name="diplome" value={formData.diplome} onChange={handleChange} placeholder="Diplôme" />
          </div>

          <div className="input-group">
            <label>ID <span>*</span></label>
            <input type="text" name="id" value={formData.id} onChange={handleChange} placeholder="ex: 0046390" required />
          </div>

          <div className="input-group">
            <label>ORCID</label>
            <input type="text" name="orcid" value={formData.orcid} onChange={handleChange} placeholder="0000-1345-0138" />
          </div>

          <div className="input-group">
            <label>Indice-H</label>
            <input type="text" name="indiceH" value={formData.indiceH} onChange={handleChange} placeholder="ex: 18,14..." />
          </div>

          <div className="input-group">
            <label>Équipe</label>
            <input type="text" name="equipe" value={formData.equipe} onChange={handleChange} placeholder="équipe" />
          </div>

          <div className="input-group">
    <label>Chef d'équipe</label>
    <div className="radio-container">
        <label className="radio-box">
            <input type="radio" name="chefEquipe" value="oui" checked={formData.chefEquipe === "oui"} onChange={handleChange} />
            <span className="radio-circle"></span> OUI
        </label>
        <label className="radio-box">
            <input type="radio" name="chefEquipe" value="non" checked={formData.chefEquipe === "non"} onChange={handleChange} />
            <span className="radio-circle"></span> NON
        </label>
    </div>
</div>

          <div className="input-group">
            <label>Établissement d'origine</label>
            <input type="text" name="etablissement" value={formData.etablissement} onChange={handleChange} placeholder="établissement d'origine" />
          </div>

          <div className="input-group">
            <label>Adresse résidentielle</label>
            <input type="text" name="adresse" value={formData.adresse} onChange={handleChange} placeholder="Adresse résidentielle" />
          </div>

          <div className="save-button-container">
           <button type="submit" className="save-button">Sauvegarder</button>
         </div>

        </form>

            {/* Carte d'approbation */}
            <ApprovalCard isVisible={showApproval} onClose={() => setShowApproval(false)} />

      </div>
    </div>
  );
};

export default Personal;
