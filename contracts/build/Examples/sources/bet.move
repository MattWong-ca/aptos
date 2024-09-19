module bet_addr::bet {
    use std::signer;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;

    struct Bet has key {
        amount: u64,
        creator: address,
        taker: address,
        resolved: bool,
        winner: address
    }

    public entry fun create_bet(account: &signer, bet_amount: u64) {
        let sender_addr = signer::address_of(account);
        coin::transfer<AptosCoin>(account, @bet_addr, bet_amount);
        
        move_to(account, Bet {
            amount: bet_amount,
            creator: sender_addr,
            taker: @0x0,
            resolved: false,
            winner: @0x0
        });
    }

    public entry fun take_bet(account: &signer, creator: address, bet_amount: u64) acquires Bet {
        let bet = borrow_global_mut<Bet>(creator);
        assert!(bet.amount == bet_amount, 0);
        assert!(bet.taker == @0x0, 1);
        
        let taker_addr = signer::address_of(account);
        coin::transfer<AptosCoin>(account, @bet_addr, bet_amount);
        
        bet.taker = taker_addr;
    }

    // public entry fun resolve_bet(account: &signer, winner: address) acquires Bet {
    //     let sender_addr = signer::address_of(account);
    //     let bet = borrow_global_mut<Bet>(sender_addr);
        
    //     assert!(!bet.resolved, 2);
    //     assert!(winner == bet.creator || winner == bet.taker, 3);
        
    //     bet.resolved = true;
    //     bet.winner = winner;
        
    //     coin::transfer<AptosCoin>(&bet_addr, winner, bet.amount * 2);
    // }
}
