import register from "./register.js";
import confirmRegistration from "./confirmRegistration.js";
import login from "./login.js";
import requestPasswordReset from "./requestPasswordReset.js";
import resetPassword from "./resetPassword.js";
import profile from "./profile.js";
import list from "./list.js";
import update from "./update.js";
import upload from "./upload.js";
import avatar from "./avatar.js";

export const userController = { 
    register, 
    confirmRegistration,
    list, 
    login, 
    requestPasswordReset,
    resetPassword,
    profile, 
    update, 
    upload,
    avatar
};
