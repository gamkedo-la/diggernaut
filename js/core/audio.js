//Constants-------------------------------------------------------------------
const FILTER_MIN = 400;
const FILTER_MAX = 20000;
const FILTER_TRANSITION_TIME = 1;
const FILTER_Q_CURVE = [0, 1, 0, 1, 0];
const VOLUME_INCREMENT = 0.1;
const CROSSFADE_TIME = 0.25;
const HARDPAN_THRESH = 300;
const DROPOFF_MIN = 100;
const DROPOFF_MAX = 500;

const AudioGlobal = function AudioGlobal() {

	this.initialized = false;
	var audioCtx, musicBus, soundEffectsBus, filterBus, masterBus, compressor;
	var isMuted;
	var musicVolume;
	var soundEffectsVolume;
	var currentMusicTrack;
	var musicStartTime = 0;

//--//Set up WebAudioAPI nodes------------------------------------------------
	this.init = function(callback) {
		if (this.initialized) return;

		// console.log("Initializing Audio...");
		//throws a warning in chrome. is fine. Just be sure to audioCtx.resume() on user interaction with title screen of your game.
		audioCtx = new (window.AudioContext || window.webkitAudioContext)(); 
		this.context = audioCtx;
		musicBus = audioCtx.createGain();
		soundEffectsBus = audioCtx.createGain();
		filterBus = audioCtx.createBiquadFilter();
		masterBus = audioCtx.createGain();
		// Create a compressor node
        compressor = new DynamicsCompressorNode(audioCtx, {
			threshold: -50,
			knee: 40,
			ratio: 12,
			attack: 0,
			release: 0.25,
		  });

		musicVolume = 0.7;
		soundEffectsVolume = 0.1;

		filterBus.frequency.value = FILTER_MAX;

		musicBus.gain.value = musicVolume;
		soundEffectsBus.gain.value = soundEffectsVolume;
		filterBus.type = "lowpass";
		musicBus.connect(filterBus);
		soundEffectsBus.connect(filterBus);
		filterBus.connect(masterBus);
		masterBus.connect(compressor);
		compressor.connect(audioCtx.destination);
		// console.log("Audio initialized.");
		this.initialized = true;
		callback()
	}

//--//volume handling functions-----------------------------------------------
	this.toggleMute = function() {
		if (!this.initialized) return;

		var newVolume = (masterBus.gain.value === 0 ? 1 : 0);
		masterBus.gain.setTargetAtTime(newVolume, audioCtx.currentTime, 0.03);
	}

	this.setMute = function(tOrF) {
		if (!this.initialized) return;

		var newVolume = (tOrF === false ? 1 : 0);
		masterBus.gain.setTargetAtTime(newVolume, audioCtx.currentTime, 0.03);
	}

	this.setMusicVolume = function(amount) {
		if (!this.initialized) return;

		musicVolume = amount;
		if (musicVolume > 1.0) {
			musicVolume = 1.0;
		} else if (musicVolume < 0.0) {
			musicVolume = 0.0;
		}
		musicBus.gain.setTargetAtTime(Math.pow(musicVolume, 2), audioCtx.currentTime, 0.03);
	}

	this.setSoundEffectsVolume = function(amount) {
		if (!this.initialized) return;

		soundEffectsVolume = amount;
		if (soundEffectsVolume > 1.0) {
			soundEffectsVolume = 1.0;
		} else if (soundEffectsVolume < 0.0) {
			soundEffectsVolume = 0.0;
		}
		soundEffectsBus.gain.setTargetAtTime(Math.pow(soundEffectsVolume, 2), audioCtx.currentTime, 0.03);
	}

	this.turnVolumeUp = function() {
		if (!this.initialized) return;

		this.setMusicVolume(musicVolume + VOLUME_INCREMENT);
		this.setSoundEffectsVolume(soundEffectsVolume + VOLUME_INCREMENT);
	}

	this.turnVolumeDown = function() {
		if (!this.initialized) return;

		this.setMusicVolume(musicVolume - VOLUME_INCREMENT);
		this.setSoundEffectsVolume(soundEffectsVolume - VOLUME_INCREMENT);
	}

//--//Audio playback classes--------------------------------------------------
	this.playSound = function(buffer, pan = 0, vol = 1, rate = 1, loop = false) {
		if (!this.initialized) return;
		if (Array.isArray(buffer)) {
			buffer = buffer[Math.floor(mapRNG()*buffer.length)]
		}

		var source = audioCtx.createBufferSource();
		var gainNode = audioCtx.createGain();
		var panNode = audioCtx.createStereoPanner();

		source.connect(panNode);
		panNode.connect(gainNode);
		gainNode.connect(soundEffectsBus);

		source.buffer = buffer;

		source.playbackRate.value = rate;
		source.loop = loop;
		gainNode.gain.value = vol;
		panNode.pan.value = pan;
		source.start();

		return {sound: source, volume: gainNode, pan: panNode};
	}

	this.playMusic = function(buffer) {
        if (!this.initialized) return;

		var source = audioCtx.createBufferSource();
		var gainNode = audioCtx.createGain();

		source.connect(gainNode);
		gainNode.connect(musicBus);

		source.buffer = buffer;

		source.loop = true;

		if (currentMusicTrack != null) {
			currentMusicTrack.volume.gain.setTargetAtTime(0, audioCtx.currentTime, CROSSFADE_TIME);
			currentMusicTrack.sound.stop(audioCtx.currentTime + CROSSFADE_TIME);
		}

		source.start(); 
		currentMusicTrack = {sound: source, volume: gainNode};

		musicStartTime = audioCtx.currentTime;


		return {sound: source, volume: gainNode};
	}

	this.swapMusic = function(buffer) {
        if (!this.initialized) return;

		var source = audioCtx.createBufferSource();
		var gainNode = audioCtx.createGain();

		var startTime = audioCtx.currentTime - musicStartTime;
		while(startTime >= buffer.duration) {
			startTime -= buffer.duration;
		}

		source.connect(gainNode);
		gainNode.connect(musicBus);

		source.buffer = buffer;

		source.loop = true;

		if (currentMusicTrack != null) {
			currentMusicTrack.volume.gain.setTargetAtTime(0, audioCtx.currentTime, CROSSFADE_TIME);
			currentMusicTrack.sound.stop(audioCtx.currentTime + CROSSFADE_TIME);
		}

		gainNode.gain.value = 0;
		gainNode.gain.setTargetAtTime(1, audioCtx.currentTime, CROSSFADE_TIME);

		source.start(audioCtx.currentTime, startTime);
		currentMusicTrack = {sound: source, volume: gainNode};

		musicStartTime = audioCtx.currentTime - startTime;


		return {sound: source, volume: gainNode};
	}

//--//Gameplay functions------------------------------------------------------
	this.duckMusic = function (duration, volume = 0) {
		currentMusicTrack.volume.gain.setTargetAtTime(volume, audioCtx.currentTime, CROSSFADE_TIME);
		currentMusicTrack.volume.gain.setTargetAtTime(1, audioCtx.currentTime + duration, CROSSFADE_TIME);
		return;
	}

	this.calculatePan = function(panX) {
		panX -= G.view.x + G.c.width/2;
		if (panX > HARDPAN_THRESH) panX = HARDPAN_THRESH;
		if (panX < -HARDPAN_THRESH) panX = -HARDPAN_THRESH;

		return panX/HARDPAN_THRESH;
	}

	this.calcuateVolumeDropoff = function(objectPos) {
		var dx = (G.view.x + G.c.width/2) - objectPos.x;
		var dy = (G.view.y + G.c.height/2) - objectPos.y;
		var distance = Math.sqrt(dx * dx + dy * dy);

		var newVolume = 1;
		if (distance > DROPOFF_MIN && distance <= DROPOFF_MAX) {
			newVolume = Math.abs((distance - DROPOFF_MIN)/(DROPOFF_MAX - DROPOFF_MIN) - 1);
		} else if (distance > DROPOFF_MAX) {
			newVolume = 0;
		}

		return Math.pow(newVolume, 2);
	}

	this.getDuration = function(soundReferance) {
		return soundReferance.sound.buffer.duration;
	}

    return this;
}
