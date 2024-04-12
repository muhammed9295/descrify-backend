import {Router} from "express";;
import {verifyJWT} from "../middlewares/auth.middlewares.js";
import {generateTitleAndDescription, getSingleUserResponse, getUserConversation} from "../controllers/conversation.controllers.js"

const router = Router();

router.route("/generate-response").get(verifyJWT, generateTitleAndDescription);
router.route("/get-user-conversation").get(verifyJWT, getUserConversation);
router.route("/get-single-conversation/:id").get(verifyJWT, getSingleUserResponse);

export default router;