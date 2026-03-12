import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, BellRing, Check, Circle } from 'lucide-react';
import { cn } from '../lib/utils';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/notifications', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = res.data.data;
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.is_read).length);
        } catch (err) {
            console.error("Error fetching notifications:", err);
        }
    };

    const markRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`/api/notifications/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchNotifications();
        } catch (err) {
            console.error("Error marking read:", err);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Polling every 30s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-zinc-100 transition-colors"
            >
                {unreadCount > 0 ? (
                    <>
                        <BellRing className="w-5 h-5 text-blue-600 animate-bounce" />
                        <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white">
                            {unreadCount}
                        </span>
                    </>
                ) : (
                    <Bell className="w-5 h-5 text-zinc-400" />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-4 w-80 bg-white/90 backdrop-blur-2xl border border-zinc-100 shadow-2xl rounded-[2rem] overflow-hidden z-[110] animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="p-5 border-b border-zinc-50 flex justify-between items-center bg-zinc-50/50">
                        <span className="text-xs font-black uppercase tracking-widest text-zinc-900">Notifications</span>
                        {unreadCount > 0 && <span className="text-[10px] text-zinc-400 italic">{unreadCount} unread</span>}
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-10 text-center text-zinc-400 text-sm">No notifications yet.</div>
                        ) : (
                            notifications.map((n) => (
                                <div 
                                    key={n.notification_id} 
                                    className={cn("p-5 border-b border-zinc-50 flex gap-4 hover:bg-zinc-50 transition-colors cursor-default group", 
                                        !n.is_read && "bg-blue-50/30")}
                                >
                                    <div className="mt-1">
                                        {!n.is_read ? (
                                            <Circle className="w-2 h-2 fill-blue-500 text-blue-500" />
                                        ) : (
                                            <div className="w-2 h-2" />
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className={cn("text-xs leading-relaxed", !n.is_read ? "text-zinc-900 font-bold" : "text-zinc-500")}>
                                            {n.message}
                                        </p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] text-zinc-300">{new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            {!n.is_read && (
                                                <button 
                                                    onClick={() => markRead(n.notification_id)}
                                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-blue-100 rounded-lg transition-all text-blue-600 text-[10px] font-bold"
                                                >
                                                    Mark as read
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
