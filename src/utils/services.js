import { m } from "framer-motion";


export const apiAuhentication = "http://localhost:4000/api";
// export const apiAuhentication = "https://morpion-soket-back.vercel.app/api";
export const baseUrl = "http://localhost:4000/api"; 
export const baseUrlSocket = "http://localhost:4000"; 

export const postRequest = async (url, body) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    let data;
    if (response.ok) {
        data = response.status === 204 ? null : await response.json();
    } else {
        data = await response.json();
        throw new Error(data.error.message);
    }

    return data;
};



export const getRequest = async (url) => {
    const response = await fetch(url);

    const data = await response.json();

    if (!response.ok) {
     let message = data?.error?.message || 'Something went wrong';

     if(data?.message){
        message = data.message;
     }
     return {error: true, message}
    }

    return data;
}