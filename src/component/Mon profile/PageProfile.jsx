import pageStyle from './PageProfile.module.css';  
import Sidebar from '../nav/Sidebar';  
import Topnav from '../nav/Topnav';  
import ProfileCard from './Profilecard';
import AboutCard from './Aboutcard';

export default function ProfilePage({ chercheur }) {
  return (
    <div >
      <Sidebar />  
      <div >
        <Topnav />  
        <div className={pageStyle.pageProfile}>
          <ProfileCard 
            name={chercheur.nom} 
            firstName={chercheur.prenom} 
            grade={chercheur.grade} 
            imageUrl={chercheur.photo} 
          />
          <AboutCard researcher={chercheur} />
        </div>
      </div>
    </div>
  );
}
