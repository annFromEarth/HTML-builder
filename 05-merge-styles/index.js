const fs = require('fs');
const path = require ('path');
const EventEmitter = require('events');
const emitter = new EventEmitter();

const folderToCopy = '05-merge-styles/styles';
const destinationFolder = '05-merge-styles/project-dist';
  
let filesArray = [];
let bundle='';

fs.rm(path.join(destinationFolder, 'bundle.css'), { force: true, recursive: true}, (err) => {
  if (err) throw err;
  createFile();
});

function createFile() {
  fs.writeFile(path.join(destinationFolder, 'bundle.css'), '', (err) => {
    if (err) throw err;
  }); 
  createBundle();
}

function createBundle() {

  fs.readdir(folderToCopy, (err, files) => {
    if(err){
      throw err;
    } else {
      filesArray=files;
      appendCSS();}});

  function appendCSS() {
    filesArray.forEach(x=> { if(!checkIfDirectory(x) && checkIfCSS(x)) {
      fs.readFile(path.join(folderToCopy, x), (err, data) => {
        if (err) {
          throw err;
        } else {
          bundle+=data+'\n';
          emitter.on('bundleReady', appendStyles);
          emitter.emit('bundleReady');
        }
      });
    }});
  }

  function appendStyles() {
    fs.appendFile(path.join(destinationFolder, 'bundle.css'), bundle, (error) => {
      if (error) console.log(error.message);
    });
  }
}    

function checkIfDirectory(filename){
  fs.stat(path.join(folderToCopy, filename), (err, stats) => { 
    if (err) {
      throw err;
    } else {
      if (stats.isDirectory()) return true; }
  });
}

function checkIfCSS(filename){
  if (path.parse(filename).ext === '.css') return true;
}