import {
  findFarmerPDA,
  GemBankClient,
  GemFarmClient,
} from '@gemworks/gem-farm-ts';
import { Connection, PublicKey } from '@solana/web3.js';
import { programs } from '@metaplex/js';

const {
  metadata: { Metadata },
} = programs;

async function getStakedNFTs(
  connection: Connection,
  farmClient: GemFarmClient,
  bankClient: GemBankClient,
  farmPublicKey: PublicKey,
  farmerPublicKey: PublicKey,
): Promise<programs.metadata.MetadataData[]> {
  console.time('Fetch Farm');
  const farm = await farmClient.fetchFarmAcc(farmPublicKey);
  console.timeEnd('Fetch Farm');

  console.log({ farm });

  console.time('Fetch Farmer PDA');
  const [farmerPDA] = await findFarmerPDA(farmPublicKey, farmerPublicKey);
  console.timeEnd('Fetch Farmer PDA');

  console.log({ farmerPDA });

  console.time('Fetch Farmer');
  const farmer = await farmClient.fetchFarmerAcc(new PublicKey(farmerPDA));
  console.timeEnd('Fetch Farmer');

  console.log({ farmer, v: farmer.vault.toString() });

  console.time('Fetch Vault');
  const vault = await bankClient.fetchAllGdrPDAs(farmer.vault);
  console.timeEnd('Fetch Vault');

  console.log({ vault });

  console.time('Fetch Mints');
  const mints = vault.map((gdr) => gdr.account.gemMint);
  console.timeEnd('Fetch Mints');

  console.time('Fetch PDA');
  const pda = await Promise.all(
    mints.map(
      (m) => Metadata.getPDA(m),
      // eslint-disable-next-line function-paren-newline
    ),
  );
  console.timeEnd('Fetch PDA');

  console.log({ pda });

  console.time('Fetch Staked NFTS Onchain');
  const accs = (
    await Promise.all(
      pda.map(
        (p) => Metadata.load(connection, p),
        // eslint-disable-next-line function-paren-newline
      ),
    )
  ).map((d) => d.data);
  console.timeEnd('Fetch Staked NFTS Onchain');

  console.log({ accs });

  return accs;
}

export {
  // eslint-disable-next-line import/prefer-default-export
  getStakedNFTs,
};
