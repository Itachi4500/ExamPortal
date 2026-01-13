import React, { useState, useEffect, useRef } from 'react';
import { Camera, Mic, Monitor, AlertTriangle, CheckCircle, XCircle, Eye, Users, Volume2, Smartphone, FileText, Video } from 'lucide-react';
import * as faceapi from 'face-api.js';

const ProctoringSystem = ({ examId, studentId, onViolation, onClose }) => {
    const [isActive, setIsActive] = useState(false);
    const [violations, setViolations] = useState([]);
    const [monitoring, setMonitoring] = useState({
        webcam: false,
        microphone: false,
        screen: false,
        faceDetection: false
    });

    const [detectionStatus, setDetectionStatus] = useState({
        faceDetected: false,
        multipleFaces: false,
        noiseLevel: 0,
        tabSwitches: 0,
        phoneDetected: false
    });

    const [recordings, setRecordings] = useState({
        screenshots: [],
        videoChunks: [],
        auditLogs: []
    });

    const videoRef = useRef(null);
    const screenRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const canvasRef = useRef(null);
    const lastFaceDetectionTime = useRef(Date.now());

    const [modelsLoaded, setModelsLoaded] = useState(false);

    // Load face-api.js models
    const loadModels = async () => {
        try {
            const MODEL_URL = '/models';
            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
            ]);
            setModelsLoaded(true);
            logAudit('SYSTEM', 'Face detection models loaded successfully');
            return true;
        } catch (error) {
            console.error('Failed to load face detection models:', error);
            logAudit('ERROR', 'Failed to load face detection models');
            return false;
        }
    };

    // Initialize proctoring system
    const initializeProctoring = async () => {
        try {
            // Load face detection models first
            if (!modelsLoaded) {
                await loadModels();
            }

            // Request webcam and microphone access
            const webcamStream = await navigator.mediaDevices.getUserMedia({
                video: { width: 1280, height: 720, facingMode: 'user' },
                audio: true
            });

            if (videoRef.current) {
                videoRef.current.srcObject = webcamStream;
                // Wait for video to be ready
                await new Promise((resolve) => {
                    videoRef.current.onloadedmetadata = () => {
                        videoRef.current.play();
                        resolve();
                    };
                });
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
            mediaRecorder.start(5000); // Record in 5-second chunks

            setMonitoring(prev => ({ ...prev, webcam: true, microphone: true, faceDetection: true }));
            setIsActive(true);

            logAudit('SYSTEM', 'Proctoring initialized successfully');
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

            // Detect when user stops sharing
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

    // Face detection using face-api.js AI models
    const detectFace = async () => {
        if (!videoRef.current || !modelsLoaded) return;

        const video = videoRef.current;

        // Check if video is ready
        if (video.readyState !== video.HAVE_ENOUGH_DATA) {
            return;
        }

        try {
            // Detect faces using TinyFaceDetector (faster, good for real-time)
            const detections = await faceapi
                .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({
                    inputSize: 416,
                    scoreThreshold: 0.5
                }))
                .withFaceLandmarks()
                .withFaceExpressions();

            const faceCount = detections.length;
            const faceDetected = faceCount > 0;
            const multipleFaces = faceCount > 1;

            // Check if face is in the left corner (e.g., x-coordinate in first 30% of frame)
            const isLeftCorner = faceDetected && detections[0].detection.box.x < (video.videoWidth * 0.3);

            // Update detection status
            setDetectionStatus(prev => ({
                ...prev,
                faceDetected,
                multipleFaces,
                isLeftCorner
            }));

            // Log violations with throttling
            const now = Date.now();
            const timeSinceLastDetection = now - lastFaceDetectionTime.current;

            if (!faceDetected && timeSinceLastDetection > 3000) {
                // No face detected for more than 3 seconds
                logViolation('FACE', 'No face detected in frame', 'HIGH');
                lastFaceDetectionTime.current = now;
            } else if (multipleFaces && timeSinceLastDetection > 5000) {
                // Multiple faces detected
                logViolation('FACE', `Multiple faces detected (${faceCount} faces)`, 'CRITICAL');
                lastFaceDetectionTime.current = now;
            } else if (isLeftCorner && timeSinceLastDetection > 3000) {
                logViolation('FACE', 'Suspicious head movement (looking sideways)', 'MEDIUM');
                lastFaceDetectionTime.current = now;
            }
        } catch (error) {
            console.error('Face detection error:', error);
        }
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
    const captureScreenshot = () => {
        if (!videoRef.current || !canvasRef.current) return null;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        ctx.drawImage(videoRef.current, 0, 0);

        const screenshot = {
            timestamp: new Date().toISOString(),
            dataUrl: canvas.toDataURL('image/jpeg', 0.8),
            reason: 'Violation detected'
        };

        setRecordings(prev => ({
            ...prev,
            screenshots: [...prev.screenshots, screenshot]
        }));

        logAudit('SCREENSHOT', 'Screenshot captured');
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

        // Capture screenshot for high/critical violations
        if (severity === 'HIGH' || severity === 'CRITICAL') {
            violation.screenshot = captureScreenshot();
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
                captureScreenshot();
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

    // Continuous monitoring loop
    useEffect(() => {
        if (!isActive) return;

        const monitoringInterval = setInterval(() => {
            detectFace();
            monitorAudio();
        }, 2000);

        return () => clearInterval(monitoringInterval);
    }, [isActive]);

    // Cleanup on unmount
    useEffect(() => {
        // Auto-initialize proctoring when component mounts
        initializeProctoring();

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

    // Generate violation report
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
            monitoring
        };
    };

    return (
        <div className="proctoring-system">
            {/* Hidden video elements */}
            <video ref={videoRef} autoPlay muted style={{ display: 'none' }} />
            <video ref={screenRef} autoPlay muted style={{ display: 'none' }} />
            <canvas ref={canvasRef} style={{ display: 'none' }} />

            {/* Proctoring UI Component */}
            <div className="fixed top-20 right-4 bg-white rounded-lg shadow-lg p-4 z-50 w-80">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-indigo-600" />
                    Proctoring Status
                </h3>

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

                {/* Detection Status */}
                <div className="border-t pt-3 mb-3">
                    <div className="flex items-center justify-between text-sm mb-2">
                        <span className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Face Detection
                        </span>
                        {!modelsLoaded ? (
                            <span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-700">
                                Loading AI...
                            </span>
                        ) : (
                            <span className={`px-2 py-1 rounded text-xs ${detectionStatus.multipleFaces
                                ? 'bg-orange-100 text-orange-700'
                                : detectionStatus.faceDetected
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                                }`}>
                                {detectionStatus.multipleFaces
                                    ? 'Multiple Faces'
                                    : detectionStatus.faceDetected
                                        ? 'Detected'
                                        : 'Not Detected'}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center justify-between text-sm mb-2">
                        <span className="flex items-center gap-2">
                            <Volume2 className="w-4 h-4" />
                            Noise Level
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${detectionStatus.noiseLevel > 60
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                            }`}>
                            {detectionStatus.noiseLevel.toFixed(0)}
                        </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Tab Switches
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${detectionStatus.tabSwitches > 0
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
                                <div key={v.id} className="text-xs bg-gray-50 p-2 rounded">
                                    <span className="font-semibold text-red-600">{v.type}:</span> {v.description}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProctoringSystem;
