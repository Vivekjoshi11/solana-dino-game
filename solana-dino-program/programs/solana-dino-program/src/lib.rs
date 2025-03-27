// use anchor_lang::prelude::*;

// declare_id!("DiYHqM4mbukW2TTU4qrMhm49GmeJkqBC4upMktYxthE2");

// #[program]
// pub mod solana_dino_program {
//     use super::*;

//     pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
//         let scoreboard = &mut ctx.accounts.scoreboard;
//         scoreboard.high_score = 0;
//         scoreboard.player = ctx.accounts.player.key();
//         Ok(())
//     }

//     pub fn update_score(ctx: Context<UpdateScore>, new_score: u64) -> Result<()> {
//         let scoreboard = &mut ctx.accounts.scoreboard;
//         if new_score > scoreboard.high_score {
//             scoreboard.high_score = new_score;
//             scoreboard.player = ctx.accounts.player.key();
//         }
//         Ok(())
//     }
// }

// #[derive(Accounts)]
// pub struct Initialize<'info> {
//     #[account(init, payer = player, space = 8 + 8 + 32)]
//     pub scoreboard: Account<'info, Scoreboard>,
//     #[account(mut)]
//     pub player: Signer<'info>,
//     pub system_program: Program<'info, System>,
// }

// #[derive(Accounts)]
// pub struct UpdateScore<'info> {
//     #[account(mut)]
//     pub scoreboard: Account<'info, Scoreboard>,
//     pub player: Signer<'info>,
// }

// #[account]
// pub struct Scoreboard {
//     pub high_score: u64,
//     pub player: Pubkey,
// }


use anchor_lang::prelude::*;

declare_id!("78qRqoSKe2bNGzYMNe83DdjWHyaaPQtvMCe81c72fkL4");

#[program]
pub mod solana_dino_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let scoreboard = &mut ctx.accounts.scoreboard;
        scoreboard.high_score = 0;
        scoreboard.player = ctx.accounts.player.key();
        Ok(())
    }

    pub fn update_score(ctx: Context<UpdateScore>, new_score: u64) -> Result<()> {
        let scoreboard = &mut ctx.accounts.scoreboard;
        if new_score > scoreboard.high_score {
            scoreboard.high_score = new_score;
            scoreboard.player = ctx.accounts.player.key();
        }
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = player, space = 8 + 8 + 32)] // Discriminator (8) + u64 (8) + Pubkey (32)
    pub scoreboard: Account<'info, Scoreboard>,
    #[account(mut)]
    pub player: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateScore<'info> {
    #[account(mut)]
    pub scoreboard: Account<'info, Scoreboard>,
    pub player: Signer<'info>,
}

#[account]
pub struct Scoreboard {
    pub high_score: u64,
    pub player: Pubkey,
}