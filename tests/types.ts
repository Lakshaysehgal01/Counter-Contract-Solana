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

export const size=borsh.serialize(schema,new Counter({count:0})).length;