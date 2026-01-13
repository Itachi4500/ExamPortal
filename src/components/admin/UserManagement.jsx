import React, { useState, useEffect } from 'react';
import {
    Users, UserPlus, Edit2, Trash2, Search, Filter, Download,
    Mail, Phone, Calendar, Shield, CheckCircle, XCircle, MoreVertical,
    Lock, Unlock, Ban, UserCheck, Award, TrendingUp
} from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [showUserModal, setShowUserModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = () => {
        // Simulate API call
        const mockUsers = [
            {
                id: 1,
                name: 'John Doe',
                email: 'john.doe@example.com',
                phone: '+1234567890',
                role: 'student',
                status: 'active',
                joinDate: '2025-09-15',
                examsCompleted: 12,
                avgScore: 85.5,
                violations: 0,
                lastActive: '2 hours ago'
            },
            {
                id: 2,
                name: 'Jane Smith',
                email: 'jane.smith@example.com',
                phone: '+1234567891',
                role: 'student',
                status: 'active',
                joinDate: '2025-09-20',
                examsCompleted: 8,
                avgScore: 92.3,
                violations: 0,
                lastActive: '1 day ago'
            },
            {
                id: 3,
                name: 'Dr. Robert Johnson',
                email: 'robert.j@example.com',
                phone: '+1234567892',
                role: 'admin',
                status: 'active',
                joinDate: '2025-08-01',
                examsCompleted: 0,
                avgScore: 0,
                violations: 0,
                lastActive: '30 min ago'
            },
            {
                id: 4,
                name: 'Emily Davis',
                email: 'emily.d@example.com',
                phone: '+1234567893',
                role: 'student',
                status: 'suspended',
                joinDate: '2025-10-05',
                examsCompleted: 5,
                avgScore: 65.2,
                violations: 3,
                lastActive: '1 week ago'
            },
            {
                id: 5,
                name: 'Michael Brown',
                email: 'michael.b@example.com',
                phone: '+1234567894',
                role: 'proctor',
                status: 'active',
                joinDate: '2025-09-10',
                examsCompleted: 0,
                avgScore: 0,
                violations: 0,
                lastActive: '5 min ago'
            }
        ];
        setUsers(mockUsers);
    };

    const handleCreateUser = () => {
        setEditingUser({
            name: '',
            email: '',
            phone: '',
            role: 'student',
            status: 'active'
        });
        setShowUserModal(true);
    };

    const handleEditUser = (user) => {
        setEditingUser({ ...user });
        setShowUserModal(true);
    };

    const handleSaveUser = () => {
        if (editingUser.id) {
            setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
        } else {
            setUsers([...users, {
                ...editingUser,
                id: Date.now(),
                joinDate: new Date().toISOString().split('T')[0],
                examsCompleted: 0,
                avgScore: 0,
                violations: 0,
                lastActive: 'Just now'
            }]);
        }
        setShowUserModal(false);
        setEditingUser(null);
    };

    const handleDeleteUser = (id) => {
        if (confirm('Are you sure you want to delete this user?')) {
            setUsers(users.filter(u => u.id !== id));
        }
    };

    const handleSuspendUser = (id) => {
        setUsers(users.map(u =>
            u.id === id ? { ...u, status: u.status === 'suspended' ? 'active' : 'suspended' } : u
        ));
    };

    const handleBulkAction = (action) => {
        if (selectedUsers.length === 0) {
            alert('Please select users first');
            return;
        }

        switch (action) {
            case 'delete':
                if (confirm(`Delete ${selectedUsers.length} users?`)) {
                    setUsers(users.filter(u => !selectedUsers.includes(u.id)));
                    setSelectedUsers([]);
                }
                break;
            case 'suspend':
                setUsers(users.map(u =>
                    selectedUsers.includes(u.id) ? { ...u, status: 'suspended' } : u
                ));
                setSelectedUsers([]);
                break;
            case 'activate':
                setUsers(users.map(u =>
                    selectedUsers.includes(u.id) ? { ...u, status: 'active' } : u
                ));
                setSelectedUsers([]);
                break;
        }
    };

    const toggleUserSelection = (id) => {
        setSelectedUsers(prev =>
            prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
        );
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
        return matchesSearch && matchesRole && matchesStatus;
    });

    const stats = {
        total: users.length,
        active: users.filter(u => u.status === 'active').length,
        suspended: users.filter(u => u.status === 'suspended').length,
        students: users.filter(u => u.role === 'student').length,
        admins: users.filter(u => u.role === 'admin').length,
        proctors: users.filter(u => u.role === 'proctor').length
    };

    return (
        <div style={{ padding: 'var(--spacing-lg)' }}>
            {/* Header */}
            <div className="dashboard-header" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div>
                    <h1 className="header-title">User Management</h1>
                    <p style={{ color: 'var(--dark-muted)', marginTop: '0.5rem' }}>
                        Manage all users, roles, and permissions
                    </p>
                </div>
                <button className="btn btn-primary" onClick={handleCreateUser}>
                    <UserPlus size={18} />
                    Add New User
                </button>
            </div>

            {/* Stats */}
            <div className="stats-grid" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                            <Users />
                        </div>
                    </div>
                    <div className="stat-value">{stats.total}</div>
                    <div className="stat-label">Total Users</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)' }}>
                            <CheckCircle />
                        </div>
                    </div>
                    <div className="stat-value">{stats.active}</div>
                    <div className="stat-label">Active Users</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                            <Ban />
                        </div>
                    </div>
                    <div className="stat-value">{stats.suspended}</div>
                    <div className="stat-label">Suspended</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
                            <UserCheck />
                        </div>
                    </div>
                    <div className="stat-value">{stats.students}</div>
                    <div className="stat-label">Students</div>
                </div>
            </div>

            {/* Filters and Actions */}
            <div className="data-table-container" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div className="table-header">
                    <div className="search-box">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                        <select
                            className="form-select"
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            style={{ width: 'auto', padding: '0.5rem 1rem' }}
                        >
                            <option value="all">All Roles</option>
                            <option value="student">Students</option>
                            <option value="admin">Admins</option>
                            <option value="proctor">Proctors</option>
                        </select>

                        <select
                            className="form-select"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            style={{ width: 'auto', padding: '0.5rem 1rem' }}
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="suspended">Suspended</option>
                        </select>

                        {selectedUsers.length > 0 && (
                            <>
                                <button className="btn btn-secondary" onClick={() => handleBulkAction('activate')}>
                                    <Unlock size={16} />
                                    Activate ({selectedUsers.length})
                                </button>
                                <button className="btn btn-secondary" onClick={() => handleBulkAction('suspend')}>
                                    <Ban size={16} />
                                    Suspend ({selectedUsers.length})
                                </button>
                                <button className="btn btn-danger" onClick={() => handleBulkAction('delete')}>
                                    <Trash2 size={16} />
                                    Delete ({selectedUsers.length})
                                </button>
                            </>
                        )}

                        <button className="btn btn-secondary">
                            <Download size={16} />
                            Export
                        </button>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="data-table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th style={{ width: '50px' }}>
                                <input
                                    type="checkbox"
                                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedUsers(filteredUsers.map(u => u.id));
                                        } else {
                                            setSelectedUsers([]);
                                        }
                                    }}
                                />
                            </th>
                            <th>User</th>
                            <th>Contact</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Join Date</th>
                            <th>Exams</th>
                            <th>Avg Score</th>
                            <th>Violations</th>
                            <th>Last Active</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.includes(user.id)}
                                        onChange={() => toggleUserSelection(user.id)}
                                    />
                                </td>
                                <td>
                                    <div>
                                        <div style={{ fontWeight: 600, color: 'var(--dark-text)' }}>{user.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--dark-muted)' }}>{user.email}</div>
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                                        <Phone size={14} />
                                        <span>{user.phone}</span>
                                    </div>
                                </td>
                                <td>
                                    <span className={`badge ${user.role === 'admin' ? 'badge-danger' :
                                            user.role === 'proctor' ? 'badge-warning' :
                                                'badge-info'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td>
                                    <span className={`badge ${user.status === 'active' ? 'badge-success' : 'badge-danger'
                                        }`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td>{user.joinDate}</td>
                                <td>{user.examsCompleted}</td>
                                <td>
                                    {user.avgScore > 0 ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                                            <span style={{ fontWeight: 600, color: user.avgScore >= 80 ? '#4ade80' : user.avgScore >= 60 ? '#fbbf24' : '#f87171' }}>
                                                {user.avgScore}%
                                            </span>
                                            {user.avgScore >= 80 && <TrendingUp size={14} style={{ color: '#4ade80' }} />}
                                        </div>
                                    ) : (
                                        <span style={{ color: 'var(--dark-muted)' }}>-</span>
                                    )}
                                </td>
                                <td>
                                    {user.violations > 0 ? (
                                        <span className="badge badge-danger">{user.violations}</span>
                                    ) : (
                                        <CheckCircle size={16} style={{ color: '#4ade80' }} />
                                    )}
                                </td>
                                <td style={{ fontSize: '0.875rem' }}>{user.lastActive}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                                        <button
                                            className="btn btn-secondary"
                                            style={{ padding: '0.5rem', fontSize: '0.75rem' }}
                                            onClick={() => handleEditUser(user)}
                                            title="Edit"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button
                                            className={`btn ${user.status === 'suspended' ? 'btn-success' : 'btn-secondary'}`}
                                            style={{ padding: '0.5rem', fontSize: '0.75rem' }}
                                            onClick={() => handleSuspendUser(user.id)}
                                            title={user.status === 'suspended' ? 'Activate' : 'Suspend'}
                                        >
                                            {user.status === 'suspended' ? <Unlock size={14} /> : <Ban size={14} />}
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            style={{ padding: '0.5rem', fontSize: '0.75rem' }}
                                            onClick={() => handleDeleteUser(user.id)}
                                            title="Delete"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* User Modal */}
            {showUserModal && (
                <div className="modal-overlay" onClick={() => setShowUserModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                        <div className="modal-header">
                            <h2 className="modal-title">
                                {editingUser?.id ? 'Edit User' : 'Add New User'}
                            </h2>
                            <button className="close-btn" onClick={() => setShowUserModal(false)}>
                                <XCircle size={20} />
                            </button>
                        </div>

                        <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                            <div className="form-group">
                                <label className="form-label">Full Name *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={editingUser?.name || ''}
                                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                    placeholder="Enter full name"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Email *</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    value={editingUser?.email || ''}
                                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                    placeholder="user@example.com"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Phone</label>
                                <input
                                    type="tel"
                                    className="form-input"
                                    value={editingUser?.phone || ''}
                                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                                    placeholder="+1234567890"
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                                <div className="form-group">
                                    <label className="form-label">Role *</label>
                                    <select
                                        className="form-select"
                                        value={editingUser?.role || 'student'}
                                        onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                                    >
                                        <option value="student">Student</option>
                                        <option value="proctor">Proctor</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Status *</label>
                                    <select
                                        className="form-select"
                                        value={editingUser?.status || 'active'}
                                        onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}
                                    >
                                        <option value="active">Active</option>
                                        <option value="suspended">Suspended</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', justifyContent: 'flex-end', marginTop: 'var(--spacing-md)' }}>
                                <button className="btn btn-secondary" onClick={() => setShowUserModal(false)}>
                                    Cancel
                                </button>
                                <button className="btn btn-primary" onClick={handleSaveUser}>
                                    {editingUser?.id ? 'Update User' : 'Create User'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
