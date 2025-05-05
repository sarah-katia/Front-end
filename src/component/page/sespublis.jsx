import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../cartes/mespublicationsBUTTON.css';

const Sespublis = () => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPublications = async () => {
      console.log("🔍 Début de la récupération des publications...");
      
      try {
        // Utiliser la clé "user" pour récupérer les données utilisateur
        const userDataString = localStorage.getItem("user");
        console.log("📝 Données brutes du localStorage:", userDataString);
        
        if (!userDataString) {
          console.error("❌ Aucune donnée utilisateur trouvée dans le localStorage");
          throw new Error("Utilisateur non connecté");
        }

        const userData = JSON.parse(userDataString);
        console.log("👤 Données utilisateur parsées:", userData);

        // Vérifier que les données chercheur existent
        if (!userData.chercheur) {
          console.error("❌ Objet chercheur non trouvé dans les données utilisateur");
          throw new Error("Données chercheur manquantes");
        }

        console.log("• Détails chercheur:", userData.chercheur);

        const chercheurId = userData.chercheur.chercheur_id;
        console.log("🆔 ID du chercheur récupéré:", chercheurId);
        
        if (!chercheurId) {
          console.error("❌ ID chercheur manquant dans les données");
          throw new Error("ID chercheur non trouvé");
        }

        console.log(`📡 Appel API: http://localhost:8000/publications/chercheur/${chercheurId}`);
        const response = await axios.get(`http://localhost:8000/publications/chercheur/${chercheurId}`);
        
        console.log("✅ Données reçues de l'API:", response.data);
        
        // Vérifier si les données sont dans response.data.objectdata
        let publicationsData = [];
        
        if (response.data && response.data.objectdata && Array.isArray(response.data.objectdata)) {
          // Format correct avec objectdata
          publicationsData = response.data.objectdata;
        } else if (Array.isArray(response.data)) {
          // Format alternatif: tableau directement dans response.data
          publicationsData = response.data;
        } else {
          // Autre cas: chercher un tableau dans les propriétés
          Object.keys(response.data).forEach(key => {
            if (Array.isArray(response.data[key])) {
              publicationsData = response.data[key];
            }
          });
        }
        
        console.log("📊 Publications extraites:", publicationsData);

        // Adapter le formatage des données selon le format de la réponse
        const formattedData = publicationsData.map(pub => ({
          id: pub.publication_id,
          title: pub.titre_publication,
          date: pub.annee,
          authors: pub.auteurs || "",
          link: pub.lien || "",
          // Conserver les données complètes pour les passer à la page de détail
          completeData: pub
        }));

        console.log("📊 Publications formatées:", formattedData);
        setPublications(formattedData);
        setLoading(false);
      } catch (err) {
        console.error("❌ Erreur lors de la récupération des publications:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPublications();
  }, []);

  const emptyPlaceholders = Array(4).fill(0).map((_, index) => (
    <div key={`empty-${index}`} className="publication-item empty-publication-item">
      <div className="publication-title empty-content"></div>
      <div className="publication-date empty-content"></div>
      <div className="action-button-container">
        <div className="empty-button"></div>
      </div>
    </div>
  ));

  return (
    <div className="publications-container">
      <div className="publications-card">
        <div className="publications-header">
          <h2 className="header-title">
            Mes Publications
            {loading && <span className="loading-indicator"> (Chargement...)</span>}
          </h2>
        </div>
        
        <div className="publications-list">
          <div className="table-headers">
            <div className="title-header">Titre</div>
            <div className="date-header">Année</div>
            <div></div>
          </div>
          
          {publications.length > 0 ? (
            publications.map((publication) => (
              <div key={publication.id} className="publication-item">
                <div className="publication-title">{publication.title}</div>
                <div className="publication-date">
                  <span className="mobile-label">Année: </span>{publication.date}
                </div>
                <div className="action-button-container">
                  <Link 
                    to={`/Voirpluspub/${publication.id}`} 
                    state={{ publication: publication.completeData }}
                    className="view-more-button"
                  >
                    Voir plus
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-publications-container">
              <div className="no-publications-message">
                {error ? `Erreur: ${error}` : "Aucune publication trouvée"}
              </div>
              {!loading && emptyPlaceholders}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sespublis;