import React from 'react';

const PublicationDetails = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">
        Novel area-efficient and flexible architectures for optimal Ate pairing on FPGA
      </h1>
      
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row mb-2 items-baseline">
          <div>
            <span className="text-blue-600 font-medium">Les Auteurs: </span>
            <span>Mouloud Koudil, Oussama Azzouz, Mohamed Anane, Mohamed Issad, Yassine Himeur</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row mb-2 items-baseline">
          <div>
            <span className="text-blue-600 font-medium">Journal: </span>
            <span>The journal of supercomputing</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row mb-2 items-baseline">
          <div>
            <span className="text-blue-600 font-medium">Date de publication: </span>
            <span>2024</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row mb-2 items-baseline">
          <div>
            <span className="text-blue-600 font-medium">Volume: </span>
            <span>80</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row mb-2 items-baseline">
          <div>
            <span className="text-blue-600 font-medium">Pages: </span>
            <span>2633-2659</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row mb-2 items-baseline">
          <div>
            <span className="text-blue-600 font-medium">Editeur: </span>
            <span>Springer US</span>
          </div>
        </div>
      </div>
      
      <hr className="border-gray-300 my-4" />
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-blue-600 mb-3">Détails sur la conférence / le journal:</h2>
        
        <div className="flex flex-col sm:flex-row mb-2 items-baseline">
          <div>
            <span className="text-blue-600 font-medium">Thématique: </span>
            <span>la thématique</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row mb-2 items-baseline">
          <div>
            <span className="text-blue-600 font-medium">Scope: </span>
            <span className="text-gray-600">
              big paragraph i don't know what to write here big paragraph i don't know what to write here big
              paragraph i don't know what to write here big paragraph i don't know what to write here big paragraph i
              don't know what to write here big paragraph i don't know what to write here
            </span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row mb-2 items-baseline">
          <div>
            <span className="text-blue-600 font-medium">Lieu: </span>
            <span>bla bla bla</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row mb-2 items-baseline">
          <div>
            <span className="text-blue-600 font-medium">Période: </span>
            <span>2019 - 2023</span>
          </div>
        </div>
      </div>
      
      <hr className="border-gray-300 my-4" />
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-blue-600 mb-3">Détails sur le classement de la conférence / le journal:</h2>
        
        <div className="flex flex-col sm:flex-row mb-2 items-baseline">
          <div>
            <span className="text-blue-600 font-medium">Nom du site: </span>
            <span>IDgrsdt, core, scimago ......etc</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row mb-2 items-baseline">
          <div>
            <span className="text-blue-600 font-medium">Classement: </span>
            <span>A, B....</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row mb-2 items-baseline">
          <div>
            <span className="text-blue-600 font-medium">Lien vers le classement: </span>
            <span className="text-blue-500 underline">https://www.ghjirkodtlfktijkrlem....</span>
          </div>
        </div>
      </div>
      
      <div className="text-right">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md">
          Voir la publication
        </button>
      </div>
    </div>
  );
};

export default PublicationDetails;