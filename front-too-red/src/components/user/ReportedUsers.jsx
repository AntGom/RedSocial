import { useEffect, useState } from "react";
import { Global } from "../../helpers/Global";

const ReportedUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //Filtros
  const [reportStatus, setReportStatus] = useState("");

  useEffect(() => {
    //Usuarios con publicaciones reportadas
    const fetchUsersWithReports = async () => {
      const token = localStorage.getItem("token");

      let url = `${Global.url}publication/reported-users?`;

      if (reportStatus) {
        url += `reportStatus=${reportStatus}&`;
      }

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token,
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener los datos");
        }

        const data = await response.json();
        setUsers(data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsersWithReports();
  }, [reportStatus]); //Cargar si filtros cambian

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-xl font-semibold">Cargando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-8 text-red-500">
        <div className="text-xl font-semibold">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto -mt-8 px-4 py-8">
      <h1 className="text-3xl font-bold text-start mb-4">Usuarios con Publicaciones Reportadas</h1>

      {/* Filtros */}
      <div className="flex justify-between mb-4">
        <select
          value={reportStatus}
          onChange={(e) => setReportStatus(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="">Estado del Reporte</option>
          <option value="active">Activo</option>
          <option value="reverted">Revisado</option>
        </select>
      </div>

      {users.length === 0 ? (
        <p className="text-center text-xl">No hay usuarios con publicaciones reportadas</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border-2 border-red-600">
          <table className="min-w-full bg-white shadow-md">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Nick</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Publicaciones Reportadas</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Número de Reportes</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.userId} className="border-t">
                  <td className="px-4 py-2 text-sm text-gray-800">{user.nick}</td>
                  <td className="px-4 py-2 text-sm text-gray-800">{user.email}</td>
                  <td className="px-4 py-2 text-sm">
                    <ul className="list-disc pl-5 space-y-1">
                      {user.reportedPublications.map((pub, index) => (
                        <li key={index} className="text-gray-600">
                          <strong>{pub.title}</strong>
                          <div className="text-xs text-gray-500">
                            <p className="">Fecha: {new Date(pub.createdAt).toLocaleDateString()}</p> 
                          </div>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-2 text-sm text-center text-gray-800">
                    {user.reportedCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReportedUsers;
