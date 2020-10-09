//Contributors: Osbaldo Martinez

module.exports = {
    // Check if user is logged as user
    ensureUserAuthenticated: (req, res, next) => {
        if (req.isAuthenticated() && req.user.id) {
            return next();
        }
        req.flash('error', 'Please log in');
        res.redirect('/moderators/login?redirectUrl=' + req.originalUrl);
    },
    // Check if user is logged as administrator
    ensureAdminAuthenticated: (req, res, next) => {
        if (req.isAuthenticated() && req.user.aid) {
            return next();
        }
        req.flash('error', 'Please log in');
        res.redirect('/masteradmin/login');
    },
    // Check if user is already logged in as user or administrator
    forwardAuthenticated: (req, res, next) => {
        if (!req.isAuthenticated()) {
            return next();
        }
        else {
            if (req.user.id) {
                res.redirect('/moderators/dashboard');
            }
            else if (req.user.aid) {
                res.redirect('/masteradmin/dashboard');
            }
        }
    }
}