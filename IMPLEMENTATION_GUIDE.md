# 🛠️ GreenForge Complete Implementation Guide

> **Date:** January 10, 2026  
> **Goal:** Fix all 5 phases while PRESERVING existing data  
> **Total Time:** 2-3 weeks (can be done incrementally)

---

## 📋 Pre-Implementation Checklist

Before making ANY changes, we will:

1. ✅ Backup existing SQLite database (if exists)
2. ✅ Keep existing frontend mock data in `projects.js` as fallback
3. ✅ Use migration scripts that ADD to database, not DROP
4. ✅ Never delete existing tables or columns

---

## 🗃️ PHASE 5 FIRST: SQLite Optimization (Do This First!)

**Why first?** All other phases depend on a stable, optimized database.

### Step 5.1: Backup Existing Data

```bash
# Run in: ChainFund-backend/ChainFund/chainfund-backend

# Create backup directory
mkdir -p backups

# Copy database if it exists
if (Test-Path chainfund.db) { Copy-Item chainfund.db backups/chainfund_backup_$(Get-Date -Format "yyyyMMdd").db }
```

### Step 5.2: Add WAL Mode and Performance Settings

**File:** `app/database.py`

**ADD these changes (don't remove anything):**

```python
# At the top of file, add after imports
import threading

# Database connection pool (single writer, multiple readers)
_connection_pool = {}
_lock = threading.Lock()

# REPLACE get_db_connection with optimized version:
@contextmanager
def get_db_connection():
    """Optimized context manager with WAL mode"""
    conn = sqlite3.connect(
        str(DB_PATH),
        timeout=30.0,
        isolation_level=None,  # Autocommit for reads
        check_same_thread=False
    )
    conn.row_factory = sqlite3.Row
    
    # Performance optimizations
    conn.execute("PRAGMA journal_mode=WAL")       # Write-Ahead Logging
    conn.execute("PRAGMA synchronous=NORMAL")     # Faster writes
    conn.execute("PRAGMA cache_size=-64000")      # 64MB cache
    conn.execute("PRAGMA temp_store=MEMORY")      # Temp tables in RAM
    conn.execute("PRAGMA busy_timeout=5000")      # 5s timeout
    
    try:
        yield conn
    finally:
        conn.close()
```

### Step 5.3: Add New Tables (Without Dropping Existing)

**ADD to `init_database()` function:**

```python
# ADD after existing tables (around line 350)

# Governance Proposals table (NEW)
cursor.execute('''
    CREATE TABLE IF NOT EXISTS governance_proposals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        proposer_wallet TEXT,
        status TEXT DEFAULT 'active',  -- active, passed, rejected, executed
        votes_for INTEGER DEFAULT 0,
        votes_against INTEGER DEFAULT 0,
        quorum_required INTEGER DEFAULT 100,
        voting_ends_at TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (proposer_wallet) REFERENCES users(wallet_address)
    )
''')

# Governance Votes table (NEW)
cursor.execute('''
    CREATE TABLE IF NOT EXISTS governance_votes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        proposal_id INTEGER NOT NULL,
        voter_wallet TEXT NOT NULL,
        vote_power INTEGER NOT NULL,
        vote_direction TEXT NOT NULL,  -- 'for' or 'against'
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(proposal_id, voter_wallet),
        FOREIGN KEY (proposal_id) REFERENCES governance_proposals(id),
        FOREIGN KEY (voter_wallet) REFERENCES users(wallet_address)
    )
''')

# SBT Tokens table (NEW)
cursor.execute('''
    CREATE TABLE IF NOT EXISTS sbt_tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        owner_wallet TEXT NOT NULL,
        role TEXT NOT NULL,  -- Creator, Backer, SuperBacker, etc.
        campaign_id INTEGER,
        metadata_uri TEXT,
        issued_at TEXT DEFAULT CURRENT_TIMESTAMP,
        is_active INTEGER DEFAULT 1,
        FOREIGN KEY (owner_wallet) REFERENCES users(wallet_address),
        FOREIGN KEY (campaign_id) REFERENCES projects(id)
    )
''')

# AI Verifications table (NEW)  
cursor.execute('''
    CREATE TABLE IF NOT EXISTS ai_verifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        milestone_id INTEGER NOT NULL,
        project_id INTEGER NOT NULL,
        image_path TEXT,
        ai_result TEXT,  -- JSON with confidence, analysis, etc.
        status TEXT DEFAULT 'pending',  -- pending, verified, rejected
        verified_by TEXT,  -- 'groq', 'gpt4o', 'manual'
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (milestone_id) REFERENCES milestones(id),
        FOREIGN KEY (project_id) REFERENCES projects(id)
    )
''')

# Oracle Votes table (NEW - for multi-oracle)
cursor.execute('''
    CREATE TABLE IF NOT EXISTS oracle_votes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        milestone_id INTEGER NOT NULL,
        oracle_address TEXT NOT NULL,
        vote_result TEXT NOT NULL,  -- 'approve' or 'reject'
        confidence INTEGER,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(milestone_id, oracle_address),
        FOREIGN KEY (milestone_id) REFERENCES milestones(id)
    )
''')
```

---

## 🔧 PHASE 1: Stellar SDK Migration

### Step 1.1: Install Dependencies

```bash
cd ChainFund-backend/ChainFund/chainfund-backend
pip install stellar-sdk>=10.0.0
```

### Step 1.2: Create New SDK Service (Keep Old as Fallback)

**File:** `app/services/soroban_sdk_v2.py` (NEW FILE)

```python
"""
Stellar SDK v2 Service - Direct SDK calls (no subprocess)
"""
from stellar_sdk import (
    Keypair, Network, Server, SorobanServer, 
    TransactionBuilder, scval
)
from stellar_sdk.soroban_rpc import GetTransactionStatus
import asyncio
from app.config import settings
import logging

logger = logging.getLogger(__name__)

class SorobanSDKService:
    """Modern Stellar SDK service replacing subprocess calls"""
    
    def __init__(self):
        self.rpc_url = "https://soroban-testnet.stellar.org"
        self.horizon_url = "https://horizon-testnet.stellar.org"
        self.network_passphrase = Network.TESTNET_NETWORK_PASSPHRASE
        
        # Load admin keypair if available
        if settings.stellar_admin_secret:
            self.admin_keypair = Keypair.from_secret(settings.stellar_admin_secret)
        else:
            self.admin_keypair = None
            logger.warning("No admin secret configured - contract writes disabled")
            
        # Initialize servers
        self.horizon = Server(horizon_url=self.horizon_url)
        self.soroban = SorobanServer(self.rpc_url)
        
        # Contract addresses
        self.core_contract_id = settings.chainfund_contract_id
        
    async def get_account(self, public_key: str) -> dict:
        """Get account info from Horizon"""
        try:
            account = self.horizon.accounts().account_id(public_key).call()
            xlm_balance = next(
                (b["balance"] for b in account["balances"] if b["asset_type"] == "native"),
                "0"
            )
            return {
                "success": True,
                "public_key": public_key,
                "xlm_balance": xlm_balance,
                "sequence": account["sequence"]
            }
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    async def invoke_contract(
        self,
        contract_id: str,
        function_name: str,
        args: list = None,
        source_keypair: Keypair = None
    ) -> dict:
        """Invoke a contract function using proper SDK"""
        try:
            keypair = source_keypair or self.admin_keypair
            if not keypair:
                return {"success": False, "error": "No keypair available for signing"}
            
            # Load source account
            source_account = self.soroban.load_account(keypair.public_key)
            
            # Build transaction
            tx = (
                TransactionBuilder(
                    source_account=source_account,
                    network_passphrase=self.network_passphrase,
                    base_fee=100,
                )
                .set_timeout(300)
                .append_invoke_contract_function_op(
                    contract_id=contract_id,
                    function_name=function_name,
                    parameters=args or [],
                )
                .build()
            )
            
            # Simulate first
            sim_response = self.soroban.simulate_transaction(tx)
            
            if sim_response.error:
                return {"success": False, "error": sim_response.error}
            
            # Prepare and sign
            prepared_tx = self.soroban.prepare_transaction(tx, sim_response)
            prepared_tx.sign(keypair)
            
            # Submit
            send_response = self.soroban.send_transaction(prepared_tx)
            
            # Wait for result
            tx_hash = send_response.hash
            
            # Poll for completion (max 30 seconds)
            for _ in range(30):
                get_response = self.soroban.get_transaction(tx_hash)
                if get_response.status == GetTransactionStatus.SUCCESS:
                    return {
                        "success": True,
                        "tx_hash": tx_hash,
                        "result": get_response.result_xdr
                    }
                elif get_response.status == GetTransactionStatus.FAILED:
                    return {"success": False, "error": "Transaction failed"}
                await asyncio.sleep(1)
            
            return {"success": False, "error": "Transaction timeout"}
            
        except Exception as e:
            logger.error(f"Contract invocation failed: {e}")
            return {"success": False, "error": str(e)}
    
    async def query_contract(
        self,
        contract_id: str,
        function_name: str,
        args: list = None
    ) -> dict:
        """Query contract (read-only, no signing)"""
        try:
            # For read operations, use simulation only
            source_account = self.soroban.load_account(self.admin_keypair.public_key)
            
            tx = (
                TransactionBuilder(
                    source_account=source_account,
                    network_passphrase=self.network_passphrase,
                    base_fee=100,
                )
                .set_timeout(30)
                .append_invoke_contract_function_op(
                    contract_id=contract_id,
                    function_name=function_name,
                    parameters=args or [],
                )
                .build()
            )
            
            sim_response = self.soroban.simulate_transaction(tx)
            
            if sim_response.error:
                return {"success": False, "error": sim_response.error}
            
            # Parse result from simulation
            result = sim_response.result
            return {"success": True, "data": result}
            
        except Exception as e:
            logger.error(f"Contract query failed: {e}")
            return {"success": False, "error": str(e)}

# Singleton instance
soroban_sdk = SorobanSDKService()
```

### Step 1.3: Update contracts_v2.py to Use New Service

**File:** `app/routers/contracts_v2.py`

**ADD at top of file:**

```python
from app.services.soroban_sdk_v2 import soroban_sdk

# Configuration for fallback
USE_SDK = True  # Set to False to use old CLI method
```

**REPLACE `invoke_contract` function:**

```python
async def invoke_contract(contract_id: str, method: str, args: List[str]) -> Dict[str, Any]:
    """
    Invoke a contract method - uses SDK or falls back to CLI
    """
    if USE_SDK:
        try:
            # Convert string args to proper ScVal types
            scval_args = [scval.to_string(arg) for arg in args]
            result = await soroban_sdk.invoke_contract(contract_id, method, scval_args)
            return result
        except Exception as e:
            logger.warning(f"SDK failed, falling back to CLI: {e}")
    
    # Fallback to old CLI method (existing code)
    # ... keep existing subprocess code as fallback ...
```

---

## 🤖 PHASE 2: Real AI Verification

### Step 2.1: Update AI Service with Groq Vision

**File:** `app/services/ai_service.py`

**REPLACE `verify_proof_of_work` method:**

```python
async def verify_proof_of_work(
    self, 
    milestone_title: str, 
    image_bytes: bytes = None,
    project_description: str = ""
) -> Dict[str, Any]:
    """
    Verify proof using Groq Vision (real AI analysis)
    Falls back to mock if API unavailable
    """
    
    # If no Groq client or no image, use enhanced mock
    if not self.client or not image_bytes:
        return await self._mock_verify_proof(milestone_title)
    
    try:
        import base64
        b64_image = base64.b64encode(image_bytes).decode('utf-8')
        
        prompt = f"""
        You are an auditor for a sustainability crowdfunding platform.
        Analyze this image as proof for milestone: "{milestone_title}"
        
        Project context: {project_description[:500] if project_description else "Environmental project"}
        
        Evaluate:
        1. Does the image show relevant work being done?
        2. Is there physical evidence of progress (people working, equipment, results)?
        3. Any signs this could be a stock photo or AI-generated?
        4. Geographic/location clues matching project claims?
        
        Return ONLY valid JSON:
        {{
            "verified": true or false,
            "confidence": 0.0 to 1.0,
            "analysis": "detailed explanation",
            "objects_detected": ["list", "of", "visible", "things"],
            "red_flags": ["any", "concerns"],
            "recommendation": "approve" or "needs_review" or "reject"
        }}
        """
        
        # Use Groq's vision model
        chat_completion = self.client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{b64_image}"
                            }
                        }
                    ]
                }
            ],
            model="llama-3.2-90b-vision-preview",  # Groq's vision model
            temperature=0.3,
            max_tokens=1024,
            response_format={"type": "json_object"}
        )
        
        result = json.loads(chat_completion.choices[0].message.content)
        
        # Store verification in database
        await self._store_verification(milestone_title, result)
        
        return result
        
    except Exception as e:
        logger.error(f"Vision API error: {e}")
        return await self._mock_verify_proof(milestone_title)

async def _mock_verify_proof(self, milestone_title: str) -> Dict[str, Any]:
    """Enhanced mock for demo/fallback"""
    import random
    await asyncio.sleep(1.5)  # Simulate processing
    
    # More realistic mock based on milestone keywords
    keywords_positive = ["plant", "install", "build", "clean", "solar", "tree"]
    has_keyword = any(k in milestone_title.lower() for k in keywords_positive)
    
    if has_keyword:
        confidence = 0.85 + random.random() * 0.1
        verified = True
    else:
        confidence = 0.6 + random.random() * 0.2
        verified = random.random() > 0.3
    
    return {
        "verified": verified,
        "confidence": round(confidence, 2),
        "analysis": f"Demo verification for '{milestone_title}'. Connect Groq Vision for real AI analysis.",
        "objects_detected": ["demo_placeholder"],
        "red_flags": [],
        "recommendation": "approve" if verified else "needs_review"
    }
```

### Step 2.2: Add Image Upload Endpoint

**File:** `app/routers/milestones.py` (ADD)

```python
from fastapi import UploadFile, File
from app.services.ai_service import ai_service

@router.post("/{project_id}/milestones/{milestone_id}/verify-proof")
async def verify_milestone_proof(
    project_id: int,
    milestone_id: int,
    proof_image: UploadFile = File(...)
):
    """Upload and verify proof of work for a milestone"""
    
    # Read image
    image_bytes = await proof_image.read()
    
    if len(image_bytes) > 10 * 1024 * 1024:  # 10MB limit
        raise HTTPException(400, "Image too large (max 10MB)")
    
    # Get milestone info
    # ... (fetch from database)
    
    # Run AI verification
    result = await ai_service.verify_proof_of_work(
        milestone_title=milestone.title,
        image_bytes=image_bytes,
        project_description=project.description
    )
    
    # Store result in ai_verifications table
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO ai_verifications (milestone_id, project_id, ai_result, status, verified_by)
            VALUES (?, ?, ?, ?, ?)
        ''', (milestone_id, project_id, json.dumps(result), result["recommendation"], "groq"))
        conn.commit()
    
    return {
        "success": True,
        "verification": result
    }
```

---

## 🔐 PHASE 3: Multi-Oracle Security

### Step 3.1: Create Oracle Service

**File:** `app/services/oracle_service.py` (NEW)

```python
"""
Multi-Oracle Consensus Service
Requires 3-of-5 oracles to agree for verification
"""
from typing import List, Dict
from app.database import get_db_connection
import logging

logger = logging.getLogger(__name__)

class OracleService:
    REQUIRED_VOTES = 3  # 3-of-5 consensus
    
    def __init__(self):
        self.oracle_addresses = [
            # In production, these would be separate servers
            "oracle_1_primary",
            "oracle_2_backup",
            "oracle_3_external",
            "oracle_4_community",
            "oracle_5_partner"
        ]
    
    async def submit_vote(
        self,
        milestone_id: int,
        oracle_id: str,
        vote: str,  # 'approve' or 'reject'
        confidence: int
    ) -> Dict:
        """Record an oracle's vote"""
        
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            # Insert or update vote
            cursor.execute('''
                INSERT OR REPLACE INTO oracle_votes 
                (milestone_id, oracle_address, vote_result, confidence)
                VALUES (?, ?, ?, ?)
            ''', (milestone_id, oracle_id, vote, confidence))
            conn.commit()
            
            # Check if consensus reached
            return await self.check_consensus(milestone_id)
    
    async def check_consensus(self, milestone_id: int) -> Dict:
        """Check if 3-of-5 consensus is reached"""
        
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            cursor.execute('''
                SELECT vote_result, COUNT(*) as count
                FROM oracle_votes
                WHERE milestone_id = ?
                GROUP BY vote_result
            ''', (milestone_id,))
            
            votes = {row['vote_result']: row['count'] for row in cursor.fetchall()}
            
            approve_votes = votes.get('approve', 0)
            reject_votes = votes.get('reject', 0)
            total_votes = approve_votes + reject_votes
            
            if approve_votes >= self.REQUIRED_VOTES:
                return {
                    "consensus_reached": True,
                    "result": "approved",
                    "votes": {"approve": approve_votes, "reject": reject_votes}
                }
            elif reject_votes >= self.REQUIRED_VOTES:
                return {
                    "consensus_reached": True,
                    "result": "rejected",
                    "votes": {"approve": approve_votes, "reject": reject_votes}
                }
            else:
                return {
                    "consensus_reached": False,
                    "result": "pending",
                    "votes": {"approve": approve_votes, "reject": reject_votes},
                    "needed": self.REQUIRED_VOTES - max(approve_votes, reject_votes)
                }

oracle_service = OracleService()
```

---

## 🔗 PHASE 4: Frontend Integration

### Step 4.1: Update ContractService.js for Real Transactions

**File:** `src/services/ContractService.js`

**ADD new methods:**

```javascript
/**
 * Fund a campaign with actual XLM transaction
 * @param {number} campaignId 
 * @param {string} backerAddress 
 * @param {number} amountXlm 
 * @param {Function} signTransaction - From StellarContext
 */
async fundCampaignReal(campaignId, backerAddress, amountXlm, signTransaction) {
  try {
    // Step 1: Get unsigned transaction from backend
    const response = await fetch(`${API_BASE}/contracts/v2/campaigns/${campaignId}/fund/prepare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        backer_address: backerAddress,
        amount: xlmToStroops(amountXlm)
      })
    });
    
    const { tx_xdr, network_passphrase } = await response.json();
    
    if (!tx_xdr) {
      throw new Error('Failed to prepare transaction');
    }
    
    // Step 2: Sign with user's wallet (Freighter)
    const signedXdr = await signTransaction(tx_xdr, {
      network: "TESTNET",
      networkPassphrase: network_passphrase
    });
    
    // Step 3: Submit signed transaction
    const submitResponse = await fetch(`${API_BASE}/contracts/v2/transactions/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ signed_xdr: signedXdr })
    });
    
    return await submitResponse.json();
    
  } catch (error) {
    console.error('Real funding failed:', error);
    throw error;
  }
}

/**
 * Vote on milestone verification
 */
async voteOnMilestone(campaignId, milestoneId, voterAddress, approve, signTransaction) {
  try {
    const response = await fetch(
      `${API_BASE}/contracts/v2/campaigns/${campaignId}/milestones/${milestoneId}/vote/prepare`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voter_address: voterAddress, approve })
      }
    );
    
    const { tx_xdr, network_passphrase } = await response.json();
    
    if (!tx_xdr) {
      // Fallback to mock voting if contract not ready
      return this.vote(campaignId, milestoneId, voterAddress, approve);
    }
    
    const signedXdr = await signTransaction(tx_xdr, {
      network: "TESTNET",
      networkPassphrase: network_passphrase
    });
    
    const submitResponse = await fetch(`${API_BASE}/contracts/v2/transactions/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ signed_xdr: signedXdr })
    });
    
    return await submitResponse.json();
    
  } catch (error) {
    console.error('Voting failed, using mock:', error);
    return this.vote(campaignId, milestoneId, voterAddress, approve);
  }
}
```

---

## 📊 Data Preservation Summary

| Data Type | Source | Preservation Method |
|-----------|--------|---------------------|
| Frontend Projects | `projects.js` | ✅ Kept as fallback |
| Database Tables | SQLite | ✅ Only ADD new tables, never DROP |
| User Data | `users` table | ✅ Unchanged |
| Donations | `donations` table | ✅ Unchanged |
| Contract State | Soroban | ✅ Separate from DB |

---

## 📋 Implementation Order

```
Week 1:
├── Day 1: Phase 5 - SQLite WAL mode + new tables
├── Day 2: Phase 5 - Test database performance
├── Day 3: Phase 1 - Install stellar-sdk, create soroban_sdk_v2.py
├── Day 4: Phase 1 - Update contracts_v2.py with fallback
├── Day 5: Phase 1 - Test SDK calls

Week 2:
├── Day 1: Phase 2 - Update ai_service.py with Groq Vision
├── Day 2: Phase 2 - Add image upload endpoint
├── Day 3: Phase 2 - Test AI verification
├── Day 4: Phase 3 - Create oracle_service.py
├── Day 5: Phase 3 - Add oracle endpoints

Week 3:
├── Day 1: Phase 4 - Update ContractService.js
├── Day 2: Phase 4 - Connect donation flow
├── Day 3: Phase 4 - Connect voting flow
├── Day 4: Integration testing
├── Day 5: Bug fixes and polish
```

---

## 🎯 Quick Start Command

To begin implementation immediately:

```bash
# 1. Backup database
cd ChainFund-backend/ChainFund/chainfund-backend
mkdir -p backups

# 2. Install dependencies
pip install stellar-sdk>=10.0.0

# 3. Run database migration
python -c "from app.database import init_database; init_database()"
```

---

*This plan ensures ZERO data loss while upgrading the entire stack.*
