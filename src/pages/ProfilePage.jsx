import { useContext, useEffect, useState } from "react";
import NavBar from "../component/NavBar.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import { baseUrl } from "../utils/services.js";

export const ProfilePage = () => {
    const { token, currentUser } = useContext(AuthContext);
    const [wins, setWins] = useState(null);

    useEffect(() => {
        const fetchWins = async () => {
            try {
                const response = await fetch(`${baseUrl}/users/${currentUser._id}/wins`, {
                    headers: {
                        'Authorization': token
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user wins');
                }

                const data = await response.json();
                setWins(data.wins);
            } catch (error) {
                console.error('Error fetching wins:', error.message);
            }
        };

        if (token && currentUser._id) {
            fetchWins();
        }
    }, [token, currentUser._id]);

    return (
        <>
            <NavBar />
            <div>
                <h1 className="text-2xl font-bold text-center">Profile Page</h1>
                <div className="flex justify-center items-center text-center">
                    <div className="flex flex-col items-start text-center">
                        <label className="text-lg font-semibold text-center">Nom complet</label>
                        <p className="text-lg text-center">
                            {currentUser ? currentUser.fullName : "Chargement..."}
                        </p>
                        <label className="text-lg font-semibold text-center mt-4">Nombre de victoires</label>
                        <br></br>
                        <p className="text-lg text-center">
                            {wins !== null ? wins : "Vous n'avez pas encore gagné de partie."}
                        </p>
                    </div>
                </div>
            </div>
            <div className="w-full grid grid-cols-12 gap-4"></div>
        </>
    );
}

export default ProfilePage;
