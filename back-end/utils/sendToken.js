const jwt = require("jsonwebtoken");

// Create and send token in a cookie
const sendToken = (user, statusCode, res) => {
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      RoleId: user.RoleId, // Include RoleId
    },
    process.env.JWT_SECRET,
    { expiresIn: "2h" } // Set token to expire in 2 hours
  );
  console.log("Generated Token Payload:", jwt.decode(token));

  // Set cookie expiration time in milliseconds
  const cookieExpiresInMs =
    process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000;

  // Cookie options
  const options = {
    expires: new Date(Date.now() + cookieExpiresInMs), // Proper expiration format
    httpOnly: true, // Ensures cookie is only accessible via HTTP
  };

  // Send token in cookie and as JSON
  res.status(statusCode).cookie("token", token, options).json({
    status: "success",
    statusCode,
    message: "User successfully logged in",
    token,
  });
};

module.exports = sendToken;
