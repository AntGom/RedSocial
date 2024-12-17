import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteProfileModal from "./DeleteButton";
import FollowButton from "./FollowButton";
import BanButton from "./BanButton";
import EditProfileButton from "./EditProfileButton";
import ToastManager from "./ToastManager";
import { TrashIcon } from "@heroicons/react/24/solid";

const ProfileActions = ({ user, auth, iFollow, setIFollow, token }) => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });
  const [showToast, setShowToast] = useState(false);

  const showToastMessage = (message, type) => {
    setToast({ message, type });
    setShowToast(true);
  };

  const handleDeleteSuccess = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/social/logout");
    showToastMessage("Perfil eliminado correctamente.", "success");
  };

  return (
    <section className=" mb-3 mr-4 md:mr-8">
      {user._id === auth._id ? (
        <article className="flex  flex-col gap-8 md:flex-row">
          <div>
            <EditProfileButton />
          </div>

          <button onClick={() => setShowDeleteModal(true)}>
            <TrashIcon className="w-8 h-8 text-red-600" />
          </button>
          {showDeleteModal && (
            <DeleteProfileModal
              authId={auth._id}
              token={token}
              onDeleteSuccess={handleDeleteSuccess}
              onCancel={() => setShowDeleteModal(false)}
            />
          )}
        </article>
      ) : (
        <>
          <FollowButton
            userId={user._id}
            iFollow={iFollow}
            setIFollow={setIFollow}
            token={token}
            showToastMessage={showToastMessage}
          />
          {auth.role === "admin" && (
            <BanButton
              user={user}
              token={token}
              showToastMessage={showToastMessage}
            />
          )}
        </>
      )}
      <ToastManager
        showToast={showToast}
        toast={toast}
        onClose={() => setShowToast(false)}
      />
    </section>
  );
};

ProfileActions.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    isBanned: PropTypes.bool,
  }).isRequired,
  auth: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  }).isRequired,
  iFollow: PropTypes.bool,
  setIFollow: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
};

export default ProfileActions;
