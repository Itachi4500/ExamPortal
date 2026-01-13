import React, { useState } from 'react';
import AdminDashboard from './components/admin/AdminDashboard';
import ExamManagement from './components/admin/ExamManagement';
import UserManagement from './components/admin/UserManagement';
import LiveExamView from './components/admin/LiveExamView';
import AnalyticsDashboard from './components/analytics/AnalyticsDashboard';
import NotificationCenter from './components/notifications/NotificationCenter';
import ConsentManager from './components/compliance/ConsentManager';
import ExamSystem from './ExamSystem';
import './src/styles/dashboard.css';

const ComprehensiveAdminApp = () => {
    const [currentView, setCurrentView] = useState('admin-dashboard');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);

    // Render the appropriate component based on current view
    const renderView = () => {
        switch (currentView) {
            case 'admin-dashboard':
                return <AdminDashboard />;
            case 'exam-management':
                return <ExamManagement />;
            case 'user-management':
                return <UserManagement />;
            case 'live-monitoring':
                return <LiveExamView />;
            case 'analytics':
                return <AnalyticsDashboard />;
            case 'notifications':
                return <NotificationCenter />;
            case 'compliance':
                return <ConsentManager />;
            case 'exam-system':
                return <ExamSystem />;
            default:
                return <AdminDashboard />;
        }
    };

    return (
        <div className="comprehensive-admin-app">
            {renderView()}
        </div>
    );
};

export default ComprehensiveAdminApp;
