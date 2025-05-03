import React, { useState } from "react";
import Sidebardir from "../nav/sidebarAssi";
import Topnav from "../nav/Topnav";
import ResearcherProfile from "../cartes/carteinfochercheur";
import Publications from "../cartes/carteajouter";
import ApprovalCard from "../cartes/approvalcard";

const ResearcherPage = () => {
  const [isApprovalVisible, setIsApprovalVisible] = useState(false);
  
  const showApproval = () => {
    setIsApprovalVisible(true);
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setIsApprovalVisible(false);
    }, 3000);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebardir />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <Topnav />
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4">
          {/* Approval notification */}
          {isApprovalVisible && (
            <div className="fixed top-20 right-4 z-50">
              <ApprovalCard message="Action réussie!" />
            </div>
          )}

          {/* Researcher Profile */}
          <div className="mb-8">
            <ResearcherProfile />
          </div>
          
          {/* Publications List */}
          <div>
            <Publications />
          </div>
          
          {/* Demo button to show approval card */}
          {showApproval && (
          <ApprovalCard
            isVisible={showApproval}
            onClose={() => setShowApproval(false)}
            onConfirm={() => console.log("Infos sauvegardées:", formData)}
          />
        )}
        </main>
      </div>
    </div>
  );
};

export default ResearcherPage;