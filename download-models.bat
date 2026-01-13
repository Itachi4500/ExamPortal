@echo off
echo Downloading face-api.js model files...
echo.

REM Create models directory
if not exist "public\models" mkdir public\models
cd public\models

echo Downloading Tiny Face Detector...
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-weights_manifest.json
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-shard1

echo.
echo Downloading Face Landmarks 68...
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-weights_manifest.json
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_landmark_68_model-shard1

echo.
echo Downloading Face Expression Model...
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_expression_model-weights_manifest.json
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/face_expression_model-shard1

cd ..\..

echo.
echo ========================================
echo Model files downloaded successfully!
echo Location: public\models\
echo ========================================
echo.
echo You can now use the Advanced AI Proctoring System.
echo.
pause
