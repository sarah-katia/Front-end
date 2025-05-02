import React, { useState } from 'react';
import Kermi from '../../assets/kermi.jpg';

const CarteModifAssis = () => {
  const [assistantInfo, setAssistantInfo] = useState({
    nom: 'Kermi',
    prenom: 'Adel',
    role: 'assistante',
    telephone: '0665986598',
    email: 'assistante@esi.dz',
    photoUrl: Kermi
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setAssistantInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/assistante/${assistantInfo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assistantInfo),
      });
      if (response.ok) {
        alert("Modification enregistrée.");
      } else {
        alert("Échec de la mise à jour.");
      }
    } catch (err) {
      console.error("Erreur :", err);
    }
  };

  const styles = {
    card: {
        marginTop : '20rem',
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
      fontSize: '0.8rem',
    },
    label: {
      fontWeight: 'bold',
      color: '#249CF4',
      marginRight: '0.4rem',
      fontSize: '1rem',
      marginBottom: '0.5rem'
    },
    input: {
      padding: '0.4rem 0.6rem',
      fontSize: '0.9rem',
      borderRadius: '0.4rem',
      border: '1px solid #ccc',
      marginBottom: '1rem',
      width: '15rem'
    },
    btnGroup: {
      display: 'flex',
      justifyContent: 'center',
      gap: '2rem',
      width: '100%',
      marginLeft: '17rem'
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
    saveBtn: {
      backgroundColor: '#249CF4',
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>Information sur l’assistante</div>

      <div style={styles.body}>
        <img src={assistantInfo.photoUrl} alt="Assistante" style={styles.img} />

        <div style={styles.infoGrid}>
          <div style={styles.infoColumn}>
            <label style={styles.label}>Nom:</label>
            <input
              style={styles.input}
              name="nom"
              value={assistantInfo.nom}
              onChange={handleChange}
            />
            <label style={styles.label}>Prénom:</label>
            <input
              style={styles.input}
              name="prenom"
              value={assistantInfo.prenom}
              onChange={handleChange}
            />
            <label style={styles.label}>Rôle:</label>
            <input
              style={{ ...styles.input, backgroundColor: '#eee', cursor: 'not-allowed' }}
              value={assistantInfo.role}
              disabled
            />
          </div>
          <div style={styles.infoColumn}>
            <label style={styles.label}>Num.tel:</label>
            <input
              style={styles.input}
              name="telephone"
              value={assistantInfo.telephone}
              onChange={handleChange}
            />
            <label style={styles.label}>Email:</label>
            <input
              style={styles.input}
              name="email"
              value={assistantInfo.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div style={styles.btnGroup}>
          <button
            style={{ ...styles.button, ...styles.saveBtn }}
            onClick={handleSave}
          >
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarteModifAssis;
