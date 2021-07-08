const http = require('http');
const uuid = require('uuid');
const NodePath = require('path');
const express = require("express");
const fs = require('fs')

const sPathToSave = "C:\\";
const sAbsolutePath = "FromUploader/";
const sDictionaryDirectoryPath = "Dictionary"
const sDictionaryFileName = "Dictionary.json";
const sHostAddress = '192.168.2.104';
const iPortNumber = 55551;

const app = express();
const server = http.createServer(app);

server.listen(iPortNumber, sHostAddress);
console.log('Listening on', sHostAddress + ':' + iPortNumber);

app.use(express.static('client'));

//Получение userSid из Microsoft Auth
app.use("/config", function (oRequest, oResponse, next) {
    var nodeSSPI = require('node-sspi')
    var nodeSSPIObj = new nodeSSPI({
        offerSSPI: true,
        maxLoginAttemptsPerConnection: 1,
        retrieveGroups: true
    })
    _setHeaders(oResponse, true);
    nodeSSPIObj.authenticate(oRequest, oResponse, function (oError) {
        oResponse.finished || next()
    })
});

//Записываем логин
app.use("/config", function (oRequest, oResponse, next) {
    let sUserId = oRequest.connection.userSid;
    if (sUserId) {
        _writeHead(oResponse, 200, "OK");
        oResponse.end(sUserId);
    } else {
        _writeHead(oResponse, 500, "ERROR");
        oResponse.end("All");
    }
})

//Основная обработка всех запросов по пути /upload
app.use("/upload", function (oRequest, oResponse) {
    //Выставляем хедеры для политики CORS
    _setHeaders(oResponse, false);

    oRequest.on("error", function () {
        handleError(Object.assign(new Error('Ошибка обработки запроса'), {
            code: 454
        }), oResponse);
    });

    oResponse.on("error", function () {
        handleError(Object.assign(new Error('Ошибка обработки запроса'), {
            code: 551
        }), oResponse);
    });

    switch (oRequest.method) {
        case 'OPTIONS':
            //Pre-flight request для загрузки файла
            _handleOptionsRequest(oRequest, oResponse);
            break;
        case "GET":
            //Получение списка файлов
            _readDirectory(oRequest, oResponse);
            break;
        case "PUT":
            //Редактирование файла
            _handleEditRequest(oRequest, oResponse);
            break;
        case "DELETE":
            //Удаление файла
            _handleDeleteRequest(oRequest, oResponse);
            break;
        case 'POST':
            //Загрузка нового файла
            _handleSaveFile(oRequest, oResponse);
            break;
        default:
            break;
    }

});

//Обработка ошибок
function handleError(oError, iCode, oResponse) {
    _writeHead(oResponse, iCode, "ERROR");
    if (oError instanceof Error) {
        oResponse.write(oError.message);
    } else {
        oResponse.write(oError);
    }
    oResponse.end();
    console.log(oError);
}

//Записываем в head запроса тип данных, статус и текст
function _writeHead(oResponse, iStatus, sHeadText) {
    oResponse.writeHead(iStatus, sHeadText, {
        "Content-Type": "text/plain"
    });
}

//Выставляем headers для CORS
function _setHeaders(oResponse, bAllowCredentials) {
    oResponse.setHeader('Access-Control-Allow-Origin', '*');
    oResponse.setHeader('Access-Control-Request-Method', '*');
    oResponse.setHeader('Access-Control-Allow-Methods', '*');
    oResponse.setHeader('Access-Control-Allow-Headers', '*');
    if (bAllowCredentials) {
        oResponse.setHeader('Access-Control-Allow-Credentials', '*');
    }
}

//Обработка Pre-flight запроса
function _handleOptionsRequest(oResponse, oRequest) {
    _writeHead(oResponse, 200, "OK");
    oResponse.end();
}

//Функция проверки существования директории, если такой нет, то создаем её
function _checkDir(sPath) {
    if (!fs.existsSync(sPath)) {
        fs.mkdirSync(sPath, function (oError) {
            handleError(oError, 500, oResponse);
        });
    }
}

function _checkDictFile(sDictFilePath, oResponse) {
    if (!fs.existsSync(sDictFilePath)) {
        fs.writeFileSync(sDictFilePath, JSON.stringify([]), function (oError) {
            handleError(oError, 500, oResponse);
        })
    }
}

//Сохранение файла
function _handleSaveFile(oRequest, oResponse) {
    let oHeaders = oRequest.headers;
    if (oHeaders) {
        let sSlugHeader = oHeaders["slug"];
        let sUserId = oHeaders["user-credentials"];
        sUserId ? sUserId : "All";
        if (sSlugHeader) {
            //Генерируем уникальный uuid для нового файла
            var sFileNameUniqueId = uuid.v4();
            let sFileType = NodePath.extname(sSlugHeader);
            let sFinalDirectory = sPathToSave + sUserId + "\\";
            let sDictionaryDirectory = sFinalDirectory + sDictionaryDirectoryPath;
            let sFinalFileName = sFileNameUniqueId + sFileType;
            let sFinalFilePath = sFinalDirectory + sFinalFileName;
            let sFinalAbsolutePath = sAbsolutePath + sUserId + "/";

            _checkDir(sFinalDirectory, oResponse);
            _handleDirectoryOperation(sDictionaryDirectory, "CREATE", oResponse);
            let sDictFilePath = sDictionaryDirectory + "\\" + sDictionaryFileName;

            //Если запрос внезапно прервался, то удаляем битый файл
            oRequest.on('close', function () {
                //TODO: Файл создается заново, если произошёл сбой загрузки, но корректно записывается
                let bWriteToResponseMessage = false;
                var oError;
                if (sFinalFilePath) {
                    oError = _deleteFile(sFinalFilePath, bWriteToResponseMessage, oResponse);
                }
                let sErrorMessage = oError && oError.Message ? "\n" + oError.Message : "";
                handleError('Загрузка отменена пользователем' + sErrorMessage, 451, oResponse);
            })
            //Если есть данные, то записываем их в файл
            oRequest.on('data', function (chunk) {
                fs.appendFileSync(sFinalFilePath, Buffer.from(chunk), oError => {
                    if (oError) {
                        handleError(oError, 500, oResponse);
                    }
                });
            });

            //Запрос успешно выполнился
            oRequest.on('end', function () {
                _handleDirectoryOperation(sDictFilePath, "APPEND", oResponse, {
                    [sFinalFileName]: sSlugHeader
                });
                _writeHead(oResponse, 200, "OK");
                oResponse.write(sFinalAbsolutePath + sFinalFileName);
                oResponse.end();
            });
        } else {
            handleError('Missing slug header', 452, oResponse);
        }

    } else {
        handleError("No request headers", 453, oResponse);
    }

}

//Получение списка файлов в директории и отправка ответным запросом
function _readDirectory(oRequest, oResponse) {
    let oHeaders = oRequest.headers;
    if (oHeaders) {
        oResponse.setHeader('Content-Type', 'application/json');
        let sUserId = oHeaders["user-credentials"];
        sUserId ? sUserId : "All";
        let sFinalDirectory = sPathToSave + sUserId + "\\";
        let sDictionaryDirectory = sFinalDirectory + sDictionaryDirectoryPath;
        let sFinalAbsolutePath = sAbsolutePath + sUserId + "/";
        var aResponseData = [];

        _checkDir(sFinalDirectory, oResponse);
        _checkDir(sDictionaryDirectory, oResponse);
        let sDictFilePath = sDictionaryDirectory + "\\" + sDictionaryFileName;
        _checkDictFile(sDictFilePath, oResponse);
        let aDictionary = _handleDirectoryOperation(sDictFilePath, "READ", oResponse);
        fs.readdir(sFinalDirectory, (oError, aFiles) => {
            if (oError)
                handleError(oError, 454, oResponse);
            else {
                aFiles.forEach(sFile => {
                    if (fs.statSync(sFinalDirectory + sFile).isDirectory()) {
                        //Обработка директорий
                    } else {
                        sConvertedFileName = aDictionary.find(oItem =>
                            oItem.hasOwnProperty(sFile)
                        );
                        sConvertedFileName = sConvertedFileName ? decodeURIComponent(sConvertedFileName[sFile]) : sFile;
                        aResponseData.push({
                            fileName: sConvertedFileName,
                            filePath: sFinalAbsolutePath + sFile
                        });
                    }
                })
                oResponse.end(JSON.stringify(aResponseData));
            }
        });
    }
}

//Обработка изменения файла
function _handleEditRequest(oRequest, oResponse) {
    let oHeaders = oRequest.headers;
    if (oHeaders) {
        let aFilePaths = decodeURIComponent(oHeaders["filepath"]).split("/");;
        let sNewFileName = decodeURIComponent(oHeaders["newfilename"]);
        let sUserPath = aFilePaths[1];
        let sFilePath = aFilePaths[2];
        let sDictFilePath = sPathToSave + sUserPath + "\\" + sDictionaryDirectoryPath + "\\" + sDictionaryFileName;
        if (sFilePath && sNewFileName) {
            _handleDirectoryOperation(sDictFilePath, "UPDATE", oResponse, {
                oldValue: sFilePath,
                newValue: sNewFileName
            });
        } else {
            handleError('File path missing or empty filename', 400, oResponse);
        }
    } else {
        handleError("No request headers", 453, oResponse);
    }
}

//Обработка удаления файла
function _handleDeleteRequest(oRequest, oResponse) {
    let oHeaders = oRequest.headers;
    if (oHeaders) {
        let sFilePath = decodeURIComponent(oHeaders["filepath"]).split("/").slice(-2).join("\\");
        let sFinalFilePath = sPathToSave + sFilePath;
        let bWriteToResponseMessage = true;
        _deleteFile(sFinalFilePath, bWriteToResponseMessage, oResponse);
    } else {
        handleError('No request headers', 453, oResponse);
    }
}

//Удаление файла по заданному пути
function _deleteFile(sFilepath, bWriteToResponse, oResponse) {
    if (sFilepath) {
        fs.unlink(sFilepath, (oError) => {
            if (bWriteToResponse) {
                if (oError) {
                    handleError(oError, 400, oResponse);
                } else {
                    _handleDirectoryOperation(sFilepath, "DELETE", oResponse,
                        sFilepath.substring(sFilepath.lastIndexOf('\\') + 1)
                    );
                    _writeHead(oResponse, 200, "OK");
                    oResponse.end();
                }
            } else {
                return oError;
            }
        })
    } else {
        handleError('File path missing', 400, oResponse);
    }
}

function _handleDirectoryOperation(sDictFilePath, sOperation, oResponse, oData) {
    switch (sOperation) {
        case "CREATE":
            _checkDir(sDictFilePath, oResponse);
            break;
        case "APPEND":
            _handleAppendToJSON(sDictFilePath, oData, oResponse);
            break;
        case "READ":
            return _handleReadJSON(sDictFilePath, oResponse);
            break;
        case "DELETE":
            _handleDeleteRecordFromJSON(sDictFilePath, oData, oResponse);
            break;
        case "UPDATE":
            _handleEditJSON(sDictFilePath, oData, oResponse);
            break;
        default:
            break;
    }
}

function _handleAppendToJSON(sDictFilePath, oDataToAdd, oResponse) {
    var oData = fs.readFileSync(sDictFilePath);
    if (oData) {
        var oJSON = JSON.parse(oData)
        oJSON.push(oDataToAdd);
        fs.writeFileSync(sDictFilePath, JSON.stringify(oJSON));
    }
}

function _handleReadJSON(sDictFilePath, oResponse) {
    return JSON.parse(fs.readFileSync(sDictFilePath));
}

function _handleDeleteRecordFromJSON(sDictFilePath, oDataToDelete, oResponse) {
    let sFinalPath = sDictFilePath.substr(0, sDictFilePath.lastIndexOf("\\"));
    sFinalPath = sFinalPath + "\\" + sDictionaryDirectoryPath + "\\" + sDictionaryFileName;
    var oData = fs.readFileSync(sFinalPath);
    if (oData) {
        var oJSON = JSON.parse(oData);
        oJSON = oJSON.filter(oItem => !oItem.hasOwnProperty(oDataToDelete));
        fs.writeFileSync(sFinalPath, JSON.stringify(oJSON));
    }
}

function _handleEditJSON(sDictFilePath, oDataToEdit, oResponse) {
    try {
        var oData = fs.readFileSync(sDictFilePath);
        if (oData) {
            var oJSON = JSON.parse(oData);
            for (let i = 0; i < oJSON.length; i++) {
                if (oJSON[i].hasOwnProperty(oDataToEdit.oldValue)) {
                    oJSON[i][oDataToEdit.oldValue] = oDataToEdit.newValue;
                    fs.writeFileSync(sDictFilePath, JSON.stringify(oJSON));
                    _writeHead(oResponse, 200, "OK");
                    oResponse.end();
                }
            }
        }
    } catch (oError) {
        handleError(oError, 400, oResponse);
    }

}