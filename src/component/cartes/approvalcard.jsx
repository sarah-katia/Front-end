import React from "react";
import "./approvalcard.css";
import { useNavigate } from "react-router-dom";


const ApprovalCard = ({ isVisible, onClose }) => {
  if (!isVisible) return null;
  const navigate = useNavigate();

  return (
    <div className="overlay">
      <div className="card">
        <p>Voulez-vous vraiment enregistrer les modifications?</p>
        <div className="buttons">
          <button className="oui" onClick={() => navigate("/Mon profile")}>OUI</button>
          <button className="non" onClick={onClose}>NON</button>
        </div>
      </div>
    </div>
  );
};

export default ApprovalCard;
