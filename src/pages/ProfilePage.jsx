import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

export const ProfilePage = () => {
    const { currentUser } = useContext(AuthContext);
    console.log(currentUser);

    return (
        <>
            <NavBar />
            <div>
                <h1 className="text-2xl font-bold text-center">Page de profil</h1>

                <div className="flex justify-center items-center text-center">
                    <div className="flex flex-col items-start text-center">
                        <label className="text-lg font-semibold text-center">Nom complet</label>
                        {currentUser && currentUser.fullName ? <h1>Bonjour, {currentUser.fullName}</h1> : <h1>Veuillez vous connecter</h1>}
                    </div>

                    <div className="mt-12">
                        <h4 className="text-center">Mon historique de morpion</h4>
                        <p>Vous avez gagné 5 parties</p>
                    </div>
                </div>
            </div>
          
        </>
    );
}

export default ProfilePage;