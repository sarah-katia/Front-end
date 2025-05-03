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
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 font-sans bg-gray-50">
      {/* Publications Header with horizontal lines */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex-grow h-px bg-blue-400"></div>
        <h2 className="mx-4 text-blue-500 text-xl font-medium">Publications</h2>
        <div className="flex-grow h-px bg-blue-400"></div>
      </div>

      {/* Publications Container */}
      <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-200">
        {/* Table Header */}
        <div className="grid grid-cols-[3fr,1fr,1fr] items-center pb-3 border-b border-gray-300 mb-6">
          <div className="text-gray-800 font-medium text-lg">Titre</div>
          <div className="text-gray-800 font-medium text-lg">Date</div>
          <div></div>
        </div>
        
        {/* Publications List */}
        <div className="space-y-6">
          {publications.map((publication) => (
            <div 
              key={publication.id} 
              className="grid grid-cols-[3fr,1fr,1fr] items-center py-2"
            >
              <div className="text-gray-800">
                {publication.title}
              </div>
              <div className="text-gray-800">
                {publication.date}
              </div>
              <div className="flex justify-end">
                <button className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors">
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