import React from "react";
import approvalCardStyles from "./approvalcard.module.css"; // Module CSS
import { useNavigate } from "react-router-dom";

const ApprovalCard = ({ isVisible, onClose }) => {
  if (!isVisible) return null;
  const navigate = useNavigate();

  return (
    <div className={approvalCardStyles.overlay}>
      <div className={approvalCardStyles.card}>
        <p>Voulez-vous vraiment enregistrer les modifications?</p>
        <div className={approvalCardStyles.buttons}>
          <button className={approvalCardStyles.oui} onClick={() => navigate("/PageProfile")}>OUI</button>
          <button className={approvalCardStyles.non} onClick={onClose}>NON</button>
        </div>
      </div>
    </div>
  );
};

export default ApprovalCard;
