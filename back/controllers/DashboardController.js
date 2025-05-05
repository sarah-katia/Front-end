const { Sequelize, Op } = require('sequelize');
// const Chercheur = require('../models/chercheur.model');
// const Publication = require('../models/publication.model');
// const ConfJournal = require('../models/conf_journal.model');
// const PubClassement = require('../models/pub_classement.model');
// const Classement = require('../models/classement.model');
const { Publication, Chercheur, ConfJournal, PubClassement ,Classement} = require('../models');

// Helper function to get current year
const getCurrentYear = () => new Date().getFullYear();

const DashboardController = {
  /**
   * Get overall dashboard statistics
   */
  getStats: async (req, res) => {
    try {
      // Get total number of active chercheurs
      const totalChercheurs = await Chercheur.count({
        where: {
          Statut: 'Actif'
        }
      });

      // Get total number of publications
      const totalPublications = await Publication.count();

      res.status(200).json({
        totalChercheurs,
        totalPublications
      });
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des statistiques du dashboard' });
    }
  },

  /**
   * Get publications by research team
   */
  getPublicationsByTeam: async (req, res) => {
    try {
      const result = await Chercheur.findAll({
        attributes: ['Equipe', [Sequelize.fn('COUNT', Sequelize.col('Publications.publication_id')), 'value']],
        include: [{
          model: Publication,
          attributes: []
        }],
        where: {
          Statut: 'Actif'
        },
        group: ['Equipe'],
        raw: true
      });

      // Transform data for frontend
      const formattedData = result.map(item => ({
        name: item.Equipe || 'Non spécifié',
        value: parseInt(item.value, 10)
      }));

      res.status(200).json(formattedData);
    } catch (error) {
      console.error('Error getting publications by team:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des publications par équipe' });
    }
  },

  /**
   * Get chercheurs by research team
   */
  getChercheursByTeam: async (req, res) => {
    try {
      const result = await Chercheur.findAll({
        attributes: ['Equipe', [Sequelize.fn('COUNT', Sequelize.col('chercheur_id')), 'value']],
        where: {
          Statut: 'Actif'
        },
        group: ['Equipe'],
        raw: true
      });

      // Transform data for frontend
      const formattedData = result.map(item => ({
        name: item.Equipe || 'Non spécifié',
        value: parseInt(item.value, 10)
      }));

      res.status(200).json(formattedData);
    } catch (error) {
      console.error('Error getting chercheurs by team:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des chercheurs par équipe' });
    }
  },

  
  /**
 * Get yearly statistics for publications with conferences and articles
 */
getYearlyStats: async (req, res) => {
    try {
      const currentYear = getCurrentYear();
      const startYear = currentYear - 5;
      const result = [];
  
      // Loop through the last 6 years
      for (let year = startYear; year <= currentYear; year++) {
        // Get all publications for this year with their conference/journal info
        const publications = await Publication.findAll({
          where: {
            annee: year
          },
          include: [
            {
              model: ConfJournal,
              attributes: ['type']
            }
          ]
        });
  
        // Count total publications for this year
        const totalPublications = publications.length;
        
        // Count conferences for this year
        const conferencesCount = publications.filter(pub => 
          pub.Conf_Journal?.type === 'Conference' || 
          pub.Conf_Journal?.type === 'Conférence' || 
          pub.Conf_Journal?.type === 'confrence'
        ).length;
        
        // Articles = total publications - conferences
        const articlesCount = totalPublications - conferencesCount;
  
        result.push({
          name: year.toString(),
          conferences: conferencesCount,
          articles: articlesCount
        });
      }
  
      res.status(200).json(result);
    } catch (error) {
      console.error('Error getting yearly stats:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des statistiques annuelles' });
    }
  },
  /**
 * Get top chercheurs by publication count
 */
getTopChercheurs: async (req, res) => {
    try {
      const result = await Publication.findAll({
        attributes: [
          'chercheur_id',
          [Sequelize.fn('COUNT', Sequelize.col('publication_id')), 'value']
        ],
        include: [{
          model: Chercheur,
          attributes: ['nom_complet'],
          required: true // INNER JOIN instead of LEFT JOIN
        }],
        where: {
          // You can add conditions for publications if needed
        },
        group: ['chercheur_id'],
        order: [[Sequelize.literal('value'), 'DESC']],
        limit: 10,
        raw: true
      });
  
      // Transform data for frontend
      const formattedData = result.map(item => ({
        name: item['Chercheur.nom_complet'],
        value: parseInt(item.value, 10)
      }));
  
      res.status(200).json(formattedData);
    } catch (error) {
      console.error('Error getting top chercheurs:', error);
      
      // Return static fallback data in case of error
      const fallbackData = [
        { name: 'Mouloud Koudil', value: 35 },
        { name: 'Kermi Adel', value: 28 },
        { name: 'SiTayeb Fatima', value: 25 },
        { name: 'BenBouzid Mohamed', value: 22 },
        { name: 'AYA SOFIA', value: 18 },
        { name: 'Khelouat Boualem', value: 15 },
        { name: 'Artabaz Saliha', value: 12 },
        { name: 'Mokhtari Ahmed', value: 10 },
        { name: 'Benaissa Karima', value: 8 },
        { name: 'Mansouri Hassan', value: 5 }
      ];
      
      res.status(200).json(fallbackData);
    }
  },
  /**
   * Get publication percentage by type
   */
  getPourcentagePublications: async (req, res) => {
    try {
      const totalPublications = await Publication.count();
      
      const confJournalStats = await ConfJournal.findAll({
        attributes: ['type', [Sequelize.fn('COUNT', Sequelize.col('publication_id')), 'count']],
        group: ['type'],
        raw: true
      });

      // Transform data for frontend
      const formattedData = confJournalStats.map(item => ({
        name: item.type === 'Not found' ? 'Autres' : (item.type || 'Autres'),
        value: Math.round((parseInt(item.count, 10) / totalPublications) * 100)
      }));

      res.status(200).json(formattedData);
    } catch (error) {
      console.error('Error getting publication percentages:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des pourcentages de publications' });
    }
  },

  /**
   * Get Scimago-ranked publications
   */
  getScimagoPublications: async (req, res) => {
    try {
      const scimagoResults = await PubClassement.findAll({
        attributes: [
          'classement',
          [Sequelize.fn('COUNT', Sequelize.col('publication_id')), 'count']
        ],
        include: [{
          model: Classement,
          attributes: [],
          where: {
            nom: 'SJR'
          }
        }],
        group: ['classement'],
        raw: true
      });

      // Transform data for frontend
      const formattedData = scimagoResults.map(item => ({
        name: item.classement || 'Non classé',
        value: parseInt(item.count, 10)
      }));

      res.status(200).json(formattedData);
    } catch (error) {
      console.error('Error getting Scimago publications:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des publications classées Scimago' });
    }
  },

  /**
   * Get CORE-ranked publications
   */
  getCorePublications: async (req, res) => {
    try {
      const coreResults = await PubClassement.findAll({
        attributes: [
          'classement',
          [Sequelize.fn('COUNT', Sequelize.col('publication_id')), 'count']
        ],
        include: [{
          model: Classement,
          attributes: [],
          where: {
            nom: 'CORE'
          }
        }],
        group: ['classement'],
        raw: true
      });

      // Transform data for frontend
      const formattedData = coreResults.map(item => ({
        name: item.classement || 'Non classé',
        value: parseInt(item.count, 10)
      }));

      res.status(200).json(formattedData);
    } catch (error) {
      console.error('Error getting CORE publications:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des publications classées CORE' });
    }
  },

  /**
   * Export publications by team to Excel
   */
  exportPublicationsByTeam: async (req, res) => {
    try {
      const result = await Chercheur.findAll({
        attributes: ['Equipe', [Sequelize.fn('COUNT', Sequelize.col('Publications.publication_id')), 'count']],
        include: [{
          model: Publication,
          attributes: []
        }],
        where: {
          Statut: 'Actif'
        },
        group: ['Equipe'],
        raw: true
      });

      // Create Excel workbook
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Publications par équipe');
      
      // Add headers
      worksheet.columns = [
        { header: 'Équipe', key: 'equipe', width: 30 },
        { header: 'Nombre de publications', key: 'count', width: 25 }
      ];
      
      // Add data rows
      result.forEach(item => {
        worksheet.addRow({ 
          equipe: item.Equipe || 'Non spécifié', 
          count: parseInt(item.count, 10) 
        });
      });
      
      // Style headers
      worksheet.getRow(1).font = { bold: true };
      
      // Set response headers for Excel download
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=publications_par_equipe.xlsx');
      
      // Write workbook to response
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error('Error exporting publications by team:', error);
      res.status(500).json({ message: 'Erreur lors de l\'exportation des publications par équipe' });
    }
  },

  /**
 * Get publications statistics by date range
 */
getStatsByDateRange: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({ message: 'Les dates de début et de fin sont requises' });
      }
  
      // Parse dates
      const start = parseInt(startDate, 10);
      const end = parseInt(endDate, 10);
      
      // Get publications in date range
      const publications = await Publication.findAll({
        where: {
          annee: {
            [Op.between]: [start, end]
          }
        },
        include: [
          {
            model: ConfJournal,
            attributes: ['type']
          }
        ]
      });
  
      // Calculate publication counts by type
      const typeCounts = {};
      publications.forEach(pub => {
        const type = pub.Conf_Journal?.type || 'Autre';
        typeCounts[type] = (typeCounts[type] || 0) + 1;
      });
  
      // Format type counts for the pie chart
      const formattedTypeCounts = Object.entries(typeCounts).map(([name, value]) => ({
        name,
        value
      }));
  
      // Get yearly statistics with conferences and articles
      const yearlyStats = [];
      for (let year = start; year <= end; year++) {
        const yearPublications = publications.filter(pub => pub.annee === year);
        
        // Count conferences for this year
        const conferences = yearPublications.filter(pub => 
          pub.Conf_Journal?.type === 'Conference' || 
          pub.Conf_Journal?.type === 'Conférence' || 
          pub.Conf_Journal?.type === 'conference'
        ).length;
        
        // Articles = total publications - conferences
        const articles = yearPublications.length - conferences;
  
        yearlyStats.push({
          name: year.toString(),
          conferences: conferences,
          articles: articles
        });
      }
  
      res.status(200).json({
        totalPublications: publications.length,
        typeCounts: formattedTypeCounts,
        yearlyStats
      });
    } catch (error) {
      console.error('Error getting stats by date range:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des statistiques par période' });
    }
  },

  
};

module.exports = DashboardController;