const app=require('express')()
const server=require('http').createServer(app)
const Io=require('socket.io')(server,{
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  })
const {findGame}=require('./server-sockets/game')


// app.use(function (req, res, next) {

//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Expose-Headers', '*');

//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//     next();
// });



// const cors=require('cors')
// app.use(cors())


// app.use('/home',homeRouter)


Io.queue=[]

findGame(Io)





server.listen(1993,(err)=>{
    if(err)console.error(err)
    console.log(`app is listen on http://localhost:1993 http://192.168.1.1`)
})
