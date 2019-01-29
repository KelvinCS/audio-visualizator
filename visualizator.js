const canvasElement = document.getElementById("canvas");
const canvasCtx = canvasElement.getContext("2d");
const barWidth = 2;
const barHeight = 2;
const barSpacing = 2;
const radius = 140;
const beta = Math.PI * 0.75;
const URL = "https://radiofg.impek.com/fg";

function start() {
  let shockWaveSize = 0;
  let oldIntensity = 0;

  setCanvasFullscreen();
  onWindowResize(() => setCanvasFullscreen());

  const analyser = new AnalyserFromSourceURL(URL);
  analyser.playAudio();

  startFrameLooper(() => {
    clearCanvas();

    drawPlayButton();

    let intensity = 0;

    const frequencyData = analyser.getFrequencyData();
    const numOfBars = getNumOfBars(radius, barWidth + barSpacing);
    const bars = [];

    for (let index = 0; index < numOfBars; index++) {
      const amplitude = getAmplitudeForBar(index, frequencyData, numOfBars);
      bars[index] = amplitude;

      intensity += amplitude;
    }

    bars.map((amplitude, index) =>
      drawFrequencyBar(
        radius + (intensity - 10000) / 400,
        barWidth,
        barHeight + amplitude,
        getBarRotation(index, numOfBars) - beta
      )
    );

    shockWaveSize += 60;

    if (intensity - oldIntensity > 3000) {
      shockWaveSize = 0;
    }

    oldIntensity = intensity;

    drawShockwave(shockWaveSize + radius);
  });
}

function onPressCanvas(callback) {
  canvasElement.addEventListener("click", callback);
}

function getAmplitudeForBar(barIndex, frequencyData, maxOfBars) {
  const frequencyJump = Math.floor(frequencyData.length / maxOfBars);

  return frequencyData[frequencyJump * barIndex];
}

function getBarRotation(barIndex, maxOfBars) {
  return (barIndex * 2 * Math.PI) / maxOfBars;
}

function clearCanvas() {
  canvasCtx.save();

  canvasCtx.setTransform(1, 0, 0, 1, 0, 0);
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

  canvasCtx.restore();
}

function getNumOfBars(circleRadius, barsize) {
  return getCircleDiameter(circleRadius) / barsize;
}

function getCircleDiameter(cicleRadius) {
  return cicleRadius * 2 * Math.PI;
}

function startFrameLooper(callback) {
  requestAnimationFrame(() => {
    callback();
    startFrameLooper(callback);
  });
}

function onWindowResize(callback) {
  window.addEventListener("resize", callback);
}

function drawShockwave(radius) {
  const middleX = canvasElement.width / 2;
  const middleY = canvasElement.height / 2;

  canvasCtx.lineWidth = 8;
  canvasCtx.strokeStyle = "rgb(255, 255, 255)";
  canvasCtx.beginPath();
  canvasCtx.arc(middleX, middleY, radius, 0, Math.PI * 2, false);
  canvasCtx.stroke();
}

function styleCanvas() {
  canvasCtx.fillStyle = "rgba(255, 255, 255)";
}

function drawFrequencyBar(y, w, h, rotation) {
  const middleX = canvasElement.width / 2;
  const middleY = canvasElement.height / 2;

  canvasCtx.save();
  canvasCtx.translate(middleX, middleY);
  canvasCtx.rotate(rotation);
  canvasCtx.fillRect(0, y, w, h);
  canvasCtx.restore();
}

function drawPlayButton() {
  const middleX = canvasElement.width / 2;
  const middleY = canvasElement.height / 2;

  canvasCtx.save();

  canvasCtx.beginPath();
  canvasCtx.fillStyle = "#ffffff";
  canvasCtx.moveTo(middleX - 20, middleY - 30);
  canvasCtx.lineTo(middleX - 20, middleY + 30);
  canvasCtx.lineTo(middleX + 30, middleY);

  canvasCtx.fill();

  canvasCtx.restore();
}

function setCanvasFullscreen() {
  canvasElement.width = window.innerWidth;
  canvasElement.height = window.innerHeight;
  styleCanvas();
}

onPressCanvas(() => start());
