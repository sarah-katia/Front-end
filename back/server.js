require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const { sequelize, Classement } = require('./models/index');
const homeRoutes = require('./routes/LProutes');
const authRoutes = require('./routes/authRoutes');
const chercheurRoutes = require('./routes/chercheurRoutes');
const directriceRoutes = require('./routes/directriceRoutes');
const adminRoutes = require('./routes/adminRoutes');
const protectedroutes = require('./routes/protectedroutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const cors = require('cors');
const seedAdmin = require('./scripts/seedAdmin');


const app = express();
const PORT = process.env.PORT || 8000;

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/', homeRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/chercheur', chercheurRoutes);
app.use('/directrice', directriceRoutes);
app.use('/protected', protectedroutes);
app.use('/dashboard', dashboardRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Detailed error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Function to seed static tables
const seedStaticTables = async () => {
  try {
    console.log('Seeding static tables...');
    
    await Classement.bulkCreate([
      { class_id: 1, Nom: 'CORE', Type: 'Conference' },
      { class_id: 2, Nom: 'SJR', Type: 'Journal' },
      { class_id: 3, Nom: 'DGRSDT', Type: 'Journal' },
      { class_id: 4, Nom: 'Qualis', Type: 'Conference' }
    ], {
      ignoreDuplicates: true,
      updateOnDuplicate: ['Nom', 'Type']
    });

    console.log('Static tables seeded successfully');
  } catch (error) {
    console.error('Error seeding static tables:', error);
  }
};

// Start server after syncing and seeding
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to the database successfully.');

    await sequelize.sync({ alter: true }); 
    console.log('Database synchronized.');

    await seedStaticTables(); // Seed static Classement table
    await seedAdmin();        // Seed admin user

    app.listen(PORT, () => {
      console.log(` API server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(' Failed to start the server:', error);
  }
})();