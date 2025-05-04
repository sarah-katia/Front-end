import React, { useState, useEffect } from "react";
import axios from "axios";
import stylesModule from "./personal.module.css";
import Sidebar from '../nav/Sidebar';
import Topnav from '../nav/Topnav';
import ApprovalCard from "../cartes/approvalcard";

const Personal = () => {
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
  const [isLoading, setIsLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const loadUserData = () => {
      try {
        const storedUser = localStorage.getItem("user");
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log("User data from localStorage:", parsedUser);

          const chercheurId = parsedUser.chercheur_id || parsedUser.id || 
                            (parsedUser.chercheur && (parsedUser.chercheur.chercheur_id || parsedUser.chercheur.id));
          
          if (!chercheurId) {
            throw new Error("Researcher ID not found in user data");
          }

          setUserId(chercheurId);
          
          const chercheur = parsedUser.chercheur || parsedUser;
          
          setFormData({
            chercheur_id: chercheurId,
            nom_complet: chercheur.nom_complet || "",
            Mails: chercheur.Mails || parsedUser.Mails || "",
            Tél: chercheur.Tél || parsedUser.Tél || "",
            Diplôme: chercheur.Diplôme || "",
            Etablissement_origine: chercheur.Etablissement_origine || "",
            Qualité: chercheur.Qualité || chercheur.qualite || "",
            Grade_Recherche: chercheur.Grade_Recherche || "",
            Grade_Enseignement: chercheur.Grade_Enseignement || "",
            Statut: chercheur.Statut || "Actif",
            Hindex: chercheur.Hindex || "",
            Equipe: chercheur.Equipe || chercheur.equipe || "",
            Chef_Equipe: chercheur.Chef_Equipe || false,
            Lien_GoogleScholar: chercheur.Lien_GoogleScholar || "",
            Lien_DBLP: chercheur.Lien_DBLP || "",
            Orcid: chercheur.Orcid || ""
          });
        } else {
          setError("No user data found. Please login.");
        }
      } catch (err) {
        console.error("Error loading user data:", err);
        setError(err.message || "Error loading researcher data");
      } finally {
        setLoadingData(false);
      }
    };

    loadUserData();
  }, []);

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

  const validateUrl = (url) => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateForm = () => {
    if (!formData.chercheur_id || !formData.nom_complet || !formData.Mails || !formData.Tél) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.Mails)) {
      setError("Veuillez entrer une adresse email valide.");
      return false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.Tél)) {
      setError("Le numéro de téléphone doit contenir 10 chiffres.");
      return false;
    }

    if (formData.Lien_GoogleScholar && !validateUrl(formData.Lien_GoogleScholar)) {
      setError("L'URL Google Scholar n'est pas valide");
      return false;
    }

    if (formData.Lien_DBLP && !validateUrl(formData.Lien_DBLP)) {
      setError("L'URL DBLP n'est pas valide");
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setShowApproval(true);
    }
  };

  const confirmUpdate = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.put(
        `http://localhost:8000/chercheur/${userId}`,
        formData
      );

      // Update localStorage
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const updatedUser = {
        ...storedUser,
        ...formData,
        chercheur: {
          ...(storedUser.chercheur || {}),
          ...formData
        }
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setShowApproval(false);
    } catch (err) {
      console.error("Error updating researcher:", err);
      setError(err.response?.data?.message || "Erreur lors de la mise à jour du profil");
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className={stylesModule.profileEditContainer}>
        <Sidebar />
        <div className={stylesModule.profileEditContent}>
          <Topnav />
          <div className={stylesModule.loading}>Chargement des données...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={stylesModule.profileEditContainer}>
        <Sidebar />
        <div className={stylesModule.profileEditContent}>
          <Topnav />
          <div className={stylesModule.error}>
            {error}
            <button onClick={() => window.location.reload()} className={stylesModule.reloadButton}>
              Rafraîchir la page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={stylesModule.profileEditContainer} style={{ paddingTop: "520px" }}>
      <Sidebar />
      <div className={stylesModule.profileEditContent}>
        <Topnav />

        {error && (
          <div className={stylesModule.errorMessage}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={stylesModule.profileEditForm}>
          <div className={stylesModule.profilePhotoSection}>
            <img src="/Koudil.png" alt="Profil" />
            <div className={stylesModule.buttonsContainer}>
              <button type="button">Changer la photo</button>
              <button type="button">Supprimer</button>
            </div>
          </div>

          <div className={stylesModule.inputGroup}>
            <label>ID Chercheur <span>*</span></label>
            <input 
              type="text" 
              name="chercheur_id" 
              value={formData.chercheur_id} 
              onChange={handleChange} 
              placeholder="Identifiant unique" 
              required 
              readOnly
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
              <option value="Retraité">Retraité</option>
            </select>
          </div>

          <div className={stylesModule.saveButtonContainer}>
            <button 
              type="submit" 
              className={stylesModule.saveButton}
              disabled={isLoading}
            >
              {isLoading ? 'Enregistrement...' : 'Sauvegarder'}
            </button>
          </div>
        </form>
        
        <ApprovalCard 
          isVisible={showApproval} 
          onConfirm={confirmUpdate}
          onCancel={() => setShowApproval(false)}
          message="Confirmez-vous la modification de ce profil?"
        />
      </div>
    </div>
  );
};

export default Personal;