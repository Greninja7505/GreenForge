# Deployment Guide for ChainFund

## Project Structure
```
ChainFund-backend/
├── ChainFund-backend/
│   ├── Chain-Front/
│   │   └── Chain-Front/          # React Frontend App
│   │       ├── package.json
│   │       ├── vite.config.ts
│   │       └── src/
│   └── ChainFund/
│       └── chainfund-backend/    # Python Backend API
│           ├── requirements.txt
│           └── start_server.py
├── package.json                  # Root package.json for monorepo
├── render.yaml                   # Render deployment config
└── build.sh                      # Build script
```

## Deployment Instructions

### Option 1: Render.com (Recommended)

1. **Connect Repository**: Link your GitHub repository to Render
2. **Use render.yaml**: The `render.yaml` file will automatically configure your services
3. **Environment Variables**: Set these in Render dashboard:
   - `NODE_VERSION=18.17.0`
   - `PYTHON_VERSION=3.11.0`
   - Any custom environment variables for your app

### Option 2: Manual Configuration

#### Frontend (Static Site)
- **Build Command**: `cd ChainFund-backend/Chain-Front/Chain-Front && npm install && npm run build`
- **Publish Directory**: `ChainFund-backend/Chain-Front/Chain-Front/dist`
- **Redirects**: All routes should redirect to `/index.html` for SPA routing

#### Backend (Web Service)
- **Build Command**: `cd ChainFund-backend/ChainFund/chainfund-backend && pip install -r requirements.txt`
- **Start Command**: `cd ChainFund-backend/ChainFund/chainfund-backend && python start_server.py`

### Option 3: Using Build Script

You can also use the provided build script:
```bash
chmod +x build.sh
./build.sh
```

## Troubleshooting

### Common Issues:

1. **ENOENT package.json error**: 
   - Make sure Render is looking in the correct directory
   - Use the root `package.json` or specify the correct path

2. **Missing script: "dev" error**:
   - This happens when Render tries to run `npm run dev` from wrong directory
   - Use the root package.json which now includes all necessary scripts
   - For static sites, use build command instead of dev command

3. **Build failures**:
   - Check Node.js version (should be 18+)
   - Verify all dependencies are listed correctly
   - Check build logs for specific errors
   - Try using `npm ci` instead of `npm install` for faster, reliable builds

4. **404 errors after deployment**:
   - Ensure redirects are configured for SPA routing
   - Check that `vercel.json` or equivalent redirect rules are in place

### Render-Specific Solutions:

If you're getting script errors on Render:

1. **Use Simple Configuration**: Rename `render-simple.yaml` to `render.yaml`
2. **Manual Setup**: If yaml doesn't work, configure manually:
   - **Service Type**: Static Site
   - **Build Command**: `npm run build`
   - **Publish Directory**: `ChainFund-backend/Chain-Front/Chain-Front/dist`
   - **Node Version**: 18

3. **Debug Build**: Check the build script output in Render logs

### Port Detection Issues:

If you see "No open ports detected on 0.0.0.0":

1. **Verify Static Site Setup**: Make sure you selected "Static Site" not "Web Service"
2. **Check Configuration**: Ensure `env: static` is set in render.yaml
3. **Manual Override**: In Render dashboard:
   - Go to Settings
   - Change service type to "Static Site"
   - Set publish directory to `ChainFund-backend/Chain-Front/Chain-Front/dist`
4. **Alternative Configs**: Try `render-simple.yaml` or `render-backup.yaml`

## Environment Variables

Create a `.env` file in the frontend directory with:
```
VITE_STELLAR_NETWORK=testnet
VITE_STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
VITE_API_BASE_URL=/api
```

## Support

For deployment issues, check:
1. Build logs in Render dashboard
2. Network configuration for API calls
3. Static file serving configuration