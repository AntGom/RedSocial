//import Navbar from "./Navbar";
import { Navigate, Outlet } from "react-router-dom";
import NewSidebar from "./NewSidebar";
import useAuth from "../../../hooks/UseAuth";

const PrivateLayout = () => {
  const { auth, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 ">
      {/* <Navbar /> */}
      <div className="flex">
         <NewSidebar /> 

        <main className="flex-1 ml-64 p-4 ">
          {auth._id ? <Outlet /> : <Navigate to="/login" />}
        </main>
      </div>
    </div>
  );
};

export default PrivateLayout;
