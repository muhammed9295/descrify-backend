import {Router} from "express";;
import {verifyJWT} from "../middlewares/auth.middlewares.js";
import {generateTitleAndDescription, getUserConversation} from "../controllers/conversation.controllers.js"

const router = Router();

router.route("/generate-response").get(verifyJWT, generateTitleAndDescription);
router.route("/get-user-conversation").get(verifyJWT, getUserConversation);

export default router;