// Creates JWT, sets it as an httpOnly cookie, and sends the user response
export const sendToken = (user, statusCode, res, message = "Success") => {
  const token = user.getSignedToken();

  const options = {
    expires: new Date(
      Date.now() +
        (Number(process.env.COOKIE_EXPIRES_DAYS) || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    message,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  });
};
