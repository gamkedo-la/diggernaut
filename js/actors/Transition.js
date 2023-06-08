const transition = {
  active: false,
  progress: 0,
  duration: 400, // transition duration in milliseconds
  color: '#000', // transition color
  type: 'pixelation', // transition type
  reverse: false, // reverse transition
  scale: 1, // pixelation scale
};

function drawTransition() {
  if (!transition.active) return;
  if (transition.type === 'pixelation') { drawPixelationTransition(); return }
  const { progress, color, reverse } = transition;
  const wipeWidth = reverse
    ? canvas.width * (1 - progress)
    : canvas.width * progress;

  canvasContext.fillStyle = color;
  canvasContext.fillRect(
    reverse ? canvas.width - wipeWidth : 0,
    0,
    wipeWidth,
    canvas.height
  );
}

function drawPixelationTransition() {
  if (!transition.active) return;

  const { progress, reverse } = transition;
  const pixelationFactor = reverse ? 1 - progress : progress;
  const scaleFactor = Math.max(1, Math.floor(pixelationFactor * 20));

  const bufferCanvas = document.createElement('canvas');
  bufferCanvas.width = canvas.width;
  bufferCanvas.height = canvas.height;
  const bufferContext = bufferCanvas.getContext('2d');
  bufferContext.drawImage(canvas, 0, 0);

  const scaledCanvas = document.createElement('canvas');
  scaledCanvas.width = Math.ceil(canvas.width / scaleFactor);
  scaledCanvas.height = Math.ceil(canvas.height / scaleFactor);
  const scaledContext = scaledCanvas.getContext('2d');
  scaledContext.drawImage(bufferCanvas, 0, 0, scaledCanvas.width, scaledCanvas.height);

  canvasContext.imageSmoothingEnabled = false;
  canvasContext.drawImage(
    scaledCanvas,
    0,
    0,
    scaledCanvas.width,
    scaledCanvas.height,
    0,
    0,
    canvas.width,
    canvas.height
  );
}


function startTransition(callback, triggerReverse = true) {
  if (transition.active) return;

  transition.active = true;
  transition.progress = 0;

  const startTime = performance.now();
  const { duration } = transition;

  function updateTransition() {
    const now = performance.now();
    const elapsedTime = now - startTime;
    transition.progress = Math.min(elapsedTime / duration, 1);

    if (transition.progress < 1) {
      requestAnimationFrame(updateTransition);
    } else {
      transition.active = false;
      if (callback) {
        callback();
      }
      // Start the reverse wipe after the state change
      if (triggerReverse && !transition.reverse) {
        transition.reverse = true;
        startTransition(() => {
          transition.reverse = false;
        }, false);
      }
    }
  }

  requestAnimationFrame(updateTransition);
}
