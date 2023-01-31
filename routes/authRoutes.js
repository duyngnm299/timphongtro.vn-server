const express = require("express");
const authController = require("../controllers/auth");
const middlewareController = require("../middleware/middleware");

const router = express.Router();

router.post("/signin", authController.signInController);
router.post("/signup", authController.signUpController);
router.post("/refresh", authController.requestRefreshToken);
router.post(
  "/logout",
  middlewareController.verifyToken,
  authController.logoutUser
);
router.post(
  "/admin/logout",
  middlewareController.verifyToken,
  authController.logoutAdmin
);
router.post("/send-mail/:id", authController.sendMail);
router.post("/verify/:id", authController.verifyEmail);
router.post("/:id", authController.updatePassword);
router.post("/admin/signup", authController.adminSignUp);
router.post("/admin/signin", authController.adminSignIn);
router.post("/admin/refresh", authController.requestRefreshTokenAdmin);

module.exports = router;
