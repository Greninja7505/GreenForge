#![cfg(test)]

use super::*;
use soroban_sdk::testutils::{Address as _, Ledger, LedgerInfo};
use soroban_sdk::{token, vec, map};

#[test]
fn test_create_campaign() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, ChainFundContract);
    let client = ChainFundContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    client.initialize(&admin);

    let creator = Address::generate(&env);
    let title = String::from_str(&env, "Test Campaign");
    let description = String::from_str(&env, "A test crowdfunding campaign");
    let goal_amount = 1000;
    let duration_days = 30;

    let milestones = vec![
        &env,
        Milestone {
            id: 1,
            title: String::from_str(&env, "Prototype"),
            description: String::from_str(&env, "Build initial prototype"),
            amount: 500,
            status: MilestoneStatus::Pending,
            votes_for: 0,
            votes_against: 0,
            created_at: 0,
        }
    ];

    let campaign_id = client.create_campaign(
        &creator,
        &title,
        &description,
        &goal_amount,
        &milestones,
        &duration_days
    );

    assert_eq!(campaign_id, 1);

    let campaign = client.get_campaign(&campaign_id);
    assert_eq!(campaign.title, title);
    assert_eq!(campaign.creator, creator);
    assert_eq!(campaign.goal_amount, goal_amount);
    assert_eq!(campaign.status, CampaignStatus::Active);
}

#[test]
fn test_back_campaign() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, ChainFundContract);
    let client = ChainFundContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    client.initialize(&admin);

    // Create campaign
    let creator = Address::generate(&env);
    let campaign_id = client.create_campaign(
        &creator,
        &String::from_str(&env, "Test Campaign"),
        &String::from_str(&env, "Description"),
        &1000,
        &vec![&env],
        &30
    );

    // Back campaign
    let backer = Address::generate(&env);
    let amount = 500;

    client.back_campaign(&backer, &campaign_id, &amount);

    let campaign = client.get_campaign(&campaign_id);
    assert_eq!(campaign.total_backed, amount);
    assert!(campaign.backers.contains_key(backer));
}

#[test]
fn test_vote_milestone() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, ChainFundContract);
    let client = ChainFundContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    client.initialize(&admin);

    // Create campaign with milestone
    let creator = Address::generate(&env);
    let milestones = vec![
        &env,
        Milestone {
            id: 1,
            title: String::from_str(&env, "Milestone 1"),
            description: String::from_str(&env, "First milestone"),
            amount: 500,
            status: MilestoneStatus::Pending,
            votes_for: 0,
            votes_against: 0,
            created_at: 0,
        }
    ];

    let campaign_id = client.create_campaign(
        &creator,
        &String::from_str(&env, "Test Campaign"),
        &String::from_str(&env, "Description"),
        &1000,
        &milestones,
        &30
    );

    // Back campaign to get voting rights
    let backer = Address::generate(&env);
    client.back_campaign(&backer, &campaign_id, &100);

    // Vote on milestone
    client.vote_milestone(&backer, &campaign_id, &1, &true);

    let campaign = client.get_campaign(&campaign_id);
    let milestone = &campaign.milestones.get(0).unwrap();
    assert_eq!(milestone.votes_for, 1);
}

#[test]
fn test_mint_skill_nft() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, ChainFundContract);
    let client = ChainFundContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    client.initialize(&admin);

    let recipient = Address::generate(&env);
    let skill_score = 250;
    let skill_level = String::from_str(&env, "Intermediate");

    let token_id = client.mint_skill_nft(&recipient, &skill_score, &skill_level);

    assert_eq!(token_id, 1);

    let nft = client.get_skill_nft(&token_id);
    assert_eq!(nft.owner, recipient);
    assert_eq!(nft.skill_score, skill_score);
    assert_eq!(nft.skill_level, skill_level);
}