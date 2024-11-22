/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAuth from "../../../hooks/UseAuth";
import { Global } from "../../../helpers/Global";
import PublicationList from "../../publication/PublicationList";
import HeaderProfile from "./HeaderProfile";

const Profile = () => {
  const { auth } = useAuth();
  const [user, setUser] = useState({});
  const [iFollow, setIFollow] = useState(false);
  const [counters, setCounters] = useState({});
  const [publications, setPublications] = useState([]);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(true);
  const params = useParams();
  const token = localStorage.getItem("token");

  const getCounters = async () => {
    const response = await fetch(Global.url + "user/counters/" + params.userId, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: token },
    });
    const data = await response.json();
    if (data.following) setCounters(data);
  };

  const getDataUser = async () => {
    const response = await fetch(Global.url + "user/profile/" + params.userId, {
      headers: { Authorization: token },
    });
    const data = await response.json();
    setUser(data.user);
    setIFollow(data.following && data.following._id);
  };

  const getPublications = async (actualPage = 1, newProfile = false) => {
    const response = await fetch(
      Global.url + "publication/user/" + params.userId + "/" + actualPage,
      {
        method: "GET",
        headers: { Authorization: token },
      }
    );
    const data = await response.json();
    if (data.status === "success") {
      const newPublications = newProfile
        ? data.publications
        : [...publications, ...data.publications];
      setPublications(newPublications);
      setMore(data.totalPages > actualPage);
    }
  };

  useEffect(() => {
    setPage(1);
    getDataUser();
    getCounters();
    getPublications(1, true);
  }, [params.userId]);

  if (!user.name) return <div>Cargando...</div>;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <HeaderProfile
        user={user}
        auth={auth}
        counters={counters}
        iFollow={iFollow}
        setIFollow={setIFollow}
        token={token}
      />
      <PublicationList
        publications={publications}
        page={page}
        setPage={setPage}
        more={more}
        setMore={setMore}
        getPublications={getPublications}
      />
    </section>
  );
};

export default Profile;
