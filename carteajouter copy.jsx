import React from 'react';
const Publications = () => {
    // Sample publication data - replace with your actual data
    const publications = [
      {
        id: 1,
        title: "Novel area-efficient and flexible architectures for optimal Ate pairing on FPGA",
        date: "2024",
      },
      {
        id: 2,
        title: "Energy-efficient mechanisms in security of the internet of things: A survey",
        date: "2023",
      },
      {
        id: 3,
        title: "Energy-efficient mechanisms in security of the internet of things: A survey",
        date: "2023",
      },
      {
        id: 4,
        title: "nergy-efficient mechanisms in security of the internet of things: A survey",
        date: "2023",
      },
      {
        id: 5,
        title: "Reliability-aware intelligent mapping based on reinforcement learning on chip",
        date: "2022",
      },
    ]
  
    return (
      <>
        {/* Publications Section Header */}
        <div className="flex items-center justify-center mb-8 mt-12">
          <div className="flex-grow h-px bg-blue-400" />
          <h2 className="mx-4 text-blue-600 text-xl sm:text-2xl font-semibold whitespace-nowrap">Publications</h2>
          <div className="flex-grow h-px bg-blue-400" />
        </div>
  
        <div className="bg-white rounded-[20px] shadow-lg p-3 sm:p-6 max-w-7xl mx-auto border border-gray-200">
          {/* Header with Filter and Add buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 mb-6 sm:mb-8">
            <button className="w-full sm:w-auto bg-[#98FB98] text-black px-4 sm:px-6 py-2 rounded-full hover:bg-[#90EE90] transition-colors text-sm sm:text-base">
              Filtrer
            </button>
            <button className="w-full sm:w-auto bg-[#1216B4] text-white px-4 sm:px-6 py-2 rounded-full hover:bg-blue-700 transition-colors text-sm sm:text-base">
              + Ajouter une publication
            </button>
          </div>
  
          {/* Table Header - Hidden on mobile */}
          <div className="hidden sm:grid grid-cols-[1fr,120px,120px] gap-4 mb-4 px-4 pb-2 border-b-2 border-gray-800">
            <div className="font-semibold">Titre</div>
            <div className="font-semibold">Date</div>
            <div></div> {/* Space for button */}
          </div>
  
          {/* Publications List */}
          <div className="space-y-3">
            {publications.map((publication) => (
              <div
                key={publication.id}
                className="flex flex-col sm:grid sm:grid-cols-[1fr,120px,120px] gap-3 sm:gap-4 items-start sm:items-center bg-white rounded-xl p-4 hover:bg-gray-50 border border-gray-200 shadow-md"
              >
                <div className="text-gray-800 text-sm sm:text-base">{publication.title}</div>
                <div className="text-gray-600 text-sm sm:text-base order-3 sm:order-none">
                  {/* Date label for mobile */}
                  <span className="sm:hidden font-semibold mr-2">Date:</span>
                  {publication.date}
                </div>
                <div className="order-2 sm:order-none w-full sm:w-auto">
                  <button className="w-full sm:w-auto bg-[#1216B4] text-white px-4 sm:px-6 py-2 rounded-full hover:bg-blue-700 transition-colors text-sm sm:text-base">
                    Voir plus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    )
  }
  
  export default Publications
  