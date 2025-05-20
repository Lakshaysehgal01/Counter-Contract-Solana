import * as borsh from "borsh";

export class Counter {
  count: number;
  constructor({ count }: { count: number }) {
    this.count = count;
  }
}

export const schema: borsh.Schema = {
  struct: {
    count: "u32",
  },
};
export class Increment {
  tag = 0;
  value: number;
  constructor(value: number) {
    this.value = value;
  }
}
export class Decrement {
  tag = 1;
  value: number;
  constructor(value: number) {
    this.value = value;
  }
}
export const size = borsh.serialize(schema, new Counter({ count: 0 })).length;

export function encodeInstruction(ix: Increment | Decrement): Buffer {
  const tag = Buffer.from([ix.tag]);
  const value = Buffer.alloc(4);
  value.writeUInt32LE(ix.value, 0);
  return Buffer.concat([tag, value]);
}
