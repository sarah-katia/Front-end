import React, { useState } from "react";
import stylesModule from "./personal.module.css"; // Le fichier CSS en module
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
    <div className={stylesModule.profileEditContainer}>
      <Sidebar />
      <div className={stylesModule.profileEditContent}>
        <Topnav />

        <form onSubmit={handleSubmit} className={stylesModule.profileEditForm}>
          <div className={stylesModule.profilePhotoSection}>
            <img src="/Koudil.png" alt="Profil" />
            <div className={stylesModule.buttonsContainer}>
            <button type="button">Changer la photo</button>
            <button type="button">   Supprimer  </button>
            </div>
          </div>

          {/* Champs du formulaire */}
          <div className={stylesModule.inputGroup}>
            <label>Nom <span>*</span></label>
            <input type="text" name="nom" value={formData.nom} onChange={handleChange}  placeholder="Nom" required />
          </div>

          <div className={stylesModule.inputGroup}>
            <label>Prénom <span>*</span></label>
            <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} placeholder="Prénom" required />
          </div>

          <div className={stylesModule.inputGroup}>
            <label>Adresse e-mail <span>*</span></label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="exemple@email.com" required />
          </div>

          <div className={stylesModule.inputGroup}>
            <label>Numéro de téléphone <span>*</span></label>
            <input type="text" name="telephone" value={formData.telephone} onChange={handleChange} placeholder="Numéro de téléphone" required />
          </div>

          <div className={stylesModule.inputGroup}>
            <label>Diplôme</label>
            <input type="text" name="diplome" value={formData.diplome} onChange={handleChange} placeholder="Diplôme" />
          </div>

          <div className={stylesModule.inputGroup}>
            <label>ID <span>*</span></label>
            <input type="text" name="id" value={formData.id} onChange={handleChange} placeholder="ex: 0046390" required />
          </div>

          <div className={stylesModule.inputGroup}>
            <label>ORCID</label>
            <input type="text" name="orcid" value={formData.orcid} onChange={handleChange} placeholder="0000-1345-0138" />
          </div>

          <div className={stylesModule.inputGroup}>
            <label>Indice-H</label>
            <input type="text" name="indiceH" value={formData.indiceH} onChange={handleChange} placeholder="ex: 18,14..." />
          </div>

          <div className={stylesModule.inputGroup}>
            <label>Équipe</label>
            <input type="text" name="equipe" value={formData.equipe} onChange={handleChange} placeholder="équipe" />
          </div>

          <div className={stylesModule.inputGroup}>
            <label>Chef d'équipe</label>
            <div className={stylesModule.radioContainer}>
                <label className={stylesModule.radioBox}>
                    <input type="radio" name="chefEquipe" value="oui" checked={formData.chefEquipe === "oui"} onChange={handleChange} />
                    <span className={stylesModule.radioCircle}></span> OUI
                </label>
                <label className={stylesModule.radioBox}>
                    <input type="radio" name="chefEquipe" value="non" checked={formData.chefEquipe === "non"} onChange={handleChange} />
                    <span className={stylesModule.radioCircle}></span> NON
                </label>
            </div>
          </div>

          <div className={stylesModule.inputGroup}>
            <label>Établissement d'origine</label>
            <input type="text" name="etablissement" value={formData.etablissement} onChange={handleChange} placeholder="établissement d'origine" />
          </div>

          <div className={stylesModule.inputGroup}>
            <label>Adresse résidentielle</label>
            <input type="text" name="adresse" value={formData.adresse} onChange={handleChange} placeholder="Adresse résidentielle" />
          </div>

          <div className={stylesModule.saveButtonContainer}>
           <button type="submit" className={stylesModule.saveButton}>Sauvegarder</button>
         </div>

        </form>
        
            <ApprovalCard isVisible={showApproval} onClose={() => setShowApproval(false)} />

      </div>
    </div>
  );
};

export default Personal;
