/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Global } from "../../helpers/Global";
import PublicationList from "../publication/PublicationList";
import { useParams } from "react-router-dom";

const MyPublications = () => {
  const [publications, setPublications] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const params = useParams();
  const token = localStorage.getItem("token");

  const getMyPublications = async (actualPage = 1) => {
    const response = await fetch(
      Global.url + "publication/user/" + params.userId + "/" + actualPage,
      {
        method: "GET",
        headers: { Authorization: token },
      }
    );
    const data = await response.json();
    if (data.status === "success") {
      setPublications((prev) =>
        actualPage === 1 ? data.publications : [...prev, ...data.publications]
      );
      setMore(data.totalPages > actualPage);
    }
  };

  useEffect(() => {
    setPage(1);
    getMyPublications(1);
  }, [params.userId]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-4">Mis Publicaciones</h1>
      <PublicationList
        publications={publications}
        page={page}
        setPage={setPage}
        more={more}
        setMore={setMore}
        getPublications={getMyPublications}
      />
    </section>
  );
};

export default MyPublications;
