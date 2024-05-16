
import LoginPage from "../pages/LoginPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import HomePage from "../pages/HomePage.jsx";
import EmailWaitPage from "../pages/EmailWaitPage.jsx";
import {ProfilePage} from "../pages/ProfilePage.jsx";

export const routes = [

    {
        path: "/login",
        component: LoginPage,
    },

    {
        path: "/register",
        component: RegisterPage,
   
    },

    {
        path: "/",
        component: HomePage,
        protected: true,
   
    },

    {
        path: "/profile",
        component: ProfilePage,
        protected: true,
   
    },
    {
        path: "/email-wait",
        component: EmailWaitPage,
    },

];

export default routes;