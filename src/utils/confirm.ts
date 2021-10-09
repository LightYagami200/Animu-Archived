// ====================
// SECTION | IMPORTS
// ====================
import {
  ButtonInteraction,
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageButton,
} from 'discord.js';
// ====================!SECTION

// ====================
// SECTION | CONFIRM
// ====================
function confirm(
  interaction: CommandInteraction,
  confirmationMessage: string,
  confirmationUserID: string,
  time: number,
): Promise<ButtonInteraction> {
  let confirmed = false;

  return new Promise(async (resolve, reject) => {
    // Confirmation
    const message = (await interaction.editReply({
      content: confirmationMessage,
      components: [
        new MessageActionRow({
          components: [
            new MessageButton({
              label: 'Yes',
              customId: 'confirm:yes',
              style: 'PRIMARY',
            }),
            new MessageButton({
              label: 'No',
              customId: 'confirm:no',
              style: 'DANGER',
            }),
          ],
        }),
      ],
    })) as Message;

    // Collector
    const buttonCollector = message.createMessageComponentCollector({
      componentType: 'BUTTON',
      time,
      filter: (i) => i.user.id === confirmationUserID,
    });

    // Button Collector
    buttonCollector.on(
      'collect',
      async (subInteraction: ButtonInteraction) => {
        if (subInteraction.customId === 'confirm:yes') {
          resolve(subInteraction);
          confirmed = true;
          buttonCollector.stop();
        }

        if (subInteraction.customId === 'confirm:no') {
          reject(subInteraction);
          confirmed = true;
          buttonCollector.stop();
        }
      },
    );

    buttonCollector.on('end', () => {
      if (!confirmed) message.delete();
    });
  });
}

export default confirm;
// ====================!SECTION
