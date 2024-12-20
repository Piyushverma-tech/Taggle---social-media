import {  useState, useEffect ,  useContext, createContext } from "react";
import io from "socket.io-client";
import { UserData } from "./userContext";


const EndPoint = "https://taggle-social-media.onrender.com"; 

const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const {user} = UserData();
    const [onlineUsers, setOnlineUsers] = useState([]);


    useEffect(() => {
        const socket = io(EndPoint, {
            query: {
                userId: user?._id,
                
            }
        });

        setSocket(socket);

        socket.on("getOnlineUser", (users) => {
            setOnlineUsers(users);
        })

        return () => socket && socket.close();
    }, [user?._id] );




    return <SocketContext.Provider value={{socket, onlineUsers}}>{children}</SocketContext.Provider>
};

export const SocketData = () => useContext(SocketContext);