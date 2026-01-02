import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Clock,
  Shield,
  Check,
  X,
  Loader,
  ExternalLink,
  Wallet,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useStellar } from "../context/StellarContext";

// Stub escrow contract hook until implementation
const useEscrowContract = () => ({
  createEscrow: async (params) => {
    console.log('Creating escrow:', params);
    return { hash: 'escrow_' + Date.now(), status: 'pending' };
  },
  getEscrowStatus: async (escrowId) => {
    console.log('Getting escrow status:', escrowId);
    return { status: 'active', balance: 0 };
  },
});

const HireGig = () => {
  const { gigId } = useParams();
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState("basic");
  const [requirements, setRequirements] = useState("");
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [txStatus, setTxStatus] = useState(null); // null, 'pending', 'success', 'failed'
  const [txHash, setTxHash] = useState("");
  const [txError, setTxError] = useState("");

  // Use the existing StellarContext instead of undefined hook
  const { 
    isConnected, 
    publicKey, 
    connectWallet, 
    sendPayment 
  } = useStellar();
  
  const { 
    createEscrow, 
    getEscrowStatus 
  } = useEscrowContract();

  // Mock gig data - replace with API call
  const gig = {
    id: gigId,
    title: "Professional Logo Design",
    freelancer: {
      name: "Sarah Designer",
      avatar: "https://i.pravatar.cc/150?img=1",
      rating: 4.9,
      reviewsCount: 127,
      completedOrders: 450,
      responseTime: "1 hour",
    },
    packages: {
      basic: {
        name: "Basic",
        price: 50,
        deliveryTime: "3 days",
        revisions: 2,
        features: [
          "1 Logo Concept",
          "2 Revisions",
          "Source Files",
          "Commercial Use",
        ],
      },
      standard: {
        name: "Standard",
        price: 100,
        deliveryTime: "5 days",
        revisions: 5,
        features: [
          "3 Logo Concepts",
          "5 Revisions",
          "Source Files",
          "Commercial Use",
          "Social Media Kit",
          "Brand Style Guide",
        ],
      },
      premium: {
        name: "Premium",
        price: 200,
        deliveryTime: "7 days",
        revisions: -1, // Unlimited
        features: [
          "5 Logo Concepts",
          "Unlimited Revisions",
          "Source Files",
          "Commercial Use",
          "Social Media Kit",
          "Brand Style Guide",
          "Business Card Design",
          "Priority Support",
        ],
      },
    },
    description: "I will create a professional, unique logo for your brand that stands out and represents your business perfectly.",
    images: [
      "https://picsum.photos/800/600?random=1",
      "https://picsum.photos/800/600?random=2",
      "https://picsum.photos/800/600?random=3",
    ],
  };

  const selectedPackageData = gig.packages[selectedPackage];
  const total = selectedPackageData.price;

  const handleHireClick = () => {
    // Redirect to the donate page with the gig amount pre-filled
    const projectSlug = "cross-chain-bridge-protocol"; // Replace with your actual project slug
    navigate(`/donate/${projectSlug}`, { 
      state: { 
        amount: total,
        gigId: gig.id,
        gigTitle: gig.title,
        requirements: requirements.trim()
      } 
    });
  };

  const handleWalletConnect = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      setTxError("Failed to connect wallet. Please try again.");
    }
  };

  const handlePayment = async () => {
    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }

    try {
      setTxStatus("pending");
      setTxError("");

      // Create escrow contract
      const escrowData = await createEscrow({
        gigId: gig.id,
        buyerAddress: publicKey,
        sellerAddress: gig.freelancer.walletAddress || "GXXXXXXXXXXXXXXXX", // Replace with actual seller address
        amount: total,
        requirements: requirements,
        deliveryTime: selectedPackageData.deliveryTime,
      });

      // Send payment to escrow contract
      const payment = await sendPayment({
        destination: escrowData.contractAddress,
        amount: total,
        memo: `Hire: ${gig.title} - Order #${escrowData.orderId}`,
      });

      setTxHash(payment.hash);
      setTxStatus("success");

      // Wait 2 seconds then redirect to freelancer orders page
      setTimeout(() => {
        navigate(`/freelancer/orders`);
      }, 2000);

    } catch (error) {
      console.error("Payment failed:", error);
      setTxStatus("failed");
      setTxError(error.message || "Transaction failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Gig Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1
                className="text-4xl font-bold text-white mb-4"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: "700",
                  letterSpacing: "-0.01em",
                }}
              >
                {gig.title}
              </h1>
              
              {/* Freelancer Info */}
              <div className="flex items-center gap-4">
                <img
                  src={gig.freelancer.avatar}
                  alt={gig.freelancer.name}
                  className="w-12 h-12 rounded-full border-2 border-[#49E4A4]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3
                      className="text-lg font-semibold text-white"
                      style={{ fontFamily: "Inter, sans-serif", fontWeight: "600" }}
                    >
                      {gig.freelancer.name}
                    </h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-[#FFD700] fill-current" />
                      <span className="text-sm text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
                        {gig.freelancer.rating} ({gig.freelancer.reviewsCount} reviews)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
                    <span>{gig.freelancer.completedOrders} orders completed</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Responds in {gig.freelancer.responseTime}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Gig Images */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <div className="grid grid-cols-1 gap-4">
                <img
                  src={gig.images[0]}
                  alt="Gig preview"
                  className="w-full h-96 object-cover rounded-2xl border border-white/5"
                />
                <div className="grid grid-cols-3 gap-4">
                  {gig.images.slice(1).map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Preview ${index + 2}`}
                      className="w-full h-32 object-cover rounded-xl border border-white/5"
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Package Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <h2
                className="text-2xl font-bold text-white mb-6"
                style={{ fontFamily: "Inter, sans-serif", fontWeight: "700" }}
              >
                Select Package
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.keys(gig.packages).map((packageKey) => {
                  const pkg = gig.packages[packageKey];
                  return (
                    <button
                      key={packageKey}
                      onClick={() => setSelectedPackage(packageKey)}
                      className={`p-6 rounded-2xl border-2 transition-all text-left ${
                        selectedPackage === packageKey
                          ? "border-[#5B6FED] bg-[#5B6FED]/10"
                          : "border-white/10 bg-[#1a1a1a] hover:border-white/20"
                      }`}
                    >
                      <h3
                        className="text-xl font-bold text-white mb-2"
                        style={{ fontFamily: "Inter, sans-serif", fontWeight: "700" }}
                      >
                        {pkg.name}
                      </h3>
                      <div
                        className="text-3xl font-bold text-[#49E4A4] mb-4"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        ${pkg.price}
                      </div>
                      <div className="space-y-2 text-sm text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{pkg.deliveryTime} delivery</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4" />
                          <span>
                            {pkg.revisions === -1 ? "Unlimited" : pkg.revisions} revisions
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#1a1a1a] rounded-2xl p-8 border border-white/5 mb-8"
            >
              <h2
                className="text-2xl font-bold text-white mb-4"
                style={{ fontFamily: "Inter, sans-serif", fontWeight: "700" }}
              >
                About This Gig
              </h2>
              <p
                className="text-gray-400 text-base leading-relaxed"
                style={{ fontFamily: "Inter, sans-serif", lineHeight: "1.7" }}
              >
                {gig.description}
              </p>

              <div className="mt-6 border-t border-white/10 pt-6">
                <h3
                  className="text-xl font-semibold text-white mb-4"
                  style={{ fontFamily: "Inter, sans-serif", fontWeight: "600" }}
                >
                  What's Included
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedPackageData.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-[#49E4A4]" />
                      <span
                        className="text-gray-300 text-sm"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-24 bg-[#1a1a1a] rounded-2xl p-6 border border-white/5"
            >
              <h2
                className="text-2xl font-bold text-white mb-6"
                style={{ fontFamily: "Inter, sans-serif", fontWeight: "700" }}
              >
                Order Summary
              </h2>

              {/* Package Details */}
              <div className="mb-6 pb-6 border-b border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
                    Package
                  </span>
                  <span className="text-white font-semibold" style={{ fontFamily: "Inter, sans-serif" }}>
                    {selectedPackageData.name}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
                    Delivery Time
                  </span>
                  <span className="text-white" style={{ fontFamily: "Inter, sans-serif" }}>
                    {selectedPackageData.deliveryTime}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400" style={{ fontFamily: "Inter, sans-serif" }}>
                    Revisions
                  </span>
                  <span className="text-white" style={{ fontFamily: "Inter, sans-serif" }}>
                    {selectedPackageData.revisions === -1 ? "Unlimited" : selectedPackageData.revisions}
                  </span>
                </div>
              </div>

              {/* Requirements */}
              <div className="mb-6">
                <label
                  className="block text-white font-semibold mb-2"
                  style={{ fontFamily: "Inter, sans-serif", fontWeight: "600" }}
                >
                  Project Requirements *
                </label>
                <textarea
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="Describe your project requirements..."
                  className="w-full p-4 bg-black border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-[#5B6FED] focus:outline-none resize-none"
                  style={{ fontFamily: "Inter, sans-serif", minHeight: "120px" }}
                />
              </div>

              {/* Total */}
              <div className="mb-6 pb-6 border-b border-white/10">
                <div className="flex justify-between items-center">
                  <span
                    className="text-lg text-gray-400"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Total
                  </span>
                  <span
                    className="text-3xl font-bold text-[#49E4A4]"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    ${total}
                  </span>
                </div>
              </div>

              {/* Escrow Protection Notice */}
              <div className="mb-6 p-4 bg-[#5B6FED]/10 border border-[#5B6FED]/20 rounded-xl">
                <div className="flex gap-3">
                  <Shield className="w-5 h-5 text-[#5B6FED] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4
                      className="text-white font-semibold mb-1"
                      style={{ fontFamily: "Inter, sans-serif", fontWeight: "600", fontSize: "0.875rem" }}
                    >
                      Escrow Protection
                    </h4>
                    <p
                      className="text-gray-400 text-xs leading-relaxed"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      Your payment is secured in a smart contract escrow. Funds are only released when you approve the delivery.
                    </p>
                  </div>
                </div>
              </div>

              {/* Hire Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleHireClick}
                className="w-full py-4 bg-[#5B6FED] text-white rounded-xl font-semibold text-lg hover:bg-[#5B6FED]/90 transition-all flex items-center justify-center gap-2"
                style={{ fontFamily: "Inter, sans-serif", fontWeight: "600" }}
                disabled={!requirements.trim()}
              >
                <Wallet className="w-5 h-5" />
                Pay with Stellar
              </motion.button>

              <p
                className="text-center text-gray-500 text-xs mt-4"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                By hiring, you agree to our Terms of Service
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Wallet Modal */}
      <AnimatePresence>
        {showWalletModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !txStatus && setShowWalletModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1a1a1a] rounded-2xl p-8 max-w-md w-full border border-white/10"
            >
              {/* Close Button */}
              {!txStatus && (
                <button
                  onClick={() => setShowWalletModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              )}

              {/* Modal Content */}
              <div className="text-center">
                {!txStatus && (
                  <>
                    <div className="w-16 h-16 bg-[#5B6FED]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Wallet className="w-8 h-8 text-[#5B6FED]" />
                    </div>
                    <h2
                      className="text-2xl font-bold text-white mb-2"
                      style={{ fontFamily: "Inter, sans-serif", fontWeight: "700" }}
                    >
                      Connect Stellar Wallet
                    </h2>
                    <p
                      className="text-gray-400 mb-6"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {isConnected
                        ? "Your wallet is connected. Review the transaction details and confirm."
                        : "Connect your Stellar wallet to securely pay with blockchain escrow."}
                    </p>

                    {isConnected && (
                      <div className="bg-black rounded-xl p-4 mb-6 text-left">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-400 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                            Wallet Address
                          </span>
                          <span className="text-white text-sm font-mono">
                            {publicKey.slice(0, 8)}...{publicKey.slice(-8)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-400 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                            Amount
                          </span>
                          <span className="text-[#49E4A4] text-sm font-semibold" style={{ fontFamily: "Inter, sans-serif" }}>
                            ${total}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                            Gig
                          </span>
                          <span className="text-white text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                            {gig.title}
                          </span>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={isConnected ? handlePayment : handleWalletConnect}
                      className="w-full py-4 bg-[#5B6FED] text-white rounded-xl font-semibold hover:bg-[#5B6FED]/90 transition-all"
                      style={{ fontFamily: "Inter, sans-serif", fontWeight: "600" }}
                    >
                      {isConnected ? "Confirm Payment" : "Connect Wallet"}
                    </button>
                  </>
                )}

                {txStatus === "pending" && (
                  <>
                    <div className="w-16 h-16 bg-[#5B6FED]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Loader className="w-8 h-8 text-[#5B6FED] animate-spin" />
                    </div>
                    <h2
                      className="text-2xl font-bold text-white mb-2"
                      style={{ fontFamily: "Inter, sans-serif", fontWeight: "700" }}
                    >
                      Processing Transaction
                    </h2>
                    <p
                      className="text-gray-400 mb-4"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      Please wait while we process your payment...
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                      <div className="w-2 h-2 bg-[#5B6FED] rounded-full animate-pulse" />
                      <span style={{ fontFamily: "Inter, sans-serif" }}>Creating escrow contract</span>
                    </div>
                  </>
                )}

                {txStatus === "success" && (
                  <>
                    <div className="w-16 h-16 bg-[#49E4A4]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-[#49E4A4]" />
                    </div>
                    <h2
                      className="text-2xl font-bold text-white mb-2"
                      style={{ fontFamily: "Inter, sans-serif", fontWeight: "700" }}
                    >
                      Payment Successful!
                    </h2>
                    <p
                      className="text-gray-400 mb-6"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      Your payment has been secured in escrow. The freelancer will start working on your order.
                    </p>
                    {txHash && (
                      <a
                        href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 text-[#5B6FED] hover:text-[#5B6FED]/80 transition-colors text-sm mb-4"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        <span>View on Stellar Explorer</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <p
                      className="text-gray-500 text-sm"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      Redirecting to your orders...
                    </p>
                  </>
                )}

                {txStatus === "failed" && (
                  <>
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h2
                      className="text-2xl font-bold text-white mb-2"
                      style={{ fontFamily: "Inter, sans-serif", fontWeight: "700" }}
                    >
                      Transaction Failed
                    </h2>
                    <p
                      className="text-gray-400 mb-6"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {txError || "Something went wrong. Please try again."}
                    </p>
                    <button
                      onClick={() => {
                        setTxStatus(null);
                        setTxError("");
                      }}
                      className="w-full py-4 bg-[#5B6FED] text-white rounded-xl font-semibold hover:bg-[#5B6FED]/90 transition-all"
                      style={{ fontFamily: "Inter, sans-serif", fontWeight: "600" }}
                    >
                      Try Again
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HireGig;
