import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { cn } from '../lib/utils';
import { TrendingUp, TrendingDown, Minus, Info, Search } from 'lucide-react';

const HeatmapPage = () => {
    // Karnataka Focused Mock Data
    const allMapData = [
        { name: 'Bangalore', product: 'Tomato', lat: 12.9716, lng: 77.5946, demand: 'High', color: '#ef4444' },
        { name: 'Bangalore', product: 'Onion', lat: 12.9800, lng: 77.6000, demand: 'Medium', color: '#f59e0b' },
        { name: 'Mysore', product: 'Paddy', lat: 12.2958, lng: 76.6394, demand: 'High', color: '#ef4444' },
        { name: 'Mysore', product: 'Sugarcane', lat: 12.3000, lng: 76.6500, demand: 'Low', color: '#10b981' },
        { name: 'Hubli', product: 'Chilli', lat: 15.3647, lng: 75.1240, demand: 'High', color: '#ef4444' },
        { name: 'Dharwad', product: 'Maize', lat: 15.4589, lng: 75.0078, demand: 'Medium', color: '#f59e0b' },
        { name: 'Belgaum', product: 'Sugarcane', lat: 15.8497, lng: 74.4977, demand: 'High', color: '#ef4444' },
        { name: 'Belgaum', product: 'Potato', lat: 15.8600, lng: 74.5100, demand: 'Medium', color: '#f59e0b' },
        { name: 'Mangalore', product: 'Coconut', lat: 12.9141, lng: 74.8560, demand: 'High', color: '#ef4444' },
        { name: 'Mangalore', product: 'Paddy', lat: 12.9200, lng: 74.8700, demand: 'Medium', color: '#f59e0b' },
        { name: 'Davanagere', product: 'Maize', lat: 14.4644, lng: 75.9213, demand: 'High', color: '#ef4444' },
        { name: 'Davanagere', product: 'Paddy', lat: 14.4700, lng: 75.9300, demand: 'Low', color: '#10b981' },
        { name: 'Shimoga', product: 'Paddy', lat: 13.9299, lng: 75.5681, demand: 'High', color: '#ef4444' },
        { name: 'Shimoga', product: 'Arecanut', lat: 13.9400, lng: 75.5800, demand: 'Medium', color: '#f59e0b' },
        { name: 'Tumkur', product: 'Coconut', lat: 13.3392, lng: 77.1140, demand: 'High', color: '#ef4444' },
        { name: 'Tumkur', product: 'Groundnut', lat: 13.3500, lng: 77.1200, demand: 'Medium', color: '#f59e0b' },
        { name: 'Gulbarga', product: 'Tur Pulse', lat: 17.3297, lng: 76.8343, demand: 'High', color: '#ef4444' },
        { name: 'Gulbarga', product: 'Maize', lat: 17.3400, lng: 76.8500, demand: 'Low', color: '#10b981' },
        { name: 'Bellary', product: 'Onion', lat: 15.1394, lng: 76.9214, demand: 'High', color: '#ef4444' },
        { name: 'Bellary', product: 'Chilli', lat: 15.1500, lng: 76.9400, demand: 'Medium', color: '#f59e0b' },
        { name: 'Kolar', product: 'Tomato', lat: 13.1363, lng: 78.1291, demand: 'High', color: '#ef4444' },
        { name: 'Chikmagalur', product: 'Coffee', lat: 13.3161, lng: 75.7720, demand: 'Medium', color: '#f59e0b' },
        { name: 'Bagalkot', product: 'Sugarcane', lat: 16.1817, lng: 75.6958, demand: 'Low', color: '#10b981' },
        { name: 'Bijapur', product: 'Grapes', lat: 16.8302, lng: 75.7100, demand: 'High', color: '#ef4444' },
        { name: 'Raichur', product: 'Cotton', lat: 16.2120, lng: 77.3439, demand: 'Medium', color: '#f59e0b' },
    ];

    const [selectedProduct, setSelectedProduct] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    // Filter markers
    const displayedData = selectedProduct === 'All' 
        ? allMapData 
        : allMapData.filter(item => item.product === selectedProduct);

    // Calculate demand logic for the list
    const productStats = allMapData.reduce((acc, item) => {
        if (!acc[item.product]) {
            acc[item.product] = { count: 0, highCount: 0, medCount: 0, lowCount: 0 };
        }
        acc[item.product].count++;
        if (item.demand === 'High') acc[item.product].highCount++;
        else if (item.demand === 'Medium') acc[item.product].medCount++;
        else acc[item.product].lowCount++;
        return acc;
    }, {});

    const productList = Object.keys(productStats).map(name => {
        const stats = productStats[name];
        return { name, ...stats };
    })
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => b.highCount - a.highCount);

    useEffect(() => {
        setTimeout(() => window.dispatchEvent(new Event('resize')), 200);
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 h-[calc(100vh-80px)] flex flex-col">
            <header className="shrink-0 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-zinc-900 tracking-tighter uppercase">Predictive <span className="text-red-600">Core</span></h1>
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Karnataka Regional Demand Ecosystem</p>
                </div>

                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setSelectedProduct('All')}
                        className={cn(
                            "px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all",
                            selectedProduct === 'All' ? "bg-zinc-950 text-white shadow-xl shadow-zinc-200" : "bg-white text-zinc-400 border border-zinc-100 hover:bg-zinc-50"
                        )}
                    >
                        View Global
                    </button>
                    <div className="flex items-center gap-2 px-4 py-2 bg-zinc-50 rounded-2xl border border-zinc-100">
                        <Info className="w-4 h-4 text-zinc-400" />
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight">Auto-refreshing every 5m</span>
                    </div>
                </div>
            </header>

            <div className="flex-1 min-h-0 flex gap-6">
                {/* Demand List Panel */}
                <div className="w-96 bg-white rounded-[3rem] border border-zinc-100 shadow-2xl flex flex-col overflow-hidden">
                    <div className="p-8 border-b border-zinc-50 space-y-4">
                        <div className="space-y-2">
                            <h2 className="text-xl font-black text-zinc-900 leading-tight">Demand <br/>Inventory</h2>
                            <div className="flex gap-1">
                                <div className="h-1 w-8 bg-red-500 rounded-full" />
                                <div className="h-1 w-4 bg-zinc-100 rounded-full" />
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-red-500 transition-colors" />
                            <input 
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 pl-10 pr-4 text-sm font-bold text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:bg-white transition-all shadow-inner"
                            />
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                        {productList.map((item) => (
                            <div
                                key={item.name}
                                onClick={() => setSelectedProduct(item.name)}
                                className={cn(
                                    "w-full p-5 rounded-[2rem] flex flex-col gap-4 transition-all group cursor-pointer",
                                    selectedProduct === item.name 
                                        ? "bg-zinc-950 text-white shadow-2xl scale-[1.02]" 
                                        : "bg-white border border-zinc-50 hover:bg-zinc-50 text-zinc-700 hover:scale-[1.01]"
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:rotate-12",
                                            selectedProduct === item.name ? "bg-white/10" : "bg-zinc-100"
                                        )}>
                                            {item.highCount > item.medCount ? (
                                                <TrendingUp className={cn("w-5 h-5", selectedProduct === item.name ? "text-white" : "text-red-500")} />
                                            ) : (
                                                <TrendingDown className={cn("w-5 h-5", selectedProduct === item.name ? "text-white" : "text-emerald-500")} />
                                            )}
                                        </div>
                                        <div className="text-left">
                                            <p className="font-black text-sm uppercase tracking-tight">{item.name}</p>
                                            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Multi-District Data</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-1">
                                        {item.highCount > 0 && (
                                            <div className="px-2 py-0.5 rounded-md bg-red-500 text-white text-[8px] font-black uppercase">High</div>
                                        )}
                                        {item.medCount > 0 && (
                                            <div className="px-2 py-0.5 rounded-md bg-amber-500 text-white text-[8px] font-black uppercase">Mid</div>
                                        )}
                                        {item.lowCount > 0 && (
                                            <div className="px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[8px] font-black uppercase">Low</div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pt-2 border-t border-zinc-100/10">
                                    <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden flex">
                                        <div style={{ width: `${(item.highCount/item.count)*100}%` }} className="bg-red-500" />
                                        <div style={{ width: `${(item.medCount/item.count)*100}%` }} className="bg-amber-500" />
                                        <div style={{ width: `${(item.lowCount/item.count)*100}%` }} className="bg-emerald-500" />
                                    </div>
                                    <span className="text-[9px] font-bold text-zinc-400 whitespace-nowrap">{item.count} Districts</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-6 bg-zinc-50 border-t border-zinc-100">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4">
                            <span>Sentiment Legend</span>
                            <div className="w-1 h-1 bg-zinc-200 rounded-full" />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500" /> <span className="text-[9px] font-bold">Surge</span></div>
                            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500" /> <span className="text-[9px] font-bold">Steady</span></div>
                            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /> <span className="text-[9px] font-bold">Low</span></div>
                        </div>
                    </div>
                </div>

                {/* Map View */}
                <div className="flex-1 rounded-[3rem] overflow-hidden border border-zinc-100 shadow-2xl relative">
                    <MapContainer
                        center={[15.3173, 75.7139]}
                        zoom={7}
                        style={{ height: '100%', width: '100%' }}
                        scrollWheelZoom={true}
                        className="z-0"
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        />
                        {displayedData.map((loc, idx) => (
                            <CircleMarker
                                key={`${loc.name}-${loc.product}-${idx}`}
                                center={[loc.lat, loc.lng]}
                                radius={24}
                                pathOptions={{ 
                                    color: loc.color, 
                                    fillColor: loc.color, 
                                    fillOpacity: 0.5,
                                    weight: 2
                                }}
                            >
                                <Popup className="custom-popup">
                                    <div className="p-2 space-y-2">
                                        <div className="flex items-center justify-between gap-4">
                                            <h4 className="font-black text-xs uppercase tracking-tighter text-zinc-900">{loc.name}</h4>
                                            <div style={{ backgroundColor: loc.color }} className="w-2 h-2 rounded-full animate-pulse" />
                                        </div>
                                        <div className="pt-2 border-t border-zinc-100">
                                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Current Demand</p>
                                            <p className="font-black text-sm text-zinc-900">{loc.product}</p>
                                            <p className="text-[10px] font-bold mt-1 inline-block px-2 py-0.5 rounded-md text-white uppercase tracking-widest" style={{backgroundColor: loc.color}}>
                                                {loc.demand} Level
                                            </p>
                                        </div>
                                    </div>
                                </Popup>
                            </CircleMarker>
                        ))}
                    </MapContainer>
                    
                    {/* Map Interaction Hint */}
                    <div className="absolute bottom-8 right-8 z-[400] bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl border border-zinc-100 shadow-xl flex items-center gap-3">
                        <div className="p-2 bg-red-600 rounded-xl">
                            <TrendingUp className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-900">Predictive Node</span>
                            <span className="text-[9px] font-bold text-zinc-500">Showing {selectedProduct === 'All' ? 'Karnataka Summary' : `${selectedProduct} Hotspots`}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeatmapPage;

