import React from "react";
import profileImage from "../../assets/Kermi.jpg"; // Remplace par un lien ou une image locale

const Pluschercheur = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');

        .card {
          font-family: 'Poppins', sans-serif;
          background: #fafafa;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
         margin-top : 15rem;
        width:56rem;
          border: 1px solid #e0e0e0;
        }

        .card-header {
          background-color: #03a9f4;
          color: white;
          padding: 12px 20px;
          font-weight: bold;
          font-size: 16px;
          text-align: left;
        }

        .top-section {
        margin-top: 1rem;
        margin-left:2rem ;
          display: flex;
          padding: 20px;
          align-items: center;
          margin-bottom: 1rem ;
        }

        .top-section img {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          margin-right: 20px;
          border: 2px solid #ccc;
        }

        .name-grade {
          display: flex;
          flex-direction: column;
          gap: 5px;
          margin-left : 16.9rem;
        }

        .name-grade p {
          margin: 0;
          font-size: 14px;
        }

        .name-grade p strong {
          margin-right: 5px;
        }

        .info-columns {
          display: flex;
          justify-content: space-between;
          padding: 0 20px 20px 20px;
        }

        .column {
          width: 48%;
        }

        .column p {
          font-size: 14px;
          margin: 6px 0;
        }

        .footer-links p {
          border-top: 1px solid #eee;
          padding: 10px 20px 20px;
          font-size: 14px;
           font-size: 0.875rem ;
            margin-bottom:2rem; 
  line-height: 0; 
           
        }
            .footer-links strong {
          border-top: 1px solid #eee;
          font-size: 14px;
           font-size: 0.875rem ;
        }

        .footer-links a {
          color: #007bff;
          text-decoration: none;
          font-size: 0.875rem ;
        }

        .footer-links a:hover {
          text-decoration: underline;
        }
          .profileTitle {
  background-color: #249CF4;
  color: white;
  padding: 10px 50px;
  border-radius: 10px;
  font-size: 20px;
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  position: absolute;
  top: -30px; /* Légèrement au-dessus de la carte */
  right: -10px; /* Aligné à droite */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.profileHeader {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-top: 40px; /* Laisse de la place pour le badge flottant */
}

      `}</style>

      <div className="card">
      <div className="profileHeader">
  <div className="profileTitle">Information sur le chercheur</div>
</div>

        <div className="top-section">
          <img src={profileImage} alt="Profil" />
          <div className="name-grade">
            <p><strong>Nom:</strong> Kermi</p>
            <p><strong>Prénom:</strong> Adel</p>
            <p><strong>Grade:</strong> Maître de Conférences A</p>
          </div>
        </div>

        <div className="info-columns">
          <div className="column">
            <p><strong>Diplôme:</strong> Doctorat d’état</p>
            <p><strong>Qualité:</strong> Enseignant chercheur</p>
            <p><strong>Équipe:</strong> TIIMA</p>
            <p><strong>Chef d'équipe:</strong> Oui</p>
          </div>
          <div className="column">
            <p><strong>Nombre de Publications:</strong> 79</p>
            <p><strong>Indice-H:</strong> 16</p>
            <p><strong>Statut:</strong> Actif</p>
            <p><strong>Établissement:</strong> ESI (École Nationale Supérieure d’Informatique)</p>
          </div>
        </div>

        <div className="footer-links">
          <p><strong>📧 Email:</strong> <a href="mailto:a_kermi@esi.dz">a_kermi@esi.dz</a></p>
          <p><strong>ORCID:</strong> <a href="#">0000-0001-9022</a></p>
          <p><strong>🔗 Google Scholar:</strong> <a href="https://scholar.google.com/citations?hl=fr">https://scholar.google.com/citations?hl=fr</a></p>
        </div>
      </div>
    </>
  );
};

export default Pluschercheur;
