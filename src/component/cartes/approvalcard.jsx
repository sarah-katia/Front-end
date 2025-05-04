import React from "react";
import approvalCardStyles from "./approvalcard.module.css";

const ApprovalCard = ({ isVisible, onConfirm, onCancel }) => {
  if (!isVisible) return null;

  return (
    <div className={approvalCardStyles.overlay}>
      <div className={approvalCardStyles.card}>
        <p>Voulez-vous vraiment enregistrer les modifications ?</p>
        <div className={approvalCardStyles.buttons}>
          <button className={approvalCardStyles.oui} onClick={onConfirm}>OUI</button>
          <button className={approvalCardStyles.non} onClick={onCancel}>NON</button>
        </div>
      </div>
    </div>
  );
};

export default ApprovalCard;
