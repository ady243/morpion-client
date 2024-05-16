
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@nextui-org/react";
import {Badge} from "@nextui-org/react";
import {NotificationIcon} from "./NotificationIcon.jsx";
import {useState} from "react";


export default function NavBar() {
    const [isInvisible] = useState(false);


    const StyleNotification = {
        position: "absolute",
        right: "300px",
        zIndex: "1",
    }

    const StyleLogo = {
        fontFamily:"fantasy",
        fontWeight: "bold",
    }
    return (
        <Navbar shouldHideOnScroll>
            <NavbarBrand>
                <p className="font-bold text-inherit" style={StyleLogo}>Morpion<span className="text-red-800">Game</span></p>
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-4" justify="center">

                <NavbarItem style={StyleNotification}>
                    <Link color="foreground" href="#">
                        <Badge color="danger" content={5} isInvisible={isInvisible} shape="circle">
                            <NotificationIcon className="fill-current" size={30} />
                        </Badge>
                    </Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem className="hidden lg:flex">
                    <Link href="/login">Se connecter</Link>
                </NavbarItem>
                <NavbarItem>
                    <Button as={Link} color="primary" href="#" variant="flat">
                       Se déconnecter
                    </Button>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}
