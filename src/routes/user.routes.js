import {Router} from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controllers.js";
import {verifyJWT} from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser)

// Secured routes
router.route("/logout").post(verifyJWT, logoutUser);
// Secured routes


export default router;
