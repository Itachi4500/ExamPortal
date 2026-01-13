import React, { useState, useEffect } from 'react';
import {
    BarChart3, TrendingUp, TrendingDown, PieChart, Activity,
    Users, Clock, Target, Award, AlertTriangle, Download,
    Filter, Calendar, ArrowUp, ArrowDown, Minus
} from 'lucide-react';

const AnalyticsDashboard = () => {
    const [timeRange, setTimeRange] = useState('7days');
    const [selectedMetric, setSelectedMetric] = useState('performance');
    const [analyticsData, setAnalyticsData] = useState(null);

    useEffect(() => {
        loadAnalyticsData();
    }, [timeRange]);

    const loadAnalyticsData = () => {
        // Simulate comprehensive analytics data
        setAnalyticsData({
            overview: {
                totalExams: 156,
                totalStudents: 2847,
                avgScore: 78.3,
                avgDuration: 65.5,
                completionRate: 87.5,
                violationRate: 8.2
            },
            performance: {
                excellent: 35, // 90-100%
                good: 42,      // 75-89%
                average: 18,   // 60-74%
                poor: 5        // <60%
            },
            timeAnalysis: {
                avgTimePerQuestion: 2.5, // minutes
                fastestCompletion: 45,   // minutes
                slowestCompletion: 118,  // minutes
                peakActivityHour: '10:00 AM'
            },
            difficultyAnalysis: {
                easy: { count: 45, avgScore: 92.5, avgTime: 1.5 },
                medium: { count: 78, avgScore: 76.8, avgTime: 2.5 },
                hard: { count: 33, avgScore: 58.3, avgTime: 4.2 }
            },
            cheatingTrends: {
                totalViolations: 234,
                tabSwitches: 89,
                multipleFaces: 45,
                phoneDetected: 32,
                noFaceDetected: 68,
                trendPercentage: -15.3 // negative means improvement
            },
            topPerformers: [
                { id: 1, name: 'Jane Smith', avgScore: 96.5, examsCompleted: 12, violations: 0 },
                { id: 2, name: 'Michael Chen', avgScore: 94.8, examsCompleted: 10, violations: 0 },
                { id: 3, name: 'Sarah Johnson', avgScore: 93.2, examsCompleted: 11, violations: 0 },
                { id: 4, name: 'David Lee', avgScore: 91.7, examsCompleted: 9, violations: 0 },
                { id: 5, name: 'Emma Wilson', avgScore: 90.5, examsCompleted: 12, violations: 0 }
            ],
            recentExams: [
                { id: 1, name: 'Mathematics Final', date: '2026-01-08', students: 52, avgScore: 82.5, violations: 3, difficulty: 'hard' },
                { id: 2, name: 'Physics Midterm', date: '2026-01-07', students: 38, avgScore: 76.8, violations: 5, difficulty: 'medium' },
                { id: 3, name: 'Chemistry Quiz', date: '2026-01-05', students: 45, avgScore: 88.2, violations: 1, difficulty: 'easy' },
                { id: 4, name: 'Biology Test', date: '2026-01-03', students: 41, avgScore: 74.5, violations: 4, difficulty: 'medium' }
            ]
        });
    };

    const MetricCard = ({ icon: Icon, label, value, change, changeType, gradient }) => (
        <div className="stat-card">
            <div className="stat-header">
                <div className="stat-icon" style={{ background: gradient }}>
                    <Icon />
                </div>
                {change && (
                    <div className={`stat-trend ${changeType === 'up' ? 'trend-up' : changeType === 'down' ? 'trend-down' : ''}`}>
                        {changeType === 'up' && <ArrowUp size={16} />}
                        {changeType === 'down' && <ArrowDown size={16} />}
                        {changeType === 'neutral' && <Minus size={16} />}
                        <span>{Math.abs(change)}%</span>
                    </div>
                )}
            </div>
            <div className="stat-value">{value}</div>
            <div className="stat-label">{label}</div>
        </div>
    );

    const PerformanceDistribution = ({ data }) => {
        const total = data.excellent + data.good + data.average + data.poor;
        const getPercentage = (value) => ((value / total) * 100).toFixed(1);

        return (
            <div className="chart-container">
                <div className="chart-header">
                    <h3 className="chart-title">Performance Distribution</h3>
                </div>

                <div style={{ padding: 'var(--spacing-lg)' }}>
                    {[
                        { label: 'Excellent (90-100%)', value: data.excellent, color: '#4ade80' },
                        { label: 'Good (75-89%)', value: data.good, color: '#60a5fa' },
                        { label: 'Average (60-74%)', value: data.average, color: '#fbbf24' },
                        { label: 'Poor (<60%)', value: data.poor, color: '#f87171' }
                    ].map((item, index) => (
                        <div key={index} style={{ marginBottom: 'var(--spacing-md)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontSize: '0.875rem', color: 'var(--dark-text)' }}>{item.label}</span>
                                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: item.color }}>
                                    {item.value} ({getPercentage(item.value)}%)
                                </span>
                            </div>
                            <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{
                                    width: `${getPercentage(item.value)}%`,
                                    height: '100%',
                                    background: item.color,
                                    transition: 'width 0.5s ease'
                                }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const DifficultyAnalysis = ({ data }) => (
        <div className="chart-container">
            <div className="chart-header">
                <h3 className="chart-title">Question Difficulty Analysis</h3>
            </div>

            <div style={{ padding: 'var(--spacing-lg)' }}>
                <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                    {[
                        { level: 'Easy', data: data.easy, color: '#4ade80' },
                        { level: 'Medium', data: data.medium, color: '#fbbf24' },
                        { level: 'Hard', data: data.hard, color: '#f87171' }
                    ].map((item, index) => (
                        <div key={index} style={{
                            padding: 'var(--spacing-md)',
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '8px',
                            borderLeft: `4px solid ${item.color}`
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-sm)' }}>
                                <h4 style={{ fontSize: '1rem', fontWeight: 600, color: item.color }}>{item.level}</h4>
                                <span className="badge" style={{ background: `${item.color}20`, color: item.color }}>
                                    {item.data.count} questions
                                </span>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-sm)' }}>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--dark-muted)', marginBottom: '0.25rem' }}>Avg Score</div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--dark-text)' }}>
                                        {item.data.avgScore}%
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--dark-muted)', marginBottom: '0.25rem' }}>Avg Time</div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--dark-text)' }}>
                                        {item.data.avgTime} min
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const CheatingTrends = ({ data }) => (
        <div className="chart-container">
            <div className="chart-header">
                <h3 className="chart-title">Violation Analysis</h3>
                <div className={`stat-trend ${data.trendPercentage < 0 ? 'trend-up' : 'trend-down'}`}>
                    {data.trendPercentage < 0 ? <TrendingDown size={16} /> : <TrendingUp size={16} />}
                    <span>{Math.abs(data.trendPercentage)}% {data.trendPercentage < 0 ? 'decrease' : 'increase'}</span>
                </div>
            </div>

            <div style={{ padding: 'var(--spacing-lg)' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 'var(--spacing-md)',
                    marginBottom: 'var(--spacing-lg)'
                }}>
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-md)', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: '#ef4444', marginBottom: '0.25rem' }}>
                            {data.totalViolations}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--dark-muted)' }}>Total Violations</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-md)', background: 'rgba(74, 222, 128, 0.1)', borderRadius: '8px' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: '#4ade80', marginBottom: '0.25rem' }}>
                            {((1 - data.totalViolations / (analyticsData.overview.totalExams * analyticsData.overview.totalStudents * 0.01)) * 100).toFixed(1)}%
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--dark-muted)' }}>Clean Exams</div>
                    </div>
                </div>

                <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
                    {[
                        { type: 'Tab Switches', count: data.tabSwitches, icon: Activity },
                        { type: 'Multiple Faces', count: data.multipleFaces, icon: Users },
                        { type: 'Phone Detected', count: data.phoneDetected, icon: AlertTriangle },
                        { type: 'No Face Detected', count: data.noFaceDetected, icon: AlertTriangle }
                    ].map((item, index) => {
                        const percentage = ((item.count / data.totalViolations) * 100).toFixed(1);
                        return (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '8px',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <item.icon size={20} style={{ color: '#ef4444' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                        <span style={{ fontSize: '0.875rem', color: 'var(--dark-text)' }}>{item.type}</span>
                                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#ef4444' }}>
                                            {item.count} ({percentage}%)
                                        </span>
                                    </div>
                                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                                        <div style={{ width: `${percentage}%`, height: '100%', background: '#ef4444' }} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );

    if (!analyticsData) {
        return <div style={{ padding: 'var(--spacing-lg)', textAlign: 'center' }}>Loading analytics...</div>;
    }

    return (
        <div style={{ padding: 'var(--spacing-lg)' }}>
            {/* Header */}
            <div className="dashboard-header" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div>
                    <h1 className="header-title">Analytics Dashboard</h1>
                    <p style={{ color: 'var(--dark-muted)', marginTop: '0.5rem' }}>
                        Comprehensive insights and performance metrics
                    </p>
                </div>

                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                    <select
                        className="form-select"
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        style={{ width: 'auto', padding: '0.5rem 1rem' }}
                    >
                        <option value="7days">Last 7 Days</option>
                        <option value="30days">Last 30 Days</option>
                        <option value="90days">Last 90 Days</option>
                        <option value="1year">Last Year</option>
                    </select>

                    <button className="btn btn-secondary">
                        <Filter size={16} />
                        Filters
                    </button>

                    <button className="btn btn-primary">
                        <Download size={16} />
                        Export Report
                    </button>
                </div>
            </div>

            {/* Overview Metrics */}
            <div className="stats-grid" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <MetricCard
                    icon={BarChart3}
                    label="Total Exams"
                    value={analyticsData.overview.totalExams}
                    change={12}
                    changeType="up"
                    gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                />
                <MetricCard
                    icon={Users}
                    label="Total Students"
                    value={analyticsData.overview.totalStudents.toLocaleString()}
                    change={8}
                    changeType="up"
                    gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                />
                <MetricCard
                    icon={Award}
                    label="Average Score"
                    value={`${analyticsData.overview.avgScore}%`}
                    change={3.5}
                    changeType="up"
                    gradient="linear-gradient(135deg, #4ade80 0%, #22c55e 100%)"
                />
                <MetricCard
                    icon={Clock}
                    label="Avg Duration"
                    value={`${analyticsData.overview.avgDuration} min`}
                    change={2.1}
                    changeType="down"
                    gradient="linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)"
                />
                <MetricCard
                    icon={Target}
                    label="Completion Rate"
                    value={`${analyticsData.overview.completionRate}%`}
                    change={5.2}
                    changeType="up"
                    gradient="linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)"
                />
                <MetricCard
                    icon={AlertTriangle}
                    label="Violation Rate"
                    value={`${analyticsData.overview.violationRate}%`}
                    change={15.3}
                    changeType="down"
                    gradient="linear-gradient(135deg, #f87171 0%, #ef4444 100%)"
                />
            </div>

            {/* Charts Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)' }}>
                <PerformanceDistribution data={analyticsData.performance} />
                <CheatingTrends data={analyticsData.cheatingTrends} />
            </div>

            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <DifficultyAnalysis data={analyticsData.difficultyAnalysis} />
            </div>

            {/* Top Performers and Recent Exams */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-lg)' }}>
                {/* Top Performers */}
                <div className="data-table-container">
                    <div className="table-header">
                        <h3 className="chart-title">Top Performers</h3>
                        <Award size={20} style={{ color: '#fbbf24' }} />
                    </div>

                    <div style={{ padding: 'var(--spacing-md)' }}>
                        {analyticsData.topPerformers.map((student, index) => (
                            <div key={student.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-md)',
                                padding: 'var(--spacing-sm)',
                                marginBottom: 'var(--spacing-sm)',
                                background: index === 0 ? 'rgba(251, 191, 36, 0.1)' : 'rgba(255,255,255,0.05)',
                                borderRadius: '8px',
                                borderLeft: index < 3 ? `4px solid ${['#fbbf24', '#94a3b8', '#cd7f32'][index]}` : 'none'
                            }}>
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    background: 'var(--primary-gradient)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 700,
                                    fontSize: '0.875rem'
                                }}>
                                    {index + 1}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, color: 'var(--dark-text)', marginBottom: '0.25rem' }}>
                                        {student.name}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--dark-muted)' }}>
                                        {student.examsCompleted} exams completed
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#4ade80' }}>
                                        {student.avgScore}%
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--dark-muted)' }}>
                                        avg score
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Exams */}
                <div className="data-table-container">
                    <div className="table-header">
                        <h3 className="chart-title">Recent Exams</h3>
                        <Activity size={20} style={{ color: '#60a5fa' }} />
                    </div>

                    <div style={{ padding: 'var(--spacing-md)' }}>
                        {analyticsData.recentExams.map((exam) => (
                            <div key={exam.id} style={{
                                padding: 'var(--spacing-md)',
                                marginBottom: 'var(--spacing-sm)',
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '8px'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-sm)' }}>
                                    <div>
                                        <div style={{ fontWeight: 600, color: 'var(--dark-text)', marginBottom: '0.25rem' }}>
                                            {exam.name}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--dark-muted)' }}>
                                            {exam.date} • {exam.students} students
                                        </div>
                                    </div>
                                    <span className={`badge ${exam.difficulty === 'easy' ? 'badge-success' :
                                            exam.difficulty === 'medium' ? 'badge-warning' :
                                                'badge-danger'
                                        }`}>
                                        {exam.difficulty}
                                    </span>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--dark-muted)' }}>Avg Score: </span>
                                        <span style={{ fontWeight: 600, color: exam.avgScore >= 80 ? '#4ade80' : exam.avgScore >= 60 ? '#fbbf24' : '#f87171' }}>
                                            {exam.avgScore}%
                                        </span>
                                    </div>
                                    <div>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--dark-muted)' }}>Violations: </span>
                                        <span className={`badge ${exam.violations === 0 ? 'badge-success' : 'badge-danger'}`}>
                                            {exam.violations}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
