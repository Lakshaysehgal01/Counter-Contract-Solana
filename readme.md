# Solana Counter Contract

This project contains a simple Solana smart contract (program) written in Rust, which implements a counter that can be incremented or decremented, along with a TypeScript test suite using Bun.

## Program Overview

- **Location:** `src/lib.rs`
- **Functionality:**  
  The contract manages a single `Counter` struct with a `count` field. It supports two instructions:
  - `Increment(u32)`: Increases the counter by the given value.
  - `Decrement(u32)`: Decreases the counter by the given value.

## Building and Deploying

1. **Install Rust and Solana CLI tools.**
2. **Build the program for Solana:**
   ```bash
   cargo build-sbf -- -Znext-lockfile-bump
   ```
3. **Deploy to Solana:**
   ```bash
   solana program deploy target/deploy/counter_contract.so
   ```
   Replace the path with your actual build output if different.

## Program Address

- Example: `9XuXAACdRWoAf5ZgcTQG98GBbduDTgzNeYyLSX5eDAos`

## Testing

### Test Suite

- **Location:** `tests/`
- **Test Runner:** [Bun](https://bun.sh)
- **How to install dependencies:**
  ```bash
  cd tests
  bun install
  ```
- **How to run tests:**
  ```bash
  bun run index.test.ts
  ```

### Test Details

- The tests use Solana's localnet, create accounts, and interact with the deployed counter contract.
- Serialization is handled with Borsh, matching the contract's data layout.

## File Structure

- `src/lib.rs` – Rust smart contract source code.
- `Cargo.toml` – Rust dependencies and build config.
- `tests/` – TypeScript test suite using Bun.
- `tests/types.ts` – Borsh schema for the counter.
- `tests/index.test.ts` – Main test file.
