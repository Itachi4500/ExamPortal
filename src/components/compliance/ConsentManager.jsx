import React, { useState } from 'react';
import {
    Shield, CheckCircle, XCircle, FileText, Lock, Eye,
    AlertTriangle, Download, Upload, Check, X, Info
} from 'lucide-react';

const ConsentManager = () => {
    const [showConsentModal, setShowConsentModal] = useState(false);
    const [consentData, setConsentData] = useState({
        camera: false,
        microphone: false,
        screenShare: false,
        dataCollection: false,
        termsAccepted: false,
        privacyAccepted: false
    });

    const [complianceStats, setComplianceStats] = useState({
        totalUsers: 2847,
        consentGiven: 2654,
        consentPending: 193,
        dataRetentionDays: 90,
        gdprCompliant: true,
        lastAudit: '2026-01-01'
    });

    const handleConsentChange = (key) => {
        setConsentData({ ...consentData, [key]: !consentData[key] });
    };

    const handleSubmitConsent = () => {
        const allRequired = consentData.camera &&
            consentData.screenShare &&
            consentData.dataCollection &&
            consentData.termsAccepted &&
            consentData.privacyAccepted;

        if (!allRequired) {
            alert('Please accept all required consents to continue');
            return;
        }

        alert('Consent submitted successfully!');
        setShowConsentModal(false);
    };

    const ConsentItem = ({ icon: Icon, title, description, required, checked, onChange }) => (
        <div style={{
            padding: 'var(--spacing-md)',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '8px',
            border: `1px solid ${checked ? 'rgba(74, 222, 128, 0.3)' : 'rgba(255,255,255,0.1)'}`,
            marginBottom: 'var(--spacing-md)'
        }}>
            <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'flex-start' }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    background: checked ? 'rgba(74, 222, 128, 0.2)' : 'rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                }}>
                    <Icon size={20} style={{ color: checked ? '#4ade80' : 'var(--dark-muted)' }} />
                </div>

                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xs)' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--dark-text)' }}>
                            {title}
                        </h4>
                        {required && (
                            <span className="badge badge-danger" style={{ fontSize: '0.625rem' }}>
                                Required
                            </span>
                        )}
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--dark-muted)', lineHeight: 1.5 }}>
                        {description}
                    </p>
                </div>

                <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <input
                        type="checkbox"
                        checked={checked}
                        onChange={onChange}
                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                </label>
            </div>
        </div>
    );

    return (
        <div style={{ padding: 'var(--spacing-lg)' }}>
            {/* Header */}
            <div className="dashboard-header" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div>
                    <h1 className="header-title">Compliance & Consent Management</h1>
                    <p style={{ color: 'var(--dark-muted)', marginTop: '0.5rem' }}>
                        GDPR-compliant data privacy and user consent management
                    </p>
                </div>

                <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                    <button className="btn btn-secondary">
                        <Download size={16} />
                        Export Report
                    </button>
                    <button className="btn btn-primary" onClick={() => setShowConsentModal(true)}>
                        <FileText size={16} />
                        View Consent Form
                    </button>
                </div>
            </div>

            {/* Compliance Stats */}
            <div className="stats-grid" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)' }}>
                            <CheckCircle />
                        </div>
                    </div>
                    <div className="stat-value">{complianceStats.consentGiven}</div>
                    <div className="stat-label">Consent Given</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--dark-muted)', marginTop: 'var(--spacing-xs)' }}>
                        {((complianceStats.consentGiven / complianceStats.totalUsers) * 100).toFixed(1)}% of users
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                            <AlertTriangle />
                        </div>
                    </div>
                    <div className="stat-value">{complianceStats.consentPending}</div>
                    <div className="stat-label">Pending Consent</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--dark-muted)', marginTop: 'var(--spacing-xs)' }}>
                        {((complianceStats.consentPending / complianceStats.totalUsers) * 100).toFixed(1)}% of users
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
                            <Lock />
                        </div>
                    </div>
                    <div className="stat-value">{complianceStats.dataRetentionDays}</div>
                    <div className="stat-label">Data Retention (Days)</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--dark-muted)', marginTop: 'var(--spacing-xs)' }}>
                        Auto-delete after period
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                            <Shield />
                        </div>
                    </div>
                    <div className="stat-value">
                        {complianceStats.gdprCompliant ?
                            <CheckCircle size={32} style={{ color: '#4ade80' }} /> :
                            <XCircle size={32} style={{ color: '#ef4444' }} />
                        }
                    </div>
                    <div className="stat-label">GDPR Compliant</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--dark-muted)', marginTop: 'var(--spacing-xs)' }}>
                        Last audit: {complianceStats.lastAudit}
                    </div>
                </div>
            </div>

            {/* Compliance Information */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)' }}>
                {/* Data Privacy Policy */}
                <div className="chart-container">
                    <div className="chart-header">
                        <h3 className="chart-title">Data Privacy Policy</h3>
                        <Shield size={20} style={{ color: '#4ade80' }} />
                    </div>

                    <div style={{ padding: 'var(--spacing-lg)' }}>
                        <div style={{ marginBottom: 'var(--spacing-md)' }}>
                            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--dark-text)', marginBottom: 'var(--spacing-sm)' }}>
                                Data Collection
                            </h4>
                            <p style={{ fontSize: '0.875rem', color: 'var(--dark-muted)', lineHeight: 1.6 }}>
                                We collect only necessary data for exam proctoring including video, audio, screen recordings, and behavioral analytics. All data is encrypted and stored securely.
                            </p>
                        </div>

                        <div style={{ marginBottom: 'var(--spacing-md)' }}>
                            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--dark-text)', marginBottom: 'var(--spacing-sm)' }}>
                                Data Usage
                            </h4>
                            <p style={{ fontSize: '0.875rem', color: 'var(--dark-muted)', lineHeight: 1.6 }}>
                                Collected data is used solely for exam integrity verification, violation detection, and academic performance analysis. Data is never shared with third parties.
                            </p>
                        </div>

                        <div style={{ marginBottom: 'var(--spacing-md)' }}>
                            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--dark-text)', marginBottom: 'var(--spacing-sm)' }}>
                                Data Retention
                            </h4>
                            <p style={{ fontSize: '0.875rem', color: 'var(--dark-muted)', lineHeight: 1.6 }}>
                                All proctoring data is automatically deleted after {complianceStats.dataRetentionDays} days. Users can request immediate deletion at any time.
                            </p>
                        </div>

                        <button className="btn btn-primary" style={{ width: '100%' }}>
                            <Download size={16} />
                            Download Full Policy
                        </button>
                    </div>
                </div>

                {/* User Rights */}
                <div className="chart-container">
                    <div className="chart-header">
                        <h3 className="chart-title">Your Rights (GDPR)</h3>
                        <Info size={20} style={{ color: '#60a5fa' }} />
                    </div>

                    <div style={{ padding: 'var(--spacing-lg)' }}>
                        {[
                            { title: 'Right to Access', description: 'Request a copy of all your personal data' },
                            { title: 'Right to Rectification', description: 'Correct any inaccurate personal data' },
                            { title: 'Right to Erasure', description: 'Request deletion of your personal data' },
                            { title: 'Right to Restrict Processing', description: 'Limit how we use your data' },
                            { title: 'Right to Data Portability', description: 'Receive your data in a portable format' },
                            { title: 'Right to Object', description: 'Object to certain data processing activities' }
                        ].map((right, index) => (
                            <div key={index} style={{
                                marginBottom: 'var(--spacing-md)',
                                paddingBottom: 'var(--spacing-md)',
                                borderBottom: index < 5 ? '1px solid rgba(255,255,255,0.1)' : 'none'
                            }}>
                                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--dark-text)', marginBottom: '0.25rem' }}>
                                    {right.title}
                                </h4>
                                <p style={{ fontSize: '0.75rem', color: 'var(--dark-muted)' }}>
                                    {right.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Security Measures */}
            <div className="chart-container">
                <div className="chart-header">
                    <h3 className="chart-title">Security Measures</h3>
                    <Lock size={20} style={{ color: '#fbbf24' }} />
                </div>

                <div style={{ padding: 'var(--spacing-lg)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-md)' }}>
                        {[
                            { icon: Lock, title: 'End-to-End Encryption', description: 'All data encrypted in transit and at rest' },
                            { icon: Shield, title: 'Secure Storage', description: 'Data stored in encrypted databases' },
                            { icon: Eye, title: 'Access Control', description: 'Role-based access permissions' },
                            { icon: FileText, title: 'Audit Logs', description: 'Complete activity tracking' },
                            { icon: CheckCircle, title: 'Regular Audits', description: 'Quarterly security assessments' },
                            { icon: AlertTriangle, title: 'Breach Protocol', description: 'Immediate notification system' }
                        ].map((measure, index) => (
                            <div key={index} style={{
                                padding: 'var(--spacing-md)',
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '8px',
                                textAlign: 'center'
                            }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '12px',
                                    background: 'var(--primary-gradient)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto var(--spacing-sm)'
                                }}>
                                    <measure.icon size={24} style={{ color: 'white' }} />
                                </div>
                                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--dark-text)', marginBottom: 'var(--spacing-xs)' }}>
                                    {measure.title}
                                </h4>
                                <p style={{ fontSize: '0.75rem', color: 'var(--dark-muted)' }}>
                                    {measure.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Consent Modal */}
            {showConsentModal && (
                <div className="modal-overlay" onClick={() => setShowConsentModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div className="modal-header">
                            <div>
                                <h2 className="modal-title">Consent & Privacy Agreement</h2>
                                <p style={{ color: 'var(--dark-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                    Please review and accept the following consents to continue
                                </p>
                            </div>
                            <button className="close-btn" onClick={() => setShowConsentModal(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div>
                            <ConsentItem
                                icon={Eye}
                                title="Camera Access"
                                description="Allow access to your camera for identity verification and proctoring during exams. Video will be recorded and analyzed for violation detection."
                                required={true}
                                checked={consentData.camera}
                                onChange={() => handleConsentChange('camera')}
                            />

                            <ConsentItem
                                icon={AlertTriangle}
                                title="Microphone Access"
                                description="Allow access to your microphone to detect audio anomalies during exams. This is optional but recommended for comprehensive proctoring."
                                required={false}
                                checked={consentData.microphone}
                                onChange={() => handleConsentChange('microphone')}
                            />

                            <ConsentItem
                                icon={Eye}
                                title="Screen Sharing"
                                description="Allow screen sharing to monitor your exam environment and prevent unauthorized access to external resources during the exam."
                                required={true}
                                checked={consentData.screenShare}
                                onChange={() => handleConsentChange('screenShare')}
                            />

                            <ConsentItem
                                icon={FileText}
                                title="Data Collection & Processing"
                                description="Consent to collection, processing, and temporary storage of exam data including video, audio, screen recordings, and behavioral analytics for academic integrity purposes."
                                required={true}
                                checked={consentData.dataCollection}
                                onChange={() => handleConsentChange('dataCollection')}
                            />

                            <ConsentItem
                                icon={FileText}
                                title="Terms & Conditions"
                                description="I have read and agree to the Terms & Conditions of using this examination platform."
                                required={true}
                                checked={consentData.termsAccepted}
                                onChange={() => handleConsentChange('termsAccepted')}
                            />

                            <ConsentItem
                                icon={Shield}
                                title="Privacy Policy"
                                description="I have read and agree to the Privacy Policy and understand how my data will be collected, used, and protected."
                                required={true}
                                checked={consentData.privacyAccepted}
                                onChange={() => handleConsentChange('privacyAccepted')}
                            />

                            <div style={{
                                padding: 'var(--spacing-md)',
                                background: 'rgba(59, 130, 246, 0.1)',
                                borderRadius: '8px',
                                border: '1px solid rgba(59, 130, 246, 0.3)',
                                marginBottom: 'var(--spacing-md)'
                            }}>
                                <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'flex-start' }}>
                                    <Info size={20} style={{ color: '#60a5fa', flexShrink: 0, marginTop: '2px' }} />
                                    <div>
                                        <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#60a5fa', marginBottom: 'var(--spacing-xs)' }}>
                                            Important Information
                                        </h4>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--dark-muted)', lineHeight: 1.5 }}>
                                            All collected data will be automatically deleted after {complianceStats.dataRetentionDays} days.
                                            You can request immediate deletion at any time by contacting support. Your data is encrypted
                                            and will never be shared with third parties.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', justifyContent: 'flex-end' }}>
                                <button className="btn btn-secondary" onClick={() => setShowConsentModal(false)}>
                                    <X size={16} />
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleSubmitConsent}
                                    disabled={!(consentData.camera && consentData.screenShare && consentData.dataCollection && consentData.termsAccepted && consentData.privacyAccepted)}
                                >
                                    <Check size={16} />
                                    Accept & Continue
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConsentManager;
