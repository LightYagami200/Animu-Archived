// =====================
// SECTION | IMPORTS
// =====================
import { SlashCommandBuilder } from '@discordjs/builders';
import { UserModel } from '@models/users.model';
import {
  CommandInteraction,
  GuildMember,
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from 'discord.js';
import { getParsedNftAccountsByOwner } from '@nfteyez/sol-rayz';
import axios from 'axios';
import Redis from 'ioredis';
// =====================!SECTION

// =====================
// SECTION | INIT
// =====================
const redis = new Redis(process.env.REDIS_URL);

interface NFTMetadata {
  uri: string;
  name: string;
  symbol: string;
  description: string;
  seller_fee_basis_points: number;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
  properties: {
    creators: Array<{
      address: string;
      share: number;
    }>;
    files: [
      {
        uri: string;
        type: string;
      },
    ];
  };
  collection: {
    name: string;
    family: string;
  };
}

interface NFT {
  name: string;
  symbol: string;
  mint: string;
  updateAuthority: string;
  arweaveURI: string;
  image: string;
}

// =====================!SECTION

// =====================
// SECTION | COMMAND
// =====================
module.exports = {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription('View profile/nfts of a user ;)')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('User to view profile of')
        .setRequired(false),
    ),
  async execute(interaction: CommandInteraction) {
    // -> Get member
    const member = (interaction.options.getMember('user') ||
      interaction.member)! as GuildMember;

    // -> If member is bot
    if (member.user.bot)
      return await interaction.reply({
        content: "Baka! You can't view profiles of bots (⊙﹏⊙✿)",
        ephemeral: true,
      });

    // -> Get User
    const user = await UserModel.findOne({ discordID: member.id });

    // -> If no user
    if (!user)
      return await interaction.reply({
        content: "That user doesn't have a profile (◡﹏◡✿)",
        ephemeral: true,
      });

    // -> If no verified wallet
    if (!user.publicKey)
      return await interaction.reply({
        content: "That user doesn't have a verified wallet (◡﹏◡✿)",
        ephemeral: true,
      });

    // -> Defer reply
    await interaction.deferReply({
      ephemeral: true,
    });

    // -> Get NFTs
    const nftArray = await getParsedNftAccountsByOwner({
      publicAddress: user.publicKey,
    });

    // -> TODO:
    // Store all fetched images on BunnyCDN

    // -> Get metadata from cache
    const cachedMetadata = (
      await Promise.all(
        nftArray.map((nft) => redis.hget('nft-metadata', nft.data.uri)),
      )
    )
      .filter((nft) => nft)
      .map((nft) => JSON.parse(nft!) as NFTMetadata);

    const arweave = (
      await Promise.all(
        nftArray.map((nft) =>
          cachedMetadata.find((cNft) => cNft.uri === nft.data.uri)
            ? cachedMetadata.find((cNft) => cNft.uri === nft.data.uri)
            : axios.get(nft.data.uri),
        ),
      )
    ).map((res) => (res && 'data' in res ? res.data : res));

    // -> Cache uncached metadata
    for (let i = 0; i < arweave.length; i++) {
      if (
        !cachedMetadata.find((cNft) => cNft.uri === nftArray[i].data.uri)
      ) {
        redis.hset(
          'nft-metadata',
          nftArray[i].data.uri,
          JSON.stringify({ uri: nftArray[i].data.uri, ...arweave[i] }),
        );
      }
    }

    // -> State
    const state = {
      currentPage: 0,
    };

    // -> Create NFTs array
    const nfts = nftArray.map((nft) => ({
      name: nft.data.name,
      symbol: nft.data.symbol,
      mint: nft.mint,
      updateAuthority: nft.updateAuthority,
      arweaveURI: nft.data.uri,
      image: arweave.find((ar) => ar.name === nft.data.name)?.image,
    }));

    // -> Reply
    const msg = (await interaction.editReply({
      embeds: getNFTsPanel(member, nfts, state.currentPage),
      components: getNFTPagination(nfts, state.currentPage),
    })) as Message;

    // -> Add component handler
    const componentCollector = msg.createMessageComponentCollector({
      filter: (i) =>
        i.user.id === interaction.user.id &&
        i.customId.startsWith('command:profile:'),
      time: 120000,
    });

    componentCollector.on('collect', async (i) => {
      switch (i.customId) {
        // --> Handle Previous button in pagination
        case 'command:profile:nft-prev':
          // --> Update State
          state.currentPage--;

          // --> Reply
          await i.update({
            embeds: getNFTsPanel(member, nfts, state.currentPage),
            components: getNFTPagination(nfts, state.currentPage),
          });
          break;

        // --> Handle Next button in pagination
        case 'command:profile:nft-next':
          // --> Update State
          state.currentPage++;

          // --> Reply
          await i.update({
            embeds: getNFTsPanel(member, nfts, state.currentPage),
            components: getNFTPagination(nfts, state.currentPage),
          });
          break;

        default:
          break;
      }
    });
  },
};
// =====================!SECTION

// =====================
// SECTION | UTILS
// =====================
function getNFTsPanel(member: GuildMember, nfts: NFT[], page: number) {
  if (!nfts.length)
    return [
      new MessageEmbed({
        url: `https://animu.io/users/${member.id}`,
        title: `${member.displayName}'s profile`,
        fields: [
          {
            name: 'Total NFTs',
            value: '0',
          },
        ],
        color: 0x2196f3,
        footer: {
          icon_url: 'https://i.ibb.co/k6SZnVH/favicon.png',
          text: 'Powered by Animu.io',
        },
      }),
    ];

  const nftsToShow = nfts.slice(page * 4, (page + 1) * 4);

  return [
    new MessageEmbed({
      url: `https://animu.io/users/${member.id}`,
      title: `${member.displayName}'s Profile`,
      image: {
        url: nftsToShow[0].image,
      },
      fields: [
        {
          name: 'Total NFTs',
          value: nfts.length.toString(),
        },
      ],
      color: 0x2196f3,
      footer: {
        icon_url: 'https://i.ibb.co/k6SZnVH/favicon.png',
        text: 'Powered by Animu.io',
      },
    }),
    ...nftsToShow.slice(1, 4).map(
      (nft) =>
        new MessageEmbed({
          url: `https://animu.io/users/${member.id}`,
          image: {
            url: nft.image,
          },
        }),
    ),
  ];
}

function getNFTPagination(nftArray: NFT[], page: number) {
  return [
    new MessageActionRow({
      components: [
        new MessageButton({
          label: 'Previous',
          custom_id: 'command:profile:nft-prev',
          // @ts-ignore
          style: 'PRIMARY',
          disabled: page === 0,
        }),
        new MessageButton({
          label: 'Next',
          custom_id: 'command:profile:nft-next',
          // @ts-ignore
          style: 'PRIMARY',
          disabled: Math.ceil(nftArray.length / 4) <= page + 1,
        }),
      ],
    }),
  ];
}
// =====================!SECTION
