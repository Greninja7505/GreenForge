import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, User, Shield, Briefcase, Heart, Filter, Download, Trash2, Edit2 } from "lucide-react";
import toast from "react-hot-toast";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("all");

    useEffect(() => {
        // Load users from localStorage as per app architecture
        const loadUsers = () => {
            try {
                const storedUsers = localStorage.getItem("stellar_all_users");
                if (storedUsers) {
                    setUsers(JSON.parse(storedUsers));
                } else {
                    // Fallback mock data if empty
                    setUsers([
                        { id: "1", name: "Admin User", email: "admin@greenforge.com", roles: ["admin"], createdAt: new Date().toISOString() },
                        { id: "2", name: "Jane Doe", email: "jane@example.com", roles: ["donor"], createdAt: new Date().toISOString() }
                    ]);
                }
            } catch (error) {
                console.error("Failed to load users", error);
            }
        };
        loadUsers();
    }, []);

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole =
            filterRole === "all" || (user.roles && user.roles.includes(filterRole)) || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const getRoleBadge = (role) => {
        switch (role) {
            case "admin":
                return <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-bold border border-red-500/30 flex items-center gap-1"><Shield className="w-3 h-3" /> Admin</span>;
            case "creator":
                return <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-bold border border-blue-500/30 flex items-center gap-1"><Briefcase className="w-3 h-3" /> Creator</span>;
            default:
                return <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-bold border border-green-500/30 flex items-center gap-1"><Heart className="w-3 h-3" /> User</span>;
        }
    };

    return (
        <div className="min-h-screen pt-28 pb-12 bg-black text-white">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                    <div>
                        <h1 className="text-3xl font-light mb-2">User Management</h1>
                        <p className="text-white/40">Manage platform users and roles</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="btn-outline flex items-center gap-2">
                            <Download className="w-4 h-4" /> Export CSV
                        </button>
                    </div>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                        <h3 className="text-white/40 text-sm uppercase tracking-wider mb-2">Total Users</h3>
                        <div className="text-3xl font-light">{users.length}</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                        <h3 className="text-white/40 text-sm uppercase tracking-wider mb-2">Donors</h3>
                        <div className="text-3xl font-light">{users.filter(u => u.roles?.includes('donor') || u.role === 'donor').length}</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                        <h3 className="text-white/40 text-sm uppercase tracking-wider mb-2">Creators</h3>
                        <div className="text-3xl font-light">{users.filter(u => u.roles?.includes('creator') || u.role === 'creator').length}</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                        <input
                            type="text"
                            placeholder="Search users by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:border-white/30 focus:outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-white/40" />
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-white/30 focus:outline-none appearance-none cursor-pointer"
                        >
                            <option value="all">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="donor">User</option>
                            <option value="creator">Creator</option>
                        </select>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                    <th className="p-4 text-white/40 font-medium text-sm uppercase tracking-wider">User</th>
                                    <th className="p-4 text-white/40 font-medium text-sm uppercase tracking-wider">Role</th>
                                    <th className="p-4 text-white/40 font-medium text-sm uppercase tracking-wider">Status</th>
                                    <th className="p-4 text-white/40 font-medium text-sm uppercase tracking-wider">Joined</th>
                                    <th className="p-4 text-white/40 font-medium text-sm uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <motion.tr
                                            key={user.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                        >
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                                                        {user.avatar ? (
                                                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <User className="w-5 h-5 text-white/60" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-white">{user.name}</div>
                                                        <div className="text-sm text-white/40">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex gap-1 flex-wrap">
                                                    {(user.roles || [user.role || 'donor']).map((role, i) => (
                                                        <div key={i}>{getRoleBadge(role)}</div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="flex items-center gap-2 text-sm text-white/60">
                                                    <span className="w-2 h-2 rounded-full bg-green-500"></span> Active
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-white/40">
                                                {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors">
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-2 hover:bg-red-500/20 rounded-lg text-white/60 hover:text-red-400 transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-white/40">
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;
