var fs = require('fs');
const path = require ('path');
const EventEmitter = require('events');
const emitter = new EventEmitter();
// const templateTags = file.match(/\{\{[a-z]+\}\}/gm);

let filesArray = [];
let assetsArray=[];
let htmlComponentsArray =[];
let htmlReplacementArray=[];
let bundleCSS='';

function checkIfCSS(file){
  if (path.parse(file).ext === '.css') return true;
}

//1. Создаёт папку  **project-dist**, запускает все процессы.

fs.rm('06-build-page/project-dist', { force: true, recursive: true}, (err) => {
  if (err) throw err;
  createDestination();
});

function createDestination() {
  fs.mkdir('06-build-page/project-dist', { recursive: true }, (err) => {
    if (err) {throw err;} else { replaceTags(), copyStyles( '06-build-page/styles','06-build-page/project-dist/style.css'), copyAssets('06-build-page/assets', '06-build-page/project-dist/assets');}
  });
}  

//2. Собирает в единый файл стили из папки **styles** и помещает их в файл **project-dist/style.css**.

function  copyStyles(sourceFolder, destinationFile) {
      
  fs.writeFile(destinationFile, '', (err) => {
    if (err) {throw err;} else { createBundle();}}); 
      
  function createBundle() {
    fs.readdir(sourceFolder, (err, files) => {
      if(err){throw err;
      } else {
        filesArray=files;
        appendCSS();}});
      
    function appendCSS() {
      filesArray.forEach(x=> {fs.stat(path.join(sourceFolder, x), (err, stats) => { 
        if (err) { throw err;} else {
          if (!stats.isDirectory()) {if (checkIfCSS(x)) {
            fs.readFile(path.join(sourceFolder, x), (err, data) => {
              if (err) {throw err;
              } else {
                bundleCSS+=data+'\n';
                emitter.on('bundleReady', appendStyles);
                emitter.emit('bundleReady');
              }
            });
          }}}});});}
      
    function appendStyles() {
      fs.appendFile(destinationFile, bundleCSS, (error) => {
        if (error) console.log(error.message);
      });
    }
  }    
}

//3. Заменяет шаблонные теги в файле **template.html** с названиями файлов из папки components (пример:```{{section}}```) на содержимое одноимённых компонентов и  сохраняет результат в **project-dist/index.html**.

function replaceTags() {

  fs.copyFile('06-build-page/template.html', '06-build-page/project-dist/index.html', (err) =>{
    if(err){throw err;} makeComponentsArray();});

  function makeComponentsArray() {
    fs.readdir('06-build-page/components', { withFileTypes: true }, (err, files) => {if (err){throw err;
    } else { files.forEach(x => { if ((path.parse(x.name).ext) === '.html') {
      htmlComponentsArray.push(`${x.name}`);
      replaceHTMLfromhtmlComponentsArray();}});}});
  }

  function replaceHTMLfromhtmlComponentsArray() {

    let htmlFileContent ='';
    fs.readFile('06-build-page/project-dist/index.html', 'utf-8', (err, data) => {
      if (err) { throw err ;}
      htmlFileContent = data;
      replaceComponents();
    });

    function replaceComponents() {
      let i=0;
      htmlComponentsArray.forEach(x => {
        let htmlComponentContent = '';
        fs.readFile(path.join('06-build-page/components', x), 'utf-8', (err, data) => {
          if (err) { throw err ;}
          //   console.log('here', x); // why 3 times? -needs a fix
          htmlComponentContent = data;
          htmlReplacementArray.push([]);
          htmlReplacementArray[i].push(x);
          htmlReplacementArray[i].push(htmlComponentContent);
          i++;
          if (i===htmlComponentsArray.length) { 
            for( let j=0; j<htmlComponentsArray.length; j++){
              htmlFileContent = htmlFileContent.replace(`{{${path.parse(htmlReplacementArray[j][0]).name}}}`, `${htmlReplacementArray[j][1]}`);
            }                    
            writeReplacedHTML();  //unnecessary done 3 times - needs a fix
          }
        });});

      function  writeReplacedHTML() {

        fs.rm ('06-build-page/project-dist/index.html', { force: true, recursive: true}, (err) => {
          if (err) throw err;
          appendHTML();
        });

        function appendHTML() {
          fs.writeFile('06-build-page/project-dist/index.html', htmlFileContent, (err) =>{
            if(err){throw err;} });
        }}
    }}
}

//4. Копирует папку **assets** в **project-dist/assets**

function copyAssets (sourceFolderAssets, destinationFolderAssets) {

  fs.mkdir(destinationFolderAssets, { recursive: true }, (err) => {
    if (err) {throw err;} else { copyAssetsFromTo();}
  });

  function copyAssetsFromTo() {
    function createAssetsList(sourceF, destinationF) {
      fs.readdir(sourceF, (err, files) => {
        if(err){throw err;
        } else {
          assetsArray=files;
          assetsArray.forEach(y=> { fs.stat(path.join(sourceF, y), (err, stats) => { 
            if (err) { throw err;} else {
              if (!stats.isDirectory()) {
                fs.copyFile(path.join(sourceF,y), path.join(destinationF,y), (err) =>{
                  if(err){throw err;}
                });
              } else {
                fs.mkdir(path.join(destinationF,y), { recursive: true }, (err) => {
                  if (err) {throw err;} else { createAssetsList (path.join(sourceF,y), path.join(destinationF,y));}});
              }
            }});});}});}

    createAssetsList(sourceFolderAssets, destinationFolderAssets);
  }
}
