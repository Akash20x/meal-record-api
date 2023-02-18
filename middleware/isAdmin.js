    
  const isAdmin = async (req, res, next) => {
    try {
      const role = req.user.role;
      if (role!=='admin') {
        return res.status(401).json({
          error: "Not Admin",
        });
      }
      next();
    } catch (error) {
      console.log(error);
    }
  };
  
  module.exports = {
    isAdmin  
  };