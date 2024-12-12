import { useEffect, useState } from "react";
import { Global } from "../../helpers/Global";
import { TrashIcon } from "@heroicons/react/24/solid";
import DeletePublication from "./DeletePublication";

const ReportedPublications = () => {
  const [reportedPublications, setReportedPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPublicationId, setSelectedPublicationId] = useState(null);

  useEffect(() => {
    const fetchReportedPublications = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${Global.url}publication/reported-publications`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener las publicaciones");
        }

        const { data } = await response.json();
        setReportedPublications(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReportedPublications();
  }, []);

  const handleDeleteSuccess = () => {
    setReportedPublications((prev) =>
      prev.filter((pub) => pub._id !== selectedPublicationId)
    );
    setShowDeleteModal(false);
  };

  const handleCancel = () => {
    setShowDeleteModal(false);
  };

  const handleDeleteClick = (publicationId) => {
    setSelectedPublicationId(publicationId);
    setShowDeleteModal(true);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <section className="flex flex-col mb-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Publicaciones Reportadas
      </h1>
      {reportedPublications.length === 0 ? (
        <p>No hay publicaciones reportadas.</p>
      ) : (
        <article className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportedPublications.map((pub) => (
            <div
              key={pub._id}
              className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:bg-gray-100 transition-all duration-300 flex flex-col h-full"
            >
              {/* Contenido principal */}
              <div className="p-3 flex-1">
                {/* Información del usuario */}
                <div className="flex justify-center space-x-4">
                  <div className="flex flex-col justify-center">
                    <h2 className="font-semibold text-red-700">
                      Datos de la publicación:
                    </h2>
                    <p className="text-sm text-gray-900 italic">
                      {pub.user.email}
                    </p>
                    <p className="text-sm text-gray-900">
                      <strong>Nick: </strong>@{pub.user.nick}
                    </p>
                    <p className="text-sm text-gray-900">
                      <strong>Fecha:</strong>{" "}
                      {new Date(pub.createdAt).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-900 line-2">
                      <strong>Texto:</strong> {pub.text || "Sin texto"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Archivos adjuntos */}
              {pub.file && (
                <div className="p-3 -mt-4">
                  <h2 className="font-semibold"> Archivo adjunto:</h2>
                  <img
                    src={`${Global.url}publication/media/${pub.file}`}
                    alt="Archivo adjunto"
                    className="h-32 object-cover mt-2 rounded-lg"
                  />
                </div>
              )}

              {/* Reportes */}
              <div className="p-4 -mt-4">
                <h4 className="font-semibold text-red-700">Reportes:</h4>
                {pub.reports.length === 0 ? (
                  <p>No hay reportes para esta publicación.</p>
                ) : (
                  <ul>
                    {pub.reports.map((report) => (
                      <li key={report._id} className="mb-4">
                        <p className="text-sm text-gray-900">
                          <strong>Reportado por:</strong> {report.user.nick} (
                          {report.user.email})
                        </p>
                        <p className="text-sm text-gray-900">
                          <strong>Motivo:</strong> {report.reason}
                        </p>
                        <p className="text-sm text-gray-900">
                          <strong>Fecha:</strong>{" "}
                          {new Date(report.createdAt).toLocaleString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Botón para eliminar publicación */}
              <div className="p-3">
                <button
                  onClick={() => handleDeleteClick(pub._id)}
                  className="text-red-600 hover:text-red-800 hover:scale-125 transition-all duration-300"
                >
                  <TrashIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
          ))}
        </article>
      )}

      {/* Modal de eliminación */}
      {showDeleteModal && (
        <DeletePublication
          publicationId={selectedPublicationId}
          onDeleteSuccess={handleDeleteSuccess}
          onCancel={handleCancel}
        />
      )}
    </section>
  );
};

export default ReportedPublications;
