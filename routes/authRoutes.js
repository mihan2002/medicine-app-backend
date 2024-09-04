const express = require("express");
const passport = require("passport");
const {
  googleCallback,
  getProfile,
  logout,
} = require("../controllers/authController");

const router = express.Router();

// Define the authentication route with expanded scopes
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Handle the Google OAuth callback
router.get(
  "/auth/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  googleCallback
);

// Define profile route to access user profile data
router.get("/profile", getProfile);

// Define logout route to handle user logout
router.get("/logout", logout);

module.exports = router;
