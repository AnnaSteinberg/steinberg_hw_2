import {createServer, IncomingMessage} from "node:http";
import {debuglog} from "node:util";
import {addUser, getAllUsers, updateUser, User} from "./model/users.ts";


const myServer =
    createServer(async (req, res) => {
        const {url, method} = req;


        function parseBody(req: InstanceType<typeof IncomingMessage>) {
            return new Promise((resolve, reject) => {
                let body = "";
                req.on('data', (chunk) => {
                    body += chunk.toString();
                })
                req.on('end', () => {
                    try {
                        resolve(JSON.parse(body))
                    } catch (e) {
                        reject(new Error('Invalid JSON'));
                    }
                })
            })
        }

        switch (url! + method) {
            case"/api/users" + "POST": {
                const body = await parseBody(req)
                console.log(body)
                if (body) {
                    addUser(body as User)
                    res.writeHead(201, {'Content-Type': 'text/plain'});
                    res.end("User was added successfully!");
                } else {
                    res.writeHead(409, {'Content-Type': 'text/plain'});
                    res.end("User already exists!");
                }
                break;
            }
            case "/api/users" + "GET": {
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify((getAllUsers())));
                break;
            }
            case "/api/user_update" + "POST": {
                const body = await parseBody(req)
                console.log(body)
                if (body) {
                    updateUser(body as User)
                    res.writeHead(201, {'Content-Type': 'text/plain'});
                    res.end("User was updated successfully!");
                }else {
                    res.writeHead(409, {'Content-Type': 'text/plain'});
                    res.end("Users data don't update!");
                }
                break
            }
            default:
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.end("Not Found");
                break;
        }
    })

myServer.listen(3005,()=> console.log(`Server started on port http://localhost:3005!`));