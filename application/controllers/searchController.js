const db = require('../config/db');

// Handle search redirection on POST
exports.post = (req, res, next) => {
    let keyword = req.body.keyword;
    let sql = "SELECT * FROM posts";
    let placeholders = [];
    let dataPassed = [];
    let criteria = {};

    if (keyword != "") {
        sql += " WHERE (title LIKE ? OR description LIKE ?)";
        placeholders = ['%' + keyword + '%', '%' + keyword + '%'];
        criteria.keyword = keyword;
    }

    db.query(sql,placeholders, (err, result) => {
        if (err) throw err;

        let totalResults = result.length;

        for(let i = 0; i < totalResults; i++) {
            dataPassed.push(result[i]);
        }

        res.render('results', {
            post: dataPassed,
            total: totalResults,
            searchCriteria: criteria
        });
    });
}