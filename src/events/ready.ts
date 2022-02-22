// =====================
// SECTION | IMPORTS
// =====================
import { topGGToken } from '@keys';
import axios from 'axios';
import { Client } from 'discord.js';
// =====================!SECTION

// =====================
// SECTION | READY
// =====================
module.exports = {
  name: 'ready',
  once: true,
  async execute(client: Client) {
    axios.post(
      `https://top.gg/api/bots/${client.user!.id}/stats`,
      {
        server_count: client.guilds.cache.size,
      },
      {
        headers: {
          Authorization: topGGToken,
        },
      },
    );
  },
};
// =====================!SECTION
