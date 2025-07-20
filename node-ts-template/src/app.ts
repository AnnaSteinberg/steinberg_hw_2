import {createServer, IncomingMessage} from "node:http";
import {addUser, getAllUsers, getUser, removeUser, updateUser, User} from "./model/users.ts";
import {emitter} from "./events/emitter.ts";
import {myLogger} from "./events/logger.ts";


const myServer =
    createServer(async (req, res) => {
        myLogger.log("We got the request");
        const {url, method} = req;

        const fURL = new URL(url!,`http://localhost:3333`);


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

        switch (fURL.pathname + method) {
            case"/api/users" + "POST": {
                const body = await parseBody(req) as User;
                if (body && (body as User).id) {
                    addUser(body as User)
                    myLogger.save(`User with id ${body.id} was successfully added!`);

                    res.writeHead(201, {'Content-Type': 'text/plain'});
                    res.end(`User ${body.id} was added successfully!`);
                    // emitter.emit('user_added')
                    myLogger.log('Response for add user with id ' + body.id + ' was send successfully!');
                } else {
                    res.writeHead(409, {'Content-Type': 'text/plain'});
                    res.end("User already exists!");
                    myLogger.save(`User with id ${body.id} already exists!`);
                    myLogger.log(`User with id ${body.id} already exists!`);
                }
                break;
            }
            case "/api/users" + "GET": {
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify((getAllUsers())));
                break;
            }
            case "/api/user_update" + "PUT": {
                const body = await parseBody(req) as User
                if (body && (body as User).id) {
                    updateUser(body as User)
                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.end(`User ${body.id} was updated successfully!`);
                }else {
                    res.writeHead(409, {'Content-Type': 'text/plain'});
                    res.end("Users data don't update!");
                }
                break
            }
            case "/api/user_delete" + "DELETE": {
                const id = Number(fURL.searchParams.get("userId"))
                const deleted = removeUser(id);
                if (deleted) {
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify(deleted));
                    // emitter.emit('user_removed');
                    myLogger.save(`User with id ${id} was deleted!`);
                }else {
                    res.writeHead(404, {'Content-Type': 'text/plain'});
                    res.end("User not found!");
                }
                break;
            }
            case "/api/user" + "GET":{//
                const id = Number(fURL.searchParams.get("userId"));
                const user = getUser(id);
                if (user){
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify(user));
                }else {
                    res.writeHead(409, {'Content-Type': 'text/plain'});
                    res.end("User not found!");}
                break;
            }
            case '/api/logger' + 'GET':{
                const allLogs = myLogger.getLogArray()
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(allLogs));
                break;
            }
            default:
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.end("Not Found");
                break;
        }
    })

myServer.listen(3333,()=> console.log(`Server started on port http://localhost:3333!`));