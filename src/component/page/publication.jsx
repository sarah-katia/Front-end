import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Publication.css";

const Publication = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedPublication, setFetchedPublication] = useState(null);

  const publication = location.state?.publication || fetchedPublication;

  useEffect(() => {
    console.log("ID de l'URL:", id);
    console.log("Détails complets de la publication:", publication);

    if (!publication && id && id !== "undefined" && id !== "detail") {
      setIsLoading(true);

      const fetchPublicationById = async () => {
        try {
          const baseRoute = window.workingPublicationApiRoute || "http://localhost:8000/publications/";
          const response = await axios.get(`${baseRoute}${id}`);
          if (response.data) {
            setFetchedPublication(response.data);
          }
        } catch (error) {
          console.error("Erreur lors de la récupération de la publication:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchPublicationById();
    }
  }, [id, publication]);

  if (isLoading) {
    return (
      <div className="publication-loading">
        <p>Chargement des informations...</p>
      </div>
    );
  }

  if (!publication) {
    return (
      <div className="publication-not-found">
        <h2>Publication non trouvée</h2>
        <p>Les informations de cette publication ne sont pas disponibles.</p>
        <p className="error-details">ID reçu: {id || "non défini"}</p>
        <button onClick={() => navigate(-1)} className="back-button">
          Retour
        </button>
      </div>
    );
  }

  const confJournal = publication.Conf_Journal || {};
  const classements = confJournal.Pub_Classements || [];

  const classementsFiltres = classements.filter(
    (classement) =>
      classement.Classement?.Type?.toLowerCase() === confJournal.type?.toLowerCase()
  );

  return (
    <div className="publication-details-container">
      <div className="publication-details-content">
        <div className="publication-details-header">
          <h2 className="publication-details-title">{publication.titre_publication}</h2>
          <button className="back-button" onClick={() => navigate(-1)}>
            Retour
          </button>
        </div>

        <div className="publication-details-body">
          <div className="info-section">
            <div className="info-row">
              <span className="info-label">Auteurs:</span>
              <span className="info-value">{publication.auteurs}</span>
            </div>

            <div className="info-grid">
              <div className="info-col">
                <div className="info-item">
                  <span className="info-label">Journal/Conférence:</span>
                  <span className="info-value">{confJournal.nom || "Non spécifié"}</span>
                </div>

                <div className="info-item">
                  <span className="info-label">Date de publication:</span>
                  <span className="info-value">{publication.annee}</span>
                </div>

                <div className="info-item">
                  <span className="info-label">Volume:</span>
                  <span className="info-value">{publication.volumes || "Non spécifié"}</span>
                </div>
              </div>

              <div className="info-col">
                <div className="info-item">
                  <span className="info-label">Pages:</span>
                  <span className="info-value">{publication.nombre_pages || "Non spécifié"}</span>
                </div>

                <div className="info-item">
                  <span className="info-label">Éditeur:</span>
                  <span className="info-value">{publication.editors || "Non spécifié"}</span>
                </div>

                <div className="info-item">
                  <span className="info-label">Type:</span>
                  <span className="info-value">{confJournal.type || "Non spécifié"}</span>
                </div>
              </div>
            </div>
          </div>

          {confJournal && Object.keys(confJournal).length > 0 && (
            <>
              <div className="section-divider"></div>
              <div className="info-section">
                <h3 className="section-title">Détails sur la conférence / le journal:</h3>

                <div className="info-grid">
                  <div className="info-col">
                    <div className="info-item">
                      <span className="info-label">Thématique:</span>
                      <span className="info-value">{confJournal.thematique || "Non spécifié"}</span>
                    </div>

                    <div className="info-item">
                      <span className="info-label">Lieu:</span>
                      <span className="info-value">{confJournal.lieu || "Non spécifié"}</span>
                    </div>
                  </div>

                  <div className="info-col">
                    <div className="info-item">
                      <span className="info-label">Période:</span>
                      <span className="info-value">{confJournal.periode || "Non spécifié"}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Périodicité:</span>
                      <span className="info-value">{confJournal.periodicite || "Non spécifié"}</span>
                    </div>
                  </div>
                </div>

                {confJournal.scope && (
                  <div className="info-item full-width">
                    <span className="info-label">Scope:</span>
                    <span className="info-value">{confJournal.scope}</span>
                  </div>
                )}
              </div>
            </>
          )}

          {classementsFiltres && classementsFiltres.length > 0 && (
            <>
              <div className="section-divider"></div>
              <div className="info-section">
                <h3 className="section-title">Détails sur le classement:</h3>

                {classementsFiltres.map((classement, index) => (
                  <div key={index} className="classement-item">
                    <div className="info-grid">
                      <div className="info-col">
                        <div className="info-item">
                          <span className="info-label">Nom du site:</span>
                          <span className="info-value">
                            {classement.Classement?.Nom || "Non spécifié"}
                          </span>
                        </div>

                        <div className="info-item">
                          <span className="info-label">Classement:</span>
                          <span className="info-value">
                            {classement.classement || "Non spécifié"}
                          </span>
                        </div>
                      </div>

                      <div className="info-col">
                        <div className="info-item">
                          <span className="info-label">Type:</span>
                          <span className="info-value">
                            {classement.Classement?.Type || "Non spécifié"}
                          </span>
                        </div>

                        {classement.lien_vers_classement &&
                          classement.lien_vers_classement !== "N/A" && (
                            <div className="info-item">
                              <span className="info-label">Lien:</span>
                              <span className="info-value">
                                <a
                                  href={classement.lien_vers_classement}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Voir le classement
                                </a>
                              </span>
                            </div>
                          )}
                      </div>
                    </div>
                    {index < classementsFiltres.length - 1 && (
                      <div className="classement-divider"></div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {classementsFiltres.length === 0 && (
            <p>Aucun classement pour le type "{confJournal.type}" trouvé.</p>
          )}

          {publication.lien && (
            <div className="action-button-container">
              <a
                href={publication.lien}
                target="_blank"
                rel="noopener noreferrer"
                className="view-publication-button"
              >
                Voir la publication complète
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Publication;
