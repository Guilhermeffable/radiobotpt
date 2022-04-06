const Discord = require('discord.js');

module.exports.run = (client, message, args, queue, searcher, prefix) => {
    let msg = new Discord.MessageEmbed()
        .setTitle('Comandos disponíveis')
        .setDescription('Todos os comandos disponíveis')
        .addField(
            `${prefix}play <query>`,
            'Pesquisa e reproduz o primeiro resultado encontrado no YouTube.'
        )
        .addField(
            `${prefix}skip`,
            'Passa a música atual, reproduz a próxima música na queue.'
        )
        .addField(`${prefix}stop`, 'Pára toda a reprodução de música do BOT.')
        .addField(`${prefix}leave`, 'Disconecta o BOT do canal de voz.')
        .addField(`${prefix}help`, 'Mostra todos os comandos disponíveis.')
        .addField(
            `${prefix}clear`,
            'Elimina todas as mensagens enviadas pelo BOT.'
        )
        .addField(
            `${prefix}volume [valor]`,
            'Controla o volume do BOT (apenas nas streams de rádio).'
        )
        .addField(`${prefix}prefix <novo prefixo>`, 'Muda o prefixo do bot')
        .addField(`${prefix}orbital`, 'Reproduz a stream da Rádio Orbital.')
        .addField(`${prefix}antena3`, 'Reproduz a stream da Rádio Antena 3.')
        .addField(`${prefix}cid`, 'Reproduz a stream da Rádio CidadeFM.')
        .addField(
            `${prefix}cidhip`,
            'Reproduz a stream da Rádio CidadeFM Hip-Hop.'
        )
        .addField(`${prefix}hiper`, 'Reproduz a stream da Rádio HiperFM.')
        .addField(`${prefix}comercial`, 'Reproduz a stream da Rádio Comercial.')
        .addField(`${prefix}mega`, 'Reproduz a stream da Rádio MegaHits')
        .setColor('DARK_VIVID_PINK')
        .setTimestamp(new Date())
        .setFooter({
            text: message.guild.name,
            iconURL: message.guild.iconURL()
        })
        .setThumbnail(client.user.avatarURL())
        .setAuthor(client.user.username);

    message.channel.send({ embeds: [msg] });
};

module.exports.config = {
    name: 'help',
    aliases: ['h', 'hlp']
};
