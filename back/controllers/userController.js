const { Utilisateur } = require('../models');

exports.getUserInfo = async (req, res) => {
    try {
      // 1. Si on accède à /me → req.params.id est undefined → on prend l’ID du token
      const utilisateurId = req.params.id || req.user?.utilisateur_id;
  
      // 2. Si on accède à /users/:id et qu'on n’est pas admin → refus
      if (req.params.id && (req.user?.Rôle !== 'Administrateur' || req.user?.Rôle !== 'Directeur')) {
        return res.status(403).json({
          status: 'error',
          message: 'Accès refusé '
        });
      }
    
  
      // 3. Requête à la BDD
      const utilisateur = await Utilisateur.findByPk(utilisateurId, {
        attributes: ['utilisateur_id', 'nom_complet', 'Mails', 'Tél', 'Rôle']
      });
  
      if (!utilisateur) {
        return res.status(404).json({
          status: 'error',
          message: 'Utilisateur non trouvé.'
        });
      }
  
      return res.status(200).json({
        status: 'success',
        data: utilisateur
      });
  
    } catch (error) {
      console.error('[GET USER INFO] Erreur serveur :', error);
      return res.status(500).json({
        status: 'error',
        message: 'Erreur serveur lors de la récupération des informations utilisateur.',
        error: error.message
      });
    }
  };