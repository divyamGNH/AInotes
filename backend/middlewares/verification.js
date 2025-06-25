import jwt from "jsonwebtoken";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const verifyRoute = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No token. Not authorized." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.user = decoded;  // Attach user data to request for next handlers
    next();              // Proceed to the actual route
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

export {verifyRoute} ;
