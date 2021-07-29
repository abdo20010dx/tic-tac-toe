const app=require('express')()
const server=require('http').createServer(app)
const Io=require('socket.io')(server)
const {findGame}=require('./server-sockets/game')

const homeRouter=require('./routes/home.route')


// app.use('/home',homeRouter)


Io.queue=[]

findGame(Io)

Io.on('connection',socket=>{
    room.ji
})




server.listen(1993,(err)=>{
    if(err)console.error(err)
    console.log(`app is listen on http://localhost:1993 http://192.168.1.1`)
})
