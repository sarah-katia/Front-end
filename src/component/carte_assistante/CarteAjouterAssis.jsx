import React, { useState } from 'react';

const CarteAjouterAssis = () => {
  const [nouvelleAssistante, setNouvelleAssistante] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    photo: null,
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [messageSucces, setMessageSucces] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNouvelleAssistante(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNouvelleAssistante(prev => ({ ...prev, photo: file }));
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    const { nom, prenom, email } = nouvelleAssistante;
    if (!nom || !prenom || !email) {
      setMessageSucces("Veuillez remplir tous les champs obligatoires (*)");
      return;
    }

    const formData = new FormData();
    for (const key in nouvelleAssistante) {
      formData.append(key, nouvelleAssistante[key]);
    }
    formData.append('role', 'assistante');

    try {
      const response = await fetch('/api/assistante', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        setMessageSucces('Profil sauvegardé avec succès !');
        setNouvelleAssistante({
          nom: '',
          prenom: '',
          telephone: '',
          email: '',
          photo: null,
        });
        setPhotoPreview(null);
      } else {
        setMessageSucces("Une erreur est survenue lors de l'enregistrement.");
      }
    } catch (err) {
      console.error("Erreur :", err);
      setMessageSucces("Erreur de connexion au serveur.");
    }
  };

  const styles = {
    card: {
        marginTop : '15rem',
        marginLeft : '14rem',
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
      backgroundColor: '#249CF4',
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
      gap: '2rem',
      marginBottom: '2rem'
    },
    infoColumn: {
      display: 'flex',
      flexDirection: 'column',
      width: '50%'
    },
    label: {
      fontWeight: 'bold',
      color: '#1976B4',
      marginBottom: '0.4rem',
      fontSize: '1rem'
    },
    input: {
      padding: '0.6rem',
      fontSize: '0.9rem',
      borderRadius: '0.4rem',
      border: '1px solid #ccc',
      marginBottom: '1rem'
    },
    uploadBtn: {
      backgroundColor: '#1976B4',
      color: 'white',
      border: 'none',
      borderRadius: '0.4rem',
      padding: '0.6rem 1rem',
      cursor: 'pointer',
      marginBottom: '1.5rem'
    },
    saveBtnContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
      width: '100%',
    },
    saveBtn: {
      backgroundColor: '#1976B4',
      color: 'white',
      border: 'none',
      borderRadius: '0.4rem',
      padding: '0.6rem 1.5rem',
      fontSize: '0.9rem',
      fontWeight: '600',
      cursor: 'pointer',
    },
    successMessage: {
      color: '#2e7d32',
      fontWeight: 'bold',
      marginTop: '1rem',
    },
   
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>Créer une assistante</div>

      <div style={styles.body}>
        {photoPreview ? (
          <img src={photoPreview} alt="Aperçu" style={styles.img} />
        ) : (
          <div style={{ ...styles.img, backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
            Photo
          </div>
        )}

        <label htmlFor="photo" style={styles.uploadBtn}>Ajouter une photo</label>
        <input
          id="photo"
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          style={{ display: 'none' }}
        />

        <div style={styles.infoGrid}>
          <div style={styles.infoColumn}>
            <label style={styles.label}>Nom <span className='rouge'>*</span> </label>
            <input name="nom" style={styles.input} value={nouvelleAssistante.nom} onChange={handleChange} />

            <label style={styles.label}>Prénom <span className='rouge'>*</span> </label>
            <input name="prenom" style={styles.input} value={nouvelleAssistante.prenom} onChange={handleChange} />
          </div>

          <div style={styles.infoColumn}>
            <label style={styles.label}>Email <span className='rouge'>*</span> </label>
            <input name="email" style={styles.input} value={nouvelleAssistante.email} onChange={handleChange} />

            <label style={styles.label}>Téléphone</label>
            <input name="telephone" style={styles.input} value={nouvelleAssistante.telephone} onChange={handleChange} />
          </div>
        </div>

        <div style={styles.saveBtnContainer}>
          <button style={styles.saveBtn} onClick={handleSubmit}>Sauvegarder</button>
        </div>

        {messageSucces && <p style={styles.successMessage}>{messageSucces}</p>}
      </div>
    </div>
  );
};

export default CarteAjouterAssis;
