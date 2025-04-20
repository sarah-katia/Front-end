import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import stylesModule from "../modifier/personal.module.css";
import Sidebar from '../nav/sidebardir';
import Topnav from '../nav/Topnav';
import ApprovalCard from "../cartes/approvalcard";

const Ajouter = () => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    diplome: "",
    id: "",
    orcid: "",
    indiceH: "",
    equipe: "",
    chefEquipe: "",
    etablissement: "",
    statut: "",
    googleScholar: "",
    dblp: "",
  });

  const [showApproval, setShowApproval] = useState(false);

  const navigate= useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.nom || !formData.prenom || !formData.email || !formData.telephone || !formData.id || !formData.statut) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setShowApproval(true);
  };

  return (
    <div className={stylesModule.profileEditContainer} style={{ paddingTop: "450px" }} >
      <Sidebar />
      <div className={stylesModule.profileEditContent}>
        <Topnav />

        <form onSubmit={handleSubmit} className={stylesModule.profileEditForm}>
          <div className={stylesModule.profilePhotoSection}>
            <img src="/Koudil.png" alt="Profil" />
            <div className={stylesModule.buttonsContainer}>
              <button type="button">Changer la photo</button>
              <button type="button">Supprimer</button>
            </div>
          </div>

          <div className={stylesModule.inputGroup}>
            <label>Nom <span>*</span></label>
            <input type="text" name="nom" value={formData.nom} onChange={handleChange} placeholder="Nom" required />
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
            <label>ID <span>*</span></label>
            <input type="text" name="id" value={formData.id} onChange={handleChange} placeholder="ex: 0046390" required />
          </div>

          <div className={stylesModule.inputGroup}>
            <label>Diplôme</label>
            <input type="text" name="diplome" value={formData.diplome} onChange={handleChange} placeholder="Diplôme" />
          </div>

          <div className={stylesModule.inputGroup}>
            <label>ORCID</label>
            <input type="text" name="orcid" value={formData.orcid} onChange={handleChange} placeholder="0000-0002-1825-0097" />
          </div>

          <div className={stylesModule.inputGroup}>
            <label>Indice-H</label>
            <input type="text" name="indiceH" value={formData.indiceH} onChange={handleChange} placeholder="ex: 18, 14..." />
          </div>

          <div className={stylesModule.inputGroup}>
            <label>Équipe</label>
            <input type="text" name="equipe" value={formData.equipe} onChange={handleChange} placeholder="Nom de l'équipe" />
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
            <input type="text" name="etablissement" value={formData.etablissement} onChange={handleChange} placeholder="Université, centre de recherche..." />
          </div>

          
          <div className={stylesModule.inputGroup}>
            <label>Statut <span>*</span> </label>
            <div className={stylesModule.radioContainer}>
              <label className={stylesModule.radioBox}>
                <input type="radio" name="statut" value="actif" checked={formData.statut === "actif"} onChange={handleChange} required />
                <span className={stylesModule.radioCircle}></span> Actif
              </label>
              <label className={stylesModule.radioBox}>
                <input type="radio" name="statut" value="non_actif" checked={formData.statut === "non_actif"} onChange={handleChange} required />
                <span className={stylesModule.radioCircle}></span> Non actif
              </label>
            </div>
          </div>

          <div className={`${stylesModule.inputGroup} ${stylesModule.fullWidth}`}>
            <label>Google Scholar</label>
            <input type="text" name="googleScholar" value={formData.googleScholar} onChange={handleChange} placeholder="Lien vers le profil Google Scholar" />
          </div>

          <div className={`${stylesModule.inputGroup} ${stylesModule.fullWidth}`}>
            <label>DBLP</label>
            <input type="text" name="dblp" value={formData.dblp} onChange={handleChange} placeholder="Lien vers le profil DBLP" />
          </div>

          <div className={stylesModule.saveButtonContainer}>
            <button type="button" className={stylesModule.saveButton} onClick={() => navigate(-1)} >Annuler</button>
            <button type="submit" className={stylesModule.saveButton} style={{ marginLeft: "10px" }}>Sauvegarder</button>
          </div>
        </form>

        <ApprovalCard isVisible={showApproval} onClose={() => setShowApproval(false)} />
      </div>
    </div>
  );
};

export default Ajouter;
