const { createReadStream, promises } = require('fs');
const { createInterface } = require('readline');
const { basename } = require('path');

function fileBaseName(fileName) {
  const val = basename(fileName).split('.');
  return val.filter(v => v !== val[val.length - 1] ).join('.');
}

async function writeJson(fileName, data) {
    let filehandle = null;
  try {
    filehandle = await promises.open(fileName, 'w');
    await filehandle.writeFile(data);
  } catch(error){
      throw error;
  }
  finally {
    if (filehandle) {
      // Close the file if it is opened.
      await filehandle.close();
    }
  }
}

/**
 * 
 * @param {string} csvFilePath path to the csv file
 * @param {string} jsonFilePath optional- path to where the json file
 * will be saved. If not provided, the file be saved in the
 *  directory working. If provided the file extention 
 * should be .json
 * @returns Promise
 * 
 */
async function csvToJson(csvFilePath, jsonFilePath = '') {
    
  const fileStream = createReadStream(csvFilePath);

  //crlfDelay option is used to recognize all instances of CR LF
  // ('\r\n') in input file as a single line break.
  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  
  let count = 0;
  let fields = null;
  const jsonContainer = [];
  for await (const line of rl) {
      if(line){
          
          if(count === 0){
            fields = line.split(',');
            count++;
          }
          else{
              const fieldValues = line.split(',');
              const obj = {};
              for (let i = 0; i < fields.length; i++) {
                  obj[fields[i]] = fieldValues[i];
              }
              count++;
              jsonContainer.push(obj);
          }
      }
  }

const fileName = jsonFilePath || `${fileBaseName(csvFilePath)}.json`

  writeJson(fileName, JSON.stringify(jsonContainer, null, 4));
}

module.exports = csvToJson;

