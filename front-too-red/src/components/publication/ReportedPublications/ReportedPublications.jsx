import { useEffect, useState } from "react";
import ReportedPublicationCard from "./ReportedPubliactionCard";
import DeletePublication from "../DeletePublication";
import RevertReport from "./RevertReport";
import { Global } from "../../../helpers/Global";

const ReportedPublications = () => {
  const [reportedPublications, setReportedPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRevertModal, setShowRevertModal] = useState(false);
  const [selectedPublicationId, setSelectedPublicationId] = useState(null);
  const [selectedReportId, setSelectedReportId] = useState(null);

  useEffect(() => {
    const fetchReportedPublications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${Global.url}publication/reported-publications`, {
          headers: { Authorization: token },
        });
        if (!response.ok) throw new Error("Error al obtener las publicaciones");
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
    setReportedPublications((prev) => prev.filter((pub) => pub._id !== selectedPublicationId));
    setShowDeleteModal(false);
  };

  const handleRevertSuccess = () => {
    setReportedPublications((prev) =>
      prev.map((pub) =>
        pub._id === selectedPublicationId
          ? { ...pub, reports: pub.reports.filter((rep) => rep._id !== selectedReportId) }
          : pub
      ).filter((pub) => pub.reports.length > 0)
    );
    setShowRevertModal(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <section className="mb-4">
      <h1 className="text-2xl font-semibold mb-6">Publicaciones Reportadas</h1>
      {reportedPublications.length === 0 ? (
        <p>No hay publicaciones reportadas.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportedPublications.map((pub) => (
            <ReportedPublicationCard
              key={pub._id}
              publication={pub}
              onRevertClick={(publicationId, reportId) => {
                setSelectedPublicationId(publicationId);
                setSelectedReportId(reportId);
                setShowRevertModal(true);
              }}
              onDeleteClick={(publicationId) => {
                setSelectedPublicationId(publicationId);
                setShowDeleteModal(true);
              }}
            />
          ))}
        </div>
      )}
      {showDeleteModal && (
        <DeletePublication
          publicationId={selectedPublicationId}
          onDeleteSuccess={handleDeleteSuccess}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
      {showRevertModal && (
        <RevertReport
          publicationId={selectedPublicationId}
          reportId={selectedReportId}
          onRevertSuccess={handleRevertSuccess}
          onCancel={() => setShowRevertModal(false)}
        />
      )}
    </section>
  );
};

export default ReportedPublications;
