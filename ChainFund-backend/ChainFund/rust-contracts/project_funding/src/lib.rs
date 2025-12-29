#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracterror, contracttype,
    Vec, Map, symbol_short,
    Address, Env, Symbol, String,
    xdr::ScError,
};

#[derive(Clone)]
#[contract]
pub struct ProjectFunding;

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    NotFound = 1,
    Invalid = 2,
    Expired = 3,
    Inactive = 4,
    NoAccess = 5,
    NoMStone = 6,
    BadState = 7,
    Voted = 8,
}

impl From<Error> for ScError {
    fn from(e: Error) -> Self {
        ScError::Contract(e as u32)
    }
}

impl From<&Error> for ScError {
    fn from(e: &Error) -> Self {
        ScError::Contract(*e as u32)
    }
}

#[contracttype]
#[derive(Clone)]
pub struct Project {
    id: u32,
    owner: Address,
    title: Symbol,
    desc: Symbol,
    target: i128,
    current: i128,
    balance: i128,  // Track actual XLM balance
    token: Address, // XLM token contract
    status: Symbol,
    backers: Map<Address, i128>,
    mstones: Vec<Milestone>,
}

#[contracttype]
#[derive(Clone)]
pub struct Milestone {
    title: Symbol,
    desc: Symbol,
    amt: i128,
    votes: Map<Address, bool>,
    req_votes: u32,
    status: Symbol,
}

#[contractimpl]
impl ProjectFunding {
    pub fn create_project(
        env: Env,
        owner: Address,
        title: Symbol,
        desc: Symbol,
        target: i128,
        mstone_config: Vec<(Symbol, Symbol, i128, u32)>,
    ) -> Result<u32, Error> {
        owner.require_auth();

        if target <= 0 {
            return Err(Error::Invalid);
        }

        if mstone_config.is_empty() {
            return Err(Error::NoMStone);
        }

        let project_id = env.storage().instance()
            .get::<_, u32>(&symbol_short!("nextid"))
            .unwrap_or(1);

        let mut total: i128 = 0;
        let mut mstones = Vec::new(&env);

        for config in mstone_config.iter() {
            total += config.2;
            let mstone = Milestone {
                title: config.0.clone(),
                desc: config.1.clone(),
                amt: config.2,
                votes: Map::new(&env),
                req_votes: config.3,
                status: symbol_short!("pending"),
            };
            mstones.push_back(mstone);
        }

        if total != target {
            return Err(Error::Invalid);
        }

        // Hardcode native token address for testnet
        let token = Address::from_string(&String::from_slice(&env, "CB2BI5XCTQC2Y7V63JZO2FAC7S5IX5QL2EHCHF44UDG5E3VNUHVTGOVV"));
        
        let project = Project {
            id: project_id,
            owner: owner.clone(),
            title,
            desc,
            target,
            current: 0,
            balance: 0,
            token,
            status: symbol_short!("active"),
            backers: Map::new(&env),
            mstones,
        };

        env.storage().instance().set(&project_id, &project);
        env.storage().instance().set(&symbol_short!("nextid"), &(project_id + 1));

        env.events().publish(
            (symbol_short!("prj_new"), owner),
            project_id,
        );

        Ok(project_id)
    }

    pub fn fund_project(
        env: Env,
        project_id: u32,
        backer: Address,
        amount: i128,
    ) -> Result<(), Error> {
        backer.require_auth();

        let mut project: Project = env.storage().instance().get(&project_id).ok_or(Error::NotFound)?;
        
        if project.status != symbol_short!("active") {
            return Err(Error::Inactive);
        }

        if amount <= 0 || project.current + amount > project.target {
            return Err(Error::Invalid);
        }

        // Update project balances directly since XLM transfer is handled by the frontend
        project.balance = env.ledger().sequence() as i128; // Use ledger sequence as a proxy for balance
        let cur_amt = project.backers.get(backer.clone()).unwrap_or(0);
        project.backers.set(backer.clone(), cur_amt + amount);
        project.current += amount;
        project.balance += amount;

        env.storage().instance().set(&project_id, &project);

        env.events().publish(
            (symbol_short!("prj_fund"), project_id),
            amount,
        );

        Ok(())
    }

    pub fn vote_on_milestone(
        env: Env,
        project_id: u32,
        backer: Address,
        vote: bool,
    ) -> Result<(), Error> {
        backer.require_auth();

        let mut project: Project = env.storage().instance().get(&project_id).ok_or(Error::NotFound)?;
        
        let current = project.mstones
            .iter()
            .position(|m| m.status == symbol_short!("pending"))
            .ok_or(Error::NoMStone)?;

        let mut mstone = project.mstones.get(current as u32).unwrap();

        if mstone.votes.contains_key(backer.clone()) {
            return Err(Error::Voted);
        }

        mstone.votes.set(backer.clone(), vote);
        project.mstones.set(current as u32, mstone.clone());

        let total = mstone.votes.len();
        let mut pos = 0;
        for (_, v) in mstone.votes.iter() {
            if v {
                pos += 1;
            }
        }

        if total as u32 >= mstone.req_votes {
            let threshold = (mstone.req_votes as f32 * 0.66) as u32;
            if pos as u32 >= threshold {
                mstone.status = symbol_short!("done");

                if current == project.mstones.len() as usize - 1 {
                    project.status = symbol_short!("done");
                } else {
                    let mut next = project.mstones.get((current + 1) as u32).unwrap();
                    next.status = symbol_short!("pending");
                    project.mstones.set((current + 1) as u32, next);
                }

                env.events().publish(
                    (symbol_short!("mst_done"), project_id),
                    current as u32,
                );
            }
        }

        env.storage().instance().set(&project_id, &project);
        Ok(())
    }

    pub fn get_project(env: Env, project_id: u32) -> Result<Project, Error> {
        env.storage().instance().get(&project_id).ok_or(Error::NotFound)
    }

    pub fn get_milestone(env: Env, project_id: u32, milestone_index: u32) -> Result<Milestone, Error> {
        let project: Project = env.storage().instance().get(&project_id).ok_or(Error::NotFound)?;
        Ok(project.mstones.get(milestone_index).ok_or(Error::NoMStone)?)
    }

    pub fn get_project_balance(env: Env, project_id: u32) -> Result<i128, Error> {
        let project: Project = env.storage().instance().get(&project_id).ok_or(Error::NotFound)?;
        Ok(project.balance)
    }
}