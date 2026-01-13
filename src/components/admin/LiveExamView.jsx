import React, { useState, useEffect, useRef } from 'react';
import {
    Eye, Video, Mic, Monitor, AlertTriangle, CheckCircle, XCircle,
    User, Clock, Activity, Camera, Maximize2, Volume2, VolumeX,
    Play, Pause, SkipForward, Flag, MessageSquare, Download
} from 'lucide-react';

const LiveExamView = () => {
    const [activeExams, setActiveExams] = useState([]);
    const [selectedExam, setSelectedExam] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [liveFeeds, setLiveFeeds] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const videoRefs = useRef({});

    useEffect(() => {
        loadActiveExams();

        // Simulate real-time updates
        const interval = setInterval(() => {
            updateLiveData();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const loadActiveExams = () => {
        const mockExams = [
            {
                id: 1,
                title: 'Physics Midterm',
                activeStudents: 38,
                startTime: '10:00 AM',
                endTime: '11:30 AM',
                duration: 90,
                elapsed: 45,
                violations: 3,
                status: 'active'
            },
            {
                id: 2,
                title: 'Mathematics Quiz',
                activeStudents: 25,
                startTime: '11:00 AM',
                endTime: '12:00 PM',
                duration: 60,
                elapsed: 15,
                violations: 1,
                status: 'active'
            }
        ];
        setActiveExams(mockExams);
        if (mockExams.length > 0) {
            setSelectedExam(mockExams[0]);
            loadStudentFeeds(mockExams[0].id);
        }
    };

    const loadStudentFeeds = (examId) => {
        const mockFeeds = [
            {
                id: 1,
                studentName: 'John Doe',
                studentId: 'STU001',
                status: 'normal',
                faceDetected: true,
                multipleFaces: false,
                phoneDetected: false,
                tabSwitches: 0,
                audioLevel: 15,
                screenSharing: true,
                lastViolation: null,
                progress: 65,
                questionsAnswered: 26,
                totalQuestions: 40
            },
            {
                id: 2,
                studentName: 'Jane Smith',
                studentId: 'STU002',
                status: 'warning',
                faceDetected: true,
                multipleFaces: false,
                phoneDetected: false,
                tabSwitches: 2,
                audioLevel: 8,
                screenSharing: true,
                lastViolation: 'Tab switch detected',
                progress: 55,
                questionsAnswered: 22,
                totalQuestions: 40
            },
            {
                id: 3,
                studentName: 'Mike Johnson',
                studentId: 'STU003',
                status: 'alert',
                faceDetected: false,
                multipleFaces: false,
                phoneDetected: true,
                tabSwitches: 1,
                audioLevel: 45,
                screenSharing: true,
                lastViolation: 'Phone detected',
                progress: 40,
                questionsAnswered: 16,
                totalQuestions: 40
            },
            {
                id: 4,
                studentName: 'Emily Davis',
                studentId: 'STU004',
                status: 'normal',
                faceDetected: true,
                multipleFaces: false,
                phoneDetected: false,
                tabSwitches: 0,
                audioLevel: 5,
                screenSharing: true,
                lastViolation: null,
                progress: 75,
                questionsAnswered: 30,
                totalQuestions: 40
            },
            {
                id: 5,
                studentName: 'Robert Brown',
                studentId: 'STU005',
                status: 'warning',
                faceDetected: true,
                multipleFaces: true,
                phoneDetected: false,
                tabSwitches: 0,
                audioLevel: 20,
                screenSharing: true,
                lastViolation: 'Multiple faces detected',
                progress: 50,
                questionsAnswered: 20,
                totalQuestions: 40
            },
            {
                id: 6,
                studentName: 'Sarah Wilson',
                studentId: 'STU006',
                status: 'normal',
                faceDetected: true,
                multipleFaces: false,
                phoneDetected: false,
                tabSwitches: 0,
                audioLevel: 10,
                screenSharing: true,
                lastViolation: null,
                progress: 70,
                questionsAnswered: 28,
                totalQuestions: 40
            }
        ];
        setLiveFeeds(mockFeeds);
    };

    const updateLiveData = () => {
        // Simulate real-time updates
        setLiveFeeds(prev => prev.map(feed => ({
            ...feed,
            audioLevel: Math.floor(Math.random() * 50),
            progress: Math.min(100, feed.progress + Math.random() * 5)
        })));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'normal': return '#4ade80';
            case 'warning': return '#fbbf24';
            case 'alert': return '#ef4444';
            default: return '#6b7280';
        }
    };

    const handleFlagStudent = (studentId) => {
        alert(`Student ${studentId} has been flagged for review`);
    };

    const handleSendMessage = (studentId) => {
        const message = prompt('Enter message to send to student:');
        if (message) {
            alert(`Message sent to student ${studentId}: ${message}`);
        }
    };

    const StudentFeedCard = ({ feed }) => (
        <div
            className="stat-card"
            style={{
                cursor: 'pointer',
                borderLeft: `4px solid ${getStatusColor(feed.status)}`,
                position: 'relative'
            }}
            onClick={() => setSelectedStudent(feed)}
        >
            {/* Status Indicator */}
            <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                <div
                    className="pulse-dot"
                    style={{ background: getStatusColor(feed.status) }}
                />
            </div>

            {/* Video Feed Placeholder */}
            <div style={{
                width: '100%',
                height: '180px',
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                borderRadius: '8px',
                marginBottom: 'var(--spacing-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <Camera size={48} style={{ opacity: 0.3 }} />
                <div style={{
                    position: 'absolute',
                    top: '0.5rem',
                    left: '0.5rem',
                    background: 'rgba(0,0,0,0.7)',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                }}>
                    <div className="live-indicator">
                        <div className="pulse-dot" />
                        LIVE
                    </div>
                </div>
            </div>

            {/* Student Info */}
            <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--dark-text)', marginBottom: '0.25rem' }}>
                    {feed.studentName}
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--dark-muted)' }}>
                    {feed.studentId}
                </p>
            </div>

            {/* Progress */}
            <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                    <span style={{ color: 'var(--dark-muted)' }}>Progress</span>
                    <span style={{ color: 'var(--dark-text)', fontWeight: 600 }}>
                        {feed.questionsAnswered}/{feed.totalQuestions}
                    </span>
                </div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{
                        width: `${feed.progress}%`,
                        height: '100%',
                        background: getStatusColor(feed.status),
                        transition: 'width 0.3s ease'
                    }} />
                </div>
            </div>

            {/* Indicators */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}>
                    {feed.faceDetected ? (
                        <CheckCircle size={14} style={{ color: '#4ade80' }} />
                    ) : (
                        <XCircle size={14} style={{ color: '#ef4444' }} />
                    )}
                    <span style={{ color: 'var(--dark-muted)' }}>Face</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}>
                    {feed.screenSharing ? (
                        <CheckCircle size={14} style={{ color: '#4ade80' }} />
                    ) : (
                        <XCircle size={14} style={{ color: '#ef4444' }} />
                    )}
                    <span style={{ color: 'var(--dark-muted)' }}>Screen</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}>
                    {feed.audioLevel < 30 ? (
                        <Volume2 size={14} style={{ color: '#4ade80' }} />
                    ) : (
                        <Volume2 size={14} style={{ color: '#ef4444' }} />
                    )}
                    <span style={{ color: 'var(--dark-muted)' }}>Audio: {feed.audioLevel}%</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}>
                    <Activity size={14} style={{ color: feed.tabSwitches > 0 ? '#fbbf24' : '#4ade80' }} />
                    <span style={{ color: 'var(--dark-muted)' }}>Tabs: {feed.tabSwitches}</span>
                </div>
            </div>

            {/* Violations */}
            {feed.lastViolation && (
                <div style={{
                    padding: '0.5rem',
                    background: 'rgba(239, 68, 68, 0.1)',
                    borderRadius: '4px',
                    marginBottom: 'var(--spacing-sm)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#ef4444' }}>
                        <AlertTriangle size={14} />
                        <span>{feed.lastViolation}</span>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: 'var(--spacing-xs)', paddingTop: 'var(--spacing-sm)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <button
                    className="btn btn-secondary"
                    style={{ flex: 1, padding: '0.5rem', fontSize: '0.75rem' }}
                    onClick={(e) => { e.stopPropagation(); handleFlagStudent(feed.studentId); }}
                >
                    <Flag size={12} />
                </button>
                <button
                    className="btn btn-secondary"
                    style={{ flex: 1, padding: '0.5rem', fontSize: '0.75rem' }}
                    onClick={(e) => { e.stopPropagation(); handleSendMessage(feed.studentId); }}
                >
                    <MessageSquare size={12} />
                </button>
                <button
                    className="btn btn-primary"
                    style={{ flex: 1, padding: '0.5rem', fontSize: '0.75rem' }}
                >
                    <Maximize2 size={12} />
                </button>
            </div>
        </div>
    );

    return (
        <div style={{ padding: 'var(--spacing-lg)' }}>
            {/* Header */}
            <div className="dashboard-header" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div>
                    <h1 className="header-title">Live Exam Monitoring</h1>
                    <p style={{ color: 'var(--dark-muted)', marginTop: '0.5rem' }}>
                        Real-time proctoring and violation detection
                    </p>
                </div>

                <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center' }}>
                    <div className="live-indicator">
                        <div className="pulse-dot" />
                        <span>{activeExams.length} Active Exams</span>
                    </div>
                    <button className="btn btn-secondary">
                        <Download size={16} />
                        Export Report
                    </button>
                </div>
            </div>

            {/* Active Exams Tabs */}
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-lg)', overflowX: 'auto' }}>
                {activeExams.map(exam => (
                    <button
                        key={exam.id}
                        className={`btn ${selectedExam?.id === exam.id ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => {
                            setSelectedExam(exam);
                            loadStudentFeeds(exam.id);
                        }}
                        style={{ whiteSpace: 'nowrap' }}
                    >
                        {exam.title} ({exam.activeStudents})
                        {exam.violations > 0 && (
                            <span className="badge badge-danger" style={{ marginLeft: '0.5rem' }}>
                                {exam.violations}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Exam Overview */}
            {selectedExam && (
                <div className="stats-grid" style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <div className="stat-card">
                        <div className="stat-header">
                            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                                <Users />
                            </div>
                        </div>
                        <div className="stat-value">{selectedExam.activeStudents}</div>
                        <div className="stat-label">Active Students</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-header">
                            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                                <Clock />
                            </div>
                        </div>
                        <div className="stat-value">{selectedExam.elapsed}/{selectedExam.duration}</div>
                        <div className="stat-label">Minutes Elapsed</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-header">
                            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
                                <AlertTriangle />
                            </div>
                        </div>
                        <div className="stat-value">{selectedExam.violations}</div>
                        <div className="stat-label">Total Violations</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-header">
                            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)' }}>
                                <Activity />
                            </div>
                        </div>
                        <div className="stat-value">
                            {Math.round((selectedExam.elapsed / selectedExam.duration) * 100)}%
                        </div>
                        <div className="stat-label">Completion</div>
                    </div>
                </div>
            )}

            {/* Student Feeds Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--spacing-lg)' }}>
                {liveFeeds.map(feed => (
                    <StudentFeedCard key={feed.id} feed={feed} />
                ))}
            </div>

            {/* Detailed Student View Modal */}
            {selectedStudent && (
                <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '1000px' }}>
                        <div className="modal-header">
                            <div>
                                <h2 className="modal-title">{selectedStudent.studentName}</h2>
                                <p style={{ color: 'var(--dark-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                    {selectedStudent.studentId}
                                </p>
                            </div>
                            <button className="close-btn" onClick={() => setSelectedStudent(null)}>
                                <XCircle size={20} />
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-lg)' }}>
                            {/* Video Feed */}
                            <div>
                                <div style={{
                                    width: '100%',
                                    height: '400px',
                                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                                    borderRadius: '8px',
                                    marginBottom: 'var(--spacing-md)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative'
                                }}>
                                    <Camera size={64} style={{ opacity: 0.3 }} />
                                    <div className="live-indicator" style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
                                        <div className="pulse-dot" />
                                        LIVE
                                    </div>
                                </div>

                                {/* Controls */}
                                <div style={{ display: 'flex', gap: 'var(--spacing-sm)', justifyContent: 'center' }}>
                                    <button className="btn btn-secondary">
                                        <Volume2 size={16} />
                                    </button>
                                    <button className="btn btn-secondary">
                                        <Download size={16} />
                                        Record
                                    </button>
                                    <button className="btn btn-danger">
                                        <Flag size={16} />
                                        Flag Violation
                                    </button>
                                    <button className="btn btn-primary">
                                        <MessageSquare size={16} />
                                        Send Message
                                    </button>
                                </div>
                            </div>

                            {/* Student Details */}
                            <div>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>
                                    Monitoring Details
                                </h3>

                                <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
                                    <div style={{ padding: 'var(--spacing-sm)', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--dark-muted)', marginBottom: '0.25rem' }}>Status</div>
                                        <span className={`badge ${selectedStudent.status === 'normal' ? 'badge-success' :
                                                selectedStudent.status === 'warning' ? 'badge-warning' :
                                                    'badge-danger'
                                            }`}>
                                            {selectedStudent.status.toUpperCase()}
                                        </span>
                                    </div>

                                    <div style={{ padding: 'var(--spacing-sm)', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--dark-muted)', marginBottom: '0.25rem' }}>Progress</div>
                                        <div style={{ fontWeight: 600 }}>
                                            {selectedStudent.questionsAnswered}/{selectedStudent.totalQuestions} questions
                                        </div>
                                        <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden', marginTop: '0.5rem' }}>
                                            <div style={{ width: `${selectedStudent.progress}%`, height: '100%', background: 'var(--primary-gradient)' }} />
                                        </div>
                                    </div>

                                    <div style={{ padding: 'var(--spacing-sm)', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--dark-muted)', marginBottom: '0.25rem' }}>Face Detection</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            {selectedStudent.faceDetected ? (
                                                <><CheckCircle size={16} style={{ color: '#4ade80' }} /> Detected</>
                                            ) : (
                                                <><XCircle size={16} style={{ color: '#ef4444' }} /> Not Detected</>
                                            )}
                                        </div>
                                    </div>

                                    <div style={{ padding: 'var(--spacing-sm)', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--dark-muted)', marginBottom: '0.25rem' }}>Tab Switches</div>
                                        <div style={{ fontWeight: 600, color: selectedStudent.tabSwitches > 0 ? '#fbbf24' : '#4ade80' }}>
                                            {selectedStudent.tabSwitches}
                                        </div>
                                    </div>

                                    <div style={{ padding: 'var(--spacing-sm)', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--dark-muted)', marginBottom: '0.25rem' }}>Audio Level</div>
                                        <div style={{ fontWeight: 600 }}>
                                            {selectedStudent.audioLevel}%
                                        </div>
                                        <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden', marginTop: '0.5rem' }}>
                                            <div style={{
                                                width: `${selectedStudent.audioLevel}%`,
                                                height: '100%',
                                                background: selectedStudent.audioLevel > 30 ? '#ef4444' : '#4ade80'
                                            }} />
                                        </div>
                                    </div>

                                    {selectedStudent.lastViolation && (
                                        <div style={{ padding: 'var(--spacing-sm)', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                                            <div style={{ fontSize: '0.75rem', color: '#ef4444', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <AlertTriangle size={14} />
                                                Last Violation
                                            </div>
                                            <div style={{ color: 'var(--dark-text)' }}>
                                                {selectedStudent.lastViolation}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LiveExamView;
