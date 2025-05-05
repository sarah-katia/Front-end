import "./Cartepubli.css"

function Cartepubli({ publications }) {
  // Si aucune publication n'est fournie, utiliser des données de démonstration
  const demoPublications = [
    {
      id: 1,
      titre: "Novel area-efficient and flexible architectures for optimal Ate pairing on FPGA",
      date: "2024",
    },
    {
      id: 2,
      titre: "Amanos: An intent-driven management and orchestration system for next-generation cloud infrastructures",
      date: "2023",
    },
    {
      id: 3,
      titre: "PIGMMES: Partial Incremental Gaussian Mixture Model with Efficient Storage",
      date: "2023",
    },
    {
      id: 4,
      titre: "Energy-efficient mechanisms in security of the Internet of Things",
      date: "----",
    },
  ]

  const publicationsToRender = publications || demoPublications

  return (
    <div className="publications-compact-container">
      <div className="publications-compact-header">
        <h2>Mes Publications</h2>
      </div>

      <div className="publications-compact-table">
        <div className="publications-compact-table-header">
          <div className="publication-compact-title-header">Titre</div>
          <div className="publication-compact-date-header">Date</div>
          <div className="publication-compact-actions-header"></div>
        </div>

        {publicationsToRender.map((publication) => (
          <div key={publication.id} className="publication-compact-row">
            <div className="publication-compact-title">{publication.titre}</div>
            <div className="publication-compact-date">{publication.date}</div>
            <div className="publication-compact-actions">
              <button className="voir-plus-compact-button">Voir plus</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Cartepubli
