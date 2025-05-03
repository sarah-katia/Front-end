import React, { useState } from "react";
import Sidebardir from "../nav/sidebarAssi";
import Topnav from "../nav/Topnav";
import PublicationForm from "../carte_assistante/cartepublication";
import ApprovalCard from "../cartes/approvalcard";

export default function AjouterPublication() { 
    const [isApprovalVisible, setIsApprovalVisible] = useState(false);
    const [publicationData, setPublicationData] = useState({
        title: "",
        authors: "",
        journal: "",
        year: "",
        volume: "",
        issue: "",
        pages: "",
        doi: "",
    });
    
    const handleFormSubmit = (data) => {
        setPublicationData(data);
        setIsApprovalVisible(true);
    };
    
    return (
        <div className="flex h-screen bg-gray-100">
        <Sidebardir />
        <div className="flex-1 flex flex-col overflow-hidden">
            <Topnav />
            <main className="flex-1 overflow-y-auto p-4">
            {/* Demo button to show approval card */}
          {showApproval && (
          <ApprovalCard
            isVisible={showApproval}
            onClose={() => setShowApproval(false)}
            onConfirm={() => console.log("Infos sauvegardées:", formData)}
          />
        )}
            <PublicationForm onSubmit={handleFormSubmit} />
            </main>
        </div>
        </div>
    );
    }