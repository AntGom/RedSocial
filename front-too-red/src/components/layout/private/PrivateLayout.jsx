import { Navigate, Outlet } from "react-router-dom";
import NewSidebar from "./NewSidebar";
import {useAuth} from "../../../hooks/UseAuth";

const PrivateLayout = () => {
  const { auth, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        Cargando...
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500">
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white ">
      <div className="w-1/6 fixed h-full z-10 bg-white border-r-2 border-r-red-600 ">
        <NewSidebar /> 
      </div>
       
      <main className="flex-1 ml-[20%] md:ml-[16.67%] px-32 pt-8">
        {auth._id ? <Outlet /> : <Navigate to="/login" />}
      </main>
    </div>
  );
};

export default PrivateLayout;
