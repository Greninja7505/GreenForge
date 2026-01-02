import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, lazy, Suspense } from "react";

// Layout
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// Smooth Scroll
// import SmoothScroll from "./components/SmoothScroll";

// Error Boundary and Loading
import ErrorBoundary from "./components/ErrorBoundary";
import { PageLoader } from "./components/LoadingSpinner";

// Agentic ChatBot
import { AgenticChatBot } from "./components/chat";

// Hooks
import { useUser } from "./context/UserContext";

// Role-based routing
import RoleBasedRoute from "./components/RoleBasedRoute";

// Onboarding Tour
import OnboardingTour from "./components/layout/OnboardingTour";

// Effects
import ClickSpark from "./components/effects/ClickSpark";

// Eager loaded pages (critical path)
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";

// Lazy loaded pages (code splitting)
const Projects = lazy(() => import("./pages/Projects"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const Donate = lazy(() => import("./pages/Donate"));
const GIVeconomy = lazy(() => import("./pages/GIVeconomy"));
const GIVfarm = lazy(() => import("./pages/GIVfarm"));
const Community = lazy(() => import("./pages/Community"));
const Causes = lazy(() => import("./pages/Causes"));
const About = lazy(() => import("./pages/About"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const CreateProject = lazy(() => import("./pages/CreateProject"));
const Profile = lazy(() => import("./pages/Profile"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const FreelancerDashboard = lazy(() => import("./pages/Freelancer/FreelancerDashboard"));
const FreelancerProfile = lazy(() => import("./components/Freelancer/FreelancerProfile"));
const GigList = lazy(() => import("./components/Freelancer/GigList"));
const OrderManagement = lazy(() => import("./components/Freelancer/OrderManagement"));
const EarningsDashboard = lazy(() => import("./components/Freelancer/EarningsDashboard"));
const HireGig = lazy(() => import("./pages/HireGig"));
const Governance = lazy(() => import("./pages/Governance"));
const CreateGig = lazy(() => import("./pages/CreateGig"));
const EcoBounties = lazy(() => import("./pages/EcoBounties"));
const Marketplace = lazy(() => import("./pages/Marketplace"));

// Scroll to top component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Suspense wrapper for lazy loaded components
const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<PageLoader message="Loading page..." />}>
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  </Suspense>
);

//Freelancer Page Wrapper
const FreelancerProfilePage = () => (
  <SuspenseWrapper>
    <div className="min-h-screen pt-20">
      <FreelancerProfile />
    </div>
  </SuspenseWrapper>
);

const GigListPage = () => (
  <SuspenseWrapper>
    <div className="min-h-screen pt-20">
      <GigList />
    </div>
  </SuspenseWrapper>
);

const OrderManagementPage = () => (
  <SuspenseWrapper>
    <div className="min-h-screen pt-20">
      <OrderManagement />
    </div>
  </SuspenseWrapper>
);

const EarningsPage = () => (
  <SuspenseWrapper>
    <div className="min-h-screen pt-20">
      <EarningsDashboard />
    </div>
  </SuspenseWrapper>
);

const HireGigPage = () => (
  <SuspenseWrapper>
    <div className="min-h-screen pt-20">
      <HireGig />
    </div>
  </SuspenseWrapper>
);

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isLoggedIn } = useUser();

  if (!isLoggedIn) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}

// Layout wrapper component
function LayoutWrapper({ children }) {
  const location = useLocation();
  const hideNavFooter = ["/signin", "/signup"].includes(location.pathname);

  return (
    <>
      {!hideNavFooter && <Navbar />}
      {children}
      {!hideNavFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      {/* <SmoothScroll> */}
      <ScrollToTop />
      <ClickSpark
        sparkColor="#ffffff"
        sparkSize={12}
        sparkRadius={20}
        sparkCount={8}
        duration={500}
      >
        <div className="min-h-screen relative">
          {/* Background Animation Component */}
          <div className="fixed inset-0 -z-10 overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #1a1a1a 100%)",
              }}
            />
            <motion.div
              className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
              style={{
                background: "radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 70%)",
              }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.05, 0.1, 0.05],
                x: [0, 30, 0],
                y: [0, 20, 0],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            <div
              className="absolute inset-0 opacity-[0.015]"
              style={{
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
              }}
            />
          </div>

          <div className="relative z-10">
            <LayoutWrapper>
              <ErrorBoundary>
                <Suspense fallback={<PageLoader message="Loading..." />}>
                  <AnimatePresence mode="wait">
                    <Routes>
                      <Route path="/signin" element={<SignIn />} />
                      <Route path="/signup" element={<SignUp />} />
                      <Route path="/" element={<Home />} />
                      <Route path="/dashboard" element={<RoleBasedRoute feature="create_project"><Dashboard /></RoleBasedRoute>} />
                      <Route path="/projects/all" element={<Projects />} />
                      <Route path="/project/:slug" element={<ProjectDetail />} />
                      <Route path="/donate/:slug" element={<ProtectedRoute><Donate /></ProtectedRoute>} />
                      <Route path="/giveconomy" element={<ProtectedRoute><GIVeconomy /></ProtectedRoute>} />
                      <Route path="/givfarm" element={<ProtectedRoute><GIVfarm /></ProtectedRoute>} />
                      <Route path="/join" element={<ProtectedRoute><Community /></ProtectedRoute>} />
                      <Route path="/causes/all" element={<Causes />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/onboarding" element={<Onboarding />} />
                      <Route path="/create-project" element={<RoleBasedRoute feature="create_project"><CreateProject /></RoleBasedRoute>} />
                      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                      <Route path="/freelancer/dashboard" element={<RoleBasedRoute feature="freelancer"><FreelancerDashboard /></RoleBasedRoute>} />
                      <Route path="/freelancer/profile" element={<RoleBasedRoute feature="freelancer"><FreelancerProfilePage /></RoleBasedRoute>} />
                      <Route path="/freelancer/gigs" element={<RoleBasedRoute feature="freelancer"><GigListPage /></RoleBasedRoute>} />
                      <Route path="/freelancer/orders" element={<RoleBasedRoute feature="freelancer"><OrderManagementPage /></RoleBasedRoute>} />
                      <Route path="/freelancer/earnings" element={<RoleBasedRoute feature="freelancer"><EarningsPage /></RoleBasedRoute>} />
                      <Route path="/freelancer/create-gig" element={<RoleBasedRoute feature="freelancer"><SuspenseWrapper><CreateGig /></SuspenseWrapper></RoleBasedRoute>} />
                      <Route path="/hire/:gigId" element={<ProtectedRoute><HireGigPage /></ProtectedRoute>} />
                      <Route path="/governance" element={<RoleBasedRoute feature="governance"><SuspenseWrapper><Governance /></SuspenseWrapper></RoleBasedRoute>} />
                      <Route path="/eco-bounties" element={<SuspenseWrapper><EcoBounties /></SuspenseWrapper>} />
                      <Route path="/marketplace" element={<SuspenseWrapper><Marketplace /></SuspenseWrapper>} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </AnimatePresence>
                </Suspense>
              </ErrorBoundary>
            </LayoutWrapper>
          </div>

          <Toaster position="top-right" toastOptions={{
            duration: 4000,
            style: {
              background: "#000000",
              color: "#ffffff",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "12px",
              padding: "16px",
              fontSize: "14px",
            }
          }} />
          <AgenticChatBot />
          <OnboardingTour />
        </div>
      </ClickSpark>
      {/* </SmoothScroll> */}
    </Router>
  );
}

export default App;
