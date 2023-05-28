const AssetLoader = function AssetLoader(){
    this.images = {};
    this.sounds = {};
    return this;
}

AssetLoader.prototype.loadImages = function loadImages(names, callback) {

    var n,
        name,
        result = {},
        count  = names.length,
        self = this,
        onload = function() {
            if(--count == 0){
                this.images = result;
                callback();
            }

            canvasContext.fillStyle = '#000000';
            canvasContext.fillRect(0, 0, canvas.width, canvas.height);
            canvasContext.fillStyle = '#ffff00';
            canvasContext.fillRect(0, 0, (count / names.length) * canvas.width, 20);
            canvasContext.font = '10px monospace';
            canvasContext.fillText(`loading images async`, 10, 40);

          }
    
    for(n = 0 ; n < names.length ; n++) {
        name = names[n];
        result[name] = document.createElement('img');
        result[name].addEventListener('load', onload);
        result[name].src = "img/" + name + ".png";
    }
    
    return result;
}

AssetLoader.prototype.loadFile = function loadFile(filePath, done){
    let xhr = new XMLHttpRequest();
    xhr.onload = function () { 
      return done(this.responseText) 
    }
    xhr.open("GET", filePath, true);
    xhr.send();
}

AssetLoader.prototype.soundLoader = function ({context, urlList, callback} = {}) {
    this.context = context;
    this.urlList = urlList;
    this.onSoundsLoaded = callback;
    this.loadCount = 0;
}

AssetLoader.prototype.loadBuffer = function(url, key) {
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }

        if (!(key in loader.sounds)) {
          loader.sounds[key] = [ buffer ];
        }
        else {
          loader.sounds[key].push(buffer);
        }
        
        console.log('loaded sound: ' + key);
        if (++loader.loadCount == loader.urlList.length){
          console.log('all sounds loaded');
          loader.onSoundsLoaded(loader.sounds);
        }

        canvasContext.fillStyle = '#000000';
        canvasContext.fillRect(0, 0, canvas.width, canvas.height);
        canvasContext.fillStyle = '#00ff00';
        canvasContext.fillRect(0, 0, (loader.loadCount / loader.urlList.length) * canvas.width, 20);
        canvasContext.font = '10px monospace';

        let consoleText = `loading sound: ${key}`;
        if(++loader.loadCount == loader.urlList.length){
          consoleText = 'all sounds loaded';
        }
        canvasContext.fillText(consoleText, 10, 40);
        
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
}

  request.onerror = function() {
    alert('SoundLoader: XHR error');
  }

  request.send();
}

AssetLoader.prototype.loadAudioBuffer = function() {
for (var i = 0; i < this.urlList.length; ++i)
this.loadBuffer(this.urlList[i].url, this.urlList[i].name);
}
  
