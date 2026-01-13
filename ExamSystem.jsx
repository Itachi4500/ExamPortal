import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Shield, LogIn, UserPlus, Edit2, Save, X, FileText, Clock, Plus, Calendar, Code, Play, CheckCircle, AlertCircle, BookOpen, TrendingUp, Award, BarChart } from 'lucide-react';
import ProctoringSystem from './ProctoringSystem.jsx';

const ExamSystem = () => {
    const [view, setView] = useState('login');
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([
        { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin', status: 'active' },
        { id: 2, name: 'John Examiner', email: 'examiner@example.com', role: 'examiner', status: 'active' },
        { id: 3, name: 'Jane Student', email: 'student@example.com', role: 'student', status: 'active' }
    ]);
    const [exams, setExams] = useState([
        { id: 1, title: 'JavaScript Fundamentals', type: 'MCQ', duration: 60, marks: 100, negative: true, negPct: 25, date: '2026-01-10', time: '10:00', status: 'scheduled', by: 2, qs: 10 },
        { id: 2, title: 'Python Coding', type: 'Coding', duration: 120, marks: 200, negative: false, date: '2026-01-15', time: '14:00', status: 'scheduled', by: 2, qs: 5 }
    ]);
    const [tab, setTab] = useState('exams');
    const [modal, setModal] = useState(null);
    const [editData, setEditData] = useState(null);
    const [taking, setTaking] = useState(null);
    const [viewResult, setViewResult] = useState(null);
    const [results, setResults] = useState([]);

    const correctAnswers = {
        1: 0, 2: 0, 3: 0, 4: 2
    };

    // Calculate exam result with score, rank, and percentage
    const calculateResult = (answers, violations, exam) => {
        let correct = 0;
        let wrong = 0;

        // Calculate correct and wrong answers
        Object.keys(answers).forEach(qId => {
            if (correctAnswers[qId] === answers[qId]) {
                correct++;
            } else {
                wrong++;
            }
        });

        // Calculate score with negative marking if applicable
        let score = correct * (exam.marks / 4); // Assuming 4 questions total
        if (exam.negative && wrong > 0) {
            const negativeMarks = wrong * (exam.marks / 4) * (exam.negPct / 100);
            score = Math.max(0, score - negativeMarks);
        }

        // Calculate percentage
        const percentage = (score / exam.marks) * 100;

        // Calculate rank (simple ranking based on score)
        const existingResults = results.filter(r => r.examId === exam.id);
        let rank = 1;
        existingResults.forEach(r => {
            if (r.score > score) rank++;
        });

        return {
            score,
            percentage,
            rank,
            correct,
            wrong,
            violations: violations.length
        };
    };

    const Login = () => {
        const [form, setForm] = useState({ email: '', password: '' });
        const login = () => {
            const u = users.find(x => x.email === form.email);
            u ? (setUser(u), setView('dash')) : alert('Try: admin@example.com, examiner@example.com, or student@example.com');
        };
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800">Exam Portal</h1>
                        <p className="text-gray-600 mt-2">Sign in to continue</p>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} onKeyPress={(e) => e.key === 'Enter' && login()} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="your@email.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} onKeyPress={(e) => e.key === 'Enter' && login()} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="••••••••" />
                        </div>
                        <button onClick={login} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 flex items-center justify-center gap-2">
                            <LogIn className="w-5 h-5" />Sign In
                        </button>
                    </div>
                    <div className="mt-6 text-center">
                        <button onClick={() => setView('register')} className="text-indigo-600 hover:text-indigo-800 font-medium">Don't have an account? Register</button>
                    </div>
                </div>
            </div>
        );
    };

    const Register = () => {
        const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'student' });
        const register = () => {
            if (form.password !== form.confirm) return alert('Passwords do not match!');
            if (!form.name || !form.email || !form.password) return alert('Fill all fields');
            setUsers([...users, { id: users.length + 1, ...form, status: 'active' }]);
            alert('Success! Please login.');
            setView('login');
        };
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-full mb-4">
                            <UserPlus className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
                    </div>
                    <div className="space-y-4">
                        <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Full Name" />
                        <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Email" />
                        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500">
                            <option value="student">Student</option>
                            <option value="examiner">Examiner</option>
                            <option value="admin">Admin</option>
                        </select>
                        <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Password" />
                        <input type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Confirm Password" />
                        <button onClick={register} className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700">Create Account</button>
                    </div>
                    <div className="mt-6 text-center">
                        <button onClick={() => setView('login')} className="text-emerald-600 hover:text-emerald-800 font-medium">Already have account? Sign in</button>
                    </div>
                </div>
            </div>
        );
    };

    const ExamModal = ({ exam, onClose }) => {
        const [data, setData] = useState(exam || { title: '', type: 'MCQ', duration: 60, marks: 100, negative: false, negPct: 0, date: '', time: '', qs: 0, rand: false });
        const save = () => {
            if (!data.title || !data.date || !data.time) return alert('Fill required fields');
            const e = { ...data, id: exam ? exam.id : Date.now(), by: user.id, status: 'scheduled' };
            exam ? setExams(exams.map(x => x.id === e.id ? e : x)) : setExams([...exams, e]);
            onClose();
        };
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                    <div className="p-6 border-b flex justify-between items-center">
                        <h2 className="text-2xl font-bold">{exam ? 'Edit' : 'Create'} Exam</h2>
                        <button onClick={onClose}><X className="w-6 h-6" /></button>
                    </div>
                    <div className="p-6 space-y-4">
                        <input type="text" value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} className="w-full px-4 py-3 border rounded-lg" placeholder="Exam Title" />
                        <div className="grid grid-cols-2 gap-4">
                            <select value={data.type} onChange={(e) => setData({ ...data, type: e.target.value })} className="px-4 py-3 border rounded-lg">
                                <option value="MCQ">MCQ</option>
                                <option value="Subjective">Subjective</option>
                                <option value="Coding">Coding</option>
                                <option value="Mixed">Mixed</option>
                            </select>
                            <input type="number" value={data.qs} onChange={(e) => setData({ ...data, qs: parseInt(e.target.value) })} className="px-4 py-3 border rounded-lg" placeholder="Questions" />
                            <input type="number" value={data.duration} onChange={(e) => setData({ ...data, duration: parseInt(e.target.value) })} className="px-4 py-3 border rounded-lg" placeholder="Duration (min)" />
                            <input type="number" value={data.marks} onChange={(e) => setData({ ...data, marks: parseInt(e.target.value) })} className="px-4 py-3 border rounded-lg" placeholder="Total Marks" />
                            <input type="date" value={data.date} onChange={(e) => setData({ ...data, date: e.target.value })} className="px-4 py-3 border rounded-lg" />
                            <input type="time" value={data.time} onChange={(e) => setData({ ...data, time: e.target.value })} className="px-4 py-3 border rounded-lg" />
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={data.negative} onChange={(e) => setData({ ...data, negative: e.target.checked })} className="w-5 h-5" />
                                <span>Negative Marking</span>
                            </label>
                            {data.negative && <input type="number" value={data.negPct} onChange={(e) => setData({ ...data, negPct: parseInt(e.target.value) })} className="w-20 px-3 py-2 border rounded-lg" placeholder="%" />}
                        </div>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={data.rand} onChange={(e) => setData({ ...data, rand: e.target.checked })} className="w-5 h-5" />
                            <span>Randomize Questions</span>
                        </label>
                    </div>
                    <div className="p-6 bg-gray-50 flex justify-end gap-3 border-t">
                        <button onClick={onClose} className="px-6 py-3 bg-gray-300 rounded-lg hover:bg-gray-400">Cancel</button>
                        <button onClick={save} className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2">
                            <Save className="w-5 h-5" />{exam ? 'Update' : 'Create'}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const TakeExam = ({ exam, onClose }) => {
        const [time, setTime] = useState(exam.duration * 60);
        const [curr, setCurr] = useState(0);
        const [ans, setAns] = useState({});
        const [section, setSection] = useState(0);
        const [saved, setSaved] = useState(true);
        const [violations, setViolations] = useState([]);

        const qs = [
            { id: 1, sec: 0, text: 'What is typeof null?', opts: ['object', 'null', 'undefined', 'number'] },
            { id: 2, sec: 0, text: 'Method to add to array end?', opts: ['push()', 'pop()', 'shift()', 'unshift()'] },
            { id: 3, sec: 1, text: 'DOM stands for?', opts: ['Document Object Model', 'Data Object Model', 'Digital Object Model', 'Dynamic Object Model'] },
            { id: 4, sec: 1, text: 'What is closure in JS?', opts: ['Function scope', 'Variable scope', 'Lexical scope', 'Block scope'] }
        ];
        const sections = ['Section A: Basics', 'Section B: Advanced'];

        // Violations are now handled by ProctoringSystem component

        // Camera and proctoring handled by ProctoringSystem component

        useEffect(() => {
            const t = setInterval(() => setTime(p => p <= 1 ? (clearInterval(t), alert('Time up! Auto-submitting...'), onClose(), 0) : p - 1), 1000);
            return () => clearInterval(t);
        }, []);

        useEffect(() => {
            const autoSave = setInterval(() => {
                setSaved(false);
                setTimeout(() => setSaved(true), 500);
            }, 10000);
            return () => clearInterval(autoSave);
        }, [ans]);

        // Tab switches and violations are tracked by ProctoringSystem component

        // Monitor online/offline status

        const m = Math.floor(time / 60), s = time % 60;
        const secQs = qs.filter(q => q.sec === section);

        return (
            <div className="fixed inset-0 bg-gray-900 z-50 select-none">
                <div className="bg-white border-b px-6 py-3 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold">{exam.title}</h2>
                        <p className="text-sm text-gray-600">Q {curr + 1} of {secQs.length} - {sections[section]}</p>
                    </div>
                    <div className="flex gap-3 items-center">
                        {saved && (
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-100 text-green-700">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-xs">Saved</span>
                            </div>
                        )}

                        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${time < 300 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                            <Clock className="w-5 h-5" />
                            <span className="font-mono text-lg font-bold">{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}</span>
                        </div>

                        <button
                            onClick={() => {
                                const result = calculateResult(ans, violations, exam);
                                const newResult = {
                                    id: results.length + 1,
                                    examId: exam.id,
                                    studentId: user.id,
                                    score: result.score,
                                    total: exam.marks,
                                    rank: result.rank,
                                    percentage: result.percentage,
                                    correct: result.correct,
                                    wrong: result.wrong,
                                    violations: result.violations,
                                    submittedAt: new Date().toISOString(),
                                    answers: ans
                                };
                                setResults([...results, newResult]);

                                const report = `EXAM REPORT\n\nExam: ${exam.title}\nStudent: ${user.name}\nScore: ${result.score.toFixed(2)}/${exam.marks}\nPercentage: ${result.percentage.toFixed(2)}%\nRank: ${result.rank}\n\nCorrect: ${result.correct}\nWrong: ${result.wrong}\nTotal Violations: ${violations.length}\n\nViolations:\n${violations.map(v => `[${new Date(v.timestamp).toLocaleTimeString()}] ${v.type}: ${v.description || v.desc || 'N/A'}`).join('\n')}`;
                                console.log(report);
                                alert(`Exam submitted!\n\nScore: ${result.score.toFixed(2)}/${exam.marks}\nPercentage: ${result.percentage.toFixed(2)}%\nRank: ${result.rank}`);
                                setViewResult(newResult);
                                onClose();
                            }}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                        >
                            Submit
                        </button>
                    </div>
                </div>

                <div className="flex h-[calc(100vh-80px)]">
                    <div className="w-64 bg-white border-r overflow-y-auto">
                        <div className="p-4">
                            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-xs text-blue-700 text-center">📹 Proctoring is active</p>
                                <p className="text-xs text-gray-600 text-center mt-1">Check the proctoring panel on the right</p>
                            </div>
                        </div>

                        <div className="p-4 border-t">
                            <h3 className="font-bold text-gray-800 mb-4">Sections</h3>
                            <div className="space-y-2">
                                {sections.map((sec, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => (setSection(idx), setCurr(0))}
                                        className={`w-full text-left px-4 py-3 rounded-lg transition ${section === idx ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                            }`}
                                    >
                                        <div className="text-sm font-medium">{sec}</div>
                                        <div className="text-xs mt-1 opacity-80">
                                            {qs.filter(q => q.sec === idx).filter(q => ans[q.id] !== undefined).length}/{qs.filter(q => q.sec === idx).length} answered
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="mt-6">
                                <h3 className="font-bold text-gray-800 mb-3">Question Grid</h3>
                                <div className="grid grid-cols-5 gap-2">
                                    {secQs.map((q, i) => (
                                        <button
                                            key={q.id}
                                            onClick={() => setCurr(i)}
                                            className={`w-10 h-10 rounded-lg text-sm font-medium transition ${curr === i
                                                ? 'bg-indigo-600 text-white'
                                                : ans[q.id] !== undefined
                                                    ? 'bg-green-100 text-green-700 border-2 border-green-400'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8">
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
                                <div className="mb-6">
                                    <span className="text-sm font-medium text-indigo-600">Question {curr + 1}</span>
                                    <h3 className="text-xl font-semibold text-gray-800 mt-2">{secQs[curr].text}</h3>
                                </div>
                                <div className="space-y-3">
                                    {secQs[curr].opts.map((o, i) => (
                                        <label key={i} className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${ans[secQs[curr].id] === i ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}>
                                            <input type="radio" checked={ans[secQs[curr].id] === i} onChange={() => setAns({ ...ans, [secQs[curr].id]: i })} className="w-5 h-5 text-indigo-600" />
                                            <span className="ml-3">{o}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <button onClick={() => setCurr(Math.max(0, curr - 1))} disabled={curr === 0} className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
                                <button onClick={() => setCurr(Math.min(secQs.length - 1, curr + 1))} disabled={curr === secQs.length - 1} className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Integrated Proctoring System */}
                <ProctoringSystem
                    examId={exam.id}
                    studentId={user.id}
                    onViolation={(violation) => {
                        setViolations(prev => [...prev, violation]);
                        if (violation.type === 'TAB_SWITCH') {
                            setTabSwitches(prev => prev + 1);
                        }
                    }}
                />
            </div>
        );
    };

    const Dashboard = () => {
        const canManage = user?.role === 'admin';
        const canCreate = user?.role === 'admin' || user?.role === 'examiner';
        const badge = (r) => ({ admin: 'bg-purple-100 text-purple-800', examiner: 'bg-blue-100 text-blue-800', student: 'bg-green-100 text-green-800' }[r]);
        const typeBadge = (t) => ({ MCQ: 'bg-blue-100 text-blue-800', Subjective: 'bg-purple-100 text-purple-800', Coding: 'bg-green-100 text-green-800', Mixed: 'bg-orange-100 text-orange-800' }[t]);

        // Computed variables for results section
        const myResults = results.filter(r => r.studentId === user.id);
        const avgScore = myResults.length > 0
            ? myResults.reduce((sum, r) => sum + r.percentage, 0) / myResults.length
            : 0;


        return (
            <div className="min-h-screen bg-gray-50">
                <header className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Shield className="w-8 h-8 text-indigo-600" />
                            <h1 className="text-2xl font-bold">Exam Management</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm text-gray-600">Welcome, {user.name}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${badge(user.role)}`}>{user.role}</span>
                            <button onClick={() => (setUser(null), setView('login'))} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Logout</button>
                        </div>
                    </div>
                </header>

                <div className="bg-white border-b">
                    <div className="max-w-7xl mx-auto px-4 flex gap-1">
                        {['exams', 'results', 'profile', canManage && 'users'].filter(Boolean).map(t => (
                            <button key={t} onClick={() => setTab(t)} className={`px-6 py-3 font-medium ${tab === t ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600'}`}>
                                {t === 'exams' ? <FileText className="w-5 h-5 inline mr-2" /> : t === 'results' ? <BookOpen className="w-5 h-5 inline mr-2" /> : t === 'profile' ? <User className="w-5 h-5 inline mr-2" /> : <Shield className="w-5 h-5 inline mr-2" />}
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <main className="max-w-7xl mx-auto px-4 py-8">
                    {tab === 'results' && (
                        <div>
                            {user.role === 'student' && (
                                <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm opacity-90">Total Exams</span>
                                            <FileText className="w-8 h-8 opacity-50" />
                                        </div>
                                        <p className="text-3xl font-bold">{myResults.length}</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm opacity-90">Avg Score</span>
                                            <TrendingUp className="w-8 h-8 opacity-50" />
                                        </div>
                                        <p className="text-3xl font-bold">{avgScore.toFixed(1)}%</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm opacity-90">Best Rank</span>
                                            <Award className="w-8 h-8 opacity-50" />
                                        </div>
                                        <p className="text-3xl font-bold">
                                            {myResults.length > 0 ? `#${Math.min(...myResults.map(r => r.rank))}` : 'N/A'}
                                        </p>
                                    </div>
                                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm opacity-90">Violations</span>
                                            <AlertCircle className="w-8 h-8 opacity-50" />
                                        </div>
                                        <p className="text-3xl font-bold">{myResults.reduce((sum, r) => sum + r.violations, 0)}</p>
                                    </div>
                                </div>
                            )}

                            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                                <div className="p-6 border-b">
                                    <h2 className="text-xl font-bold">
                                        {user.role === 'student' ? 'My Results' : 'All Results'}
                                    </h2>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Exam</th>
                                                {(canCreate || canManage) && <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Student</th>}
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Score</th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Percentage</th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Rank</th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Violations</th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Submitted</th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {(user.role === 'student' ? myResults : results).map(r => {
                                                const exam = exams.find(e => e.id === r.examId);
                                                const student = users.find(u => u.id === r.studentId);
                                                return (
                                                    <tr key={r.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{exam?.title}</td>
                                                        {(canCreate || canManage) && <td className="px-6 py-4 text-sm text-gray-600">{student?.name}</td>}
                                                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">{r.score.toFixed(2)}/{r.total}</td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${r.percentage >= 80 ? 'bg-green-100 text-green-700' : r.percentage >= 60 ? 'bg-blue-100 text-blue-700' : r.percentage >= 40 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                                                                {r.percentage.toFixed(1)}%
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                {r.rank === 1 && <Award className="w-4 h-4 text-yellow-500" />}
                                                                <span className="text-sm font-semibold">#{r.rank}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-2 py-1 rounded text-xs font-medium ${r.violations > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                                {r.violations}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-600">{new Date(r.submittedAt).toLocaleString()}</td>
                                                        <td className="px-6 py-4">
                                                            <button onClick={() => setViewResult(r)} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">View Details</button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            {(user.role === 'student' ? myResults : results).length === 0 && (
                                                <tr>
                                                    <td colSpan={canCreate || canManage ? 8 : 7} className="px-6 py-12 text-center">
                                                        <div className="flex flex-col items-center justify-center text-gray-500">
                                                            <BookOpen className="w-16 h-16 mb-4 opacity-30" />
                                                            <p className="text-lg font-medium">No results yet</p>
                                                            <p className="text-sm mt-2">
                                                                {user.role === 'student'
                                                                    ? 'Complete an exam to see your results here'
                                                                    : 'No exam results available'}
                                                            </p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {tab === 'exams' && (
                        <div>
                            {canCreate && (
                                <div className="mb-6 flex justify-end">
                                    <button onClick={() => setModal('create')} className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2">
                                        <Plus className="w-5 h-5" />Create Exam
                                    </button>
                                </div>
                            )}
                            <div className="grid gap-6 md:grid-cols-2">
                                {exams.map(e => (
                                    <div key={e.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-800">{e.title}</h3>
                                                <p className="text-sm text-gray-600 mt-1">by {users.find(u => u.id === e.by)?.name}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeBadge(e.type)}`}>{e.type}</span>
                                        </div>
                                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                                            <div className="flex items-center gap-2"><Clock className="w-4 h-4" />{e.duration} mins | {e.marks} marks</div>
                                            <div className="flex items-center gap-2"><Calendar className="w-4 h-4" />{e.date} at {e.time}</div>
                                            {e.negative && <div className="flex items-center gap-2"><X className="w-4 h-4" />Negative: {e.negPct}%</div>}
                                        </div>
                                        <div className="flex gap-2">
                                            {user.role === 'student' && (
                                                <button onClick={() => setTaking(e)} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2">
                                                    <Play className="w-4 h-4" />Start Exam
                                                </button>
                                            )}
                                            {canCreate && (
                                                <>
                                                    <button onClick={() => (setEditData(e), setModal('edit'))} className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Edit</button>
                                                    <button onClick={() => confirm('Delete?') && setExams(exams.filter(x => x.id !== e.id))} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {tab === 'profile' && (
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-bold mb-4">My Profile</h2>
                            {editData ? (
                                <div className="space-y-4">
                                    <input type="text" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
                                    <input type="email" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
                                    <div className="flex gap-2">
                                        <button onClick={() => (setUsers(users.map(u => u.id === editData.id ? editData : u)), user.id === editData.id && setUser(editData), setEditData(null))} className="px-4 py-2 bg-green-600 text-white rounded-lg">Save</button>
                                        <button onClick={() => setEditData(null)} className="px-4 py-2 bg-gray-300 rounded-lg">Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-between">
                                    <div className="space-y-2">
                                        <p><span className="font-semibold">Name:</span> {user.name}</p>
                                        <p><span className="font-semibold">Email:</span> {user.email}</p>
                                        <p><span className="font-semibold">Role:</span> {user.role}</p>
                                    </div>
                                    <button onClick={() => setEditData(user)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2">
                                        <Edit2 className="w-4 h-4" />Edit
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {tab === 'users' && canManage && (
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-bold mb-6">All Users</h2>
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Role</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {users.map(u => (
                                        <tr key={u.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">{u.name}</td>
                                            <td className="px-4 py-3">{u.email}</td>
                                            <td className="px-4 py-3"><span className={`px-3 py-1 rounded-full text-xs font-medium ${badge(u.role)}`}>{u.role}</span></td>
                                            <td className="px-4 py-3">
                                                <button onClick={() => setEditData(u)} className="text-indigo-600 mr-2"><Edit2 className="w-4 h-4" /></button>
                                                <button onClick={() => confirm('Delete?') && setUsers(users.filter(x => x.id !== u.id))} className="text-red-600"><X className="w-4 h-4" /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </main>

                {modal && <ExamModal exam={modal === 'edit' ? editData : null} onClose={() => (setModal(null), setEditData(null))} />}
                {taking && <TakeExam exam={taking} onClose={() => setTaking(null)} />}
                {viewResult && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b flex justify-between items-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                                <div>
                                    <h2 className="text-2xl font-bold">Exam Result</h2>
                                    <p className="text-sm opacity-90">{exams.find(e => e.id === viewResult.examId)?.title}</p>
                                </div>
                                <button onClick={() => setViewResult(null)} className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                                        <div className="text-sm text-green-600 mb-1">Total Score</div>
                                        <div className="text-3xl font-bold text-green-700">{viewResult.score.toFixed(2)}</div>
                                        <div className="text-sm text-green-600">out of {viewResult.total}</div>
                                    </div>
                                    <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                                        <div className="text-sm text-blue-600 mb-1">Percentage</div>
                                        <div className="text-3xl font-bold text-blue-700">{viewResult.percentage.toFixed(1)}%</div>
                                        <div className="text-sm text-blue-600">
                                            {viewResult.percentage >= 80 ? 'Excellent!' : viewResult.percentage >= 60 ? 'Good' : viewResult.percentage >= 40 ? 'Average' : 'Need Improvement'}
                                        </div>
                                    </div>
                                    <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
                                        <div className="text-sm text-purple-600 mb-1">Your Rank</div>
                                        <div className="text-3xl font-bold text-purple-700 flex items-center gap-2">
                                            {viewResult.rank === 1 && <Award className="w-8 h-8 text-yellow-500" />}
                                            #{viewResult.rank}
                                        </div>
                                        <div className="text-sm text-purple-600">Out of all students</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                                        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                            <BarChart className="w-5 h-5 text-indigo-600" />
                                            Answer Statistics
                                        </h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Correct Answers</span>
                                                <span className="font-bold text-green-600">{viewResult.correct || 0}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Wrong Answers</span>
                                                <span className="font-bold text-red-600">{viewResult.wrong || 0}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Unanswered</span>
                                                <span className="font-bold text-gray-600">{4 - (viewResult.correct || 0) - (viewResult.wrong || 0)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                                        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                            <AlertCircle className="w-5 h-5 text-red-600" />
                                            Proctoring Report
                                        </h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Total Violations</span>
                                                <span className={`font-bold ${viewResult.violations > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                    {viewResult.violations}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Submitted At</span>
                                                <span className="text-sm text-gray-600">{new Date(viewResult.submittedAt).toLocaleTimeString()}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Status</span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${viewResult.violations === 0 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                    {viewResult.violations === 0 ? 'Clean' : 'Flagged'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200">
                                    <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-indigo-600" />
                                        Performance Insights
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                        {viewResult.percentage >= 80 && (
                                            <p className="text-green-700">🎉 Outstanding performance! You're in the top tier.</p>
                                        )}
                                        {viewResult.percentage >= 60 && viewResult.percentage < 80 && (
                                            <p className="text-blue-700">👍 Good job! Keep practicing to reach excellence.</p>
                                        )}
                                        {viewResult.percentage < 60 && (
                                            <p className="text-orange-700">📚 Keep learning! Focus on areas where you struggled.</p>
                                        )}
                                        {viewResult.violations > 0 && (
                                            <p className="text-red-700">⚠️ Violations detected. Please follow exam guidelines strictly.</p>
                                        )}
                                        {viewResult.rank === 1 && (
                                            <p className="text-purple-700">🏆 Congratulations! You ranked #1 in this exam!</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-gray-50 border-t flex justify-end">
                                <button onClick={() => setViewResult(null)} className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return view === 'login' ? <Login /> : view === 'register' ? <Register /> : <Dashboard />;
};

export default ExamSystem;
