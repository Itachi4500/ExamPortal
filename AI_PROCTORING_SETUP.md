# Advanced AI Proctoring System - Installation Guide

## 📦 Required Dependencies

Install the following packages for AI-powered proctoring:

```bash
npm install @tensorflow/tfjs @tensorflow-models/coco-ssd face-api.js
```

### Package Details:
- **@tensorflow/tfjs**: Core TensorFlow.js library (~2.5MB)
- **@tensorflow-models/coco-ssd**: Object detection model for phone detection (~5MB)
- **face-api.js**: Face detection, landmarks, and expressions (~3MB)

## 🗂️ Model Files Setup

### Download Face-API Models

1. Create a `public/models` directory in your project:
```bash
mkdir -p public/models
```

2. Download the required models from the face-api.js repository:
   - [tiny_face_detector_model](https://github.com/justadudewhohacks/face-api.js/tree/master/weights)
   - [face_landmark_68_model](https://github.com/justadudewhohacks/face-api.js/tree/master/weights)
   - [face_expression_model](https://github.com/justadudewhohacks/face-api.js/tree/master/weights)

3. Place them in `public/models/`:
```
public/
└── models/
    ├── tiny_face_detector_model-weights_manifest.json
    ├── tiny_face_detector_model-shard1
    ├── face_landmark_68_model-weights_manifest.json
    ├── face_landmark_68_model-shard1
    ├── face_expression_model-weights_manifest.json
    └── face_expression_model-shard1
```

**Quick Download Script:**
```bash
cd public
mkdir models
cd models

# Download tiny face detector
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-weights_manifest.json
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-shard1

# Download face landmarks
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-weights_manifest.json
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-shard1

# Download face expressions
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_expression_model-weights_manifest.json
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_expression_model-shard1
```

## 🔧 Integration

### Option 1: Replace Basic Proctoring

In `ExamSystem.jsx`, replace the import:

```javascript
// Change from:
import ProctoringSystem from './ProctoringSystem.jsx';

// To:
import ProctoringSystem from './AdvancedProctoringSystem.jsx';
```

### Option 2: Use Both (Fallback)

```javascript
import AdvancedProctoringSystem from './AdvancedProctoringSystem.jsx';
import BasicProctoringSystem from './ProctoringSystem.jsx';

// In your component:
const [useAdvanced, setUseAdvanced] = useState(true);

{useAdvanced ? (
    <AdvancedProctoringSystem 
        examId={exam.id}
        studentId={user.id}
        onViolation={handleViolation}
    />
) : (
    <BasicProctoringSystem 
        examId={exam.id}
        studentId={user.id}
        onViolation={handleViolation}
    />
)}
```

## 🚀 Features Implemented

### ✅ AI-Based Phone Detection
- Uses COCO-SSD object detection model
- Detects mobile phones with >50% confidence
- Triggers CRITICAL violation with screenshot
- Also detects multiple people in frame

### ✅ Advanced Face Detection
- Uses face-api.js TinyFaceDetector
- Detects 0, 1, or multiple faces
- 68-point facial landmark detection
- Face expression analysis (happy, sad, angry, etc.)

### ✅ Eye Gaze Tracking
- Calculates eye gaze direction using facial landmarks
- Gaze score: 100% = looking straight, 0% = looking away
- Tracks average gaze over last 10 readings
- Alerts if student looks away (score < 60%)

### ✅ Keystroke Analysis
- Records all keystrokes with timestamps
- Detects suspiciously fast typing (<50ms between keys)
- Identifies unusual patterns (possible copy-paste)
- Analyzes typing rhythm over 50-key windows

## 📊 Enhanced Violation Types

| Type | Description | Severity | AI Model |
|------|-------------|----------|----------|
| FACE | No face detected | HIGH | face-api.js |
| FACE | Multiple faces | CRITICAL | face-api.js |
| PHONE | Mobile phone detected | CRITICAL | COCO-SSD |
| PERSON | Multiple people | CRITICAL | COCO-SSD |
| EYE_GAZE | Looking away | MEDIUM | face-api.js |
| KEYSTROKE | Suspicious typing | LOW-MEDIUM | Custom |
| AUDIO | Background noise | MEDIUM | Web Audio API |
| TAB_SWITCH | Tab switched | HIGH | Browser API |

## 🎯 Performance Optimization

### Model Loading
- Models load asynchronously after camera initialization
- System works with basic detection if AI models fail
- Loading status shown in UI

### Detection Frequency
- AI detection runs every 3 seconds (configurable)
- Audio monitoring: continuous
- Keystroke analysis: real-time

### Resource Usage
```javascript
// Adjust detection interval for performance
const aiMonitoringInterval = setInterval(async () => {
    // AI detection code
}, 3000); // Increase to 5000 for lower CPU usage
```

### Model Size Optimization
```javascript
// Use quantized models for smaller size
await faceapi.nets.tinyFaceDetector.loadFromUri('/models'); // ~300KB
// vs
await faceapi.nets.ssdMobilenetv1.loadFromUri('/models'); // ~5MB
```

## 🔍 Testing

### Test Face Detection
1. Start exam
2. Move face out of frame → Should trigger violation
3. Have another person enter frame → Should detect multiple faces

### Test Phone Detection
1. Hold phone near face
2. System should detect within 3-6 seconds
3. Check violation log for "Mobile phone detected"

### Test Eye Tracking
1. Look at screen → Gaze score should be 70-100%
2. Look away → Score drops, violation triggered
3. Check real-time gaze score in UI

### Test Keystroke Analysis
1. Type normally → No violations
2. Paste text → Should detect suspicious pattern
3. Type very fast → May trigger fast typing alert

## 📈 Monitoring Dashboard

The enhanced UI shows:
- **AI Models Status**: Loading/Loaded indicators
- **Face Count**: 0, 1, or multiple
- **Eye Gaze Score**: Real-time percentage
- **Phone Detection**: Detected/Not detected
- **Noise Level**: Decibels
- **Tab Switches**: Counter
- **Violations**: Recent 3 with severity badges

## 🛠️ Troubleshooting

### Models Not Loading
```javascript
// Check browser console for errors
// Ensure models are in public/models/
// Verify CORS settings if using CDN
```

### High CPU Usage
```javascript
// Reduce detection frequency
const aiMonitoringInterval = setInterval(async () => {
    // ...
}, 5000); // Increase from 3000 to 5000

// Or disable some features
const [monitoring, setMonitoring] = useState({
    eyeTracking: false, // Disable if not needed
    objectDetection: true,
    faceDetection: true
});
```

### False Positives
```javascript
// Adjust confidence thresholds
const phoneDetected = predictions.some(p => 
    (p.class === 'cell phone') && p.score > 0.7 // Increase from 0.5
);

// Adjust gaze threshold
if (avgGazeScore < 50) { // Decrease from 60 for less sensitivity
    logViolation('EYE_GAZE', ...);
}
```

## 📱 Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| TensorFlow.js | ✅ | ✅ | ✅ | ✅ |
| COCO-SSD | ✅ | ✅ | ✅ | ✅ |
| face-api.js | ✅ | ✅ | ⚠️ | ✅ |
| WebRTC | ✅ | ✅ | ⚠️ | ✅ |

⚠️ Safari has limited WebRTC support

## 🔐 Privacy & Compliance

### Data Handling
- All AI processing happens **client-side** (in browser)
- No video/images sent to external servers
- Models run locally using TensorFlow.js
- Student data remains on device until exam submission

### GDPR Compliance
- Inform students about AI monitoring
- Obtain explicit consent
- Provide data deletion options
- Document data retention policies

### Consent Template
```javascript
const consentText = `
This exam uses AI-powered proctoring including:
- Face detection and tracking
- Eye gaze monitoring  
- Object detection (phones, multiple people)
- Keystroke analysis
- Audio monitoring

All processing happens in your browser. 
Do you consent to this monitoring?
`;
```

## 📚 Additional Resources

- [TensorFlow.js Docs](https://www.tensorflow.org/js)
- [COCO-SSD Model](https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd)
- [face-api.js GitHub](https://github.com/justadudewhohacks/face-api.js)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

## 🎓 Example Usage

```javascript
// In ExamSystem.jsx
import AdvancedProctoringSystem from './AdvancedProctoringSystem.jsx';

const TakeExam = ({ exam, onClose }) => {
    const [violations, setViolations] = useState([]);
    
    const handleViolation = (violation) => {
        setViolations(prev => [...prev, violation]);
        
        // Auto-submit if too many critical violations
        const criticalCount = violations.filter(v => 
            v.severity === 'CRITICAL'
        ).length;
        
        if (criticalCount >= 3) {
            alert('Too many critical violations. Exam will be submitted.');
            submitExam();
        }
    };
    
    return (
        <div>
            {/* Exam UI */}
            
            <AdvancedProctoringSystem 
                examId={exam.id}
                studentId={user.id}
                onViolation={handleViolation}
            />
        </div>
    );
};
```

## 🚦 Quick Start Checklist

- [ ] Install npm packages: `npm install @tensorflow/tfjs @tensorflow-models/coco-ssd face-api.js`
- [ ] Create `public/models` directory
- [ ] Download face-api.js model files
- [ ] Import AdvancedProctoringSystem in ExamSystem.jsx
- [ ] Test camera/microphone permissions
- [ ] Verify AI models load successfully
- [ ] Test all detection features
- [ ] Configure violation thresholds
- [ ] Add student consent form
- [ ] Deploy and monitor performance

---

**Ready to use!** The advanced proctoring system will automatically load AI models and start monitoring when the exam begins.
