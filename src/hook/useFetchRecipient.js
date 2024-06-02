import { useEffect, useState } from "react";
import { baseUrl, getRequest } from "../utils/services";

export const useFetchRecipientUser = (chat, user) => {
    const [recipientUser, setRecipientUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); 
    const [error, setError] = useState(null);

    const recipientId = chat?.numbers?.find((id) => id !== user?._id);


    useEffect(() => {
        const getUser = async () => {
           if(!recipientId)  return null;
    
           const response = await getRequest(`${baseUrl}/users/find/${recipientId}`);
          
    
          setIsLoading(false); 
    
          if(response.error) {
            return setError(error);
          }
          
          setRecipientUser(response);

        }

        getUser();

    }, [recipientId]);

    return { recipientUser, isLoading }; 
    
}