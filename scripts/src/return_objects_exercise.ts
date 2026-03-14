import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import keyPairJson from "../keypair.json" with { type: "json" };
import { SuiGrpcClient } from "@mysten/sui/grpc";
import { Transaction } from "@mysten/sui/transactions";
const keypair = Ed25519Keypair.fromSecretKey(keyPairJson.privateKey);
const suiAddress = keypair.getPublicKey().toSuiAddress();

const PACKAGE_ID = `0x57e029acbe322c733c1936ccba3642f27d0525c3883cf4e2742053ba2c5490b0`;

const suiClient = new SuiGrpcClient({
	network: 'testnet',
	baseUrl: 'https://fullnode.testnet.sui.io:443',
});

const main = async () => {
  const tx = new Transaction();

  const nft = tx.moveCall({
    target: `${PACKAGE_ID}::sui_nft::new`,
  });

  tx.transferObjects([nft], suiAddress);

  const result = await suiClient.signAndExecuteTransaction({
    transaction: tx,
    signer: keypair,
  });

  console.log(result);
};

main();