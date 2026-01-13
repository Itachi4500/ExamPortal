import React, { useState, useEffect } from 'react';
import {
    Bell, Mail, MessageSquare, Send, Check, X, Clock,
    AlertTriangle, Info, CheckCircle, Filter, Search, Trash2,
    Settings, Volume2, VolumeX, Eye, EyeOff
} from 'lucide-react';

const NotificationCenter = () => {
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedNotifications, setSelectedNotifications] = useState([]);
    const [showSettings, setShowSettings] = useState(false);
    const [notificationSettings, setNotificationSettings] = useState({
        emailEnabled: true,
        smsEnabled: false,
        pushEnabled: true,
        examReminders: true,
        resultAnnouncements: true,
        violationWarnings: true,
        systemUpdates: false
    });

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = () => {
        const mockNotifications = [
            {
                id: 1,
                type: 'violation',
                title: 'Violation Detected',
                message: 'Multiple faces detected in Exam #45 for student John Doe',
                timestamp: new Date(Date.now() - 2 * 60000),
                read: false,
                priority: 'high',
                actionRequired: true
            },
            {
                id: 2,
                type: 'exam',
                title: 'Exam Scheduled',
                message: 'Mathematics Final exam scheduled for tomorrow at 10:00 AM',
                timestamp: new Date(Date.now() - 15 * 60000),
                read: false,
                priority: 'medium',
                actionRequired: false
            },
            {
                id: 3,
                type: 'result',
                title: 'Results Published',
                message: 'Physics Midterm results have been published',
                timestamp: new Date(Date.now() - 30 * 60000),
                read: true,
                priority: 'low',
                actionRequired: false
            },
            {
                id: 4,
                type: 'user',
                title: 'New User Registrations',
                message: '5 new students have registered for the platform',
                timestamp: new Date(Date.now() - 60 * 60000),
                read: true,
                priority: 'low',
                actionRequired: false
            },
            {
                id: 5,
                type: 'system',
                title: 'System Maintenance',
                message: 'Scheduled maintenance on Jan 15, 2026 from 2:00 AM to 4:00 AM',
                timestamp: new Date(Date.now() - 2 * 60 * 60000),
                read: false,
                priority: 'medium',
                actionRequired: false
            },
            {
                id: 6,
                type: 'violation',
                title: 'Tab Switch Detected',
                message: 'Student Jane Smith switched tabs 3 times during Chemistry Quiz',
                timestamp: new Date(Date.now() - 3 * 60 * 60000),
                read: true,
                priority: 'high',
                actionRequired: true
            }
        ];
        setNotifications(mockNotifications);
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'violation': return AlertTriangle;
            case 'exam': return Bell;
            case 'result': return CheckCircle;
            case 'user': return MessageSquare;
            case 'system': return Info;
            default: return Bell;
        }
    };

    const getNotificationColor = (type, priority) => {
        if (priority === 'high') return '#ef4444';
        switch (type) {
            case 'violation': return '#f59e0b';
            case 'exam': return '#3b82f6';
            case 'result': return '#4ade80';
            case 'user': return '#a78bfa';
            case 'system': return '#6b7280';
            default: return '#6b7280';
        }
    };

    const formatTimestamp = (timestamp) => {
        const now = new Date();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes} min ago`;
        if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        return `${days} day${days > 1 ? 's' : ''} ago`;
    };

    const handleMarkAsRead = (id) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const handleMarkAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const handleDelete = (id) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const handleBulkDelete = () => {
        if (confirm(`Delete ${selectedNotifications.length} notifications?`)) {
            setNotifications(notifications.filter(n => !selectedNotifications.includes(n.id)));
            setSelectedNotifications([]);
        }
    };

    const toggleSelection = (id) => {
        setSelectedNotifications(prev =>
            prev.includes(id) ? prev.filter(nid => nid !== id) : [...prev, id]
        );
    };

    const filteredNotifications = notifications.filter(n => {
        const matchesFilter = filter === 'all' || n.type === filter ||
            (filter === 'unread' && !n.read) ||
            (filter === 'priority' && n.priority === 'high');
        const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            n.message.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const stats = {
        total: notifications.length,
        unread: notifications.filter(n => !n.read).length,
        high: notifications.filter(n => n.priority === 'high').length,
        actionRequired: notifications.filter(n => n.actionRequired).length
    };

    return (
        <div style={{ padding: 'var(--spacing-lg)' }}>
            {/* Header */}
            <div className="dashboard-header" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div>
                    <h1 className="header-title">Notification Center</h1>
                    <p style={{ color: 'var(--dark-muted)', marginTop: '0.5rem' }}>
                        Manage all notifications and alerts
                    </p>
                </div>

                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                    <button className="btn btn-secondary" onClick={handleMarkAllAsRead}>
                        <Check size={16} />
                        Mark All Read
                    </button>
                    <button className="btn btn-secondary" onClick={() => setShowSettings(true)}>
                        <Settings size={16} />
                        Settings
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="stats-grid" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                            <Bell />
                        </div>
                    </div>
                    <div className="stat-value">{stats.total}</div>
                    <div className="stat-label">Total Notifications</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
                            <Eye />
                        </div>
                    </div>
                    <div className="stat-value">{stats.unread}</div>
                    <div className="stat-label">Unread</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
                            <AlertTriangle />
                        </div>
                    </div>
                    <div className="stat-value">{stats.high}</div>
                    <div className="stat-label">High Priority</div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                            <CheckCircle />
                        </div>
                    </div>
                    <div className="stat-value">{stats.actionRequired}</div>
                    <div className="stat-label">Action Required</div>
                </div>
            </div>

            {/* Filters */}
            <div className="data-table-container" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div className="table-header">
                    <div className="search-box">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search notifications..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                        <button
                            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                            onClick={() => setFilter('all')}
                        >
                            All
                        </button>
                        <button
                            className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
                            onClick={() => setFilter('unread')}
                        >
                            Unread ({stats.unread})
                        </button>
                        <button
                            className={`filter-btn ${filter === 'priority' ? 'active' : ''}`}
                            onClick={() => setFilter('priority')}
                        >
                            High Priority
                        </button>
                        <button
                            className={`filter-btn ${filter === 'violation' ? 'active' : ''}`}
                            onClick={() => setFilter('violation')}
                        >
                            Violations
                        </button>
                        <button
                            className={`filter-btn ${filter === 'exam' ? 'active' : ''}`}
                            onClick={() => setFilter('exam')}
                        >
                            Exams
                        </button>

                        {selectedNotifications.length > 0 && (
                            <button className="btn btn-danger" onClick={handleBulkDelete}>
                                <Trash2 size={16} />
                                Delete ({selectedNotifications.length})
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Notifications List */}
            <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                {filteredNotifications.map(notification => {
                    const Icon = getNotificationIcon(notification.type);
                    const color = getNotificationColor(notification.type, notification.priority);

                    return (
                        <div
                            key={notification.id}
                            className="stat-card"
                            style={{
                                cursor: 'pointer',
                                borderLeft: `4px solid ${color}`,
                                opacity: notification.read ? 0.7 : 1,
                                background: notification.read ? 'var(--dark-card)' : 'rgba(102, 126, 234, 0.05)'
                            }}
                        >
                            <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'flex-start' }}>
                                <input
                                    type="checkbox"
                                    checked={selectedNotifications.includes(notification.id)}
                                    onChange={() => toggleSelection(notification.id)}
                                    onClick={(e) => e.stopPropagation()}
                                />

                                <div
                                    style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '12px',
                                        background: `${color}20`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}
                                >
                                    <Icon size={24} style={{ color }} />
                                </div>

                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-xs)' }}>
                                        <div>
                                            <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--dark-text)', marginBottom: '0.25rem' }}>
                                                {notification.title}
                                                {!notification.read && (
                                                    <span style={{
                                                        display: 'inline-block',
                                                        width: '8px',
                                                        height: '8px',
                                                        borderRadius: '50%',
                                                        background: '#3b82f6',
                                                        marginLeft: '0.5rem'
                                                    }} />
                                                )}
                                            </h4>
                                            <p style={{ fontSize: '0.875rem', color: 'var(--dark-muted)', lineHeight: 1.5 }}>
                                                {notification.message}
                                            </p>
                                        </div>

                                        <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                                            {notification.priority === 'high' && (
                                                <span className="badge badge-danger">High</span>
                                            )}
                                            {notification.actionRequired && (
                                                <span className="badge badge-warning">Action Required</span>
                                            )}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--spacing-sm)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', fontSize: '0.75rem', color: 'var(--dark-muted)' }}>
                                            <Clock size={14} />
                                            <span>{formatTimestamp(notification.timestamp)}</span>
                                        </div>

                                        <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                                            {!notification.read && (
                                                <button
                                                    className="btn btn-secondary"
                                                    style={{ padding: '0.5rem', fontSize: '0.75rem' }}
                                                    onClick={(e) => { e.stopPropagation(); handleMarkAsRead(notification.id); }}
                                                >
                                                    <Check size={14} />
                                                </button>
                                            )}
                                            <button
                                                className="btn btn-danger"
                                                style={{ padding: '0.5rem', fontSize: '0.75rem' }}
                                                onClick={(e) => { e.stopPropagation(); handleDelete(notification.id); }}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {filteredNotifications.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        padding: 'var(--spacing-xl)',
                        color: 'var(--dark-muted)'
                    }}>
                        <Bell size={48} style={{ opacity: 0.3, marginBottom: 'var(--spacing-md)' }} />
                        <p>No notifications found</p>
                    </div>
                )}
            </div>

            {/* Settings Modal */}
            {showSettings && (
                <div className="modal-overlay" onClick={() => setShowSettings(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                        <div className="modal-header">
                            <h2 className="modal-title">Notification Settings</h2>
                            <button className="close-btn" onClick={() => setShowSettings(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                            <div>
                                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>
                                    Notification Channels
                                </h3>

                                <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
                                    {[
                                        { key: 'emailEnabled', label: 'Email Notifications', icon: Mail },
                                        { key: 'smsEnabled', label: 'SMS Notifications', icon: MessageSquare },
                                        { key: 'pushEnabled', label: 'Push Notifications', icon: Bell }
                                    ].map(({ key, label, icon: Icon }) => (
                                        <label
                                            key={key}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 'var(--spacing-md)',
                                                padding: 'var(--spacing-md)',
                                                background: 'rgba(255,255,255,0.05)',
                                                borderRadius: '8px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <Icon size={20} style={{ color: 'var(--dark-muted)' }} />
                                            <span style={{ flex: 1, color: 'var(--dark-text)' }}>{label}</span>
                                            <input
                                                type="checkbox"
                                                checked={notificationSettings[key]}
                                                onChange={(e) => setNotificationSettings({
                                                    ...notificationSettings,
                                                    [key]: e.target.checked
                                                })}
                                            />
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>
                                    Notification Types
                                </h3>

                                <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
                                    {[
                                        { key: 'examReminders', label: 'Exam Reminders' },
                                        { key: 'resultAnnouncements', label: 'Result Announcements' },
                                        { key: 'violationWarnings', label: 'Violation Warnings' },
                                        { key: 'systemUpdates', label: 'System Updates' }
                                    ].map(({ key, label }) => (
                                        <label
                                            key={key}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: 'var(--spacing-md)',
                                                background: 'rgba(255,255,255,0.05)',
                                                borderRadius: '8px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <span style={{ color: 'var(--dark-text)' }}>{label}</span>
                                            <input
                                                type="checkbox"
                                                checked={notificationSettings[key]}
                                                onChange={(e) => setNotificationSettings({
                                                    ...notificationSettings,
                                                    [key]: e.target.checked
                                                })}
                                            />
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', justifyContent: 'flex-end', marginTop: 'var(--spacing-md)' }}>
                                <button className="btn btn-secondary" onClick={() => setShowSettings(false)}>
                                    Cancel
                                </button>
                                <button className="btn btn-primary" onClick={() => {
                                    alert('Settings saved successfully!');
                                    setShowSettings(false);
                                }}>
                                    <Check size={16} />
                                    Save Settings
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationCenter;
