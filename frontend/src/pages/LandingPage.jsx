import React from 'react';
import { HeroSection } from '../components/ui/hero-section';
import { BentoGrid } from '../components/ui/bento-grid';
import { Tractor, ShoppingBasket, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const bentoItems = [
    {
        title: "Farmer Dashboard",
        meta: "For Producers",
        description: "Access advanced price insights, demand forecasting, and direct negotiation tools.",
        icon: <Tractor className="w-5 h-5 text-emerald-600" />,
        status: "Active",
        tags: ["Analytics", "Prediction", "Sales"],
        colSpan: 1,
        href: "/farmer",
        cta: "Go to Farmer Dashboard"
    },
    {
        title: "Consumer Marketplace",
        meta: "For Buyers",
        description: "Browse fresh, locally sourced commodities directly from farmers with transparent market pricing.",
        icon: <ShoppingBasket className="w-5 h-5 text-blue-600" />,
        status: "Live",
        tags: ["Shopping", "Direct-to-Consumer"],
        colSpan: 1,
        href: "/marketplace",
        cta: "Explore Marketplace"
    },
    {
        title: "Cooperative Hub",
        meta: "For Administrators",
        description: "Manage farmer networks, oversee high-volume logistics, and monitor market stability.",
        icon: <Building2 className="w-5 h-5 text-amber-600" />,
        status: "Management",
        tags: ["Logistics", "Network"],
        colSpan: 1,
        href: "/cooperative",
        cta: "Access Hub"
    }
];

const LandingPage = () => {
    const { user } = useAuth();
    return (
        <div className="flex flex-col min-h-screen bg-zinc-50">
            <HeroSection
                logo={{
                    url: "",
                    alt: "AI Sante Logo",
                    text: "AI Sante"
                }}
                slogan="NEXT-GEN AGRICULTURE"
                title={
                    <>
                        Smart Digital Santhe <br />
                        <span className="text-emerald-500 text-3xl md:text-5xl lg:text-6xl mt-2 block tracking-tight">Market Price & Demand Analytics</span>
                    </>
                }
                subtitle="A unified platform offering market support, crop planning suggestions, price crash alerts, and cooperative integration. Empowering farmers and consumers alike with data-driven models."
                callToAction={
                    user ? undefined : { text: "Create Account", href: "/login" }
                }
                secondaryCallToAction={
                    user ? undefined : { text: "Sign In", href: "/login" }
                }
                userMessage={
                    user ? { text: `Welcome, ${user.name || user.role.split('_')[0]}!`, href: `/${user.role === 'farmer' ? 'farmer' : user.role === 'cooperative_admin' ? 'cooperative' : 'marketplace'}` } : undefined
                }
                backgroundImage="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2940&auto=format&fit=crop"
                contactInfo={{
                    website: "aisante.digital",
                    phone: "+91 800 AI SANTE",
                    address: "Agri-Tech Hub, Karnataka",
                }}
            />

            {/* The Bento Grid for Dashboard Navigation is placed right below the hero section */}
            <BentoGrid items={bentoItems} />

            <footer className="text-center py-12 text-zinc-400 text-sm font-light border-t border-zinc-200 mt-auto bg-white">
                &copy; 2026 AI Sante. Premium Digital Agriculture Ecosystem.
            </footer>
        </div>
    );
};

export default LandingPage;
