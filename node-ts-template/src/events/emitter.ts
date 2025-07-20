import {EventEmitter} from "node:events";

export  const emitter = new EventEmitter()

emitter.on('user_added', () => {
    console.log("user added!")
})

emitter.on('user_removed', ()=>{
    console.log("user removed!")
})