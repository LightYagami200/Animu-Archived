// =====================
// SECTION | IMPORTS
// =====================
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js';
import axios from 'axios';
import Redis from 'ioredis';
import * as cheerio from 'cheerio';
import { upperCase } from 'lodash';
// =====================!SECTION

// =====================
// SECTION | INIT
// =====================
const redis = new Redis(process.env.REDIS_URL);
// =====================!SECTION

// =====================
// SECTION | COMMAND
// =====================
module.exports = {
  data: new SlashCommandBuilder()
    .setName('collection')
    .setDescription('View info about a collection')
    .addStringOption((option) =>
      option
        .setName('symbol')
        .setDescription('Collection Symbol')
        .setRequired(true),
    ),
  async execute(interaction: CommandInteraction) {
    // -> Defer reply
    await interaction.deferReply({
      ephemeral: true,
    });

    // -> Data
    const collectionSymbol = interaction.options.getString('symbol', true);

    // -> Check if info is cached
    let cache = await redis.hget('collection-info', collectionSymbol);

    let collection: {
      symbol: string;
      name: string;
      description: string;
      subtitle: string;
      image: string;
      twitter: string;
      discord: string;
      website: string;
      isFlagged: boolean;
      flagMessage: string;
      categories: string[];
      floorPrice: number;
      listedCount: number;
      avgPrice24hr: number;
      volumeAll: number;
      pieces: number;
    };

    // -> If not cached, fetch info
    if (!cache) {
      try {
        console.time('Fetching from magiceden');
        const { data: ME } = await axios.get(
          `https://api-mainnet.magiceden.dev/v2/collections/${collectionSymbol}`,
        );
        console.timeEnd('Fetching from magiceden');

        // Please don't sue me moonrank (◕︵◕)
        console.time('Fetching from moonrank');
        const { data } = await axios.get(
          `https://moonrank.app/collection/${collectionSymbol}`,
        );
        console.timeEnd('Fetching from moonrank');

        console.time('Parsing');
        const $ = cheerio.load(data);

        const subtitle = $('h2.text-lg').text().trim();
        const pieces = parseInt(
          $('dt:contains("Pieces (Expected)")')
            .next()
            .text()
            .trim()
            .replace(/,/g, ''),
        );
        console.timeEnd('Parsing');

        // -> Cache info
        collection = {
          ...ME,
          pieces,
          subtitle,
        };

        console.log({ collection });

        await redis.hset(
          'collection-info',
          collectionSymbol,
          JSON.stringify(collection),
        );
      } catch (e) {
        return interaction.editReply({
          content: 'Could not find collection',
        });
      }
    } else {
      collection = JSON.parse(cache);
    }

    const fields = [
      {
        name: 'Symbol',
        value: upperCase(collection.symbol),
        inline: true,
      },
      {
        name: 'Pieces',
        value: collection.pieces.toLocaleString(),
        inline: true,
      },
      {
        name: 'Floor Price',
        value: `${(collection.floorPrice / 1_000_000_000).toFixed(
          2,
        )} <:sol:947813755780206612> SOL`,
        inline: true,
      },
      {
        name: 'Volume (All Time)',
        value: `${(collection.volumeAll / 1_000_000_000).toFixed(
          2,
        )} <:sol:947813755780206612> SOL`,
        inline: true,
      },
    ];

    if (collection.website)
      fields.push({
        name: '🌐 Website',
        value: `[Visit](${collection.website})`,
        inline: true,
      });

    if (collection.twitter)
      fields.push({
        name: '<:twitter:956888724564738078> Twitter',
        value: `[@${collection.twitter.split('/')[3]}](${
          collection.twitter
        })`,
        inline: true,
      });

    if (collection.discord && collection.discord.includes('discord.gg'))
      fields.push({
        name: '<:discord:956888615600939078> Discord',
        value: `[Join](${collection.discord})`,
        inline: true,
      });

    // -> Reply
    await interaction.editReply({
      embeds: [
        new MessageEmbed({
          title: collection.name,
          description:
            collection.subtitle.length >= 120
              ? `${collection.subtitle.substring(0, 120)}...`
              : collection.subtitle,
          fields,
          image: {
            url: collection.image,
          },
          color: 0x2196f3,
          footer: {
            icon_url:
              'https://bucketeer-e05bbc84-baa3-437e-9518-adb32be77984.s3.amazonaws.com/public/images/ce260aac-325c-4830-b855-ac5b8d32e081_800x800.png',
            text: 'Powered by Animu.io & Magic Eden',
          },
        }),
      ],
    });
  },
};
// =====================!SECTION
