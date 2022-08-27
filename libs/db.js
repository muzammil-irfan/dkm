import mysql from 'mysql2';

// const db = mysql.createConnection({
//     host:process.env.DATABASE_HOST,
//     user:process.env.DATABASE_USER,
//     password:process.env.DATABASE_PASSWORD,
//     database:process.env.DATABASE_NAME
// });
// const database_url = process.env.DATABASE_URL;
const database_url = 'mysql://0i07t5o1eyg1yfseb81f:pscale_pw_M2PYnKTnxL1ddCYFBo7J6abn1HNFiffGRM2Rt2jsIof@us-east.connect.psdb.cloud/nodejs?ssl={"rejectUnauthorized":true}';
const db = mysql.createConnection(database_url);
console.log('Pscale connected....');

export default db;