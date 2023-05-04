const fs = require('fs');
const path = require ('path');

(function copyDir() {

  const folderToCopy = '04-copy-directory/files';
  const destinationFolder = '04-copy-directory/files-copy';
  let filesArray = [];

  fs.rm(destinationFolder, { force: true, recursive: true}, (err) => {
    if (err) throw err;
    createDir();
  });

  function createDir() {
    fs.mkdir(destinationFolder, { recursive: true }, (err) => {
      if (err) throw err;
      readDir();
    }); 
  }

  function readDir() {
    fs.readdir(folderToCopy, (err, files) => {
      if(err){
        throw err;
      } else {
        filesArray=files, copy(filesArray);}});
  }

  function copy(sourceArray) {
    sourceArray.forEach(x=>{
      fs.copyFile(path.join(folderToCopy,x), path.join(destinationFolder,x), (err) => {
        if (err) throw err;
        console.log('file copied');
      });
    });}

})();

