import { useContext } from "react";
// import {Textarea} from "@nextui-org/react";
import NavBar from "../component/NavBar.jsx";
import Game from "../component/Geme.jsx";
import { AuthContext } from "../context/AuthContext.jsx";

export default function Home() {

const { currentUser } = useContext(AuthContext);


    const textAreaStyle = {
        background: 'blur(8px)',
    }


    return (
        <>
            <NavBar />
            <div>
            {currentUser ? <h1>Bonjour, {currentUser.fullName}</h1> : <h1>Veuillez vous connecter</h1>}
            </div>
            <div className="flex items-center justify-center h-screen mr-60">

                <Game/>
            </div>
            {/* <div className="flex items-center justify-center h-screen -mt-96">
                <Textarea
                    labelPlacement="outside"
                    placeholder="Tapez votre message ici ..."
                    className="col-span-12 md:col-span-6 mb-6 md:mb-0 rounded-tl-xl w-5/12 h-1/2 mt-32"
                    style={textAreaStyle}
                />
            </div> */}
        </>
    );
}