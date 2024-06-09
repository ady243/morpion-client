import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@nextui-org/react";
import { Badge } from "@nextui-org/react";
import { NotificationIcon } from "./NotificationIcon.jsx";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { Link as RouterLink } from 'react-router-dom';

export default function NavBar() {
    const [isInvisible] = useState(false);
    const { logout } = useContext(AuthContext);
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
        <Navbar shouldHideOnScroll>
            <NavbarBrand>
                <p className="font-bold text-inherit" style={StyleLogo}>Morpion<span className="text-red-800">Game</span></p>
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem style={StyleNotification}>
                    <Link color="foreground" href="#">
                        <Badge color="danger" content={notification} isInvisible={isInvisible} shape="circle">
                            <NotificationIcon className="fill-current" size={30} />
                        </Badge>
                    </Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
            <NavbarItem>
                <RouterLink to="/profile">
                    <Button auto>Mon profile</Button>
                </RouterLink>
            </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem>
                    <Button auto onClick={logout}>Déconnexion</Button>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}
