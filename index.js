require('dotenv').config()
const fs = require('fs')
const Discord = require('discord.js')

const {YTSearcher} = require('ytsearcher');

const searcher = new YTSearcher({
    key: process.env.youtube_api,
    revealed: true
});

const client = new Discord.Client()
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

fs.readdir('./commands/', (err,files) => {
    if(err) console.log(err);

    files.forEach( (file) => {
        if(!file.endsWith(".js")) return;
        let cmd = require(`./commands/${file}`);
        let cmdName = cmd.config.name;
        client.commands.set(cmdName, cmd);
        cmd.config.aliases.forEach(alias => {
            client.aliases.set(alias, cmdName)

        });
    })
});

const queue = new Map();

client.on("ready", ()  => {

    console.log(`Logged in as ${client.user.tag}!`);

})

client.on("message", async (message) => {

    const {prefix} = require('./json/config.json');

    let prefixes = JSON.parse(fs.readFileSync("./json/prefixes.json", "utf-8"));

    if(!prefixes[message.guild.id]){

        prefixes[message.guild.id] = {

            prefixes: prefix,

        };

    }

    let prefixNew = prefixes[message.guild.id].prefixes;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);

    const command = args.shift().toLowerCase();

    if(!message.content.startsWith(prefixNew) || message.author.bot) return;

    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));

    if(!cmd) return;
    try{
        cmd.run(client, message, args, queue, searcher, prefixNew);
    }catch(err){
        return console.error(err);
    }


});




let skip = (message, serverQueue) => {

    
    if(!message.member.voice.channel){

        return message.channel.send("Tens de estar conectado/a a um voice channel.");

    }

    if(!serverQueue) {
        
        return message.channel.send("Não há nada para reproduzir!");
        
    }

    serverQueue.connection.dispatcher.end();
};

let showQueue = (client, message, serverQueue) => {

    if(!message.member.voice.channel){

        return message.channel.send("Tens de estar conectado/a a um voice channel.");

    }

    if(!serverQueue) {
        
        return message.channel.send({embed:{
            color: 3447003,
            author:{
                name: client.user.username,
            icon_url: client.user.avatarURL()
        },
            title: "Queue",
            description: "Músicas na Queue",
            fields:[{
                name:"Nada para reproduzir.",
                value: "0"
            },
            ]
        }});
        
    }
    else{

        let embed = {
            color: 3447003,
            author:{
                name: client.user.username,
            icon_url: client.user.avatarURL()
        },
            title: "Queue",
            description: "Músicas na Queue",
            fields:[]
        
        };

        serverQueue.songs.map( (item, pos) => {

            embed.fields.push({
                name: `${pos + 1} - ${item.title}`});

        })


        return message.channel.send({embed});

    }

}

client.user.setActivity("!help", {

    type: "WATCHING"

})


client.login(process.env.token);