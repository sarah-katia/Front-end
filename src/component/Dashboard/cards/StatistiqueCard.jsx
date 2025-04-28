import React, { useState, useEffect } from 'react';

function StatistiqueCard({ title, number }) {
  const [currentNumber, setCurrentNumber] = useState(0);

  useEffect(() => {
    const incrementNumber = () => {
      if (currentNumber < number) {
        setCurrentNumber(currentNumber + 1);
        requestAnimationFrame(incrementNumber);
      }
    };
    incrementNumber();
  }, [number, currentNumber]);

  return (
    <div style={{
      background: '#249CF4',
      borderRadius: '10px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      padding: '10px',
      paddingRight: '30px',
      paddingLeft: '30px',
      textAlign: 'center',
      minWidth: '100px',
    }}>
      <p style={{ fontSize: '48px', fontWeight: '500', color: '#fff', marginBottom: '0px', marginTop: '10px' }}>
        {currentNumber}
      </p>
      <h3 style={{ fontSize: '18px', fontFamily: 'Poppins', color: '#fff', marginTop: '10px', marginBottom: '10px' }}>
        {title}
      </h3>
    </div>
  );
}

export default StatistiqueCard;
