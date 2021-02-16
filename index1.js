const Discord = require('discord.js');
const client = new Discord.Client(),
settings = {
    prefix: "!",
    token:"Njg0MDEyNDUyNDIxNDM1Mzk4.Xlz6PA.JYPkW1wXx00e2soIOmP3_dIL_uQ"
};



const queue = new Map();




client.on("message", async (message) => {
    
    const prefix = "!";

    const serverQueue = queue.get(message.guild.id);

    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if(command === "play"){
        execute(message, serverQueue);
    }


    async function execute(message, serverQueue){

        let vc = message.member.voice.channel;

        if(!vc){

            return message.channel.send("Please join a voice chat first!");


        }
        else{
            
        }
            
    }

});


client.login(settings.token);


