import React, { useState } from 'react';
import { User, Mail, Lock, Shield, LogIn, UserPlus, Edit2, Save, X } from 'lucide-react';

const UserManagementApp = () => {
    const [currentView, setCurrentView] = useState('login');
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState([
        { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin', status: 'active' },
        { id: 2, name: 'John Examiner', email: 'examiner@example.com', role: 'examiner', status: 'active' },
        { id: 3, name: 'Jane Student', email: 'student@example.com', role: 'student', status: 'active' }
    ]);
    const [editingUser, setEditingUser] = useState(null);

    // Login Component
    const LoginForm = () => {
        const [formData, setFormData] = useState({ email: '', password: '' });

        const handleLogin = () => {
            const user = users.find(u => u.email === formData.email);
            if (user) {
                setCurrentUser(user);
                setCurrentView('dashboard');
            } else {
                alert('Invalid credentials. Try: admin@example.com, examiner@example.com, or student@example.com');
            }
        };

        const handleKeyPress = (e) => {
            if (e.key === 'Enter') handleLogin();
        };

        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
                        <p className="text-gray-600 mt-2">Sign in to your account</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    onKeyPress={handleKeyPress}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    onKeyPress={handleKeyPress}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleLogin}
                            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                        >
                            <LogIn className="w-5 h-5" />
                            Sign In
                        </button>
                    </div>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => setCurrentView('register')}
                            className="text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                            Don't have an account? Register
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Registration Component
    const RegistrationForm = () => {
        const [formData, setFormData] = useState({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: 'student'
        });

        const handleRegister = () => {
            if (formData.password !== formData.confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            if (!formData.name || !formData.email || !formData.password) {
                alert('Please fill in all fields');
                return;
            }
            const newUser = {
                id: users.length + 1,
                name: formData.name,
                email: formData.email,
                role: formData.role,
                status: 'active'
            };
            setUsers([...users, newUser]);
            alert('Registration successful! Please login.');
            setCurrentView('login');
        };

        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-full mb-4">
                            <UserPlus className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
                        <p className="text-gray-600 mt-2">Join our platform today</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                placeholder="your@email.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            >
                                <option value="student">Student</option>
                                <option value="examiner">Examiner</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                            <input
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            onClick={handleRegister}
                            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition"
                        >
                            Create Account
                        </button>
                    </div>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => setCurrentView('login')}
                            className="text-emerald-600 hover:text-emerald-800 font-medium"
                        >
                            Already have an account? Sign in
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Dashboard Component
    const Dashboard = () => {
        const canManageUsers = currentUser?.role === 'admin';

        const handleEdit = (user) => {
            setEditingUser({ ...user });
        };

        const handleSave = () => {
            setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
            if (currentUser.id === editingUser.id) {
                setCurrentUser(editingUser);
            }
            setEditingUser(null);
        };

        const handleDelete = (userId) => {
            if (window.confirm('Are you sure you want to delete this user?')) {
                setUsers(users.filter(u => u.id !== userId));
            }
        };

        const getRoleBadge = (role) => {
            const colors = {
                admin: 'bg-purple-100 text-purple-800',
                examiner: 'bg-blue-100 text-blue-800',
                student: 'bg-green-100 text-green-800'
            };
            return colors[role] || 'bg-gray-100 text-gray-800';
        };

        return (
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Shield className="w-8 h-8 text-indigo-600" />
                            <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm text-gray-600">Welcome back,</p>
                                <p className="font-semibold text-gray-800">{currentUser.name}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleBadge(currentUser.role)}`}>
                                {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
                            </span>
                            <button
                                onClick={() => {
                                    setCurrentUser(null);
                                    setCurrentView('login');
                                }}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 py-8">
                    {/* Profile Section */}
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <User className="w-6 h-6" />
                            My Profile
                        </h2>
                        {editingUser?.id === currentUser.id ? (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                        <input
                                            type="text"
                                            value={editingUser.name}
                                            onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={editingUser.email}
                                            onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2">
                                        <Save className="w-4 h-4" />
                                        Save Changes
                                    </button>
                                    <button onClick={() => setEditingUser(null)} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition flex items-center gap-2">
                                        <X className="w-4 h-4" />
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <p className="text-gray-600"><span className="font-semibold">Name:</span> {currentUser.name}</p>
                                    <p className="text-gray-600"><span className="font-semibold">Email:</span> {currentUser.email}</p>
                                    <p className="text-gray-600"><span className="font-semibold">Role:</span> {currentUser.role}</p>
                                </div>
                                <button onClick={() => handleEdit(currentUser)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2">
                                    <Edit2 className="w-4 h-4" />
                                    Edit Profile
                                </button>
                            </div>
                        )}
                    </div>

                    {/* User Management Section (Admin Only) */}
                    {canManageUsers && (
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">All Users</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {users.map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-900">{user.name}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadge(user.role)}`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        {user.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleEdit(user)}
                                                            className="text-indigo-600 hover:text-indigo-800"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(user.id)}
                                                            className="text-red-600 hover:text-red-800"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        );
    };

    // Render based on current view
    if (currentView === 'login') return <LoginForm />;
    if (currentView === 'register') return <RegistrationForm />;
    if (currentView === 'dashboard') return <Dashboard />;
};

export default UserManagementApp;