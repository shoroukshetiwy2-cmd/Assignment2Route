const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const usersFile = path.join(__dirname, "users.json");

function readUsers() {
    const data = fs.readFileSync(usersFile, "utf8");

    if (!data.trim()) {
        return [];
    }

    return JSON.parse(data);
}

function writeUsers(users) {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, {
        "Content-Type": "application/json"
    });

    res.end(JSON.stringify(data));
}

function getRequestBody(req) {
    return new Promise((resolve, reject) => {
        let body = "";

        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (error) {
                reject(error);
            }
        });
    });
}
const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    try {

        // 1. POST /user
        if (req.method === "POST" && pathname === "/user") {
            const body = await getRequestBody(req);
            const users = readUsers();

            const emailExists = users.some(
                (user) => user.email === body.email
            );

            if (emailExists) {
                return sendResponse(res, 400, {
                    message: "Email already exists."
                });
            }

            const newUser = {
                id: users.length > 0
                    ? Math.max(...users.map((user) => user.id)) + 1
                    : 1,
                name: body.name,
                age: body.age,
                email: body.email
            };

            users.push(newUser);
            writeUsers(users);

            return sendResponse(res, 201, {
                message: "User added successfully."
            });
        }


        // 2. PATCH /user/:id
        if (req.method === "PATCH" && pathname.startsWith("/user/")) {
            const id = Number(pathname.split("/")[2]);
            const body = await getRequestBody(req);
            const users = readUsers();

            const user = users.find((user) => user.id === id);

            if (!user) {
                return sendResponse(res, 404, {
                    message: "User ID not found."
                });
            }

            if (body.name !== undefined) {
                user.name = body.name;
            }

            if (body.age !== undefined) {
                user.age = body.age;
            }

            if (body.email !== undefined) {
                user.email = body.email;
            }

            writeUsers(users);

            return sendResponse(res, 200, {
                message: "User updated successfully."
            });
        }


        // 3. DELETE /user/:id
        if (req.method === "DELETE" && pathname.startsWith("/user/")) {
            const id = Number(pathname.split("/")[2]);
            const users = readUsers();

            const userIndex = users.findIndex(
                (user) => user.id === id
            );

            if (userIndex === -1) {
                return sendResponse(res, 404, {
                    message: "User ID not found."
                });
            }

            users.splice(userIndex, 1);
            writeUsers(users);

            return sendResponse(res, 200, {
                message: "User deleted successfully."
            });
        }


        // 4. GET /user
        if (req.method === "GET" && pathname === "/user") {
            const users = readUsers();

            return sendResponse(res, 200, users);
        }


        // 5. GET /user/:id
        if (req.method === "GET" && pathname.startsWith("/user/")) {
            const id = Number(pathname.split("/")[2]);
            const users = readUsers();

            const user = users.find(
                (user) => user.id === id
            );

            if (!user) {
                return sendResponse(res, 404, {
                    message: "User ID not found."
                });
            }

            return sendResponse(res, 200, user);
        }


        return sendResponse(res, 404, {
            message: "Route not found."
        });

    } catch (error) {
        return sendResponse(res, 500, {
            message: "Internal server error."
        });
    }
});


server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});