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
      embeds: transactionEmbed(tx),
    });
  },
};
// =====================!SECTION

// =====================
// SECTION | UTILS
// =====================
function transactionEmbed(transaction: SolanaTransaction) {
  return [
    new MessageEmbed({
      title: 'Transaction Details',
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
      ],
      footer: {
        iconURL: 'https://cryptologos.cc/logos/solana-sol-logo.png',
        text: 'Powered by Solana Blockchain',
      },
    }),
  ];
}
// =====================!SECTION
