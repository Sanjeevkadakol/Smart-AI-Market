import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { DottedSurface } from './components/ui/dotted-surface';
import LandingPage from './pages/LandingPage';
import FarmerDashboard from './pages/FarmerDashboard';
import ConsumerMarketplace from './pages/ConsumerMarketplace';
import HeatmapPage from './pages/HeatmapPage';
import LoginPage from './pages/LoginPage';
import CooperativeDashboard from './pages/CooperativeDashboard';
import NegotiationPage from './pages/NegotiationPage';
import OrdersPage from './pages/OrdersPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import NotificationBell from './components/NotificationBell';
import { VoiceInput } from './components/ui/voice-input';
import { Mic, Search } from 'lucide-react';



const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="p-20 text-center animate-pulse text-zinc-400 font-light">Loading security context...</div>;
    
    // If no specific role is required, just check if user is logged in
    if (!user) return <Navigate to="/login" />;
    
    // If a specific role is required, check it
    if (requiredRole && user.role !== requiredRole) return <Navigate to="/login" />;
    
    return children;
};

const Navigation = () => {
    const { user, logout } = useAuth();
    const [showVoiceAssistant, setShowVoiceAssistant] = React.useState(false);

    return (
        <nav className="relative z-20 border-b border-zinc-100 bg-white/50 backdrop-blur-md px-6 py-4 flex justify-between items-center">
            <Link to="/" className="text-xl font-bold tracking-tighter">AI <span className="text-blue-600">Sante</span></Link>
            <div className="flex gap-8 text-sm font-medium text-zinc-600">
                <Link to="/" className="hover:text-blue-600">Home</Link>
                <Link to="/farmer" className="hover:text-blue-600">Farmer</Link>
                <Link to="/marketplace" className="hover:text-blue-600">Marketplace</Link>
                {user?.role === 'cooperative_admin' && (


                    <Link to="/cooperative" className="hover:text-emerald-600">Cooperative</Link>
                )}
                <Link to="/heatmap" className="hover:text-red-500">Heatmap</Link>
                {user && (
                    <Link to="/orders" className="hover:text-emerald-600">Orders</Link>
                )}
            </div>
            <div className="flex gap-4 items-center">
                <button 
                    onClick={() => setShowVoiceAssistant(!showVoiceAssistant)}
                    className={`p-2 rounded-full transition-all ${showVoiceAssistant ? 'bg-blue-600 text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}
                    title="Voice Assistant"
                >
                    <Mic className="w-5 h-5" />
                </button>
                {user && <NotificationBell />}
                {user ? (
                    <button onClick={logout} className="bg-zinc-900 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-zinc-800 transition shadow-md hover:shadow-lg hover:-translate-y-0.5 transform duration-200">Sign Out as {user.role.split('_')[0]}</button>
                ) : (

                    <>
                        <Link to="/login" className="text-zinc-900 border border-zinc-200 px-6 py-2 rounded-full text-sm font-bold hover:bg-zinc-50 transition shadow-sm hover:shadow-md hover:-translate-y-0.5 transform duration-200">Sign Up</Link>
                        <Link to="/login" className="bg-zinc-900 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-zinc-800 transition shadow-md hover:shadow-lg hover:-translate-y-0.5 transform duration-200">Sign In</Link>
                    </>
                )}
            </div>

            {showVoiceAssistant && (
                <div className="fixed top-24 right-6 z-[60] animate-in fade-in slide-in-from-top-4 duration-300">
                    <VoiceInput onActionComplete={() => setShowVoiceAssistant(false)} />
                </div>
            )}
        </nav>
    );
};

function App() {
    const theme = 'light';

    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen relative font-sans">
                    <DottedSurface theme={theme} />
                    <Navigation />
                    <main className="relative z-10">
                        <Routes>
                            <Route path="/" element={<LandingPage />} />
                            <Route
                                path="/farmer"
                                element={
                                    <ProtectedRoute requiredRole="farmer">
                                        <FarmerDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="/marketplace" element={<ConsumerMarketplace />} />
                            <Route
                                path="/cooperative"
                                element={
                                    <ProtectedRoute requiredRole="cooperative_admin">
                                        <CooperativeDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="/heatmap" element={<HeatmapPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route
                                path="/negotiations"
                                element={
                                    <ProtectedRoute requiredRole="farmer">
                                        <NegotiationPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/orders"
                                element={
                                    <ProtectedRoute>
                                        <OrdersPage />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>





                    </main>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
