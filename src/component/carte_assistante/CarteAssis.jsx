import React, { useState } from 'react';
import Kermi from '../../assets/kermi.jpg'

const CarteAssis = () => {
  const [showCard, setShowCard] = useState(true);

  const [assistantInfo] = useState({
    nom: 'Kermi',
    prenom: 'Adel',
    role: 'assistante',
    telephone: '0665986598',
    email: 'assistante@esi.dz',
    photoUrl: Kermi
  });

  if (!showCard) return null;

  const styles = {
    card: {
      marginTop : '12rem',
      marginLeft : '11rem',
      width: '40rem',
      backgroundColor: '#fff',
      borderRadius: '0.8rem',
      boxShadow: '0 0 0.4rem rgba(0, 0, 0, 0.2)',
      padding: '2rem 5rem',
      margin: '4rem auto',
      position: 'relative',
      fontFamily: 'Arial, sans-serif',
      
    },
    header: {
      position: 'absolute',
      top: '-1.5rem',
      right: '1rem',
      backgroundColor: '#2196f3',
      padding: '0.8rem 1.6rem',
      borderRadius: '0.4rem',
      color: 'white',
      fontSize: '1.2rem',
      fontWeight: '500'
    },
    body: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      
    },
    img: {
      width: '8rem',
      height: '8rem',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '0.2rem solid #ccc',
      marginBottom: '1.5rem'
    },
    infoGrid: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
    },
    infoColumn: {
      display: 'flex',
      flexDirection: 'column',
      lineHeight: '0',
        fontSize :'0.8rem'
    },
    label: {
      fontWeight: 'bold',
      color: '#1e88e5',
      marginRight: '0.4rem',
       fontSize :'1rem'
    },
    btnGroup: {
      display: 'flex',
      justifyContent: 'center',
      gap: '2rem',
      width: '100%',
       marginLeft :'17rem'
    },
    button: {
      padding: '0.8rem 2rem',
      borderRadius: '0.4rem',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      border: 'none',
      color: 'white',
      width: '10rem',
     
    },
    deleteBtn: {
      backgroundColor: '#1976B4',
    },
    editBtn: {
      backgroundColor: '#2196f3',
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>Information sur l’assistante</div>

      <div style={styles.body}>
        <img src={assistantInfo.photoUrl} alt="Assistante" style={styles.img} />

        <div style={styles.infoGrid}>
          <div style={styles.infoColumn}>
            <p><span style={styles.label}>Nom:</span> {assistantInfo.nom}</p>
            <p><span style={styles.label}>Prénom:</span> {assistantInfo.prenom}</p>
            <p><span style={styles.label}>Rôle:</span> {assistantInfo.role}</p>
          </div>
          <div style={styles.infoColumn}>
            <p><span style={styles.label}>Num.tel:</span> {assistantInfo.telephone}</p>
            <p><span style={styles.label}>Email:</span> {assistantInfo.email}</p>
          </div>
        </div>

        <div style={styles.btnGroup}>
          <button
            style={{ ...styles.button, ...styles.deleteBtn }}
            onClick={() => setShowCard(false)}
          >
            Supprimer
          </button>
          <button style={{ ...styles.button, ...styles.editBtn }}>
            Modifier
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarteAssis;
