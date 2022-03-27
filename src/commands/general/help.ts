// =====================
// SECTION | IMPORTS
// =====================
import { SlashCommandBuilder } from '@discordjs/builders';
import { teamCheck } from '@utils';
import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageEmbed,
  MessageSelectMenu,
  SelectMenuInteraction,
} from 'discord.js';
import { readdirSync } from 'fs';
import { startCase, toLower } from 'lodash';
import { join } from 'path';
// =====================!SECTION

// =====================
// SECTION | COMMAND
// =====================
module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription("Animu Chan's here to help you out :D"),
  async execute(interaction: CommandInteraction) {
    // -> Defer
    await interaction.deferReply({
      ephemeral: true,
    });

    // -> Is Animu Team Member?
    const isAnimuTeamMember = await teamCheck(interaction, false);

    // -> Read command categories
    const categories = readdirSync(join(__dirname, '..')).filter(
      (c) => c !== 'animu-team' || isAnimuTeamMember,
    );

    // -> State
    let selectedCategory: string | undefined;
    let selectedCategoryCommands: unknown[] = [];
    let selectedCommand:
      | { options: any[]; name: string; description: string }
      | undefined;

    // -> Reply
    const message = (await interaction.editReply({
      embeds: helpEmbed(selectedCategory, selectedCommand),
      components: helpComponents(
        categories,
        selectedCategory,
        selectedCategoryCommands,
        selectedCommand,
      ),
    })) as Message;

    // -> Start Collector
    const componentCollector = message.createMessageComponentCollector({
      filter: (i) =>
        i.user.id === interaction.user.id &&
        i.customId.startsWith('command:help:'),
      time: 120000,
    });

    // -> On button action
    componentCollector.on('collect', async (i) => {
      switch (i.customId) {
        case 'command:help:category':
          selectedCategory = (i as SelectMenuInteraction).values[0];

          // -> Read command files
          const commandFiles = readdirSync(
            join(__dirname, '..', selectedCategory),
          );

          for (const file of commandFiles.filter(
            (c) => !c.includes('context_menu'),
          )) {
            const command = require(join(
              __dirname,
              '..',
              selectedCategory,
              file,
            ));
            selectedCategoryCommands.push(command);
          }

          i.update({
            embeds: helpEmbed(selectedCategory, selectedCommand),
            components: helpComponents(
              categories,
              selectedCategory,
              selectedCategoryCommands,
              selectedCommand,
            ),
          });
          break;

        case 'command:help:command':
          const command = (i as SelectMenuInteraction).values[0];

          // -> Get command
          // @ts-ignore
          selectedCommand = selectedCategoryCommands.find(
            // @ts-ignore
            (c) => c.data.name === command,
          ).data as { options: any[]; name: string; description: string };

          // -> Reply
          await i.update({
            embeds: helpEmbed(selectedCategory, selectedCommand),
            components: helpComponents(
              categories,
              selectedCategory,
              selectedCategoryCommands,
              selectedCommand,
            ),
          });
          break;

        default:
          break;
      }
    });

    // -> Destroy collector
    componentCollector.on('end', async () => {
      try {
        if (interaction)
          interaction.editReply({
            content: 'Interaction Disabled - Please dismiss the message',
            embeds: [],
            components: [],
          });
      } catch (e) {}
    });
  },
};
// =====================!SECTION

// =====================
// SECTION | UTILS
// =====================
function helpEmbed(
  selectedCategory?: string,
  selectedCommand?: {
    options: {
      name: string;
      description: string;
      required: boolean;
      type: number;
    }[];
    name: string;
    description: string;
  },
) {
  console.log({ selectedCommand });
  console.log({ options: selectedCommand?.options });

  const embed = new MessageEmbed({
    title: selectedCommand
      ? startCase(toLower(selectedCommand.name.replace('-', ' ')))
      : 'Animu - Future of NFTs',
    description: selectedCommand
      ? selectedCommand.description
      : "Here's the list of all the awesome commands you can use!",
    fields: [
      {
        name: "What's New? ≧◡≦",
        value:
          '• Now you can view anyones profile by right clicking their avatar -> apps -> Profile \n\
           • `/collections` - View all sort of info about your favorite collections!\n\
           • `/profile` command now displays your staked NFTs (Currently only MAEC collection supported) \n\
           • `/psycho-pass` - Are you a threat to society?',
      },
    ],
    color: 0x2196f3,
  });

  if (selectedCommand && selectedCategory)
    embed.addField(
      'Category',
      startCase(toLower(selectedCategory.replace('-', ' '))),
      true,
    );

  if (selectedCommand)
    embed.addField(
      'Usage',
      `/${selectedCommand.name} ${selectedCommand.options
        .map((option) =>
          option.required ? `<${option.name}>` : `[${option.name}]`,
        )
        .join(' ')}`,
      true,
    );

  return [embed];
}

function helpComponents(
  categories: string[],
  selectedCategory?: string,
  selectedCategoryCommands: unknown[] = [],
  selectedCommand:
    | { options: any[]; name: string; description: string }
    | undefined = undefined,
) {
  const components: MessageActionRow[] = [];

  // -> Add category select menu
  components.push(
    new MessageActionRow({
      components: [
        new MessageSelectMenu({
          placeholder: 'Category',
          custom_id: 'command:help:category',
          options: categories.map((category) => ({
            label: startCase(toLower(category.replace('-', ' '))),
            value: category,
            default: category === selectedCategory,
          })),
        }),
      ],
    }),
  );

  // -> If category selected
  if (selectedCategoryCommands.length) {
    components.push(
      new MessageActionRow({
        components: [
          new MessageSelectMenu({
            placeholder: 'Command',
            custom_id: 'command:help:command',
            options: selectedCategoryCommands.map((command) => ({
              // @ts-ignore
              label: startCase(toLower(command.data.name)),
              // @ts-ignore
              description: command.data.description,
              // @ts-ignore
              value: command.data.name,
              // @ts-ignore
              default: command.data.name === selectedCommand?.name,
            })),
          }),
        ],
      }),
    );
  }

  return components;
}
// =====================!SECTION
