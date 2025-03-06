db.createUser({
    user: "root",
    pwd: process.env.DB_PASSWORD,
    roles: [{ role: "root", db: "admin" }]
});

db.createUser({
    user: process.env.DB_USER,
    pwd: process.env.DB_PASSWORD,
    roles: [{ role: "root", db: "admin" }]
});