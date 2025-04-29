import { useEffect, useState } from 'react';
import pageStyle from './PageProfile.module.css';  
import Sidebar from '../nav/Sidebar';  
import Topnav from '../nav/Topnav';  
import ProfileCard from './Profilecard';
import AboutCard from './Aboutcard';

export default function ProfilePage() {
  const [chercheur, setChercheur] = useState(null);

  useEffect(() => {
    const storedChercheur = localStorage.getItem('user'); // ici "user"
    if (storedChercheur) {
      setChercheur(JSON.parse(storedChercheur));
    }
  }, []);

  if (!chercheur) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <Sidebar />  
      <div>
        <Topnav />  
        <div className={pageStyle.pageProfile}>
          <ProfileCard />
          <AboutCard />
        </div>
      </div>
    </div>
  );
}
