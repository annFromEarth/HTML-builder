const fs = require('fs');
const path = require ('path');
const EventEmitter = require('events');
const emitter = new EventEmitter();

const codeDir = path.dirname(__filename);

const folderToCopy = path.join(codeDir, 'styles');
const destinationFolder = path.join(codeDir, 'project-dist');
  
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
    filesArray.forEach(x=> { 

      fs.stat(path.join(folderToCopy, x), (err, stats) => { 
        if (err) {
          throw err;
        } else {
          if (!stats.isDirectory()) {
            if (checkIfCSS(x)) {
              fs.readFile(path.join(folderToCopy, x), (err, data) => {
                if (err) {
                  throw err;
                } else {
                  bundle+=data+'\n';
                  emitter.on('bundleReady', appendStyles);
                  emitter.emit('bundleReady');
                }
              });}
          }
        }
      });
    });
  }

  function appendStyles() {
    fs.appendFile(path.join(destinationFolder, 'bundle.css'), bundle, (error) => {
      if (error) console.log(error.message);
    });
  }
}    

function checkIfCSS(filename){
  if (path.parse(filename).ext === '.css') return true;
}
