const userInsert = 'INSERT INTO USER (name, email, password, role) VALUES(?,?,?,?)';
const userQuery = 'SELECT * FROM USER WHERE email = ?';
const userQueryLogin = 'SELECT id, name, email,role FROM USER WHERE email = ? and password = ?';
const userQueryUpdate = 'UPDATE USER SET name = ?, password = ?, role = ? WHERE id = ?';

module.exports = {
    userInsert,
    userQuery,
    userQueryLogin,
    userQueryUpdate
}