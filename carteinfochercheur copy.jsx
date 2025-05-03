import React from 'react';
const ResearcherProfile = () => {
    // Sample researcher data
    const researcher = {
      photo: "/placeholder.svg?height=220&width=220",
      nom: "Kermi",
      prenom: "Adel",
      grade: "Maître de Conférences A",
      email: "a_kermi@esi.dz",
      diplome: "Doctorat d'état",
      orcid: "0000-0001-9022",
      qualite: "Enseignant chercheur",
      equipe: "TIIMA",
      etablissement: "ESI (Ecole Nationale Supérieure d'Informatique)",
      publications: "79",
      indiceH: "16",
      statut: "Actif",
      chefEquipe: "Oui",
      googleScholar: "https://scholar.google.com/citations?hl=en&user",
    }
  
    return (
      <div className="max-w-4xl mx-auto font-sans">
        <div className="relative bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          {/* Header - Blue banner */}
          <div className="absolute -top-5 right-8">
            <h2 className="bg-[#1E9BF0] text-white text-xl font-normal px-8 py-3 rounded-lg shadow-md">
              Information sur le chercheur
            </h2>
          </div>
  
          <div className="flex flex-col">
            {/* Top part with name and photo */}
            <div className="flex mb-6 mt-8">
              {/* Photo */}
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-gray-200 mr-16">
                <img
                  src={researcher.photo || "/placeholder.svg"}
                  alt={`${researcher.prenom} ${researcher.nom}`}
                  className="w-full h-full object-cover"
                />
              </div>
  
              {/* Personal info */}
              <div className="flex flex-col justify-center">
                <div className="mb-4">
                  <span className="text-[#1E9BF0] font-medium">Nom: </span>
                  <span className="text-l">{researcher.nom}</span>
                </div>
                <div className="mb-4">
                  <span className="text-[#1E9BF0] font-medium">Prénom: </span>
                  <span className="text-l">{researcher.prenom}</span>
                </div>
                <div>
                  <span className="text-[#1E9BF0] font-medium">Grade: </span>
                  <span>{researcher.grade}</span>
                </div>
              </div>
            </div>
  
            {/* Two column layout for other information */}
            <div className="grid grid-cols-2 gap-4">
              {/* Left column */}
              <div className="space-y-4">
                <div>
                  <span className="text-[#1E9BF0] font-medium">E-mail: </span>
                  {researcher.email}
                </div>
                <div>
                  <span className="text-[#1E9BF0] font-medium">Diplôme: </span>
                  {researcher.diplome}
                </div>
                <div>
                  <span className="text-[#1E9BF0] font-medium">ORCID: </span>
                  {researcher.orcid}
                </div>
                <div>
                  <span className="text-[#1E9BF0] font-medium">Qualité: </span>
                  {researcher.qualite}
                </div>
                <div>
                  <span className="text-[#1E9BF0] font-medium">Equipe: </span>
                  {researcher.equipe}
                </div>
                <div>
                  <span className="text-[#1E9BF0] font-medium">Etablissement d'origine: </span>
                  {researcher.etablissement}
                </div>
                <div className="flex items-center">
                  <div className="inline-flex items-center text-[#1E9BF0] font-medium mr-2">
                    <svg
                      className="w-5 h-5 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.828 14.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101"
                      />
                    </svg>
                    Lien Google Scholar:
                  </div>
                  <a
                    href={researcher.googleScholar}
                    className="text-black hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {researcher.googleScholar}
                  </a>
                </div>
              </div>
  
              {/* Right column */}
              <div className="space-y-4">
                <div>
                  <span className="text-[#1E9BF0] font-medium">Nombre de Publications: </span>
                  {researcher.publications}
                </div>
                <div>
                  <span className="text-[#1E9BF0] font-medium">Indice-H: </span>
                  {researcher.indiceH}
                </div>
                <div>
                  <span className="text-[#1E9BF0] font-medium">Statut: </span>
                  {researcher.statut}
                </div>
                <div>
                  <span className="text-[#1E9BF0] font-medium">Chef equipe: </span>
                  {researcher.chefEquipe}
                </div>
              </div>
            </div>
  
            {/* Action buttons */}
            <div className="flex justify-end gap-6 mt-8">
              <button className="bg-[#1E9BF0] text-white font-normal px-8 py-3 rounded-lg">Supprimer</button>
              <button className="bg-[#1E78AD] text-white font-normal px-8 py-3 rounded-lg">Modifier</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  export default ResearcherProfile
  