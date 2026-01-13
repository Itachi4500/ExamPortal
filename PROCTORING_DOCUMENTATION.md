# Proctoring & Anti-Cheating System Documentation

## Overview
This comprehensive proctoring system provides real-time monitoring and violation detection for online exams. It integrates seamlessly with the ExamSystem component.

## Features Implemented

### 🎥 Monitoring Features

#### 1. **Webcam Access**
- Real-time video capture from student's camera
- Continuous recording in 5-second chunks
- Video stored in WebM format with VP9 codec
- Automatic permission request on exam start

#### 2. **Microphone Monitoring**
- Real-time audio level detection
- Background noise alerts (threshold: 60dB)
- Audio context analysis using Web Audio API
- Frequency-based noise detection

#### 3. **Screen Sharing / Screen Recording**
- Optional screen sharing via `getDisplayMedia` API
- Detects when screen sharing is stopped
- Logs violations if sharing is interrupted
- Can be made mandatory for high-stakes exams

#### 4. **Face Detection**
- Basic brightness-based face detection (current implementation)
- Detects presence/absence of face in frame
- Can be enhanced with TensorFlow.js face-api for:
  - Multiple face detection
  - Face landmarks
  - Face expressions
  - Age/gender estimation

#### 5. **Tab Switch / Window Focus Detection**
- Monitors `visibilitychange` events
- Tracks window `blur` events
- Counts total tab switches
- Captures screenshot on each violation

### 🚨 Violation Detection

The system detects and logs the following violations:

| Violation Type | Severity | Trigger | Action |
|---------------|----------|---------|--------|
| FACE | HIGH | Face not detected | Screenshot + Alert |
| FACE | HIGH | Multiple faces detected | Screenshot + Alert |
| AUDIO | MEDIUM | Background noise > 60dB | Log + Alert |
| TAB_SWITCH | HIGH | Tab switched | Screenshot + Counter |
| FOCUS_LOSS | MEDIUM | Window lost focus | Log + Alert |
| SCREEN_SHARE | CRITICAL | Screen sharing stopped | Log + Alert |
| SUSPICIOUS | LOW | Copy/Paste/Right-click | Log only |

### 📄 Evidence & Logs

#### 1. **Screenshot Capture**
```javascript
captureScreenshot()
```
- Captures current webcam frame
- Saves as JPEG with 80% quality
- Includes timestamp and reason
- Automatically triggered for HIGH/CRITICAL violations

#### 2. **Video Recording**
- Continuous recording throughout exam
- Stored in chunks for reliability
- Can be downloaded/uploaded after exam
- Format: WebM (VP9 codec)

#### 3. **Violation Reports**
Each violation includes:
- Unique ID
- Type and description
- Severity level (LOW/MEDIUM/HIGH/CRITICAL)
- Timestamp (ISO format)
- Screenshot (if applicable)

#### 4. **Audit Logs**
Complete audit trail with:
- All system events
- Student actions
- Violation details
- Exam ID and Student ID
- Timestamps for everything

## Usage

### Basic Integration

```javascript
import ProctoringSystem from './ProctoringSystem.jsx';

// In your exam component
<ProctoringSystem 
    examId={exam.id}
    studentId={user.id}
    onViolation={(violation) => {
        // Handle violation
        console.log('Violation detected:', violation);
    }}
/>
```

### Generating Reports

```javascript
const report = generateReport();
// Returns:
// {
//   examId, studentId,
//   startTime, endTime,
//   totalViolations,
//   violationsByType: { FACE: 2, TAB_SWITCH: 5, ... },
//   violations: [...],
//   screenshots: [...],
//   auditLogs: [...],
//   monitoring: { webcam: true, ... }
// }
```

## Advanced Features (Optional Enhancements)

### 1. **AI-Based Phone Detection**
To implement phone detection:

```javascript
// Install TensorFlow.js
npm install @tensorflow/tfjs @tensorflow-models/coco-ssd

// In ProctoringSystem.jsx
import * as cocoSsd from '@tensorflow-models/coco-ssd';

const detectPhone = async () => {
    const model = await cocoSsd.load();
    const predictions = await model.detect(videoRef.current);
    
    const phoneDetected = predictions.some(p => 
        p.class === 'cell phone' && p.score > 0.6
    );
    
    if (phoneDetected) {
        logViolation('PHONE', 'Mobile phone detected in frame', 'CRITICAL');
    }
};
```

### 2. **Enhanced Face Detection**
Using face-api.js:

```javascript
// Install face-api.js
npm install face-api.js

import * as faceapi from 'face-api.js';

const detectFaces = async () => {
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    
    const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();
    
    if (detections.length === 0) {
        logViolation('FACE', 'No face detected', 'HIGH');
    } else if (detections.length > 1) {
        logViolation('FACE', `${detections.length} faces detected`, 'HIGH');
    }
};
```

### 3. **Eye Tracking**
Monitor if student is looking at the screen:

```javascript
const trackEyeGaze = async () => {
    const detections = await faceapi
        .detectSingleFace(videoRef.current)
        .withFaceLandmarks();
    
    if (detections) {
        const leftEye = detections.landmarks.getLeftEye();
        const rightEye = detections.landmarks.getRightEye();
        
        // Calculate gaze direction
        // Alert if looking away for too long
    }
};
```

### 4. **Keystroke Analysis**
Detect unusual typing patterns:

```javascript
const [keystrokes, setKeystrokes] = useState([]);

useEffect(() => {
    const handleKeyDown = (e) => {
        setKeystrokes(prev => [...prev, {
            key: e.key,
            timestamp: Date.now()
        }]);
        
        // Analyze typing speed, patterns
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
}, []);
```

## Security Considerations

1. **Data Privacy**
   - All recordings stored locally during exam
   - Encrypted transmission to server
   - GDPR compliance required
   - Student consent mandatory

2. **Browser Compatibility**
   - Chrome/Edge: Full support
   - Firefox: Full support
   - Safari: Limited (no screen sharing)
   - Mobile: Not recommended

3. **Bypass Prevention**
   - Disable DevTools detection
   - Virtual machine detection
   - Multiple monitor detection
   - Browser extension blocking

## Performance Optimization

1. **Video Quality**: Adjust resolution based on bandwidth
2. **Detection Frequency**: Balance between accuracy and CPU usage
3. **Screenshot Compression**: Use JPEG with 70-80% quality
4. **Chunk Size**: 5-second video chunks for reliability

## Troubleshooting

### Camera/Microphone Not Working
- Check browser permissions
- Ensure HTTPS connection
- Verify device availability
- Test with different browser

### High CPU Usage
- Reduce detection frequency
- Lower video resolution
- Disable screen sharing if not needed
- Use TinyFaceDetector instead of SSD

### False Positives
- Adjust detection thresholds
- Implement grace periods
- Use AI models for better accuracy
- Allow manual review of violations

## API Reference

### Props
- `examId`: Unique exam identifier
- `studentId`: Unique student identifier  
- `onViolation`: Callback function for violations
- `onClose`: Cleanup function

### Methods
- `initializeProctoring()`: Start monitoring
- `requestScreenShare()`: Enable screen sharing
- `captureScreenshot()`: Manual screenshot
- `generateReport()`: Create violation report
- `logViolation(type, desc, severity)`: Log custom violation
- `logAudit(category, message)`: Log audit event

## Future Enhancements

1. ✅ Basic face detection
2. ⏳ AI-based multi-face detection
3. ⏳ Phone detection using object detection
4. ⏳ Eye gaze tracking
5. ⏳ Emotion analysis
6. ⏳ Virtual background detection
7. ⏳ Second device detection
8. ⏳ Browser fingerprinting
9. ⏳ Keystroke dynamics analysis
10. ⏳ Mouse movement analysis

## License & Credits

Built with:
- React 18+
- Web APIs (MediaDevices, AudioContext, Canvas)
- Lucide React Icons

Optional AI libraries:
- TensorFlow.js
- face-api.js
- COCO-SSD

---

**Note**: This is a comprehensive proctoring solution. Always ensure compliance with local privacy laws and obtain proper consent before recording students.
