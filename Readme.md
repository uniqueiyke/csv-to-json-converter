This code convert the csv file which path/filename is pass as first argument and convert it to a json file.
The path/filename of the json file should be pass as the second argument. If this is not provided, the .csv file name will be used as the .json file name and the file will be saved in the current working directory.
The function a promise which resoves to nothing if successful or reject with an error if failed;
example                                                  
const csvToJson = require('csv-to-json');

(async () => {
    try {
        await csvToJson('ng-city.csv');
    } catch (error) {
        console.log(error.message);
    }
}
)()