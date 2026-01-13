import React, { useState, useEffect } from 'react';
import {
    Plus, Edit2, Trash2, Copy, Eye, Calendar, Clock, Users,
    FileText, Settings, Save, X, Search, Filter, Download, Upload
} from 'lucide-react';

const ExamManagement = () => {
    const [exams, setExams] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingExam, setEditingExam] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        loadExams();
    }, []);

    const loadExams = () => {
        // Simulate API call
        const mockExams = [
            {
                id: 1,
                title: 'Mathematics Final Exam',
                description: 'Comprehensive final exam covering all topics',
                date: '2026-01-15',
                duration: 120,
                totalQuestions: 50,
                totalMarks: 100,
                passingMarks: 40,
                status: 'scheduled',
                enrolledStudents: 45,
                proctoringEnabled: true,
                randomizeQuestions: true,
                showResults: false
            },
            {
                id: 2,
                title: 'Physics Midterm',
                description: 'Midterm examination for Physics course',
                date: '2026-01-10',
                duration: 90,
                totalQuestions: 40,
                totalMarks: 80,
                passingMarks: 32,
                status: 'active',
                enrolledStudents: 38,
                proctoringEnabled: true,
                randomizeQuestions: true,
                showResults: false
            },
            {
                id: 3,
                title: 'Chemistry Quiz',
                description: 'Quick assessment on organic chemistry',
                date: '2026-01-08',
                duration: 60,
                totalQuestions: 30,
                totalMarks: 60,
                passingMarks: 24,
                status: 'completed',
                enrolledStudents: 52,
                proctoringEnabled: true,
                randomizeQuestions: false,
                showResults: true
            }
        ];
        setExams(mockExams);
    };

    const handleCreateExam = () => {
        setEditingExam({
            title: '',
            description: '',
            date: '',
            duration: 60,
            totalQuestions: 0,
            totalMarks: 0,
            passingMarks: 0,
            proctoringEnabled: true,
            randomizeQuestions: true,
            showResults: false
        });
        setShowModal(true);
    };

    const handleEditExam = (exam) => {
        setEditingExam({ ...exam });
        setShowModal(true);
    };

    const handleSaveExam = () => {
        if (editingExam.id) {
            // Update existing exam
            setExams(exams.map(e => e.id === editingExam.id ? editingExam : e));
        } else {
            // Create new exam
            setExams([...exams, { ...editingExam, id: Date.now(), status: 'draft', enrolledStudents: 0 }]);
        }
        setShowModal(false);
        setEditingExam(null);
    };

    const handleDeleteExam = (id) => {
        if (confirm('Are you sure you want to delete this exam?')) {
            setExams(exams.filter(e => e.id !== id));
        }
    };

    const handleDuplicateExam = (exam) => {
        const duplicated = {
            ...exam,
            id: Date.now(),
            title: `${exam.title} (Copy)`,
            status: 'draft',
            enrolledStudents: 0
        };
        setExams([...exams, duplicated]);
    };

    const filteredExams = exams.filter(exam => {
        const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exam.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || exam.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    return (
        <div style={{ padding: 'var(--spacing-lg)' }}>
            {/* Header */}
            <div className="dashboard-header" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div>
                    <h1 className="header-title">Exam Management</h1>
                    <p style={{ color: 'var(--dark-muted)', marginTop: '0.5rem' }}>
                        Create, edit, and manage all your exams
                    </p>
                </div>
                <button className="btn btn-primary" onClick={handleCreateExam}>
                    <Plus size={18} />
                    Create New Exam
                </button>
            </div>

            {/* Filters */}
            <div className="data-table-container" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div className="table-header">
                    <div className="search-box">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search exams..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                        <select
                            className="form-select"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            style={{ width: 'auto', padding: '0.5rem 1rem' }}
                        >
                            <option value="all">All Status</option>
                            <option value="draft">Draft</option>
                            <option value="scheduled">Scheduled</option>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                        </select>

                        <button className="btn btn-secondary">
                            <Download size={16} />
                            Export
                        </button>

                        <button className="btn btn-secondary">
                            <Upload size={16} />
                            Import
                        </button>
                    </div>
                </div>
            </div>

            {/* Exams Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 'var(--spacing-lg)' }}>
                {filteredExams.map(exam => (
                    <div key={exam.id} className="stat-card" style={{ cursor: 'default' }}>
                        {/* Status Badge */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-md)' }}>
                            <span className={`badge ${exam.status === 'active' ? 'badge-success' :
                                    exam.status === 'scheduled' ? 'badge-info' :
                                        exam.status === 'completed' ? 'badge-warning' :
                                            'badge-danger'
                                }`}>
                                {exam.status}
                            </span>

                            {exam.proctoringEnabled && (
                                <span className="badge badge-info" style={{ marginLeft: 'auto' }}>
                                    <Eye size={12} />
                                    Proctored
                                </span>
                            )}
                        </div>

                        {/* Exam Title */}
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--spacing-sm)', color: 'var(--dark-text)' }}>
                            {exam.title}
                        </h3>

                        <p style={{ color: 'var(--dark-muted)', fontSize: '0.875rem', marginBottom: 'var(--spacing-md)', lineHeight: 1.5 }}>
                            {exam.description}
                        </p>

                        {/* Exam Details */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', color: 'var(--dark-muted)', fontSize: '0.875rem' }}>
                                <Calendar size={16} />
                                <span>{exam.date}</span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', color: 'var(--dark-muted)', fontSize: '0.875rem' }}>
                                <Clock size={16} />
                                <span>{exam.duration} min</span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', color: 'var(--dark-muted)', fontSize: '0.875rem' }}>
                                <Users size={16} />
                                <span>{exam.enrolledStudents} students</span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', color: 'var(--dark-muted)', fontSize: '0.875rem' }}>
                                <FileText size={16} />
                                <span>{exam.totalQuestions} questions</span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div style={{ marginBottom: 'var(--spacing-md)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--dark-muted)', marginBottom: '0.25rem' }}>
                                <span>Total Marks</span>
                                <span>{exam.totalMarks} (Pass: {exam.passingMarks})</span>
                            </div>
                            <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                                <div style={{
                                    width: `${(exam.passingMarks / exam.totalMarks) * 100}%`,
                                    height: '100%',
                                    background: 'var(--primary-gradient)'
                                }} />
                            </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: 'var(--spacing-xs)', paddingTop: 'var(--spacing-md)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                            <button
                                className="btn btn-secondary"
                                style={{ flex: 1, padding: '0.5rem', fontSize: '0.75rem' }}
                                onClick={() => handleEditExam(exam)}
                            >
                                <Edit2 size={14} />
                                Edit
                            </button>

                            <button
                                className="btn btn-secondary"
                                style={{ flex: 1, padding: '0.5rem', fontSize: '0.75rem' }}
                                onClick={() => handleDuplicateExam(exam)}
                            >
                                <Copy size={14} />
                                Duplicate
                            </button>

                            <button
                                className="btn btn-danger"
                                style={{ padding: '0.5rem', fontSize: '0.75rem' }}
                                onClick={() => handleDeleteExam(exam.id)}
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 className="modal-title">
                                {editingExam?.id ? 'Edit Exam' : 'Create New Exam'}
                            </h2>
                            <button className="close-btn" onClick={() => setShowModal(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                            <div className="form-group">
                                <label className="form-label">Exam Title *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={editingExam?.title || ''}
                                    onChange={(e) => setEditingExam({ ...editingExam, title: e.target.value })}
                                    placeholder="Enter exam title"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-textarea"
                                    value={editingExam?.description || ''}
                                    onChange={(e) => setEditingExam({ ...editingExam, description: e.target.value })}
                                    placeholder="Enter exam description"
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                                <div className="form-group">
                                    <label className="form-label">Date *</label>
                                    <input
                                        type="date"
                                        className="form-input"
                                        value={editingExam?.date || ''}
                                        onChange={(e) => setEditingExam({ ...editingExam, date: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Duration (minutes) *</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        value={editingExam?.duration || ''}
                                        onChange={(e) => setEditingExam({ ...editingExam, duration: parseInt(e.target.value) })}
                                        placeholder="60"
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--spacing-md)' }}>
                                <div className="form-group">
                                    <label className="form-label">Total Questions *</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        value={editingExam?.totalQuestions || ''}
                                        onChange={(e) => setEditingExam({ ...editingExam, totalQuestions: parseInt(e.target.value) })}
                                        placeholder="50"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Total Marks *</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        value={editingExam?.totalMarks || ''}
                                        onChange={(e) => setEditingExam({ ...editingExam, totalMarks: parseInt(e.target.value) })}
                                        placeholder="100"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Passing Marks *</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        value={editingExam?.passingMarks || ''}
                                        onChange={(e) => setEditingExam({ ...editingExam, passingMarks: parseInt(e.target.value) })}
                                        placeholder="40"
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--spacing-md)' }}>
                                <div className="form-group">
                                    <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={editingExam?.proctoringEnabled || false}
                                            onChange={(e) => setEditingExam({ ...editingExam, proctoringEnabled: e.target.checked })}
                                        />
                                        <span className="form-label" style={{ marginBottom: 0 }}>Enable Proctoring</span>
                                    </label>
                                </div>

                                <div className="form-group">
                                    <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={editingExam?.randomizeQuestions || false}
                                            onChange={(e) => setEditingExam({ ...editingExam, randomizeQuestions: e.target.checked })}
                                        />
                                        <span className="form-label" style={{ marginBottom: 0 }}>Randomize Questions</span>
                                    </label>
                                </div>

                                <div className="form-group">
                                    <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={editingExam?.showResults || false}
                                            onChange={(e) => setEditingExam({ ...editingExam, showResults: e.target.checked })}
                                        />
                                        <span className="form-label" style={{ marginBottom: 0 }}>Show Results</span>
                                    </label>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', justifyContent: 'flex-end', marginTop: 'var(--spacing-md)' }}>
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    <X size={16} />
                                    Cancel
                                </button>
                                <button className="btn btn-primary" onClick={handleSaveExam}>
                                    <Save size={16} />
                                    Save Exam
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExamManagement;
