function socketConnection ( io ) {
    let users =  [] //CONTIENE LOS SOCKETS DE LOS USUARIOS,
    //ESTOS CONTIENEN EL NICKNAME Y UN OBJETO ROUNDS DONDE CADA INDICE CONTIENE LOS CHOICES DE LOS ROUNDS
    io.on('connection', socket => {
       
        socket.on("new user",function (data, cb){
            try {
                if(data.length < 3)cb({ok:false, msg:"Nickname must be 3 characters atleast"});
                if(data.length > 30)cb({ok:false, msg:"Nickname must be below 20 characters"})
                if( findIndex(data) == -1 ){
                    cb({ok:true})
                    socket.nickname = data;
                    socket.rounds = {}
                    users.push({nickname:socket.nickname, socket})
                    console.info("New user with nickname",socket.nickname)
                }else{
                    cb({ok:false,msg:"Nickname already in use"})
                }
            } catch (error) {
                console.error(error)
            }
        })

        socket.on("friend connection",function (data, cb){
            try {
                
                if(data.player == data.friend){
                    cb({ok:false, msg:"You can't play with yourself"})
                }
                let friendIndex = findIndex(data.friend)
                if( friendIndex == -1 ){
                    cb({ok:false, msg:"User is wrong or offline"})
                }else{
                    let friendSocket = users[friendIndex].socket
                    cb({ok:true})
                    let i = friendIndex.toString()
                    socket.rounds[i] = []
                    i  = findIndex(socket.nickname)
                    friendSocket.rounds[i] = []
                    friendSocket.emit("game start", findIndex(socket.nickname))
                    socket.emit("game start", friendIndex)
                    socket.isPlaying = [true, friendSocket]
                    friendSocket.isPlaying =[true, socket]
                    console.info("Connected", socket.nickname, "with", friendSocket.nickname)
                }
            } catch (error) {
                console.error(error)
            }
        })

        socket.on("round choice", data => {
            try {
                
                // { choice: 'Rock', friend: 0, rounds: 0 }
                const {friend} = data
                let friendSocket = users[friend].socket
    
                socket.rounds[friend.toString()].push(data.choice)
    
                let playerIString = findIndex(socket.nickname).toString()
                if(friendSocket.rounds[playerIString].length == socket.rounds[friend].length){
                    let roundN = socket.rounds[friend].length - 1 
                    socket.emit("round end", {player:data.choice, oponent: friendSocket.rounds[playerIString][roundN]});
                    friendSocket.emit("round end", {oponent:data.choice, player: friendSocket.rounds[playerIString][roundN]})
                }
            } catch (error) {
                console.error(error)
            }
        })
        
        socket.on("disconnect", data =>{
            try {
                if(!socket.nickname) return;
                if(socket.isPlaying && socket.isPlaying[0]){
                    let friendSocket = socket.isPlaying[1]
                    friendSocket.emit("friend disconnected")
                    friendSocket.rounds[findIndex(socket.nickname).toString()] = 0;
                    friendSocket.isPlaying = [false]
                }
                users.splice(findIndex(socket.nickname),1);
                console.info(socket.nickname, "disconnected")
                
            } catch (error) {
                console.error(error)
            }
        })

       
    })

    function findIndex(nickname){
        for(let i = 0; i<users.length; i++){
            if(users[i].nickname == nickname){
                return i
            }
        }
        return -1;
    }
}

export default socketConnection;