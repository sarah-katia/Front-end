import { motion } from "framer-motion";
import './statcard.css';

const StatCard = ({ name, icon: Icon, value, color }) => {
  return (
    <motion.div 
      className="stat-card" 
      whileHover={{ 
        y: -5, 
      }}
    >
      <div className="stat-card-content">
        <span className="stat-card-title">
          <Icon size={20} className="icon-spacing" style={{ color }} />
          {name}
        </span>
        <p className="stat-card-value">{value}</p>
      </div>
    </motion.div>
  );
};

export default StatCard;
