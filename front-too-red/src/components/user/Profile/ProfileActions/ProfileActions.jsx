import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteProfileModal from "./DeleteButton";
import FollowButton from "./FollowButton";
import BanButton from "./BanButton";
import EditProfileButton from "./EditProfileButton";
import ToastManager from "./ToastManager";

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
    <section className="flex flex-col items-center gap-2 mr-8 mb-3">
      {user._id === auth._id ? (
        <>
          <EditProfileButton />
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center justify-center bg-white border-2 border-red-600 text-gray-900 font-semibold px-4 py-2 rounded-lg shadow-md hover:scale-110 duration-300 transition-all w-40 h-10"
          >
            Borrar perfil
          </button>
          {showDeleteModal && (
            <DeleteProfileModal
              authId={auth._id}
              token={token}
              onDeleteSuccess={handleDeleteSuccess}
              onCancel={() => setShowDeleteModal(false)}
            />
          )}
        </>
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
