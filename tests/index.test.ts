import { expect, test } from "bun:test";
import * as borsh from "borsh"
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { schema, size } from "./types";

// test("Sum function test",()=>{
//     expect(sum(1,2)).toBe(3);
// })
// function sum(a:number,b:number):number{
//     return a+b;
// }

let acc: Keypair = Keypair.generate();
let dataAcc: Keypair = Keypair.generate();
const connection = new Connection("http://127.0.0.1:8899");
const prgId = new PublicKey("9XuXAACdRWoAf5ZgcTQG98GBbduDTgzNeYyLSX5eDAos");
test("Account initialized", async () => {
  const txn = await connection.requestAirdrop(
    acc.publicKey,
    1 * LAMPORTS_PER_SOL
  );
  await connection.confirmTransaction(txn);
  let balance = await connection.getBalance(acc.publicKey);
  console.log(balance);
  const lamp = await connection.getMinimumBalanceForRentExemption(size);

  const ix = SystemProgram.createAccount({
    fromPubkey: acc.publicKey,
    space: size,
    lamports: lamp,
    programId: prgId,
    newAccountPubkey: dataAcc.publicKey,
  });
  const createTx = new Transaction().add(ix);
  const signature = await connection.sendTransaction(createTx, [acc, dataAcc]);
  await connection.confirmTransaction(signature);
  console.log(dataAcc.publicKey.toBase58());

  const accInfo=await connection.getAccountInfo(dataAcc.publicKey);
  const counter_count =borsh.deserialize(schema,accInfo?.data);
  expect(counter_count?.count).toBe(0);
});
