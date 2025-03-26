import Sidebar from '../nav/Sidebar';
import Topnav from '../nav/Topnav';
import TabsComponent from './tabscompo';

const ModifierPage = ({chercheur}) => {
  return (
    <div className="app-container">
      <Sidebar />  
      <div className="main-content">
        <Topnav />  
        <TabsComponent chercheur={chercheur} /> 
      </div>
    </div>
  );
};

export default ModifierPage;
