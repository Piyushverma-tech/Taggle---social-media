import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import toast, { Toaster } from "react-hot-toast";

const UserContext = createContext();

export const UserContextProvider = ({children}) => {
    const [user, setUser] = useState([]);
    const [isAuth, setIsAuth] = useState(false);
    const [loading, setLoading] = useState(true);



    async function registerUser (formdata, navigate, fetchPost){
        setLoading(true);
        try {
            const {data} = await axios.post("/api/auth/register",formdata);    
            toast.success(data.message);
            setIsAuth(true);
            setUser(data.user);
            navigate("/");
            setLoading(false);
        } catch (error) {
            toast.error(error.response.data.message);  
            setLoading(false);
        }
    };

    async function loginUser (email, password, navigate, fetchPost){
        setLoading(true);
        try {
            const {data} = await axios.post("/api/auth/login", {email, password, navigate});    
            toast.success(data.message);
            setIsAuth(true);
            setUser(data.user);
            navigate("/");
            setLoading(false);
            fetchPost();
        } catch (error) {
            toast.error(error.response.data.message);  
            setLoading(false);
        }
    };

    async function fetchUser () {
        try {
           const {data} = await axios.get('/api/user/me');
           setUser(data);
           setIsAuth(true);
           setLoading(false); 
        } catch (error) {
            console.log(error)
            setIsAuth(false);
            setLoading(false);
        }
    }

    async function logOutUser(navigate) {
        try {
            const {data} = await axios.get('/api/auth/logout');
            
            if(data.message){
                toast.success(data.message);
                setUser([]);
                setIsAuth(false);
                navigate("/login");
            }
        } catch (error) {
            toast.error(error.response.data.message);  
        }
        
    };

    async function followUser (id, fetchUser){
        try {
            const {data} = await axios.post("/api/user/follow/"+id);
            toast.success(data.message);
            fetchUser();
        } catch (error) {
            toast.error(error.response.data.message);  
        }
    }

    async function updateProfilePic (id, formdata, setFile, setShowSettingsModal) {
        try {
            const {data} = await axios.put("/api/user/"+id, formdata);
            toast.success(data.message);
            fetchUser();
            setFile(null); 
            setShowSettingsModal(false);
        } catch (error) {
            toast.error(error.response.data.message);  
        }
    }

    async function updateProfileName(id, name, setName, setShowSettingsModal) {
        try {
            const {data} = await axios.put("/api/user/"+id, {name});
            toast.success(data.message);
            fetchUser();
            setName("");
            setShowSettingsModal(false);
        } catch (error) {
            toast.error(error.response.data.message);  
        }
    }

    useEffect(() => {
        fetchUser();
    }, []);


    return ( 
        <UserContext.Provider value={{loginUser, isAuth, setIsAuth, user, setUser, loading, logOutUser, registerUser, followUser, updateProfilePic, updateProfileName, }}>
        {children} 
        <Toaster/>
        </UserContext.Provider>
    );

};

export const UserData = () => useContext(UserContext);