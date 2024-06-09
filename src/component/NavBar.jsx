import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@nextui-org/react";
import { Badge } from "@nextui-org/react";
import { NotificationIcon } from "./NotificationIcon.jsx";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { Link as RouterLink } from 'react-router-dom';

export default function NavBar() {
    const [isInvisible] = useState(false);
    const { logout, token } = useContext(AuthContext);
    const [notification, setNotification] = useState(0);

    const StyleNotification = {
        position: "absolute",
        right: "300px",
        zIndex: "1",
    }

    const StyleLogo = {
        fontFamily: "fantasy",
        fontWeight: "bold",
    }

    const updateNotification = () => {
        setNotification(notification + 1);
    };
    const handleNewMessage = () => {
        updateNotification();
    };

    return (
        <nav className="font-sans flex flex-col text-center sm:flex-row sm:text-left sm:justify-between py-4 px-6 bg-white shadow sm:items-baseline w-full">
            <div className="mb-2 sm:mb-0">
                <a href="#" className="text-2xl no-underline text-grey-darkest hover:text-blue-dark"></a>
            </div>
            <div>
                <div style={StyleNotification}>
                    <Link color="foreground" href="#">
                        <Badge color="danger" content={notification} isInvisible={isInvisible} shape="circle">
                            <NotificationIcon className="fill-current" size={30} />
                        </Badge>
                    </Link>
                </div>
                {token ? (
                    <>
                        <RouterLink to="/profile" className="text-lg no-underline text-grey-darkest hover:text-blue-dark ml-2">Profile</RouterLink>
                        <Button onClick={logout} className="ml-2">se deconnecter</Button>
                    </>
                ) : (
                    <RouterLink to="/login" className="text-lg no-underline text-grey-darkest hover:text-blue-dark ml-2">se connecter</RouterLink>
                )}
            </div>
        </nav>
    );
}
