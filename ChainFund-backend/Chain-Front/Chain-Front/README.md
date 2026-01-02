# ChainFund - Blockchain Philanthropy Platform

A comprehensive full-stack decentralized application (dApp) built with React, Vite, Express, MongoDB, and Stellar blockchain integration. This platform enables transparent, secure, and instant donations to verified projects worldwide.

## 🌟 Features

### Frontend

- **Modern UI/UX**: Premium design with smooth animations using Framer Motion
- **Stellar Wallet Integration**: Connect with Freighter, Albedo, or LOBSTR wallets
- **Project Discovery**: Browse and filter projects by category
- **Real-time Donations**: Instant transactions on Stellar blockchain
- **GIVeconomy**: Token rewards and staking mechanisms
- **Responsive Design**: Fully optimized for all devices
- **Dark Mode**: Professional dark theme with gradient accents

### Backend

- **RESTful API**: Express.js server with MongoDB
- **Project Management**: CRUD operations for projects
- **Donation Tracking**: Record and verify blockchain transactions
- **User Profiles**: Manage donor and creator accounts
- **Statistics**: Real-time project and donation analytics

### Blockchain Features

- **Multi-Asset Support**: XLM, USDC, and custom Stellar tokens
- **Transaction Memos**: Track donation purposes
- **Instant Settlement**: Leverage Stellar's fast finality
- **Low Fees**: Minimal transaction costs
- **Transparent**: All transactions on-chain

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- MongoDB 4.4+ (local or Atlas)
- Freighter Wallet extension (for testing)

### Installation

1. **Clone and Install Dependencies**

```powershell
cd Stellar
npm install
```

2. **Setup Environment Variables**

```powershell
copy .env.example .env
```

Edit `.env` and configure your MongoDB connection string.

3. **Start MongoDB** (if running locally)

```powershell
# Make sure MongoDB service is running
```

4. **Start Backend Server**

```powershell
npm run server
```

5. **Start Frontend Development Server** (in a new terminal)

```powershell
npm run dev
```

6. **Access the Application**

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Project Structure

```
Stellar/
├── src/                          # Frontend React application
│   ├── components/              # Reusable React components
│   │   ├── home/               # Homepage sections
│   │   ├── layout/             # Navbar, Footer
│   │   ├── projects/           # Project components
│   │   └── ...
│   ├── context/                # React Context (Stellar wallet)
│   ├── pages/                  # Route pages
│   └── index.css               # Tailwind styles
├── server/                      # Backend Express application
│   ├── models/                 # MongoDB schemas
│   ├── routes/                 # API routes
│   └── index.js                # Server entry point
├── public/                      # Static assets
└── package.json                 # Dependencies

```

## 🔧 Tech Stack

### Frontend

- **React 18**: UI library
- **Vite**: Build tool and dev server
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Animation library
- **Stellar SDK**: Blockchain integration
- **Freighter API**: Wallet connection
- **Axios**: HTTP client
- **Zustand**: State management
- **React Hot Toast**: Notifications
- **Lucide React**: Icon library

### Backend

- **Express**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM for MongoDB
- **CORS**: Cross-origin support
- **Dotenv**: Environment configuration

### Blockchain

- **Stellar SDK**: Blockchain interactions
- **Freighter Wallet**: Browser extension wallet
- **Horizon API**: Stellar network access

## 🎨 Key Features Explained

### Stellar Wallet Integration

The platform uses Freighter wallet for secure transaction signing:

- Connect/disconnect wallet
- View account balances
- Sign and submit transactions
- Switch between testnet and mainnet

### Project Donation Flow

1. User browses projects
2. Selects a project to support
3. Connects Stellar wallet
4. Chooses donation amount and asset
5. Reviews transaction details
6. Confirms and signs transaction
7. Receives instant confirmation

### GIVeconomy

- **GIV Token**: Platform governance token
- **GIVbacks**: Reward donors with tokens
- **GIVpower**: Stake tokens to boost projects
- **GIVfarm**: Liquidity provision rewards

## 📡 API Endpoints

### Projects

- `GET /api/projects` - List all projects
- `GET /api/projects/:slug` - Get project details
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/projects/:id/stats` - Project statistics

### Donations

- `GET /api/donations` - List all donations
- `GET /api/donations/transaction/:hash` - Get by transaction hash
- `POST /api/donations` - Record new donation
- `GET /api/donations/stats/:projectId` - Donation stats

### Users

- `GET /api/users/:address` - Get user profile
- `POST /api/users` - Create/update user
- `GET /api/users/:address/stats` - User statistics
- `GET /api/users/:address/projects` - User's projects
- `GET /api/users/:address/donations` - User's donations

## 🧪 Testing on Stellar Testnet

1. **Get Testnet Account**

   - Visit: https://laboratory.stellar.org/#account-creator
   - Create and fund a testnet account

2. **Install Freighter Wallet**

   - Add extension from https://www.freighter.app/
   - Import your testnet account

3. **Switch to Testnet**

   - In the app, select "Testnet" from network dropdown
   - Connect your wallet

4. **Make Test Donations**
   - Browse projects
   - Donate using testnet XLM
   - View transaction on Stellar Explorer

## 🌐 Deployment

### Frontend (Vercel/Netlify)

```powershell
npm run build
# Deploy the dist/ folder
```

### Backend (Heroku/Railway/Render)

```powershell
# Set environment variables
# Deploy server folder
```

### Environment Variables for Production

- Set `MONGODB_URI` to your MongoDB Atlas connection string
- Set `STELLAR_NETWORK=PUBLIC` for mainnet
- Configure CORS origins
- Set secure JWT secrets

## 🔐 Security Considerations

- Never commit `.env` files
- Use environment variables for secrets
- Validate all user inputs
- Implement rate limiting on API
- Use HTTPS in production
- Verify Stellar transactions on-chain
- Implement proper authentication for sensitive operations

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

MIT License - feel free to use this project for learning or production.

## 🆘 Support

For issues or questions:

- Create an issue in the repository
- Check Stellar documentation: https://developers.stellar.org
- Join Stellar Discord community

## 🎯 Roadmap

- [ ] Multi-signature project wallets
- [ ] Quadratic funding rounds
- [ ] NFT rewards for donors
- [ ] Mobile app (React Native)
- [ ] DAO governance
- [ ] Cause-based AI donation distribution
- [ ] Payment streaming
- [ ] Social features and project updates
- [ ] Advanced analytics dashboard
- [ ] Integration with more wallets (Albedo, LOBSTR)

## 🙏 Acknowledgments

- Stellar Development Foundation
- Giveth Foundation (inspiration)
- Freighter Wallet team
- Open source community

---

**Built with ❤️ for changemakers worldwide**
