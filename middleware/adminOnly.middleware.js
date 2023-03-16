const adminOnly = (req, res, next) => {
    if (req.user?.isAdmin) return next();
    res.status(403).json({
        message: "You are not authorized to perform this action",
    });
};

module.exports = adminOnly;
