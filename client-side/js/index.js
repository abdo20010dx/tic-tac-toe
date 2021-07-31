let socket = io('http://localhost:1993')


console.log('work')

socket.emit('createGame',{id:'1',name:'abdo'})
socket.on('gameCreated',()=>{console.log('created')})
// var xhttp = new XMLHttpRequest();
// xhttp.onreadystatechange = function() {
//     if (this.readyState == 4 && this.status == 200) {
// console.log(this.response)
//     }
// };
// xhttp.open("GET", "http://localhost:1993", true);
// xhttp.send();