import React, { useState, useEffect } from 'react';

function PourcentageCard({ data }) {
  const [isLoaded, setIsLoaded] = useState(false);

  // État pour stocker les pourcentages animés
  const [animatedPercentages, setAnimatedPercentages] = useState(
    data.map(item => ({ ...item, currentValue: 0 }))
  );

  useEffect(() => {
    // Lancer l'animation après un léger délai pour laisser la page se charger
    setTimeout(() => {
      setIsLoaded(true);

      // Lancer l'animation des chiffres de pourcentage
      data.forEach((item, index) => {
        let currentValue = 0;
        const interval = setInterval(() => {
          if (currentValue < item.value) {
            currentValue++;
            setAnimatedPercentages(prevState => {
              const updated = [...prevState];
              updated[index].currentValue = currentValue;
              return updated;
            });
          } else {
            clearInterval(interval); // Arrêter l'intervalle quand le nombre est atteint
          }
        }, 30); // Vitesse de l'incrémentation du nombre (30ms par incrément)
      });
    }, 200); // Délai avant de démarrer l'animation
  }, [data]);

  return (
    <div style={{ marginBottom: '20px' }}>
      <h3 style={{
        fontSize: '24px',
        color: '#1976b4',
        fontFamily: 'Poppins',
        marginBottom: '10px',
        textAlign: 'center',
      }}>
        Pourcentage des types de publications
      </h3>

      <div style={{
        background: '#1976b4',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        flex: '1',
        minWidth: '200px',
        margin: 'auto',
        maxWidth: '500px',
      }}>
        {animatedPercentages.map((item, index) => (
          <div key={index} style={{ marginBottom: '25px' }}>
            <div style={{
              fontSize: '14px',
              fontWeight: '400',
              marginBottom: '8px',
              color: '#fff'
            }}>
              {item.name}
            </div>

            <div style={{
              width: '100%',
              height: '5px',
              backgroundColor: '#4A93C4',
              borderRadius: '5px',
              position: 'relative',
            }}>
              <div style={{
                width: isLoaded ? `${item.value}%` : '0%',
                height: '100%',
                backgroundColor: '#fff',
                borderRadius: '5px',
                transition: 'width 2s ease-out', // Animation de la barre
              }} />
              {/* Position de la bulle */}
              <div style={{
                position: 'absolute',
                top: '-30px',
                left: isLoaded ? `${item.value}%` : '0%',
                transform: 'translateX(-50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transition: 'left 2s ease-out', // La bulle se déplace pendant l'animation
              }}>
                <div style={{
                  backgroundColor: '#fff',
                  color: '#333',
                  padding: '3px 5px',
                  borderRadius: '6px',
                  fontSize: '9px',
                  fontWeight: '400',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                  whiteSpace: 'nowrap',
                }}>
                  {animatedPercentages[index].currentValue}% {/* Affiche l'animation du chiffre */}
                </div>
                <div style={{
                  width: 0,
                  height: 0,
                  borderLeft: '4px solid transparent',
                  borderRight: '4px solid transparent',
                  borderTop: '4px solid #fff',
                }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PourcentageCard;
