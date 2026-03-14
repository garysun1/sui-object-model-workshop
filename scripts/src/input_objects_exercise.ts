import { SuiGrpcClient } from '@mysten/sui/grpc';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import keyPairJson from "../keypair.json" with { type: "json" };
import { Transaction } from "@mysten/sui/transactions";

const PACKAGE_ID = `0xb3491c9657444a947c97d7eeccff0d4988b432f8a37e7f9a26fb6ed4fbc3df9a`;
const COUNTER_OBJECT_ID = `0x8a6f2bc3af32c71a93a35d397fd47c14f67b7aa252002c907df9b172e95c0ec6`;

const keypair = Ed25519Keypair.fromSecretKey(keyPairJson.privateKey);

const suiClient = new SuiGrpcClient({
	network: 'testnet',
	baseUrl: 'https://fullnode.testnet.sui.io:443',
});

const main = async () => {
  const tx = new Transaction();

  const [feeCoin] = tx.splitCoins(tx.gas, [10]);

  tx.moveCall({
    target: `${PACKAGE_ID}::counter::increment`,
    arguments: [tx.object(COUNTER_OBJECT_ID), feeCoin],
  });

  const result = await suiClient.signAndExecuteTransaction({
    transaction: tx,
    signer: keypair,
  });

  console.log(result);
};

main();