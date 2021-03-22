//file containing the code to insert N number of dummy posts to database
const db = require('../config/db2');
const { v4: uuidv4 } = require('uuid');

const NUMBER_OF_DUMMY_POSTS = 150;

const addDummyPosts = (num_posts) => {
    for (let i = 0; i < num_posts; i++) {
        let sql = "INSERT INTO posts (pid, title, cover, image, status, reviewable) VALUES (?,?,?,?,?,?);";
        let postPlaceholder = [uuidv4(), "dummy_" + i, "test_" + i + ".png", "test_" + i + ".png", 1, 1];
        db.query(sql, postPlaceholder, (err, results) => {
            if(err) {
                console.log(err);
            }
            console.log(results);
        });
    }
}

addDummyPosts(NUMBER_OF_DUMMY_POSTS);