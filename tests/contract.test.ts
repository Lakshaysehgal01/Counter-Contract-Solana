import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { test, describe, beforeEach, expect } from "bun:test";
import { LiteSVM } from "litesvm";
import { Decrement, encodeInstruction, Increment, schema } from "./types";
import * as borsh from "borsh";
describe("Counter-Contract", () => {
  let svm: LiteSVM;
  let payer: Keypair;
  let Contract: PublicKey;
  let dataAcc: Keypair;
  beforeEach(() => {
    svm = new LiteSVM();
    payer = Keypair.generate();
    svm.airdrop(payer.publicKey, BigInt(2 * LAMPORTS_PER_SOL));
    Contract = PublicKey.unique();
    svm.addProgramFromFile(Contract, "../target/deploy/counter_contract.so");
    dataAcc = Keypair.generate();
    const inx = SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: dataAcc.publicKey,
      lamports: Number(svm.minimumBalanceForRentExemption(BigInt(4))),
      space: 4,
      programId: Contract,
    });
    const trx = new Transaction().add(inx);
    trx.feePayer = payer.publicKey;
    trx.recentBlockhash = svm.latestBlockhash();
    trx.sign(payer, dataAcc);
    svm.sendTransaction(trx);
  });
  test("Increment By 5 and then decrement by 3 so the ans should be 2", () => {
    const ixData = encodeInstruction(new Increment(5));
    const ix = new TransactionInstruction({
      programId: Contract,
      keys: [{ pubkey: dataAcc.publicKey, isSigner: false, isWritable: true }],
      data: ixData,
    });
    const transaction = new Transaction().add(ix);
    transaction.feePayer = payer.publicKey;
    transaction.recentBlockhash = svm.latestBlockhash();
    transaction.sign(payer);
    svm.sendTransaction(transaction);
    const updatedAcc = svm.getAccount(dataAcc.publicKey);
    if (!updatedAcc) {
      throw new Error("Data Acc not found");
    }
    const updatedCount = borsh.deserialize(schema, updatedAcc.data);
    if (!updatedCount) {
      throw new Error("Count not found");
    }
    //@ts-ignore
    console.log(updatedCount.count);
    //@ts-ignore
    expect(updatedCount.count).toBe(5);

    const ixData1 = encodeInstruction(new Decrement(3));
    const ix1 = new TransactionInstruction({
      programId: Contract,
      keys: [{ pubkey: dataAcc.publicKey, isSigner: false, isWritable: true }],
      data: ixData1,
    });
    const transaction1 = new Transaction().add(ix1);
    transaction1.feePayer = payer.publicKey;
    transaction1.recentBlockhash = svm.latestBlockhash();
    transaction1.sign(payer);
    svm.sendTransaction(transaction1);
    const updatedAcc1 = svm.getAccount(dataAcc.publicKey);
    if (!updatedAcc1) {
      throw new Error("Data Acc not found");
    }
    const updatedCount1 = borsh.deserialize(schema, updatedAcc1.data);
    if (!updatedCount1) {
      throw new Error("Count not found");
    }
    //@ts-ignore
    console.log(updatedCount1.count);
    //@ts-ignore
    expect(updatedCount1.count).toBe(2);
  });
});
