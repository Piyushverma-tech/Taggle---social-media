import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LoadingAnimation } from "../components/Loading";

const Search = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

//   const handleSearch = (e) => {
//     setQuery(e.target.value);
//     // Add search functionality here
//   };

  async function  fetchUser(e) {
    setLoading(true);
    setSearch(e.target.value);
       try {
           const {data} = await axios.get("/api/user/all?search="+ search);
           setUsers(data);
           setLoading(false);  
       } catch (error) {
       console.log(error); 
       setLoading(false);  
       }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-200  flex flex-col items-center "> 
    <div className="ml-auto mr-auto w-full max-w-md min-h-screen bg-gradient-to-r from-blue-100 to-purple-200 rounded-xl shadow-lg p-6">
      {/* Search Input */}
      <div className="w-full max-w-md">
        <input
          type="text"
          value={search}
          onChange={fetchUser}
          placeholder="Search user..."
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Search Results */}
      <div className="w-full max-w-md mt-6">
        {/* Results will go here */}
        <p className="text-gray-500 text-center">
          {search ? `Results for "${search}"` : "Start typing to search..."}
        </p>
       {loading ? <LoadingAnimation/> : <>  {users && users.length > 0 ? users.map(e => (
         <Link className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition duration-300" key={e._id} to={`/user/${e._id}`}><img
         src={e.profilePic.url}
         alt={e.name}
         className="w-10 h-10 rounded-full object-cover border-2 border-blue-200"
       />
       <div className="flex-1">
         <p className="text-gray-800 font-medium">{e.name}</p>
       </div></Link>
        )) : ""} </>}
      </div>
      </div>
    </div>
  );
};

export default Search;
