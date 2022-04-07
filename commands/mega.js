const dis = require('../music/dispatcher');
const { MessageEmbed } = require('discord.js');

module.exports.run = (client, message, args, queue, searcher) => {
	dis.createDispatcher(
		'https://20133.live.streamtheworld.com/MEGA_HITSAAC.aac?dist=triton-widget&tdsdk=js-2.9&pname=tdwidgets&pversion=2.9&banners=none',
		message
	);
	let msg = new MessageEmbed()
		.setTitle('Rádio ')
		.setDescription(`MegaHits`)
		.setColor('ORANGE');

	message.channel.send({ embeds: [msg] });
};

module.exports.config = {
	name: 'mega',
	aliases: [],
};
