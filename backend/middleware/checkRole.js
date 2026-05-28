const checkRole = (requiredRole) => {
    return (req, res, next) => {
        // Safe check using lowercase conversion
        if (req.user && req.user.role && req.user.role.toLowerCase() === requiredRole.toLowerCase()) {
            return next();
        }
        
        // If they don't have the right role, send them away with a clear error
        return res.redirect('/login?error=You+do+not+have+permission+to+view+that+page');
    };
};

module.exports = checkRole;
