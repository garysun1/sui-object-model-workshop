import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import keyPairJson from "../keypair.json" with { type: "json" };
import { SuiGrpcClient } from "@mysten/sui/grpc";
import { Transaction } from "@mysten/sui/transactions";

const keypair = Ed25519Keypair.fromSecretKey(keyPairJson.privateKey);
const suiAddress = keypair.getPublicKey().toSuiAddress();

const PACKAGE_ID = `0x9603a31f4b3f32843b819b8ed85a5dd3929bf1919c6693465ad7468f9788ef39`;
const VAULT_ID = `0x8d85d37761d2a4e391c1b547c033eb0e22eb5b825820cbcc0c386b8ecb22be33`;
const VAULT_CODE = 745223;

const suiClient = new SuiGrpcClient({
	network: 'testnet',
	baseUrl: 'https://fullnode.testnet.sui.io:443',
});

const main = async () => {
  const tx = new Transaction();

  const key = tx.moveCall({
    target: `${PACKAGE_ID}::key::new`,
  });

  tx.moveCall({
    target: `${PACKAGE_ID}::key::set_code`,
    arguments: [key, tx.pure.u64(VAULT_CODE)],
  });

  const coin = tx.moveCall({
    target: `${PACKAGE_ID}::vault::withdraw`,
    typeArguments: [`0x2::sui::SUI`],
    arguments: [tx.object(VAULT_ID), key],
  });

  tx.transferObjects([coin], suiAddress);

  const result = await suiClient.signAndExecuteTransaction({
    transaction: tx,
    signer: keypair,
  });

  console.log(result);
};

main();
