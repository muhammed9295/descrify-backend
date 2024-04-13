import {Router} from "express";;
import {verifyJWT} from "../middlewares/auth.middlewares.js";
import {deleteResponse, generateTitleAndDescription, getSingleUserResponse, getUserConversation} from "../controllers/conversation.controllers.js"

const router = Router();

router.route("/generate-response").get(verifyJWT, generateTitleAndDescription);
router.route("/get-user-conversation").get(verifyJWT, getUserConversation);
router.route("/get-single-conversation/:id").get(verifyJWT, getSingleUserResponse);
router.route("/delete-single-conversation/:id").delete(verifyJWT, deleteResponse);

export default router;