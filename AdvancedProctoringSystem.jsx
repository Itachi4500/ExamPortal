import React, { useState, useEffect, useRef } from 'react';
import { Camera, Mic, Monitor, AlertTriangle, CheckCircle, XCircle, Eye, Users, Volume2, Smartphone, FileText, Video, Brain, Activity } from 'lucide-react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as faceapi from 'face-api.js';

const AdvancedProctoringSystem = ({ examId, studentId, onViolation, onClose }) => {
    const [isActive, setIsActive] = useState(false);
    const [violations, setViolations] = useState([]);
    const [aiModelsLoaded, setAiModelsLoaded] = useState({
        objectDetection: false,
        faceDetection: false
    });

    const [monitoring, setMonitoring] = useState({
        webcam: false,
        microphone: false,
        screen: false,
        faceDetection: false,
        objectDetection: false,
        eyeTracking: false,
        keystrokeAnalysis: false
    });

    const [detectionStatus, setDetectionStatus] = useState({
        faceDetected: false,
        faceCount: 0,
        multipleFaces: false,
        noiseLevel: 0,
        tabSwitches: 0,
        phoneDetected: false,
        lookingAway: false,
        suspiciousKeystrokes: false,
        eyeGazeScore: 100
    });

    const [recordings, setRecordings] = useState({
        screenshots: [],
        videoChunks: [],
        auditLogs: [],
        keystrokeLogs: []
    });

    const videoRef = useRef(null);
    const screenRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const canvasRef = useRef(null);
    const objectDetectionModelRef = useRef(null);
    const lastKeystrokeRef = useRef(null);
    const eyeGazeHistoryRef = useRef([]);

    // Load AI Models
    const loadAIModels = async () => {
        try {
            logAudit('AI', 'Loading AI models...');

            // Load TensorFlow.js
            await tf.ready();
            logAudit('AI', 'TensorFlow.js ready');

            // Load COCO-SSD for object detection (phone detection)
            const objectModel = await cocoSsd.load();
            objectDetectionModelRef.current = objectModel;
            setAiModelsLoaded(prev => ({ ...prev, objectDetection: true }));
            logAudit('AI', 'Object detection model loaded');

            // Load face-api.js models
            await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
            await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
            await faceapi.nets.faceExpressionNet.loadFromUri('/models');
            setAiModelsLoaded(prev => ({ ...prev, faceDetection: true }));
            logAudit('AI', 'Face detection models loaded');

            setMonitoring(prev => ({
                ...prev,
                faceDetection: true,
                objectDetection: true,
                eyeTracking: true
            }));

            return true;
        } catch (error) {
            console.error('AI model loading failed:', error);
            logAudit('AI', `Model loading failed: ${error.message}`);
            // Continue with basic proctoring even if AI fails
            return false;
        }
    };

    // Initialize proctoring system
    const initializeProctoring = async () => {
        try {
            // Request webcam and microphone access
            const webcamStream = await navigator.mediaDevices.getUserMedia({
                video: { width: 1280, height: 720, facingMode: 'user' },
                audio: true
            });

            if (videoRef.current) {
                videoRef.current.srcObject = webcamStream;
            }

            // Setup audio monitoring
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            const microphone = audioContext.createMediaStreamSource(webcamStream);

            analyser.fftSize = 256;
            microphone.connect(analyser);

            audioContextRef.current = audioContext;
            analyserRef.current = analyser;

            // Setup video recording
            const mediaRecorder = new MediaRecorder(webcamStream, {
                mimeType: 'video/webm;codecs=vp9'
            });

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    setRecordings(prev => ({
                        ...prev,
                        videoChunks: [...prev.videoChunks, event.data]
                    }));
                }
            };

            mediaRecorderRef.current = mediaRecorder;
            mediaRecorder.start(5000);

            setMonitoring(prev => ({ ...prev, webcam: true, microphone: true, keystrokeAnalysis: true }));
            setIsActive(true);

            logAudit('SYSTEM', 'Proctoring initialized successfully');

            // Load AI models
            await loadAIModels();

            return true;
        } catch (error) {
            console.error('Proctoring initialization failed:', error);
            alert('Camera/Microphone access is required for this exam. Please grant permissions.');
            return false;
        }
    };

    // Request screen sharing
    const requestScreenShare = async () => {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: { mediaSource: 'screen' }
            });

            if (screenRef.current) {
                screenRef.current.srcObject = screenStream;
            }

            screenStream.getVideoTracks()[0].onended = () => {
                logViolation('SCREEN_SHARE', 'Screen sharing stopped', 'HIGH');
                setMonitoring(prev => ({ ...prev, screen: false }));
            };

            setMonitoring(prev => ({ ...prev, screen: true }));
            logAudit('SYSTEM', 'Screen sharing started');
        } catch (error) {
            logViolation('SCREEN_SHARE', 'Screen sharing denied or failed', 'CRITICAL');
        }
    };

    // Advanced Face Detection with face-api.js
    const detectFaceAdvanced = async () => {
        if (!videoRef.current || !aiModelsLoaded.faceDetection) return;

        try {
            const detections = await faceapi
                .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceExpressions();

            const faceCount = detections.length;
            setDetectionStatus(prev => ({
                ...prev,
                faceDetected: faceCount > 0,
                faceCount,
                multipleFaces: faceCount > 1
            }));

            if (faceCount === 0) {
                logViolation('FACE', 'No face detected in frame', 'HIGH');
            } else if (faceCount > 1) {
                logViolation('FACE', `Multiple faces detected (${faceCount} faces)`, 'CRITICAL');
                captureScreenshot('Multiple faces');
            }

            // Eye tracking if face detected
            if (faceCount === 1 && detections[0].landmarks) {
                trackEyeGaze(detections[0].landmarks);
            }

        } catch (error) {
            console.error('Face detection error:', error);
        }
    };

    // Eye Gaze Tracking
    const trackEyeGaze = (landmarks) => {
        try {
            const leftEye = landmarks.getLeftEye();
            const rightEye = landmarks.getRightEye();
            const nose = landmarks.getNose();

            // Calculate eye center
            const leftEyeCenter = {
                x: leftEye.reduce((sum, p) => sum + p.x, 0) / leftEye.length,
                y: leftEye.reduce((sum, p) => sum + p.y, 0) / leftEye.length
            };

            const rightEyeCenter = {
                x: rightEye.reduce((sum, p) => sum + p.x, 0) / rightEye.length,
                y: rightEye.reduce((sum, p) => sum + p.y, 0) / rightEye.length
            };

            const noseCenter = {
                x: nose.reduce((sum, p) => sum + p.x, 0) / nose.length,
                y: nose.reduce((sum, p) => sum + p.y, 0) / nose.length
            };

            // Calculate gaze direction (simplified)
            const eyeDistance = Math.sqrt(
                Math.pow(rightEyeCenter.x - leftEyeCenter.x, 2) +
                Math.pow(rightEyeCenter.y - leftEyeCenter.y, 2)
            );

            const noseToEyeDistance = Math.sqrt(
                Math.pow(noseCenter.x - (leftEyeCenter.x + rightEyeCenter.x) / 2, 2) +
                Math.pow(noseCenter.y - (leftEyeCenter.y + rightEyeCenter.y) / 2, 2)
            );

            // Gaze score (100 = looking straight, lower = looking away)
            const gazeScore = Math.max(0, Math.min(100, 100 - (noseToEyeDistance / eyeDistance) * 50));

            eyeGazeHistoryRef.current.push(gazeScore);
            if (eyeGazeHistoryRef.current.length > 10) {
                eyeGazeHistoryRef.current.shift();
            }

            const avgGazeScore = eyeGazeHistoryRef.current.reduce((a, b) => a + b, 0) / eyeGazeHistoryRef.current.length;

            setDetectionStatus(prev => ({
                ...prev,
                eyeGazeScore: Math.round(avgGazeScore),
                lookingAway: avgGazeScore < 60
            }));

            if (avgGazeScore < 60) {
                logViolation('EYE_GAZE', `Student looking away (gaze score: ${Math.round(avgGazeScore)})`, 'MEDIUM');
            }

        } catch (error) {
            console.error('Eye tracking error:', error);
        }
    };

    // AI-based Phone Detection using COCO-SSD
    const detectPhone = async () => {
        if (!videoRef.current || !objectDetectionModelRef.current) return;

        try {
            const predictions = await objectDetectionModelRef.current.detect(videoRef.current);

            const phoneDetected = predictions.some(p =>
                (p.class === 'cell phone' || p.class === 'mobile phone') && p.score > 0.5
            );

            const personCount = predictions.filter(p => p.class === 'person' && p.score > 0.6).length;

            setDetectionStatus(prev => ({ ...prev, phoneDetected }));

            if (phoneDetected) {
                logViolation('PHONE', 'Mobile phone detected in frame', 'CRITICAL');
                captureScreenshot('Phone detected');
            }

            // Detect multiple people
            if (personCount > 1) {
                logViolation('PERSON', `Multiple people detected (${personCount} people)`, 'CRITICAL');
            }

        } catch (error) {
            console.error('Object detection error:', error);
        }
    };

    // Keystroke Analysis
    const analyzeKeystroke = (event) => {
        const now = Date.now();
        const keystroke = {
            key: event.key,
            timestamp: now,
            timeSinceLast: lastKeystrokeRef.current ? now - lastKeystrokeRef.current : 0
        };

        setRecordings(prev => ({
            ...prev,
            keystrokeLogs: [...prev.keystrokeLogs, keystroke]
        }));

        // Detect suspiciously fast typing (potential copy-paste or external help)
        if (keystroke.timeSinceLast > 0 && keystroke.timeSinceLast < 50) {
            logViolation('KEYSTROKE', 'Suspiciously fast typing detected', 'LOW');
            setDetectionStatus(prev => ({ ...prev, suspiciousKeystrokes: true }));
        }

        // Detect unusual patterns (e.g., very long answers typed very quickly)
        const recentKeystrokes = recordings.keystrokeLogs.slice(-50);
        if (recentKeystrokes.length >= 50) {
            const avgTime = recentKeystrokes.reduce((sum, k) => sum + k.timeSinceLast, 0) / recentKeystrokes.length;
            if (avgTime < 100) {
                logViolation('KEYSTROKE', 'Unusual typing pattern detected (possible paste)', 'MEDIUM');
            }
        }

        lastKeystrokeRef.current = now;
    };

    // Monitor audio levels
    const monitorAudio = () => {
        if (!analyserRef.current) return;

        const analyser = analyserRef.current;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;

        setDetectionStatus(prev => ({ ...prev, noiseLevel: average }));

        if (average > 60) {
            logViolation('AUDIO', `High background noise detected (${average.toFixed(0)})`, 'MEDIUM');
        }
    };

    // Capture screenshot
    const captureScreenshot = (reason = 'Violation detected') => {
        if (!videoRef.current || !canvasRef.current) return null;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        ctx.drawImage(videoRef.current, 0, 0);

        const screenshot = {
            timestamp: new Date().toISOString(),
            dataUrl: canvas.toDataURL('image/jpeg', 0.8),
            reason
        };

        setRecordings(prev => ({
            ...prev,
            screenshots: [...prev.screenshots, screenshot]
        }));

        logAudit('SCREENSHOT', `Screenshot captured: ${reason}`);
        return screenshot;
    };

    // Log violation
    const logViolation = (type, description, severity = 'MEDIUM') => {
        const violation = {
            id: Date.now(),
            type,
            description,
            severity,
            timestamp: new Date().toISOString(),
            screenshot: null
        };

        if (severity === 'HIGH' || severity === 'CRITICAL') {
            violation.screenshot = captureScreenshot(description);
        }

        setViolations(prev => [...prev, violation]);
        logAudit('VIOLATION', `${type}: ${description} [${severity}]`);

        if (onViolation) {
            onViolation(violation);
        }
    };

    // Log audit event
    const logAudit = (category, message) => {
        const log = {
            timestamp: new Date().toISOString(),
            category,
            message,
            examId,
            studentId
        };

        setRecordings(prev => ({
            ...prev,
            auditLogs: [...prev.auditLogs, log]
        }));

        console.log(`[AUDIT] ${category}: ${message}`);
    };

    // Monitor tab switches and window focus
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && isActive) {
                setDetectionStatus(prev => ({
                    ...prev,
                    tabSwitches: prev.tabSwitches + 1
                }));
                logViolation('TAB_SWITCH', `Tab switched (Total: ${detectionStatus.tabSwitches + 1})`, 'HIGH');
                captureScreenshot('Tab switch');
            }
        };

        const handleBlur = () => {
            if (isActive) {
                logViolation('FOCUS_LOSS', 'Window focus lost', 'MEDIUM');
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleBlur);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleBlur);
        };
    }, [isActive, detectionStatus.tabSwitches]);

    // Keystroke monitoring
    useEffect(() => {
        if (!isActive || !monitoring.keystrokeAnalysis) return;

        const handleKeyDown = (e) => {
            analyzeKeystroke(e);
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isActive, monitoring.keystrokeAnalysis, recordings.keystrokeLogs]);

    // Prevent copy/paste/right-click
    useEffect(() => {
        const preventAction = (e) => {
            e.preventDefault();
            logViolation('SUSPICIOUS', `Attempted ${e.type} action`, 'LOW');
        };

        if (isActive) {
            document.addEventListener('copy', preventAction);
            document.addEventListener('cut', preventAction);
            document.addEventListener('paste', preventAction);
            document.addEventListener('contextmenu', preventAction);

            return () => {
                document.removeEventListener('copy', preventAction);
                document.removeEventListener('cut', preventAction);
                document.removeEventListener('paste', preventAction);
                document.removeEventListener('contextmenu', preventAction);
            };
        }
    }, [isActive]);

    // Continuous AI monitoring loop
    useEffect(() => {
        if (!isActive) return;

        const aiMonitoringInterval = setInterval(async () => {
            if (aiModelsLoaded.faceDetection) {
                await detectFaceAdvanced();
            }
            if (aiModelsLoaded.objectDetection) {
                await detectPhone();
            }
            monitorAudio();
        }, 3000); // Every 3 seconds

        return () => clearInterval(aiMonitoringInterval);
    }, [isActive, aiModelsLoaded]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (videoRef.current?.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
            if (screenRef.current?.srcObject) {
                screenRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
            if (mediaRecorderRef.current?.state === 'recording') {
                mediaRecorderRef.current.stop();
            }
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    // Generate comprehensive report
    const generateReport = () => {
        return {
            examId,
            studentId,
            startTime: recordings.auditLogs[0]?.timestamp,
            endTime: new Date().toISOString(),
            totalViolations: violations.length,
            violationsByType: violations.reduce((acc, v) => {
                acc[v.type] = (acc[v.type] || 0) + 1;
                return acc;
            }, {}),
            violations,
            screenshots: recordings.screenshots,
            auditLogs: recordings.auditLogs,
            keystrokeLogs: recordings.keystrokeLogs,
            monitoring,
            aiModelsUsed: aiModelsLoaded,
            detectionSummary: {
                avgEyeGazeScore: detectionStatus.eyeGazeScore,
                phoneDetected: detectionStatus.phoneDetected,
                multipleFacesDetected: detectionStatus.multipleFaces,
                tabSwitches: detectionStatus.tabSwitches,
                suspiciousKeystrokes: detectionStatus.suspiciousKeystrokes
            }
        };
    };

    return (
        <div className="advanced-proctoring-system">
            {/* Hidden video elements */}
            <video ref={videoRef} autoPlay muted style={{ display: 'none' }} />
            <video ref={screenRef} autoPlay muted style={{ display: 'none' }} />
            <canvas ref={canvasRef} style={{ display: 'none' }} />

            {/* Enhanced Proctoring UI */}
            <div className="fixed top-4 right-4 bg-white rounded-xl shadow-2xl p-5 z-50 w-96 border-2 border-indigo-200">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <Brain className="w-5 h-5 text-indigo-600" />
                        AI Proctoring
                    </h3>
                    {isActive && (
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-xs text-red-600 font-semibold">LIVE</span>
                        </div>
                    )}
                </div>

                {/* AI Models Status */}
                {isActive && (
                    <div className="mb-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                        <div className="text-xs font-semibold text-indigo-700 mb-2">AI Models</div>
                        <div className="space-y-1 text-xs">
                            <div className="flex items-center justify-between">
                                <span>Face Detection</span>
                                {aiModelsLoaded.faceDetection ? (
                                    <CheckCircle className="w-3 h-3 text-green-600" />
                                ) : (
                                    <Activity className="w-3 h-3 text-yellow-600 animate-spin" />
                                )}
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Object Detection</span>
                                {aiModelsLoaded.objectDetection ? (
                                    <CheckCircle className="w-3 h-3 text-green-600" />
                                ) : (
                                    <Activity className="w-3 h-3 text-yellow-600 animate-spin" />
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Monitoring Status */}
                <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                            <Camera className="w-4 h-4" />
                            Webcam
                        </span>
                        {monitoring.webcam ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                        )}
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                            <Mic className="w-4 h-4" />
                            Microphone
                        </span>
                        {monitoring.microphone ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                        )}
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                            <Monitor className="w-4 h-4" />
                            Screen Share
                        </span>
                        {monitoring.screen ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                            <button
                                onClick={requestScreenShare}
                                className="text-xs px-2 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                            >
                                Enable
                            </button>
                        )}
                    </div>
                </div>

                {/* AI Detection Status */}
                <div className="border-t pt-3 mb-3">
                    <div className="text-xs font-semibold text-gray-700 mb-2">AI Detection</div>

                    <div className="flex items-center justify-between text-sm mb-2">
                        <span className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Faces
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${detectionStatus.faceCount === 1
                                ? 'bg-green-100 text-green-700'
                                : detectionStatus.faceCount === 0
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-orange-100 text-orange-700'
                            }`}>
                            {detectionStatus.faceCount} detected
                        </span>
                    </div>

                    <div className="flex items-center justify-between text-sm mb-2">
                        <span className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            Eye Gaze
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${detectionStatus.eyeGazeScore > 70
                                ? 'bg-green-100 text-green-700'
                                : detectionStatus.eyeGazeScore > 50
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-red-100 text-red-700'
                            }`}>
                            {detectionStatus.eyeGazeScore}%
                        </span>
                    </div>

                    <div className="flex items-center justify-between text-sm mb-2">
                        <span className="flex items-center gap-2">
                            <Smartphone className="w-4 h-4" />
                            Phone
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${detectionStatus.phoneDetected
                                ? 'bg-red-100 text-red-700'
                                : 'bg-green-100 text-green-700'
                            }`}>
                            {detectionStatus.phoneDetected ? 'Detected!' : 'Not detected'}
                        </span>
                    </div>

                    <div className="flex items-center justify-between text-sm mb-2">
                        <span className="flex items-center gap-2">
                            <Volume2 className="w-4 h-4" />
                            Noise
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${detectionStatus.noiseLevel > 60
                                ? 'bg-red-100 text-red-700'
                                : 'bg-green-100 text-green-700'
                            }`}>
                            {detectionStatus.noiseLevel.toFixed(0)} dB
                        </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Tab Switches
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${detectionStatus.tabSwitches > 0
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-green-100 text-green-700'
                            }`}>
                            {detectionStatus.tabSwitches}
                        </span>
                    </div>
                </div>

                {/* Violations Summary */}
                <div className="border-t pt-3">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold">Total Violations</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${violations.length === 0
                                ? 'bg-green-100 text-green-700'
                                : violations.length < 3
                                    ? 'bg-orange-100 text-orange-700'
                                    : 'bg-red-100 text-red-700'
                            }`}>
                            {violations.length}
                        </span>
                    </div>

                    {violations.length > 0 && (
                        <div className="max-h-32 overflow-y-auto space-y-1">
                            {violations.slice(-3).reverse().map(v => (
                                <div key={v.id} className="text-xs bg-gray-50 p-2 rounded border-l-2 border-red-500">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-semibold text-red-600">{v.type}</span>
                                        <span className={`px-1 py-0.5 rounded text-[10px] ${v.severity === 'CRITICAL' ? 'bg-red-200 text-red-800' :
                                                v.severity === 'HIGH' ? 'bg-orange-200 text-orange-800' :
                                                    v.severity === 'MEDIUM' ? 'bg-yellow-200 text-yellow-800' :
                                                        'bg-gray-200 text-gray-800'
                                            }`}>
                                            {v.severity}
                                        </span>
                                    </div>
                                    <div className="text-gray-600">{v.description}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Initialize Button */}
                {!isActive && (
                    <button
                        onClick={initializeProctoring}
                        className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 font-semibold flex items-center justify-center gap-2 shadow-lg"
                    >
                        <Brain className="w-5 h-5" />
                        Start AI Proctoring
                    </button>
                )}

                {/* Status Indicator */}
                {isActive && (
                    <div className="mt-4 p-2 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 text-xs text-green-700">
                            <CheckCircle className="w-4 h-4" />
                            <span className="font-semibold">AI Proctoring Active</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdvancedProctoringSystem;
