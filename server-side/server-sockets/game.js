


exports.findGame=(IO)=>{
    IO.on('connection',(socket)=>{
        

        if(IO.queue == ""){

        // player create new game
        socket.on('createGame',userInfo=>{



            IO.queue = userInfo
            console.log(IO.queue)
            socket.join(IO.queue.id)
            IO.to(IO.queue.id).emit('gameCreated')
        })


        }else if(IO.queue != ""){
            //player two join game
            socket.on('joinGame',joinerInfo=>{

            socket.join(IO.queue.id)
            IO.to(IO.queue.id).emit('startGame',IO.queue,joinerInfo)

            IO.queue = ""
            })
        }


        
    })
}