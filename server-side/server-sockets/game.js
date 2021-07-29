const mongoose  = require('mongoose')



exports.findGame=(IO)=>{
    IO.on('connection',(socket)=>{
        

        if(IO.queue == ""){

        // player create new game
        socket.on('createGame',userInfo=>{
            IO.queue = userInfo
            socket.join(userInfo.id)
        })


        }else if(IO.queue != ""){
            socket.join(IO.queue.id)
            
        }


        
    })
}