// =====================
// SECTION | IMPORTS
// =====================
import { SlashCommandBuilder } from '@discordjs/builders';
import { SolanaTransaction, SolScan } from '@utils';
import { CommandInteraction, MessageEmbed } from 'discord.js';
// =====================!SECTION

// =====================
// SECTION | INIT
// =====================
const solscan = new SolScan();
// =====================!SECTION

// =====================
// SECTION | COMMAND
// =====================
module.exports = {
  data: new SlashCommandBuilder()
    .setName('transaction')
    .setDescription('View a transaction on Solana blockchain')
    .addStringOption((option) =>
      option
        .setName('signature')
        .setDescription('Transaction Signature')
        .setRequired(true),
    ),
  async execute(interaction: CommandInteraction) {
    const tx = await solscan.getTransaction(
      interaction.options.getString('signature')!,
    );

    interaction.reply({
      embeds: transactionOverviewEmbed(tx),
    });
  },
};
// =====================!SECTION

// =====================
// SECTION | UTILS
// =====================
function transactionOverviewEmbed(transaction: SolanaTransaction) {
  return [
    new MessageEmbed({
      title: 'Transaction Overview',
      fields: [
        {
          name: 'Signature',
          value: transaction.txHash,
        },
        {
          name: 'Block',
          value: `[#${transaction.slot}](https://solscan.io/block/${transaction.slot})`,
          inline: true,
        },
        {
          name: 'Timestamp',
          value: `<t:${transaction.blockTime}:R>`,
          inline: true,
        },
        {
          name: 'Result',
          value: `${
            transaction.status === 'Success'
              ? '<:success:890216066284941333> '
              : ''
          }${transaction.status}`,
          inline: true,
        },
        {
          name: 'Signer',
          value: `[${transaction.signer}](https://solscan.io/account/${transaction.signer})`,
        },
        {
          name: 'Fee',
          value: `${solscan.lamportToSol(transaction.fee)} SOL`,
          inline: true,
        },
        {
          name: 'Main Actions',
          value:
            transaction.tokenTransfers
              .map(
                (transfer) =>
                  `Transfer from [${
                    transfer.source.substring(0, 5) +
                    '...' +
                    transfer.source.slice(-5)
                  }](https://solscan.io/account/${transfer.source}) to [${
                    transfer.destination.substring(0, 5) +
                    '...' +
                    transfer.destination.slice(-5)
                  }](https://solscan.io/account/${
                    transfer.source
                  }) for **${
                    parseInt(transfer.amount) /
                    10 ** transfer.token.decimals
                  } [${transfer.token.symbol}](https://solscan.io/token/${
                    transfer.token.address
                  })**`,
              )
              .join('\n') +
            '\n' +
            transaction.solTransfers
              .map(
                (transfer) =>
                  `Transfer from [${
                    transfer.source.substring(0, 5) +
                    '...' +
                    transfer.source.slice(-5)
                  }](https://solscan.io/account/${transfer.source}) to [${
                    transfer.destination.substring(0, 5) +
                    '...' +
                    transfer.destination.slice(-5)
                  }](https://solscan.io/account/${
                    transfer.source
                  }) for **${solscan.lamportToSol(
                    transfer.amount,
                  )} <:sol:947813755780206612> [SOL](https://solscan.io/token/So11111111111111111111111111111111111111112)**`,
              )
              .join('\n') +
            '\n' +
            transaction.unknownTransfers
              .map(
                (transfer) =>
                  `**Interact** with program [Associated Token Account Program](https://solscan.io/account/${
                    transfer.programId
                  })\n${transfer.event.map(
                    (e) =>
                      `> Transfer from [${
                        e.source.substring(0, 5) +
                        '...' +
                        e.source.slice(-5)
                      }](https://solscan.io/account/${e.source}) to [${
                        e.destination.substring(0, 5) +
                        '...' +
                        e.destination.slice(-5)
                      }](https://solscan.io/account/${
                        e.source
                      }) for **${solscan.lamportToSol(
                        e.amount,
                      )} <:sol:947813755780206612> [SOL](https://solscan.io/token/So11111111111111111111111111111111111111112)**`,
                  )}`,
              )
              .join('\n'),
        },
      ],
      color: 0x2196f3,
      footer: {
        iconURL: 'https://cryptologos.cc/logos/solana-sol-logo.png',
        text: 'Powered by Solana Blockchain',
      },
    }),
  ];
}

function transactionSolBalanceChangeEmbed(transaction: SolanaTransaction) {
  return [
    new MessageEmbed({
      title: 'SOL Balance Change⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀',
      description: transaction.inputAccount
        .map(
          (i) =>
            `**Account:** [${
              i.account.substring(0, 5) + '...' + i.account.slice(-5)
            }](https://solscan.io/account/${
              i.account
            })\n**Balance Before (SOL):** ${solscan
              .lamportToSol(i.preBalance)
              .toFixed(6)} \n**Balance After (SOL):** ${solscan
              .lamportToSol(i.postBalance)
              .toFixed(6)}\n**Change (SOL):** ${solscan.lamportToSol(
              i.postBalance - i.preBalance,
            )}${
              i.postBalance - i.preBalance > 0
                ? ' <:up_arrow:947844976832827452>'
                : i.postBalance - i.preBalance < 0
                ? ' <:down_arrow:947844825057730660>'
                : ''
            }`,
        )
        .join('\n═════════════════════════\n'),
      color: 0x2196f3,
      footer: {
        iconURL: 'https://cryptologos.cc/logos/solana-sol-logo.png',
        text: 'Powered by Solana Blockchain',
      },
    }),
  ];
}

function transactiontokenBalanceChange(transaction: SolanaTransaction) {
  return [
    new MessageEmbed({
      title: 'Token Balance Change⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀',
      description: transaction.tokenBalanes
        .map(
          (i) =>
            `**Account:** [${
              i.account.substring(0, 5) + '...' + i.account.slice(-5)
            }](https://solscan.io/account/${
              i.account
            })\n**Balance Before:** ${
              parseInt(i.amount.preAmount) / 10 ** i.token.decimals
            } \n**Balance After:** ${
              parseInt(i.amount.postAmount) / 10 ** i.token.decimals
            }\n**Change:** ${
              (parseInt(i.amount.postAmount) -
                parseInt(i.amount.preAmount)) /
              10 ** i.token.decimals
            }${
              parseInt(i.amount.postAmount) -
                parseInt(i.amount.preAmount) >
              0
                ? ' <:up_arrow:947844976832827452>'
                : parseInt(i.amount.postAmount) -
                    parseInt(i.amount.preAmount) <
                  0
                ? ' <:down_arrow:947844825057730660>'
                : ''
            }\n**Token:** [${i.token.name} (${
              i.token.symbol
            })](https://solscan.io/token/${i.token.tokenAddress})`,
        )
        .join('\n═════════════════════════\n'),
      color: 0x2196f3,
      footer: {
        iconURL: 'https://cryptologos.cc/logos/solana-sol-logo.png',
        text: 'Powered by Solana Blockchain',
      },
    }),
  ];
}
// =====================!SECTION
