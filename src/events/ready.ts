// =====================
// SECTION | IMPORTS
// =====================
import { topGGToken } from '@keys';
import { Client } from 'discord.js';
import AutoPoster from 'topgg-autoposter';
// =====================!SECTION

// =====================
// SECTION | READY
// =====================
module.exports = {
  name: 'ready',
  once: true,
  async execute(client: Client) {
    if (process.env.NODE_ENV === 'production')
      AutoPoster(topGGToken, client);
  },
};
// =====================!SECTION
