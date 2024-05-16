
export const apiAuhentication = "https://morpion-soket-back.vercel.app/api"


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
}


