const fs = require('fs');
const path = require ('path');
const targetFolder = 'secret-folder';
const targetFolderPath = path.join(path.dirname(__filename), targetFolder);
let filesArray = [];

function getFilesInfo(pathsArray) {
  console.log(targetFolderPath);
  pathsArray.forEach(x=>{
    fs.stat(path.join(targetFolderPath , x), (err, stats) => { 
      if (err) {
        throw err;
      } else {
        if (!stats.isDirectory()) {console.log(path.parse(x).name +' - '+ path.parse(x).ext.replace('.','') +' - '+ stats.size/1000+'kb');
        }
      }
    });
  });

}

fs.readdir(targetFolderPath, (err, files) => {
  if(err){
    throw err;
  } else {
    filesArray=files, getFilesInfo(filesArray);}});
