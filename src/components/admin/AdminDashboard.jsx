import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard, Users, FileText, Shield, Eye, AlertTriangle,
    BarChart3, Settings, Bell, Search, Plus, Download, Filter,
    TrendingUp, TrendingDown, Activity, Clock, CheckCircle, XCircle
} from 'lucide-react';
import '../../styles/dashboard.css';

const AdminDashboard = () => {
    const [activeView, setActiveView] = useState('overview');
    const [notifications, setNotifications] = useState([]);
    const [stats, setStats] = useState({
        totalExams: 0,
        activeExams: 0,
        totalUsers: 0,
        violations: 0,
        completionRate: 0,
        avgScore: 0
    });

    useEffect(() => {
        // Load dashboard data
        loadDashboardData();

        // Set up real-time updates
        const interval = setInterval(() => {
            loadDashboardData();
        }, 30000); // Update every 30 seconds

        return () => clearInterval(interval);
    }, []);

    const loadDashboardData = async () => {
        // Simulate API call - replace with actual API
        setStats({
            totalExams: 156,
            activeExams: 12,
            totalUsers: 2847,
            violations: 23,
            completionRate: 87.5,
            avgScore: 78.3
        });

        setNotifications([
            { id: 1, type: 'violation', message: 'Multiple faces detected in Exam #45', time: '2 min ago', severity: 'high' },
            { id: 2, type: 'exam', message: 'New exam scheduled for tomorrow', time: '15 min ago', severity: 'info' },
            { id: 3, type: 'user', message: '5 new user registrations', time: '1 hour ago', severity: 'low' }
        ]);
    };

    const StatCard = ({ icon: Icon, label, value, trend, trendValue, gradient }) => (
        <div className="stat-card">
            <div className="stat-header">
                <div className="stat-icon" style={{ background: gradient }}>
                    <Icon />
                </div>
                {trend && (
                    <div className={`stat-trend ${trend === 'up' ? 'trend-up' : 'trend-down'}`}>
                        {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        <span>{trendValue}%</span>
                    </div>
                )}
            </div>
            <div className="stat-value">{value}</div>
            <div className="stat-label">{label}</div>
        </div>
    );

    const NotificationItem = ({ notification }) => {
        const getSeverityColor = (severity) => {
            switch (severity) {
                case 'high': return '#ef4444';
                case 'medium': return '#f59e0b';
                case 'low': return '#3b82f6';
                default: return '#6b7280';
            }
        };

        return (
            <div className="notification-item" style={{ borderLeft: `3px solid ${getSeverityColor(notification.severity)}` }}>
                <div className="notification-content">
                    <p className="notification-message">{notification.message}</p>
                    <span className="notification-time">{notification.time}</span>
                </div>
            </div>
        );
    };

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <Shield size={32} />
                        <span>ACMA Admin</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <ul>
                        <li className="nav-item">
                            <a
                                className={`nav-link ${activeView === 'overview' ? 'active' : ''}`}
                                onClick={() => setActiveView('overview')}
                            >
                                <LayoutDashboard size={20} />
                                <span>Overview</span>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className={`nav-link ${activeView === 'exams' ? 'active' : ''}`}
                                onClick={() => setActiveView('exams')}
                            >
                                <FileText size={20} />
                                <span>Exam Management</span>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className={`nav-link ${activeView === 'users' ? 'active' : ''}`}
                                onClick={() => setActiveView('users')}
                            >
                                <Users size={20} />
                                <span>User Management</span>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className={`nav-link ${activeView === 'monitoring' ? 'active' : ''}`}
                                onClick={() => setActiveView('monitoring')}
                            >
                                <Eye size={20} />
                                <span>Live Monitoring</span>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className={`nav-link ${activeView === 'violations' ? 'active' : ''}`}
                                onClick={() => setActiveView('violations')}
                            >
                                <AlertTriangle size={20} />
                                <span>Violation Review</span>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className={`nav-link ${activeView === 'analytics' ? 'active' : ''}`}
                                onClick={() => setActiveView('analytics')}
                            >
                                <BarChart3 size={20} />
                                <span>Analytics</span>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className={`nav-link ${activeView === 'settings' ? 'active' : ''}`}
                                onClick={() => setActiveView('settings')}
                            >
                                <Settings size={20} />
                                <span>Settings</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                {/* Header */}
                <header className="dashboard-header">
                    <div>
                        <h1 className="header-title">Admin Dashboard</h1>
                        <p style={{ color: 'var(--dark-muted)', marginTop: '0.5rem' }}>
                            Welcome back! Here's what's happening today.
                        </p>
                    </div>

                    <div className="header-actions">
                        <div className="search-box">
                            <Search size={18} />
                            <input type="text" placeholder="Search..." />
                        </div>

                        <div className="notification-badge">
                            <Bell size={20} />
                            <span className="badge-count">{notifications.length}</span>
                        </div>

                        <button className="btn btn-primary">
                            <Plus size={18} />
                            Create Exam
                        </button>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="stats-grid">
                    <StatCard
                        icon={FileText}
                        label="Total Exams"
                        value={stats.totalExams}
                        trend="up"
                        trendValue="12"
                        gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    />
                    <StatCard
                        icon={Activity}
                        label="Active Exams"
                        value={stats.activeExams}
                        gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                    />
                    <StatCard
                        icon={Users}
                        label="Total Users"
                        value={stats.totalUsers}
                        trend="up"
                        trendValue="8"
                        gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                    />
                    <StatCard
                        icon={AlertTriangle}
                        label="Violations"
                        value={stats.violations}
                        trend="down"
                        trendValue="15"
                        gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
                    />
                    <StatCard
                        icon={CheckCircle}
                        label="Completion Rate"
                        value={`${stats.completionRate}%`}
                        trend="up"
                        trendValue="5"
                        gradient="linear-gradient(135deg, #30cfd0 0%, #330867 100%)"
                    />
                    <StatCard
                        icon={TrendingUp}
                        label="Average Score"
                        value={`${stats.avgScore}%`}
                        trend="up"
                        trendValue="3"
                        gradient="linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
                    />
                </div>

                {/* Charts Section */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)' }}>
                    {/* Activity Chart */}
                    <div className="chart-container">
                        <div className="chart-header">
                            <h3 className="chart-title">Exam Activity</h3>
                            <div className="chart-filters">
                                <button className="filter-btn active">7 Days</button>
                                <button className="filter-btn">30 Days</button>
                                <button className="filter-btn">90 Days</button>
                            </div>
                        </div>
                        <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--dark-muted)' }}>
                            <Activity size={48} style={{ opacity: 0.3 }} />
                            <p style={{ marginLeft: '1rem' }}>Chart visualization will be rendered here</p>
                        </div>
                    </div>

                    {/* Recent Notifications */}
                    <div className="chart-container">
                        <div className="chart-header">
                            <h3 className="chart-title">Recent Alerts</h3>
                            <button className="filter-btn">
                                <Filter size={16} />
                            </button>
                        </div>
                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {notifications.map(notification => (
                                <NotificationItem key={notification.id} notification={notification} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Exams Table */}
                <div className="data-table-container">
                    <div className="table-header">
                        <h3 className="chart-title">Recent Exams</h3>
                        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                            <button className="btn btn-secondary">
                                <Filter size={16} />
                                Filter
                            </button>
                            <button className="btn btn-secondary">
                                <Download size={16} />
                                Export
                            </button>
                        </div>
                    </div>

                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Exam Name</th>
                                <th>Date</th>
                                <th>Students</th>
                                <th>Duration</th>
                                <th>Status</th>
                                <th>Violations</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { id: 1, name: 'Mathematics Final', date: '2026-01-15', students: 45, duration: '120 min', status: 'scheduled', violations: 0 },
                                { id: 2, name: 'Physics Midterm', date: '2026-01-10', students: 38, duration: '90 min', status: 'active', violations: 3 },
                                { id: 3, name: 'Chemistry Quiz', date: '2026-01-08', students: 52, duration: '60 min', status: 'completed', violations: 1 },
                                { id: 4, name: 'Biology Test', date: '2026-01-05', students: 41, duration: '75 min', status: 'completed', violations: 5 },
                            ].map(exam => (
                                <tr key={exam.id}>
                                    <td style={{ fontWeight: 600, color: 'var(--dark-text)' }}>{exam.name}</td>
                                    <td>{exam.date}</td>
                                    <td>{exam.students}</td>
                                    <td>{exam.duration}</td>
                                    <td>
                                        <span className={`badge ${exam.status === 'active' ? 'badge-success' :
                                                exam.status === 'scheduled' ? 'badge-info' :
                                                    'badge-warning'
                                            }`}>
                                            {exam.status}
                                        </span>
                                    </td>
                                    <td>
                                        {exam.violations > 0 ? (
                                            <span className="badge badge-danger">{exam.violations}</span>
                                        ) : (
                                            <CheckCircle size={16} style={{ color: '#4ade80' }} />
                                        )}
                                    </td>
                                    <td>
                                        <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}>
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
