import { useContext } from "react";
import NavBar from "../component/NavBar.jsx";
import Game from "../component/Geme.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import Chat from "./ChatPage.jsx";
export default function Home() {
    const { currentUser } = useContext(AuthContext);


    const textAreaStyle = {
        background: 'blur(8px)',
    }

    return (
        <>
            <NavBar />
            <div className="text-center">
                {currentUser ? <h1>Bonjour, {currentUser.fullName}</h1> : <h1>Veuillez vous connecter</h1>}
            </div>
            <div className="flex items-center justify-center h-screen mr-60">
                <Chat />
                <Game/>
            </div>
            <div>
       
            </div>
        </>
    );
}