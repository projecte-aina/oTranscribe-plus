// https://github.com/edoudou/create-silent-audio/blob/master/index.js

function createSilentAudio (time, freq = 44100){
    const length = time * freq;
    const AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
    if(! AudioContext ){
      console.log("No Audio Context")
    }
    const context = new AudioContext();
    const audioFile = context.createBuffer(1, length, freq);
    return URL.createObjectURL(bufferToWave(audioFile, length));
  }
  
  function bufferToWave(abuffer, len) {
    let numOfChan = abuffer.numberOfChannels,
      length = len * numOfChan * 2 + 44,
      buffer = new ArrayBuffer(length),
      view = new DataView(buffer),
      channels = [], i, sample,
      offset = 0,
      pos = 0;
  
    // write WAVE header
    setUint32(0x46464952);
    setUint32(length - 8);
    setUint32(0x45564157);
  
    setUint32(0x20746d66);
    setUint32(16);
    setUint16(1);
    setUint16(numOfChan);
    setUint32(abuffer.sampleRate);
    setUint32(abuffer.sampleRate * 2 * numOfChan);
    setUint16(numOfChan * 2);
    setUint16(16);
  
    setUint32(0x61746164);
    setUint32(length - pos - 4);
  
    // write interleaved data
    for(i = 0; i < abuffer.numberOfChannels; i++)
      channels.push(abuffer.getChannelData(i));
  
    while(pos < length) {
      for(i = 0; i < numOfChan; i++) {             // interleave channels
        sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767)|0; // scale to 16-bit signed int
        view.setInt16(pos, sample, true);          // write 16-bit sample
        pos += 2;
      }
      offset++                                     // next source sample
    }
  
    // create Blob
    return new Blob([buffer], {type: "audio/wav"});
  
    function setUint16(data) {
      view.setUint16(pos, data, true);
      pos += 2;
    }
  
    function setUint32(data) {
      view.setUint32(pos, data, true);
      pos += 4;
    }
  }
  
  module.exports = { createSilentAudio };