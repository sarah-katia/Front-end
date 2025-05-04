import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import stylesModule from "../modifier/personal.module.css";
import Sidebardirectrice from '../nav/SidebarDi';
import Sidebarassistante from '../nav/sidebarAssi';
import Topnav from '../nav/Topnav';
import ApprovalCard from "../cartes/approvalcard";

const Ajouter = () => {
  const location = useLocation();
  const sidebarType = location.state?.Sidebar || "assistante";
  const navigate = useNavigate();

  let SidebarComponent;
  switch (sidebarType) {
    case "assistante":
      SidebarComponent = Sidebarassistante;
      break;
    case "directrice":
      SidebarComponent = Sidebardirectrice;
      break;
    default:
      SidebarComponent = Sidebarassistante;
  }

  const [formData, setFormData] = useState({
    chercheur_id: "",
    nom_complet: "",
    Mails: "",
    Tél: "",
    Diplôme: "",
    Etablissement_origine: "",
    Qualité: "",
    Grade_Recherche: "",
    Grade_Enseignement: "",
    Statut: "Actif",
    Hindex: "",
    Equipe: "",
    Chef_Equipe: false,
    Lien_GoogleScholar: "",
    Lien_DBLP: "",
    Orcid: "",
  });

  const [showApproval, setShowApproval] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [jobInfo, setJobInfo] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "radio") {
      setFormData({ ...formData, [name]: value === "true" });
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    // Required fields validation
    if (!formData.chercheur_id || !formData.nom_complet || !formData.Mails || !formData.Tél) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.Mails)) {
      setError("Veuillez entrer une adresse email valide.");
      return false;
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.Tél)) {
      setError("Le numéro de téléphone doit contenir 10 chiffres.");
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setShowApproval(true);
    }
  };

  const confirmSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/directrice/",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      if (response.status === 202) {
        setJobInfo({
          jobId: response.data.jobId,
          statusEndpoint: response.data.statusEndpoint,
          researcherName: formData.nom_complet
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'ajout du chercheur.");
    } finally {
      setIsSubmitting(false);
      setShowApproval(false);
    }
  };

  return (
    <div className={stylesModule.profileEditContainer} style={{ paddingTop: "450px" }}>
      <SidebarComponent />
      <div className={stylesModule.profileEditContent}>
        <Topnav />

        {error && <div className={stylesModule.errorMessage}>{error}</div>}

        {jobInfo ? (
          <div className={stylesModule.jobStatusContainer}>
            <h3>Chercheur créé avec succès!</h3>
            <p>Nom: {jobInfo.researcherName}</p>
            <p>Le scraping des publications est en cours...</p>
            <button 
              onClick={() => navigate("/ajouter-chercheur")}
              className={stylesModule.saveButton}
            >
              Retour au tableau de bord
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={stylesModule.profileEditForm}>
            {/* Profile Photo Section */}
            <div className={stylesModule.profilePhotoSection}>
              <img src="/Koudil.png" alt="Profil" />
              <div className={stylesModule.buttonsContainer}>
                <button type="button">Changer la photo</button>
                <button type="button">Supprimer</button>
              </div>
            </div>

            {/* Personal Information Section */}
            
            <div className={stylesModule.inputGroup}>
              <label>ID Chercheur <span>*</span></label>
              <input 
                type="text" 
                name="chercheur_id" 
                value={formData.chercheur_id} 
                onChange={handleChange} 
                placeholder="Identifiant unique" 
                required 
              />
            </div>

            <div className={stylesModule.inputGroup}>
              <label>Nom Complet <span>*</span></label>
              <input 
                type="text" 
                name="nom_complet" 
                value={formData.nom_complet} 
                onChange={handleChange} 
                placeholder="Nom Complet" 
                required 
              />
            </div>

            <div className={stylesModule.inputGroup}>
              <label>Email <span>*</span></label>
              <input 
                type="email" 
                name="Mails" 
                value={formData.Mails} 
                onChange={handleChange} 
                placeholder="exemple@email.com" 
                required 
              />
            </div>

            <div className={stylesModule.inputGroup}>
              <label>Téléphone <span>*</span></label>
              <input 
                type="text" 
                name="Tél" 
                value={formData.Tél} 
                onChange={handleChange} 
                placeholder="10 chiffres sans espaces" 
                required 
              />
            </div>

            {/* Academic Information Section */}
            
            <div className={stylesModule.inputGroup}>
              <label>Diplôme</label>
              <input 
                type="text" 
                name="Diplôme" 
                value={formData.Diplôme} 
                onChange={handleChange} 
                placeholder="Diplôme obtenu" 
              />
            </div>

            <div className={stylesModule.inputGroup}>
              <label>Qualité</label>
              <select
                name="Qualité"
                value={formData.Qualité}
                onChange={handleChange}
                className={stylesModule.selectInput}
              >
                <option value="">Sélectionner une qualité</option>
                <option value="Professeur">Professeur</option>
                <option value="Chercheur">Chercheur</option>
                <option value="Doctorant">Doctorant</option>
                <option value="Maitre_de_conference">Maître de Conférence</option>
                <option value="Maitre_de_conference_A">Maître de Conférence A</option>
                <option value="Maitre_de_conference_B">Maître de Conférence B</option>
                <option value="Maitre_assistant">Maître assistant</option>
                <option value="Maitre_assistant_A">Maître assistant A</option>
                <option value="Maitre_assistant_B">Maître assistant B</option>
              </select>
            </div>

            <div className={stylesModule.inputGroup}>
              <label>Grade de Recherche</label>
              <input 
                type="text" 
                name="Grade_Recherche" 
                value={formData.Grade_Recherche} 
                onChange={handleChange} 
                placeholder="Grade de recherche" 
              />
            </div>

            <div className={stylesModule.inputGroup}>
              <label>Grade d'Enseignement</label>
              <input 
                type="text" 
                name="Grade_Enseignement" 
                value={formData.Grade_Enseignement} 
                onChange={handleChange} 
                placeholder="Grade d'enseignement" 
              />
            </div>

            {/* Research Information Section */}

            <div className={stylesModule.inputGroup}>
              <label>ORCID</label>
              <input 
                type="text" 
                name="Orcid" 
                value={formData.Orcid} 
                onChange={handleChange} 
                placeholder="0000-0002-1825-0097" 
              />
            </div>
            
            <div className={stylesModule.inputGroup}>
              <label>Indice H</label>
              <input 
                type="number" 
                name="Hindex" 
                value={formData.Hindex} 
                onChange={handleChange} 
                placeholder="Indice H" 
                min="0"
              />
            </div>

            <div className={stylesModule.inputGroup}>
              <label>Équipe</label>
              <select
                name="Equipe"
                value={formData.Equipe}
                onChange={handleChange}
                className={stylesModule.selectInput}
              >
                <option value="">Sélectionner une équipe</option>
                <option value="CoDesign">CoDesign</option>
                <option value="TIIMA">TIIMA</option>
                <option value="IMAGE">IMAGE</option>
                <option value="OPI">OPI</option>
                <option value="EIAH">EIAH</option>
                <option value="SURES">SURES</option>
              </select>
            </div>

            <div className={stylesModule.inputGroup}>
              <label>Chef d'équipe</label>
              <div className={stylesModule.radioContainer}>
                <label className={stylesModule.radioBox}>
                  <input 
                    type="radio" 
                    name="Chef_Equipe" 
                    value={true} 
                    checked={formData.Chef_Equipe === true} 
                    onChange={handleChange} 
                  />
                  <span className={stylesModule.radioCircle}></span> Oui
                </label>
                <label className={stylesModule.radioBox}>
                  <input 
                    type="radio" 
                    name="Chef_Equipe" 
                    value={false} 
                    checked={formData.Chef_Equipe === false} 
                    onChange={handleChange} 
                  />
                  <span className={stylesModule.radioCircle}></span> Non
                </label>
              </div>
            </div>


            {/* Online Profiles Section */}
            
            <div className={stylesModule.inputGroup}>
              <label>Lien Google Scholar</label>
              <input 
                type="url" 
                name="Lien_GoogleScholar" 
                value={formData.Lien_GoogleScholar} 
                onChange={handleChange} 
                placeholder="https://scholar.google.com/..." 
              />
            </div>

            <div className={stylesModule.inputGroup}>
              <label>Lien DBLP</label>
              <input 
                type="url" 
                name="Lien_DBLP" 
                value={formData.Lien_DBLP} 
                onChange={handleChange} 
                placeholder="https://dblp.org/..." 
              />
            </div>

            <div className={stylesModule.inputGroup}>
              <label>Établissement d'origine</label>
              <input 
                type="text" 
                name="Etablissement_origine" 
                value={formData.Etablissement_origine} 
                onChange={handleChange} 
                placeholder="Université d'origine" 
              />
            </div>

            <div className={stylesModule.inputGroup}>
              <label>Statut</label>
              <select
                name="Statut"
                value={formData.Statut}
                onChange={handleChange}
                className={stylesModule.selectInput}
              >
                <option value="Actif">Actif</option>
                <option value="Inactif">Inactif</option>
              </select>
            </div>

            {/* Form Actions */}
            <div className={stylesModule.saveButtonContainer}>
              <button
                type="button"
                className={stylesModule.saveButton}
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
              >
                Annuler
              </button>
              <button
                type="submit"
                className={stylesModule.saveButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Envoi en cours..." : "Sauvegarder"}
              </button>
            </div>
          </form>
        )}

        <ApprovalCard
          isVisible={showApproval}
          onConfirm={confirmSubmit}
          onCancel={() => setShowApproval(false)}
          message="Confirmez-vous la création de ce chercheur et le démarrage du scraping des publications?"
        />
      </div>
    </div>
  );
};

export default Ajouter;