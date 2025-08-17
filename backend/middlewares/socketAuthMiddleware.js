import jwt from "jsonwebtoken";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const checkSocketAuth = (socket, next) => {
  try {
    const cookieHeader = socket.handshake.header.cookie;
    if (!cookieHeader) return next(new Error("No cookie found"));

    const cookie = Object.fromEntries(
      cookieHeader.split(";").map((c) => {
        c.trim().split("=");
      })
    );

    const token = cookie["token"];
    if (!token) return next(new Error("No token found"));

    const decoded = jwt.verify(token, JWT_SECRET_KEY);

    socket.user = decoded;

    next();
  } catch (error) {
    console.error("Socket auth error:", err.message);
    next(new Error("Authentication failed"));
  }
};

export default checkSocketAuth;
