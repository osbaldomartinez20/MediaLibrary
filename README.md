# MediaLibrary

## Purpose
This web application was written to serve as a library directory system, where users can look up a work and get information about said work such as the author, a summary, details of publication, where to buy it or see it officially, etc. The user is able to look up works through keywords, tags, types, and origin of the work. The library directory gets entries from the users, so to make sure all submissions are appropriate there is a moderator system to approive each of the entries submitted.

# Build/Run Instructions

1. Get a server to host the application. (I am assuming a lunix server is being used)
2. Git pull this repository into a folder in the server.
3. Make sure that your server has node and npm installed, if not install them. 
4. Make sure that mysql is installed, if not install it. Then configure a new mysql server.
5. Navigate to the application folder of this project by using the command line. 
6. Use the command *npm install* to install all the node_modules necessary for the app.
7. Nagivate to the config folder in application/ and update the db.js and db2.js withe information of your mysql server.
8. Navigate to the database_creation_scripts folder in application/config and update create_db.js and create_tables.js with your mysql server information, and don't forget to update the adminName and adminName fields of adminCredentialCreate.js to use for admin login. Then use node to first run create_db.js, then create_tables.js and finally run the other files in the folder in any order.
9. Nagivate back to application/ use npm install pm2 -g to install a module to run the server in background.
10. If can run the app in http or https. Use // in the server.js file to make into coments the information about the server you are not using. If you are using https make sure to include your .key and .crt files in the sslcert folder and update the names in the server.js file.
11. To make sure your app uses the correct port use the command *sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 300011* for http and the command *sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 443 -j REDIRECT --to-port 8080* for https.
12. To start running the app, go to application/ and  use the command *sudo pm2 start server.js*. To make sure everything is fine use *pm2 list* command and make sure server is listed as online.
