class AnalyserFromSourceURL extends AnalyserNode {
  constructor(url, context = new AudioContext()) {
    super(context);

    this.audioElement = new Audio(url);
    this.audioElement.crossOrigin = "anonymous";

    this.audioSourceNode = context.createMediaElementSource(this.audioElement);

    this.audioSourceNode.connect(this);
    this.connect(context.destination);
  }

  getFrequencyData() {
    const frequencyData = new Uint8Array(this.frequencyBinCount);

    this.getByteFrequencyData(frequencyData);

    return frequencyData;
  }

  playAudio() {
    // Solution to avoid error when starting to play audio without user interaction in Chrome

    if (!this.audioElement.played.length) {
      setTimeout(() => this.audioElement.play(), 1000);
    } else {
      this.audioElement.play();
    }
  }

  pauseAudio() {
    this.audioElement.pause();
  }
}
