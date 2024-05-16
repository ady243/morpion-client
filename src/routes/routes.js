
import LoginPage from "../pages/LoginPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import HomePage from "../pages/HomePage.jsx";
import EmailWaitPage from "../pages/EmailWaitPage.jsx";
import {ProfilePage} from "../pages/ProfilePage.jsx";

export const routes = [

    {
        path: "/login",
        component: LoginPage,
        exact: true,
    },

    {
        path: "/register",
        component: RegisterPage,
        exact: true,
    },

    {
        path: "/",
        component: HomePage,
        exact: true,
    },

    {
        path: "/profile",
        component: ProfilePage,
        exact: true,
    },
    {
        path: "/email-wait",
        component: EmailWaitPage,

        exact: true,
    },

];

export default routes;