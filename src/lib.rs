// cargo init --lib
//cargo add solana-program@1.18.26  
// in cargo.toml add these lines 
//[lib]
//crate-type=["cdylib","lib"]
//cargo add borsh borsh-derive

use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{AccountInfo, next_account_info},
    pubkey:: Pubkey,
    entrypoint::ProgramResult,
    msg,
    entrypoint
};
#[derive(BorshDeserialize,BorshSerialize)]
enum Instructions{
    Increment(u32),
    Decrement(u32)
}
#[derive(BorshDeserialize,BorshSerialize)]
struct Counter{
    count:u32
}
entrypoint!(counter_contract);
pub fn counter_contract(
    program_id: &Pubkey,
    accounts:&[AccountInfo],
    instruction_data:&[u8],
)->ProgramResult{
    let acc=next_account_info(&mut accounts.iter())?;
    let instruction_type=Instructions::try_from_slice(instruction_data)?;
    let mut counter_data=Counter::try_from_slice(&acc.data.borrow())?;
    match instruction_type {
        Instructions::Increment(x)=>{
            msg!("Executing increase");
            counter_data.count=counter_data.count+x
        },
        Instructions::Decrement(y)=>{
            msg!("Executing decrease");
            counter_data.count=counter_data.count-y
        }
    }
    counter_data.serialize(&mut *acc.data.borrow_mut())?;
    msg!("Contract succeded");
    Ok(())
}
//cargo build-sbf -- -Znext-lockfile-bump  
//then in cli solana program deploy address (target file of the contarct to be depolyed) 
// 9XuXAACdRWoAf5ZgcTQG98GBbduDTgzNeYyLSX5eDAos - program addres of this account 