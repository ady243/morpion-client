import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import UserChat from "../component/chat/UserChat";
import { AuthContext } from "../context/AuthContext";
import PotentialChats from "../component/chat/PotentialChats";

function Chat() {
    const { user } = useContext(AuthContext);
    const { userChat, isUserChatLoading } = useContext(ChatContext);

    if (!userChat) {
        return null; 
    }

    return (
        <div>
            <PotentialChats />
           {userChat?.length < 1 ? null : (
            <div>
                {isUserChatLoading && <p>Loading...</p>}
                {userChat?.map((chat,index) => {
                    return (
                       <div key={index}>
                        <UserChat chat={chat} user={user} />
                       </div>
                    ); 
                })}
            </div>
            )}
        </div>
    );
}

export default Chat; 