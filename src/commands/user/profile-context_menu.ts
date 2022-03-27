// =====================
// SECTION | IMPORTS
// =====================
import { ContextMenuCommandBuilder } from '@discordjs/builders';
import { UserModel } from '@models/users.model';
import {
  CommandInteraction,
  ContextMenuInteraction,
  GuildMember,
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from 'discord.js';
import { getParsedNftAccountsByOwner } from '@nfteyez/sol-rayz';
import axios from 'axios';
import Redis from 'ioredis';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import {
  GemBankClient,
  GemFarmClient,
  GEM_BANK_PROG_ID,
  GEM_FARM_PROG_ID,
} from '@gemworks/gem-farm-ts';
import { createFakeWallet, getStakedNFTs } from '@utils';
import bankIdl from '@assets/json/gem_bank.json';
import farmIdl from '@assets/json/gem_farm.json';
import { ApplicationCommandType } from 'discord-api-types/v9';
// =====================!SECTION

// =====================
// SECTION | INIT
// =====================
const redis = new Redis(process.env.REDIS_URL);

const connection = new Connection(
  clusterApiUrl('mainnet-beta'),
  'confirmed',
);

// -> Farm IDs
// --> This is temporary - as we get more creators, this will be replaced with a call to backend
const farmIds = ['AuHnvdxt1SkLgRj9yiLVUYiYajk3MjGQpX9WsLEgr3F9'];

const farmClient = new GemFarmClient(
  connection,
  createFakeWallet(),
  // @ts-ignore
  farmIdl,
  GEM_FARM_PROG_ID,
  bankIdl,
  GEM_FARM_PROG_ID,
);

const bankClient = new GemBankClient(
  connection,
  createFakeWallet(),
  // @ts-ignore
  bankIdl,
  GEM_BANK_PROG_ID,
);

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
  data: new ContextMenuCommandBuilder()
    .setName('Profile')
    // @ts-ignore
    .setType(ApplicationCommandType.User),
  async execute(interaction: ContextMenuInteraction) {
    console.log({ op: interaction.options });

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

    // -> Get staked NFTs
    const stakedNFTs = (
      await Promise.all(
        farmIds.map((f) =>
          getStakedNFTs(
            connection,
            farmClient,
            bankClient,
            new PublicKey(f),
            new PublicKey(user.publicKey!),
          ),
        ),
      )
    ).flat();

    console.log({ stakedNFTs, data: stakedNFTs[0].data });

    // -> Get metadata from cache
    const cachedMetadataStaked = (
      await Promise.all(
        stakedNFTs.map((nft) => redis.hget('nft-metadata', nft.data.uri)),
      )
    )
      .filter((nft) => nft)
      .map((nft) => JSON.parse(nft!) as NFTMetadata);

    const arweaveStaked = (
      await Promise.all(
        stakedNFTs.map((nft) =>
          cachedMetadataStaked.find((cNft) => cNft.uri === nft.data.uri)
            ? cachedMetadataStaked.find(
                (cNft) => cNft.uri === nft.data.uri,
              )
            : axios.get(nft.data.uri),
        ),
      )
    ).map((res) => (res && 'data' in res ? res.data : res));

    console.log({ arweaveStaked });

    // -> Cache uncached metadata
    for (let i = 0; i < arweaveStaked.length; i++) {
      if (
        !cachedMetadataStaked.find(
          (cNft) => cNft.uri === stakedNFTs[i].data.uri,
        )
      ) {
        redis.hset(
          'nft-metadata',
          stakedNFTs[i].data.uri,
          JSON.stringify({
            uri: stakedNFTs[i].data.uri,
            ...arweaveStaked[i],
          }),
        );
      }
    }

    console.log({
      embeds: getNFTsPanel(member, nfts, state.currentPage, arweaveStaked),
    });

    // -> Edit reply
    await interaction.editReply({
      embeds: getNFTsPanel(member, nfts, state.currentPage, arweaveStaked),
      components: getNFTPagination(nfts, state.currentPage, arweaveStaked),
    });

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
function getNFTsPanel(
  member: GuildMember,
  nfts: NFT[],
  page: number,
  stakedNFTs?: NFT[],
) {
  if (!nfts.length && !stakedNFTs?.length)
    return [
      new MessageEmbed({
        url: `https://beta.animu.io/login`,
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

  const sNFTs = stakedNFTs ? stakedNFTs : [];
  const nftsToShow = [...nfts, ...sNFTs].slice(page * 4, (page + 1) * 4);

  console.log({ sNFTs, nftsToShow, n: nftsToShow.slice(1, 4) });

  return [
    new MessageEmbed({
      url: `https://beta.animu.io/login`,
      title: `${member.displayName}'s Profile`,
      image: {
        url: nftsToShow[0].image,
      },
      fields: [
        {
          name: 'Total NFTs',
          value:
            stakedNFTs && nfts
              ? (nfts.length + stakedNFTs.length).toString()
              : 'Loading...',
          inline: true,
        },
        {
          name: 'NFTs in Wallet',
          value: nfts.length.toString(),
          inline: true,
        },
        {
          name: 'Staked NFTs',
          value: stakedNFTs ? stakedNFTs.length.toString() : 'Loading...',
          inline: true,
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
          url: `https://beta.animu.io/login`,
          image: {
            url: nft.image,
          },
        }),
    ),
  ];
}

function getNFTPagination(
  nftArray: NFT[],
  page: number,
  stakedNFTs?: NFT[],
) {
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
          disabled:
            Math.ceil((nftArray.length + (stakedNFTs?.length || 0)) / 4) <=
            page + 1,
        }),
      ],
    }),
  ];
}
// =====================!SECTION
