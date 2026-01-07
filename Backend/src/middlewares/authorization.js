const adminOnly = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      message: "Access denied"
    });
  }
  next();
};



const cutomeronly = (req, res, next) => {
  if (req.user.role !== "CUSTOMER") {
    return res.status(403).json({
      message: "Access denied"
    });
  }
  next();
};
export  {cutomeronly};
export  {adminOnly};
