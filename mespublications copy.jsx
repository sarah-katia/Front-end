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
      title: "Amanos: An intent-driven management and orchestration system for next-generation cloud services",
      date: "2023",
    },
    {
      id: 3,
      title: "PIGMMES: Partial Incremental Gaussian Mixture Model with Efficient Storage",
      date: "2023",
    },
    {
      id: 4,
      title: "nergy-efficient mechanisms in security of the internet of things: A survey",
      date: "2023",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 font-sans pt-8">
      {/* Main container with relative positioning for header */}
      <div className="relative bg-white rounded-3xl shadow-lg p-6 pt-8 border border-gray-200 mt-6">
        {/* Mes Publications header - Positioned at the top right */}
        <div className="absolute -top-4 right-8">
          <h2 className="bg-blue-500 text-white text-xl font-normal px-8 py-3 rounded-lg shadow-md whitespace-nowrap">
            Mes Publications
          </h2>
        </div>

        {/* Publications List */}
        <div className="space-y-4 mt-4">
          {/* Table Headers - Only visible on larger screens */}
          <div className="hidden sm:grid grid-cols-[1fr,120px,120px] gap-4 px-4 pb-2">
            <div className="text-gray-800 font-medium">Titre</div>
            <div className="text-gray-800 font-medium">Date</div>
            <div></div>
          </div>
          
          {publications.map((publication) => (
            <div 
              key={publication.id} 
              className="flex flex-col sm:grid sm:grid-cols-[1fr,120px,120px] gap-4 items-start sm:items-center p-4 border border-gray-200 rounded-xl shadow-sm"
            >
              <div className="text-gray-800 w-full">
                {publication.title}
              </div>
              
              <div className="text-gray-800 flex items-center sm:block w-full">
                {/* Label for mobile */}
                <span className="sm:hidden font-medium mr-2">Date: </span>
                {publication.date}
              </div>
              
              <div className="w-full sm:w-auto mt-2 sm:mt-0">
                <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors text-center">
                  Voir plus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Publications;