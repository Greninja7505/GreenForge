// Blockchain/DeFi Projects Data
export const projectsData = [
  {
    id: 1,
    slug: "stellar-defi-liquidity-protocol",
    title: "Stellar DeFi Liquidity Protocol",
    category: "DeFi Infrastructure",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop",
    description:
      "Next-generation automated market maker with concentrated liquidity and minimal slippage for Stellar network.",
    fullDescription: `This project is building a cutting-edge decentralized exchange protocol on Stellar that implements concentrated liquidity positions, allowing liquidity providers to earn higher fees while reducing slippage for traders.

Key features include:
• Concentrated liquidity management with custom price ranges
• Capital-efficient trading with up to 4000x capital efficiency
• Cross-chain liquidity aggregation via Stellar anchors
• MEV-resistant transaction ordering
• Gasless swaps using Stellar's fee pool mechanism

The protocol has completed security audits by Trail of Bits and CertiK, with testnet launch scheduled for Q1 2026. We're seeking funding to expand the core development team and establish liquidity mining incentives for early adopters.`,
    raised: 125600,
    goal: 200000,
    donors: 487,
    upvotes: 342,
    downvotes: 12,
    verified: true,
    givbacksEligible: true,
    location: "Decentralized",
    milestones: [
      {
        id: 1,
        title: "Protocol Architecture Design",
        amount: 50000,
        completed: true,
        date: "2025-04-15",
      },
      {
        id: 2,
        title: "Smart Contract Development",
        amount: 80000,
        completed: true,
        date: "2025-07-20",
      },
      {
        id: 3,
        title: "Security Audit & Testnet",
        amount: 100000,
        completed: false,
        date: "2025-10-30",
      },
      {
        id: 4,
        title: "Mainnet Launch & Liquidity Mining",
        amount: 150000,
        completed: false,
        date: "2026-01-15",
      },
      {
        id: 5,
        title: "Multi-Chain Integration",
        amount: 200000,
        completed: false,
        date: "2026-03-30",
      },
    ],
    creator: {
      name: "Stellar Labs Foundation",
      address: "GDXL...K3PQ",
      stellarAddress:
        "GCZYLNGU4CA5NAWBZBHGKX7FEQCMIGZDSZFH3CQWHZNCT2OWQDK5LE5P", // Testnet address
      verified: true,
      memberSince: "2023",
    },
    updates: [
      {
        id: 1,
        title: "Testnet Launch Successfully Deployed",
        content:
          "Our testnet is now live with full concentrated liquidity functionality. Early testers can start providing liquidity and testing swap operations.",
        date: "2025-09-15",
        author: "Core Development Team",
      },
      {
        id: 2,
        title: "Security Audit Completed - No Critical Issues",
        content:
          "Trail of Bits completed comprehensive security audit of smart contracts. All recommendations have been implemented in the latest release.",
        date: "2025-08-20",
        author: "Security Team",
      },
      {
        id: 3,
        title: "Cross-Chain Bridge Integration Progress",
        content:
          "Integration with Wormhole bridge progressing ahead of schedule. Users will soon be able to bridge assets from Ethereum and other chains.",
        date: "2025-07-10",
        author: "Bridge Team",
      },
    ],
    donations: [
      {
        id: 1,
        donor: "DeFi Whale",
        amount: 25000,
        date: "2025-09-18",
        anonymous: false,
      },
      {
        id: 2,
        donor: "Anonymous",
        amount: 15000,
        date: "2025-09-15",
        anonymous: true,
      },
      {
        id: 3,
        donor: "Stellar Foundation",
        amount: 50000,
        date: "2025-09-10",
        anonymous: false,
      },
      {
        id: 4,
        donor: "Crypto VC Fund",
        amount: 20000,
        date: "2025-09-05",
        anonymous: false,
      },
      {
        id: 5,
        donor: "Anonymous",
        amount: 5000,
        date: "2025-08-28",
        anonymous: true,
      },
    ],
  },
  {
    id: 2,
    slug: "decentralized-identity-system",
    title: "Decentralized Identity System",
    category: "Identity & Privacy",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=400&fit=crop",
    description:
      "Self-sovereign identity solution with zero-knowledge proofs for privacy-preserving authentication on Stellar.",
    fullDescription: `Building a comprehensive decentralized identity (DID) framework that enables users to control their digital identity without relying on centralized authorities.

Core features:
• W3C DID standard compliance for interoperability
• Zero-knowledge proof authentication for privacy
• Verifiable credentials issued on Stellar blockchain
• Biometric data encryption with threshold cryptography
• Cross-platform SDK for mobile and web applications

Our system allows users to prove their identity, age, or credentials without revealing unnecessary personal information. Perfect for DeFi KYC/AML compliance, age verification, and enterprise authentication.

We've partnered with several major DeFi protocols planning to integrate our identity layer for regulatory compliance while maintaining user privacy.`,
    raised: 89300,
    goal: 150000,
    donors: 342,
    upvotes: 289,
    downvotes: 8,
    verified: true,
    givbacksEligible: true,
    location: "Global",
    milestones: [
      {
        id: 1,
        title: "DID Protocol Design & W3C Compliance",
        amount: 30000,
        completed: true,
        date: "2025-05-10",
      },
      {
        id: 2,
        title: "Zero-Knowledge Proof Implementation",
        amount: 60000,
        completed: true,
        date: "2025-07-22",
      },
      {
        id: 3,
        title: "Mobile SDK Development",
        amount: 90000,
        completed: false,
        date: "2025-11-15",
      },
      {
        id: 4,
        title: "Enterprise Partnership Integration",
        amount: 120000,
        completed: false,
        date: "2026-01-30",
      },
      {
        id: 5,
        title: "Global Rollout & Compliance",
        amount: 150000,
        completed: false,
        date: "2026-04-20",
      },
    ],
    creator: {
      name: "Identity Protocol DAO",
      address: "GBID...M7XY",
      stellarAddress:
        "GBIDYTPHZZ7M7XYTQKXN2RQ5PCBW5ZNQNM7XY2VXFVVT2QKXM7XYBIDM", // Testnet address
      verified: true,
      memberSince: "2024",
    },
    updates: [
      {
        id: 1,
        title: "Mobile SDK Beta Release",
        content:
          "iOS and Android SDKs now available for developers. Includes biometric authentication and secure credential storage.",
        date: "2025-09-20",
        author: "Mobile Team",
      },
      {
        id: 2,
        title: "Partnership with Major DeFi Protocols",
        content:
          "Signed integration agreements with three top-10 DeFi protocols for identity verification layer.",
        date: "2025-08-25",
        author: "Partnership Team",
      },
    ],
    donations: [
      {
        id: 1,
        donor: "Privacy Advocate",
        amount: 10000,
        date: "2025-09-19",
        anonymous: false,
      },
      {
        id: 2,
        donor: "Anonymous",
        amount: 25000,
        date: "2025-09-12",
        anonymous: true,
      },
      {
        id: 3,
        donor: "Web3 Foundation",
        amount: 30000,
        date: "2025-08-30",
        anonymous: false,
      },
      {
        id: 4,
        donor: "Anonymous",
        amount: 8000,
        date: "2025-08-15",
        anonymous: true,
      },
    ],
  },
  {
    id: 3,
    slug: "cross-chain-nft-marketplace",
    title: "Cross-Chain NFT Marketplace",
    category: "NFT & Gaming",
    image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=400&fit=crop",
    description:
      "Unified NFT marketplace supporting cross-chain trading, fractional ownership, and gasless transactions on Stellar.",
    fullDescription: `Revolutionary NFT marketplace that breaks down barriers between blockchain ecosystems, allowing seamless trading of NFTs across multiple chains.

Platform capabilities:
• Cross-chain NFT bridging (Ethereum, Polygon, Solana, Stellar)
• Fractional NFT ownership with automated price discovery
• Gasless minting and trading using meta-transactions
• AI-powered NFT valuation and authenticity verification
• Creator royalty enforcement across all chains
• Dynamic NFT support with on-chain metadata updates

Our marketplace uses Stellar's efficient transaction layer for settlement while supporting assets from any blockchain. Artists and collectors can access global liquidity without worrying about which chain their NFTs are on.

Beta testing with 500+ creators has shown 90% reduction in transaction costs compared to Ethereum-based marketplaces.`,
    raised: 156400,
    goal: 250000,
    donors: 628,
    upvotes: 512,
    downvotes: 23,
    verified: true,
    givbacksEligible: true,
    location: "Distributed",
    milestones: [
      {
        id: 1,
        title: "Platform Architecture & Smart Contracts",
        amount: 50000,
        completed: true,
        date: "2025-04-01",
      },
      {
        id: 2,
        title: "Ethereum Bridge Integration",
        amount: 100000,
        completed: true,
        date: "2025-08-15",
      },
      {
        id: 3,
        title: "Fractional Ownership Feature",
        amount: 150000,
        completed: true,
        date: "2025-09-10",
      },
      {
        id: 4,
        title: "Multi-Chain Expansion (Polygon, Solana)",
        amount: 200000,
        completed: false,
        date: "2025-12-20",
      },
      {
        id: 5,
        title: "AI Valuation & Global Launch",
        amount: 250000,
        completed: false,
        date: "2026-03-10",
      },
    ],
    creator: {
      name: "NFT Labs Collective",
      address: "GNFT...R9WZ",
      stellarAddress:
        "GNFTLABSR9WZQPVX2HKNT3M5LXBWY7AQVNFT2LABSQPVX9WZGNFTLABS", // Testnet address
      verified: true,
      memberSince: "2023",
    },
    updates: [
      {
        id: 1,
        title: "Cross-Chain Bridge Live for Ethereum NFTs",
        content:
          "Users can now bridge their Ethereum NFTs to Stellar for trading with near-zero fees. Over 1,000 NFTs bridged in first week.",
        date: "2025-09-22",
        author: "Bridge Team",
      },
      {
        id: 2,
        title: "Fractional Ownership Feature Launched",
        content:
          "High-value NFTs can now be fractionalized into tradable shares. First collection fractionalized: CryptoPunks #7804.",
        date: "2025-09-10",
        author: "DeFi Team",
      },
      {
        id: 3,
        title: "500 Creators Onboarded to Beta",
        content:
          "Beta program exceeded expectations with strong creator adoption. Average gas savings: 94% compared to Ethereum.",
        date: "2025-08-18",
        author: "Community Team",
      },
    ],
    donations: [
      {
        id: 1,
        donor: "NFT Collector",
        amount: 18000,
        date: "2025-09-21",
        anonymous: false,
      },
      {
        id: 2,
        donor: "Anonymous",
        amount: 40000,
        date: "2025-09-15",
        anonymous: true,
      },
      {
        id: 3,
        donor: "Art DAO",
        amount: 35000,
        date: "2025-09-08",
        anonymous: false,
      },
      {
        id: 4,
        donor: "Gaming Studio",
        amount: 22000,
        date: "2025-08-30",
        anonymous: false,
      },
      {
        id: 5,
        donor: "Anonymous",
        amount: 12000,
        date: "2025-08-20",
        anonymous: true,
      },
    ],
  },
  {
    id: 4,
    slug: "layer2-scaling-solution",
    title: "Stellar Layer 2 Scaling Protocol",
    category: "Layer 2 & Scaling",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
    description:
      "High-throughput Layer 2 solution with optimistic rollups for scaling Stellar to millions of transactions per second.",
    fullDescription: `Advanced Layer 2 scaling infrastructure that dramatically increases Stellar's transaction throughput while maintaining security and decentralization.

Technical architecture:
• Optimistic rollup design with 7-day challenge period
• 10,000+ TPS with sub-second finality
• EVM compatibility for easy smart contract migration
• Native Stellar asset support with atomic swaps
• Fraud proof verification using zero-knowledge proofs
• Decentralized sequencer network for censorship resistance

Our L2 solution enables complex DeFi applications and high-frequency trading on Stellar while keeping fees below $0.001 per transaction. Smart contracts deployed on our L2 can interact seamlessly with Stellar mainnet assets.

Currently in audit phase with mainnet launch planned for Q2 2026.`,
    raised: 178900,
    goal: 300000,
    donors: 531,
    upvotes: 445,
    downvotes: 18,
    verified: true,
    givbacksEligible: true,
    location: "Decentralized",
    milestones: [
      {
        id: 1,
        title: "Rollup Architecture & Research",
        amount: 60000,
        completed: true,
        date: "2025-03-20",
      },
      {
        id: 2,
        title: "Testnet Development",
        amount: 120000,
        completed: true,
        date: "2025-08-05",
      },
      {
        id: 3,
        title: "Security Audit & Bug Bounty",
        amount: 180000,
        completed: false,
        date: "2025-11-30",
      },
      {
        id: 4,
        title: "Mainnet Launch",
        amount: 240000,
        completed: false,
        date: "2026-02-15",
      },
      {
        id: 5,
        title: "Ecosystem Expansion & Grants",
        amount: 300000,
        completed: false,
        date: "2026-05-01",
      },
    ],
    creator: {
      name: "Stellar Scaling Labs",
      address: "GSL2...K8NM",
      stellarAddress: "GSL2K8NMQPVX2HK3M5LXBWY7AQVNFT2LABSQPVX9WZGSL2K8NMQPVX", // Testnet address
      verified: true,
      memberSince: "2024",
    },
    updates: [
      {
        id: 1,
        title: "Mainnet Audit Initiated with Trail of Bits",
        content:
          "Comprehensive security audit has begun. Covering smart contracts, sequencer logic, and fraud proof mechanisms.",
        date: "2025-09-25",
        author: "Security Team",
      },
      {
        id: 2,
        title: "Testnet Achieves 12,000 TPS Milestone",
        content:
          "Stress testing exceeded design goals. Average transaction finality: 0.8 seconds with zero failures.",
        date: "2025-09-05",
        author: "Engineering Team",
      },
    ],
    donations: [
      {
        id: 1,
        donor: "Scaling Enthusiast",
        amount: 28000,
        date: "2025-09-24",
        anonymous: false,
      },
      {
        id: 2,
        donor: "Anonymous",
        amount: 50000,
        date: "2025-09-18",
        anonymous: true,
      },
      {
        id: 3,
        donor: "DeFi Protocol DAO",
        amount: 45000,
        date: "2025-09-10",
        anonymous: false,
      },
      {
        id: 4,
        donor: "Anonymous",
        amount: 20000,
        date: "2025-08-28",
        anonymous: true,
      },
    ],
  },
  {
    id: 5,
    slug: "smart-contract-security-toolkit",
    title: "Smart Contract Security Toolkit",
    category: "Developer Tools",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop",
    description:
      "Comprehensive security analysis and formal verification tools for Stellar smart contracts and Soroban.",
    fullDescription: `Professional-grade security toolkit designed specifically for Stellar's Soroban smart contract platform, helping developers identify vulnerabilities before deployment.

Toolkit features:
• Static analysis engine with 200+ vulnerability patterns
• Formal verification using symbolic execution
• Automated fuzz testing with edge case generation
• Gas optimization recommendations
• Real-time monitoring for deployed contracts
• Integration with CI/CD pipelines (GitHub Actions, GitLab)
• Comprehensive reporting with remediation guidance

Our tools have already identified critical vulnerabilities in 15+ major DeFi protocols during beta testing, preventing potential exploits worth over $50M.

Open-source core with premium enterprise features. All proceeds fund ongoing research and tool development.`,
    raised: 67200,
    goal: 120000,
    donors: 289,
    upvotes: 198,
    downvotes: 5,
    verified: true,
    givbacksEligible: true,
    location: "Open Source",
    milestones: [
      {
        id: 1,
        title: "Static Analysis Engine Development",
        amount: 25000,
        completed: true,
        date: "2025-06-01",
      },
      {
        id: 2,
        title: "Formal Verification Module",
        amount: 50000,
        completed: true,
        date: "2025-09-28",
      },
      {
        id: 3,
        title: "CI/CD Integration & Testing",
        amount: 75000,
        completed: false,
        date: "2025-12-10",
      },
      {
        id: 4,
        title: "Enterprise Features & Dashboard",
        amount: 100000,
        completed: false,
        date: "2026-02-20",
      },
      {
        id: 5,
        title: "Community Edition & Documentation",
        amount: 120000,
        completed: false,
        date: "2026-04-15",
      },
    ],
    verified: true,
    givbacksEligible: true,
    location: "Open Source",
    creator: {
      name: "Secure Smart Contract Foundation",
      address: "GSEC...P4RT",
      stellarAddress: "GSECP4RTQPVX2HK3M5LXBWY7AQVNFT2LABSQPVX9WZGSECP4RTQPVX", // Testnet address
      verified: true,
      memberSince: "2024",
    },
    updates: [
      {
        id: 1,
        title: "Version 2.0 Released with Formal Verification",
        content:
          "Major update includes formal verification module using Z3 theorem prover. Can mathematically prove contract correctness.",
        date: "2025-09-28",
        author: "Core Dev Team",
      },
      {
        id: 2,
        title: "15 Critical Vulnerabilities Found in Beta Testing",
        content:
          "Our tools identified critical issues across multiple DeFi protocols during private beta, preventing potential exploits.",
        date: "2025-09-12",
        author: "Research Team",
      },
    ],
    donations: [
      {
        id: 1,
        donor: "Security Researcher",
        amount: 8000,
        date: "2025-09-27",
        anonymous: false,
      },
      {
        id: 2,
        donor: "Anonymous",
        amount: 15000,
        date: "2025-09-20",
        anonymous: true,
      },
      {
        id: 3,
        donor: "DeFi Protocol",
        amount: 20000,
        date: "2025-09-15",
        anonymous: false,
      },
      {
        id: 4,
        donor: "Anonymous",
        amount: 10000,
        date: "2025-09-05",
        anonymous: true,
      },
    ],
  },
  {
    id: 6,
    slug: "privacy-preserving-payment-network",
    title: "Privacy-Preserving Payment Network",
    category: "Privacy Technology",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=400&fit=crop",
    description:
      "Anonymous payment protocol using ring signatures and stealth addresses for confidential transactions on Stellar.",
    fullDescription: `Advanced privacy protocol that brings Monero-level anonymity to Stellar network while maintaining regulatory compliance options.

Privacy features:
• Ring signatures with configurable anonymity set size
• Stealth addresses for recipient privacy
• Confidential transactions hiding amounts
• Optional selective disclosure for compliance
• Mixing protocol with decentralized coordination
• Integration with existing Stellar anchors and DEXs

Our protocol allows users to transact privately while businesses can opt into compliance modes that allow selective disclosure to auditors. Best of both worlds: privacy by default, compliance when needed.

Cryptographic foundations audited by academic cryptography experts from MIT and Stanford.`,
    raised: 94500,
    goal: 180000,
    donors: 412,
    upvotes: 367,
    downvotes: 15,
    verified: true,
    givbacksEligible: true,
    location: "Decentralized",
    milestones: [
      {
        id: 1,
        title: "Ring Signature Cryptography Research",
        amount: 36000,
        completed: true,
        date: "2025-04-12",
      },
      {
        id: 2,
        title: "Stealth Address Implementation",
        amount: 72000,
        completed: true,
        date: "2025-07-18",
      },
      {
        id: 3,
        title: "Academic Audit & Peer Review",
        amount: 108000,
        completed: false,
        date: "2025-10-30",
      },
      {
        id: 4,
        title: "Testnet Launch & Mixing Protocol",
        amount: 144000,
        completed: false,
        date: "2026-01-25",
      },
      {
        id: 5,
        title: "Mainnet & Compliance Framework",
        amount: 180000,
        completed: false,
        date: "2026-04-10",
      },
    ],
    creator: {
      name: "Privacy Protocol DAO",
      address: "GPRV...L6QM",
      stellarAddress: "GPRVL6QMXY8ZVWPRVL6QMXY8ZVWPRVL6QMXY8ZVWPRVL6QMXY8ZV", // Testnet address
      verified: true,
      memberSince: "2023",
    },
    updates: [
      {
        id: 1,
        title: "Academic Audit Completed by MIT Cryptographers",
        content:
          "Cryptographic protocols reviewed by leading academics. Paper to be published at IEEE Security & Privacy 2026.",
        date: "2025-09-30",
        author: "Research Team",
      },
      {
        id: 2,
        title: "Testnet Launch with Full Privacy Features",
        content:
          "All privacy features now live on testnet. Ring size: 11, transaction linkability: 0%.",
        date: "2025-09-14",
        author: "Engineering Team",
      },
    ],
    donations: [
      {
        id: 1,
        donor: "Privacy Advocate",
        amount: 12000,
        date: "2025-09-29",
        anonymous: false,
      },
      {
        id: 2,
        donor: "Anonymous",
        amount: 30000,
        date: "2025-09-22",
        anonymous: true,
      },
      {
        id: 3,
        donor: "Crypto Fund",
        amount: 25000,
        date: "2025-09-12",
        anonymous: false,
      },
      {
        id: 4,
        donor: "Anonymous",
        amount: 15000,
        date: "2025-09-01",
        anonymous: true,
      },
    ],
  },
  {
    id: 7,
    slug: "ai-powered-trading-bot",
    title: "AI-Powered Trading Bot",
    category: "Trading & Analytics",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop",
    description:
      "Advanced algorithmic trading bot using machine learning for optimal trade execution and risk management on Stellar DEXs.",
    fullDescription: `Intelligent trading automation platform that leverages artificial intelligence and machine learning to optimize trading strategies on Stellar's decentralized exchanges.

Key capabilities:
• Machine learning algorithms for market prediction and trend analysis
• Automated risk management with dynamic position sizing
• High-frequency trading with sub-millisecond execution
• Multi-strategy portfolio management across Stellar assets
• Real-time market data analysis from multiple sources
• Backtesting engine with historical Stellar network data

Our AI models are trained on 5+ years of Stellar transaction data, achieving 23% better returns than traditional strategies in backtesting. The bot supports both spot and margin trading with integrated liquidation protection.

Currently in beta with 500+ active users, generating an average of 18% monthly returns for conservative strategies.`,
    raised: 112300,
    goal: 175000,
    donors: 398,
    upvotes: 267,
    downvotes: 9,
    verified: true,
    givbacksEligible: true,
    location: "Decentralized",
    milestones: [
      {
        id: 1,
        title: "AI Model Development & Training",
        amount: 40000,
        completed: true,
        date: "2025-05-20",
      },
      {
        id: 2,
        title: "Trading Engine & Risk Management",
        amount: 70000,
        completed: true,
        date: "2025-08-10",
      },
      {
        id: 3,
        title: "Beta Testing & Performance Optimization",
        amount: 105000,
        completed: false,
        date: "2025-11-15",
      },
      {
        id: 4,
        title: "Mobile App & Advanced Features",
        amount: 140000,
        completed: false,
        date: "2026-01-30",
      },
      {
        id: 5,
        title: "Institutional Features & API",
        amount: 175000,
        completed: false,
        date: "2026-04-15",
      },
    ],
    creator: {
      name: "Quantum Trading Labs",
      address: "GQTL...X9MN",
      stellarAddress:
        "GQTLX9MNQPVX2HK3M5LXBWY7AQVNFT2LABSQPVX9WZGQTLX9MNQPVX", // Testnet address
      verified: true,
      memberSince: "2024",
    },
    updates: [
      {
        id: 1,
        title: "Beta Launch with 500 Users",
        content:
          "Public beta launched with advanced AI strategies. Users reporting 15-25% monthly returns in conservative mode.",
        date: "2025-09-18",
        author: "Product Team",
      },
      {
        id: 2,
        title: "New ML Model Deployed",
        content:
          "Latest model incorporates sentiment analysis from crypto news and social media for improved predictions.",
        date: "2025-08-30",
        author: "AI Team",
      },
    ],
    donations: [
      {
        id: 1,
        donor: "Crypto Trader",
        amount: 15000,
        date: "2025-09-20",
        anonymous: false,
      },
      {
        id: 2,
        donor: "Anonymous",
        amount: 22000,
        date: "2025-09-12",
        anonymous: true,
      },
      {
        id: 3,
        donor: "Trading Firm",
        amount: 30000,
        date: "2025-09-05",
        anonymous: false,
      },
      {
        id: 4,
        donor: "Anonymous",
        amount: 18000,
        date: "2025-08-25",
        anonymous: true,
      },
    ],
  },
  {
    id: 8,
    slug: "decentralized-oracle-network",
    title: "Decentralized Oracle Network",
    category: "Infrastructure",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
    description:
      "Secure and reliable oracle network providing real-world data feeds to Stellar smart contracts with economic security.",
    fullDescription: `Comprehensive oracle infrastructure that bridges real-world data with Stellar's blockchain, enabling smart contracts to access external information securely and reliably.

Network features:
• Decentralized oracle nodes with economic staking
• Multi-source data aggregation with outlier detection
• Price feeds for 2000+ assets including crypto, stocks, commodities
• Weather, sports, and IoT data integration
• Verifiable randomness generation for gaming and NFTs
• Cross-chain data bridging capabilities

Our network uses a novel consensus mechanism combining proof-of-stake with data validation, ensuring 99.9% uptime and sub-second response times. Oracles are economically secured with $50M+ staked assets.

Already powering 50+ DeFi protocols on Stellar with zero data manipulation incidents in 18 months of operation.`,
    raised: 187500,
    goal: 250000,
    donors: 567,
    upvotes: 423,
    downvotes: 14,
    verified: true,
    givbacksEligible: true,
    location: "Decentralized",
    milestones: [
      {
        id: 1,
        title: "Oracle Protocol Design & Research",
        amount: 50000,
        completed: true,
        date: "2025-03-15",
      },
      {
        id: 2,
        title: "Core Network Development",
        amount: 100000,
        completed: true,
        date: "2025-07-01",
      },
      {
        id: 3,
        title: "Data Source Integration & Testing",
        amount: 150000,
        completed: true,
        date: "2025-09-20",
      },
      {
        id: 4,
        title: "Mainnet Launch & Staking",
        amount: 200000,
        completed: false,
        date: "2025-12-01",
      },
      {
        id: 5,
        title: "Enterprise Solutions & Expansion",
        amount: 250000,
        completed: false,
        date: "2026-03-15",
      },
    ],
    creator: {
      name: "Oracle Network Foundation",
      address: "GONF...Q8WX",
      stellarAddress:
        "GONFQ8WXQPVX2HK3M5LXBWY7AQVNFT2LABSQPVX9WZGONFQ8WXQPVX", // Testnet address
      verified: true,
      memberSince: "2023",
    },
    updates: [
      {
        id: 1,
        title: "50 Protocols Integrated",
        content:
          "Our oracle network now powers lending protocols, DEXs, and prediction markets with 99.9% uptime.",
        date: "2025-09-25",
        author: "Integration Team",
      },
      {
        id: 2,
        title: "Cross-Chain Data Bridge Live",
        content:
          "New feature allows Stellar contracts to access data from Ethereum, Polygon, and other chains.",
        date: "2025-09-10",
        author: "Bridge Team",
      },
    ],
    donations: [
      {
        id: 1,
        donor: "DeFi Protocol",
        amount: 35000,
        date: "2025-09-22",
        anonymous: false,
      },
      {
        id: 2,
        donor: "Anonymous",
        amount: 45000,
        date: "2025-09-15",
        anonymous: true,
      },
      {
        id: 3,
        donor: "Blockchain Foundation",
        amount: 40000,
        date: "2025-09-08",
        anonymous: false,
      },
      {
        id: 4,
        donor: "Anonymous",
        amount: 25000,
        date: "2025-08-30",
        anonymous: true,
      },
    ],
  },
  {
    id: 9,
    slug: "carbon-credit-trading-platform",
    title: "Carbon Credit Trading Platform",
    category: "Sustainability",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop",
    description:
      "Blockchain-based platform for trading carbon credits with transparent tracking and automated offset verification on Stellar.",
    fullDescription: `Revolutionary platform that tokenizes carbon credits on Stellar, enabling transparent and efficient trading of environmental assets for climate action.

Platform features:
• Tokenized carbon credits with unique serial numbers
• Automated verification using satellite imagery and IoT sensors
• Fractional ownership for accessible investing
• Smart contract automation for offset retirement
• Integration with major carbon registries (Gold Standard, Verra)
• Real-time impact tracking and reporting

Our platform processes 10,000+ tons of CO2 offsets monthly, with credits backed by verified reforestation, renewable energy, and efficiency projects. Using Stellar's fast and cheap transactions, we reduce trading costs by 95% compared to traditional markets.

Partnered with 20+ corporations and NGOs, facilitating $50M+ in carbon trading volume.`,
    raised: 98400,
    goal: 160000,
    donors: 445,
    upvotes: 356,
    downvotes: 11,
    verified: true,
    givbacksEligible: true,
    location: "Global",
    milestones: [
      {
        id: 1,
        title: "Carbon Credit Tokenization Protocol",
        amount: 35000,
        completed: true,
        date: "2025-04-10",
      },
      {
        id: 2,
        title: "Verification System Development",
        amount: 70000,
        completed: true,
        date: "2025-07-25",
      },
      {
        id: 3,
        title: "Registry Integration & Testing",
        amount: 105000,
        completed: false,
        date: "2025-11-05",
      },
      {
        id: 4,
        title: "Trading Platform Launch",
        amount: 140000,
        completed: false,
        date: "2026-01-20",
      },
      {
        id: 5,
        title: "Global Expansion & Partnerships",
        amount: 160000,
        completed: false,
        date: "2026-04-30",
      },
    ],
    creator: {
      name: "Climate Chain Foundation",
      address: "GCCF...N2KL",
      stellarAddress:
        "GCCFN2KLQPVX2HK3M5LXBWY7AQVNFT2LABSQPVX9WZGCCFN2KLQPVX", // Testnet address
      verified: true,
      memberSince: "2024",
    },
    updates: [
      {
        id: 1,
        title: "Gold Standard Registry Integration",
        content:
          "Successfully integrated with Gold Standard carbon registry, enabling trading of verified carbon credits.",
        date: "2025-09-28",
        author: "Integration Team",
      },
      {
        id: 2,
        title: "First Corporate Partnership",
        content:
          "Major tech company commits to offsetting 100,000 tons of CO2 through our platform.",
        date: "2025-09-15",
        author: "Partnership Team",
      },
    ],
    donations: [
      {
        id: 1,
        donor: "Environmental NGO",
        amount: 12000,
        date: "2025-09-26",
        anonymous: false,
      },
      {
        id: 2,
        donor: "Anonymous",
        amount: 25000,
        date: "2025-09-18",
        anonymous: true,
      },
      {
        id: 3,
        donor: "Green Tech Company",
        amount: 18000,
        date: "2025-09-10",
        anonymous: false,
      },
      {
        id: 4,
        donor: "Anonymous",
        amount: 15000,
        date: "2025-08-28",
        anonymous: true,
      },
    ],
  },
  {
    id: 10,
    slug: "stellar-gaming-metaverse",
    title: "Stellar Gaming Metaverse",
    category: "NFT & Gaming",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop",
    description:
      "Immersive gaming metaverse built on Stellar with play-to-earn mechanics, NFT assets, and cross-game interoperability.",
    fullDescription: `Next-generation gaming ecosystem that combines blockchain technology with immersive virtual worlds, creating economic opportunities for players worldwide.

Metaverse features:
• Cross-game NFT assets and character progression
• Play-to-earn mechanics with sustainable tokenomics
• Decentralized land ownership and development
• Social hubs with voice chat and events
• Tournament system with prize pools
• Creator tools for user-generated content

Our metaverse hosts 50,000+ daily active users across multiple games, with $2M+ in monthly player earnings. Using Stellar's fast transactions, we enable instant item trading and seamless cross-game asset movement.

Partnerships with major game studios bringing traditional gaming audiences to Web3.`,
    raised: 245600,
    goal: 400000,
    donors: 892,
    upvotes: 678,
    downvotes: 34,
    verified: true,
    givbacksEligible: true,
    location: "Virtual",
    milestones: [
      {
        id: 1,
        title: "Core Metaverse Engine Development",
        amount: 80000,
        completed: true,
        date: "2025-02-28",
      },
      {
        id: 2,
        title: "First Game Integration",
        amount: 160000,
        completed: true,
        date: "2025-06-15",
      },
      {
        id: 3,
        title: "Cross-Game Asset System",
        amount: 240000,
        completed: true,
        date: "2025-09-01",
      },
      {
        id: 4,
        title: "Land Sales & Creator Tools",
        amount: 320000,
        completed: false,
        date: "2025-12-15",
      },
      {
        id: 5,
        title: "Mobile Expansion & Global Launch",
        amount: 400000,
        completed: false,
        date: "2026-03-30",
      },
    ],
    creator: {
      name: "MetaGame Studios",
      address: "GMGS...T4UV",
      stellarAddress:
        "GMGST4UVQPVX2HK3M5LXBWY7AQVNFT2LABSQPVX9WZGMGST4UVQPVX", // Testnet address
      verified: true,
      memberSince: "2023",
    },
    updates: [
      {
        id: 1,
        title: "50,000 Daily Active Users Milestone",
        content:
          "Metaverse reaches 50K DAU with players earning average $15/day through gameplay and tournaments.",
        date: "2025-09-20",
        author: "Community Team",
      },
      {
        id: 2,
        title: "Major Game Studio Partnership",
        content:
          "Leading mobile game developer integrates their 10M+ user game into our metaverse ecosystem.",
        date: "2025-08-25",
        author: "Partnership Team",
      },
      {
        id: 3,
        title: "Virtual Land Auction Success",
        content:
          "First virtual land auction raises 500,000 XLM for community development fund.",
        date: "2025-07-30",
        author: "Economy Team",
      },
    ],
    donations: [
      {
        id: 1,
        donor: "Game Developer",
        amount: 25000,
        date: "2025-09-22",
        anonymous: false,
      },
      {
        id: 2,
        donor: "Anonymous",
        amount: 60000,
        date: "2025-09-15",
        anonymous: true,
      },
      {
        id: 3,
        donor: "Gaming Guild",
        amount: 35000,
        date: "2025-09-08",
        anonymous: false,
      },
      {
        id: 4,
        donor: "NFT Collector",
        amount: 28000,
        date: "2025-08-30",
        anonymous: false,
      },
      {
        id: 5,
        donor: "Anonymous",
        amount: 20000,
        date: "2025-08-20",
        anonymous: true,
      },
    ],
  },
  {
    id: 11,
    slug: "cross-chain-bridge-protocol",
    title: "Cross-Chain Bridge Protocol",
    category: "Infrastructure",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop",
    description:
      "Universal bridge protocol enabling seamless asset transfers between Stellar and 15+ major blockchains with institutional security.",
    fullDescription: `Advanced interoperability protocol that connects Stellar with major blockchains, enabling secure and efficient cross-chain asset transfers.

Bridge capabilities:
• 15+ supported chains (Ethereum, BSC, Polygon, Solana, Avalanche, etc.)
• Institutional-grade security with multi-sig and MPC
• Fast finality with optimistic validation
• Native asset wrapping and synthetic token creation
• Cross-chain smart contract calls
• Liquidity mining incentives for bridge usage

Our bridge processes $500M+ in daily volume with zero security incidents. Using a hybrid security model combining multi-party computation with optimistic validation, we achieve both speed and security.

Integrated with major DEXs and lending protocols across all supported chains.`,
    raised: 312000,
    goal: 500000,
    donors: 734,
    upvotes: 589,
    downvotes: 27,
    verified: true,
    givbacksEligible: true,
    location: "Decentralized",
    milestones: [
      {
        id: 1,
        title: "Bridge Protocol Architecture",
        amount: 75000,
        completed: true,
        date: "2025-01-15",
      },
      {
        id: 2,
        title: "Multi-Chain Integration (5 chains)",
        amount: 150000,
        completed: true,
        date: "2025-05-01",
      },
      {
        id: 3,
        title: "Security Audit & MPC Implementation",
        amount: 225000,
        completed: true,
        date: "2025-08-20",
      },
      {
        id: 4,
        title: "Mainnet Launch & Liquidity Mining",
        amount: 375000,
        completed: false,
        date: "2025-11-30",
      },
      {
        id: 5,
        title: "Full Chain Expansion & DeFi Integration",
        amount: 500000,
        completed: false,
        date: "2026-02-28",
      },
    ],
    creator: {
      name: "Interoperability Labs",
      address: "GILB...S5YZ",
      stellarAddress:
        "GILBS5YZQPVX2HK3M5LXBWY7AQVNFT2LABSQPVX9WZGILBS5YZQPVX", // Testnet address
      verified: true,
      memberSince: "2023",
    },
    updates: [
      {
        id: 1,
        title: "Bridge Volume Hits $500M Daily",
        content:
          "Cross-chain transfers exceed $500M in daily volume, connecting Stellar with 12 major blockchains.",
        date: "2025-09-28",
        author: "Operations Team",
      },
      {
        id: 2,
        title: "New Chain Integration: Solana",
        content:
          "Solana integration complete with full asset support. Users can now bridge SOL and SPL tokens to Stellar.",
        date: "2025-09-12",
        author: "Integration Team",
      },
      {
        id: 3,
        title: "Institutional Security Audit Passed",
        content:
          "Comprehensive security audit by Trail of Bits completed with zero critical findings.",
        date: "2025-08-18",
        author: "Security Team",
      },
    ],
    donations: [
      {
        id: 1,
        donor: "Blockchain Foundation",
        amount: 50000,
        date: "2025-09-25",
        anonymous: false,
      },
      {
        id: 2,
        donor: "Anonymous",
        amount: 75000,
        date: "2025-09-18",
        anonymous: true,
      },
      {
        id: 3,
        donor: "DeFi Protocol",
        amount: 45000,
        date: "2025-09-10",
        anonymous: false,
      },
      {
        id: 4,
        donor: "Crypto Exchange",
        amount: 60000,
        date: "2025-08-28",
        anonymous: false,
      },
      {
        id: 5,
        donor: "Anonymous",
        amount: 35000,
        date: "2025-08-15",
        anonymous: true,
      },
    ],
  },
  {
    id: 12,
    slug: "decentralized-social-media-platform",
    title: "Decentralized Social Media Platform",
    category: "Social & Content",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop",
    description:
      "Censorship-resistant social media platform built on Stellar with creator monetization, NFT integration, and algorithmic transparency.",
    fullDescription: `Privacy-focused social media ecosystem that gives users control over their data and content, while fairly compensating creators for their contributions.

Platform features:
• Decentralized content storage with IPFS integration
• Creator monetization through micro-donations and NFTs
• Transparent algorithms with user-controlled feeds
• End-to-end encrypted messaging and groups
• NFT profile pictures and collectible content
• Cross-platform content portability

Our platform hosts 100,000+ active users generating $1.2M in monthly creator earnings. Using Stellar's payment system, we enable instant micro-payments and tipping with zero fees for creators.

Unique governance model gives users voting rights on platform changes and content moderation policies.`,
    raised: 156800,
    goal: 225000,
    donors: 623,
    upvotes: 489,
    downvotes: 22,
    verified: true,
    givbacksEligible: true,
    location: "Decentralized",
    milestones: [
      {
        id: 1,
        title: "Social Protocol & Smart Contracts",
        amount: 45000,
        completed: true,
        date: "2025-03-10",
      },
      {
        id: 2,
        title: "Content System & IPFS Integration",
        amount: 90000,
        completed: true,
        date: "2025-06-20",
      },
      {
        id: 3,
        title: "Monetization Features & Beta Launch",
        amount: 135000,
        completed: true,
        date: "2025-09-05",
      },
      {
        id: 4,
        title: "Mobile Apps & Advanced Features",
        amount: 180000,
        completed: false,
        date: "2025-12-20",
      },
      {
        id: 5,
        title: "Global Scaling & Partnerships",
        amount: 225000,
        completed: false,
        date: "2026-03-10",
      },
    ],
    creator: {
      name: "Social Web Foundation",
      address: "GSWF...B7CD",
      stellarAddress:
        "GSWFB7CDQPVX2HK3M5LXBWY7AQVNFT2LABSQPVX9WZG SWFB7CDQPVX", // Testnet address
      verified: true,
      memberSince: "2024",
    },
    updates: [
      {
        id: 1,
        title: "100K Users & $1.2M Creator Earnings",
        content:
          "Platform reaches 100,000 active users with creators earning average $120/month through donations and NFTs.",
        date: "2025-09-22",
        author: "Growth Team",
      },
      {
        id: 2,
        title: "NFT Content Integration",
        content:
          "Users can now mint posts and threads as NFTs, creating new monetization opportunities for content creators.",
        date: "2025-09-08",
        author: "Product Team",
      },
      {
        id: 3,
        title: "Algorithmic Transparency Feature",
        content:
          "New feature allows users to see and modify how their feed algorithm works, promoting transparency.",
        date: "2025-08-20",
        author: "Engineering Team",
      },
    ],
    donations: [
      {
        id: 1,
        donor: "Content Creator",
        amount: 18000,
        date: "2025-09-24",
        anonymous: false,
      },
      {
        id: 2,
        donor: "Anonymous",
        amount: 35000,
        date: "2025-09-16",
        anonymous: true,
      },
      {
        id: 3,
        donor: "Privacy Advocate",
        amount: 22000,
        date: "2025-09-09",
        anonymous: false,
      },
      {
        id: 4,
        donor: "Social Media User",
        amount: 15000,
        date: "2025-08-31",
        anonymous: false,
      },
      {
        id: 5,
        donor: "Anonymous",
        amount: 12000,
        date: "2025-08-18",
        anonymous: true,
      },
    ],
  },
];

// Get project by slug
export const getProjectBySlug = (slug) => {
  return projectsData.find((project) => project.slug === slug);
};

// Get projects by category
export const getProjectsByCategory = (category) => {
  if (category === "All") return projectsData;
  return projectsData.filter((project) => project.category === category);
};

// Get featured projects (top 3 by raised amount)
export const getFeaturedProjects = () => {
  return [...projectsData].sort((a, b) => b.raised - a.raised).slice(0, 3);
};
