const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {

        if (req.originalUrl.startsWith('/api/')) {
            return res.status(401).json({ message: 'No token provided, authorization denied' });
        }
        return res.redirect('/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.clearCookie('token');
        if (req.originalUrl.startsWith('/api/')) {
            return res.status(401).json({ message: 'Token is not valid' });
        }
        return res.redirect('/login');
    }
};

module.exports = protect;
