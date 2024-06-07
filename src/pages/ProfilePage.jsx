import { useContext } from "react";
import NavBar from "../component/NavBar.jsx";
import { AuthContext } from "../context/AuthContext.jsx";


export const ProfilePage = () => {

    const { currentUser } = useContext(AuthContext);
    console.log(currentUser);

    return (
        <>
            <NavBar />
            <div>
                <h1 className="text-2xl font-bold text-center">Profile Page</h1>

                <div className="flex justify-center items-center text-center">
                 
                    <div className="flex flex-col items-start text-center">
                        <label className="text-lg font-semibold text-center">Nom complet</label>
                        {currentUser ? <h1>Bonjour, {currentUser.fullName}</h1> : <h1>Veuillez vous connecter</h1>}
                        </div>

                        <div className="mt-12">
  <h4 className="text-center">Mes historique morpion</h4>
                        </div>
                    
                    </div>
            </div>
            <div className="w-full grid grid-cols-12 gap-4">

            </div>
        </>
    );
}

export default ProfilePage;