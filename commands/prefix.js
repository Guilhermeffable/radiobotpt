const { ENGINE_METHOD_PKEY_ASN1_METHS } = require('constants');
const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports.run = (client, message, args, queue, searcher, prefix) => {
    let newPrefix = message.content.slice(prefix.length).trim().split(/ +/g);

    console.log();

    let prefixes = JSON.parse(
        fs.readFileSync(path.join(__dirname, '../json/prefixes.json'), 'utf-8')
    );

    let msg = new Discord.MessageEmbed()
        .setTitle('Prefixo')
        .setColor('DARK_VIVID_PINK')
        .setTimestamp(new Date())
        .setFooter({
            text: message.guild.name,
            iconURL: message.guild.iconURL()
        });

    if (newPrefix[1] === undefined) {
        msg.setDescription('Prefixo inválido, insere outro.');
        msg.addField('Prefixo atual:', '`' + `${prefix}` + '`');
        message.channel.send(msg);
    } else {
        if (newPrefix[1].match(/[\.!\/\\\/\-\?\$\%\&\=\*\+]/)) {
            msg.setDescription(
                'Prefixo válido, o novo prefixo é ' +
                    '`' +
                    `${newPrefix[1]}` +
                    '`'
            );
            prefixes[message.guild.id] = {
                prefixes: newPrefix[1]
            };
            message.channel.send(msg);
            fs.writeFile(
                path.join(__dirname, '../json/prefixes.json'),
                JSON.stringify(prefixes),
                (err) => {
                    if (err) console.error(err);
                }
            );
        } else {
            msg.setDescription('Prefixo inválido, insere outro.');
            message.channel.send({ embeds: msg });
        }
    }
};

module.exports.config = {
    name: 'prefix',
    aliases: []
};
