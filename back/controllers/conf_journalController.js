const { Op } = require("sequelize");

const searchPublications = async (req, res) => {
  try {
    const {
      chercheur_id,
      Titre_publication,
      Année_min,
      Année_max,
      Année_exact,
      Type 
    } = req.query;

    const whereClause = {};

    if (chercheur_id) whereClause.chercheur_id = chercheur_id;
    if (Titre_publication) whereClause.Titre_publication = { [Op.like]: `%${Titre_publication}%` };
    if (Type) whereClause.Type = { [Op.like]: `%${Type}%` };
    const yearFilter = {};
    if (Année_exact) {
      yearFilter[Op.eq] = Number(Année_exact);
    } else {
      if (Année_min) yearFilter[Op.gte] = Number(Année_min);
      if (Année_max) yearFilter[Op.lte] = Number(Année_max);
    }
    if (Object.keys(yearFilter).length > 0) {
      whereClause.Année = yearFilter;
    }

    console.log("Filters applied:", whereClause); // Debugging

    // 🔹 Execute query
    const publications = await Publication.findAll({ where: whereClause });

    res.json(publications);
  } catch (error) {
    console.error("Error filtering publications:", error);
    res.status(500).json({ error: "Error filtering publications" });
  }
};
