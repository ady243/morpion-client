import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import UserChat from "../component/chat/UserChat";
import { AuthContext } from "../context/AuthContext";
import PotentialChats from "../component/chat/PotentialChats";
import ChatBox from "../component/chat/ChatBox";

function Chat() {
    const { user } = useContext(AuthContext);
    const { userChat, isUserChatLoading, updateCurrentChat, currentChat } = useContext(ChatContext);

    if (!userChat) {
        return null; 
    }
    return (
        <>
          <div className="flex flex-col items-center mt-24 bg-gray-200 p-4 rounded-lg shadow-lg">
            <PotentialChats />
            <div className="mt-24">
              {userChat?.length < 1 ? null : (
                <div className="flex flex-col items-center">
                    {isUserChatLoading && <p>Loading...</p>}
                    {userChat?.map((chat,index) => {
                        return (
                            <div key={index} onClick={() => {
                                updateCurrentChat(chat);
                            }} className="mt-4 bg-white p-4 rounded-lg shadow-md w-full">
                                <UserChat chat={chat} user={user} />
                            </div>
                        ); 
                    })} 
                    <div className="mt-24">
                      <ChatBox/>
                    </div>
                </div>
              )} 
            </div>
          </div>
        </>
    );
}

export default Chat;