// DeleteConfirmationCard.jsx
import React from "react";
import cardStyles from "./approvalcard.module.css"; // Réutilisation du CSS

const DeleteConfirmationCard = ({ isVisible, onConfirm, onCancel, chercheur, message }) => {
  if (!isVisible || !chercheur) return null;

  return (
    <div className={cardStyles.overlay}>
      <div className={cardStyles.card}>
        <p>{message}</p>
        <div className={cardStyles.buttons}>
          <button className={cardStyles.oui} onClick={onConfirm}>OUI</button>
          <button className={cardStyles.non} onClick={onCancel}>NON</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationCard;
