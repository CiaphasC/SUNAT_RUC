"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var envConfig_1 = require("../config/envConfig");
var path_1 = require("path");
var app_root_path_1 = require("app-root-path");
var fs_1 = require("fs");
var worker_threads_1 = require("worker_threads");
var utils_1 = require("../utils");
if (!worker_threads_1.parentPort)
    throw new Error('Worker must run in a worker thread.');
// Función para analizar una línea en un objeto.
function parseLineToObject(line) {
    var _a = line.split('|'), RUC = _a[0], NOMBRE_O_RAZON_SOCIAL = _a[1], ESTADO_DEL_CONTRIBUYENTE = _a[2], CONDICION_DE_DOMICILIO = _a[3], UBIGEO = _a[4], TIPO_DE_VIA = _a[5], NOMBRE_DE_VIA = _a[6], CODIGO_DE_ZONA = _a[7], TIPO_DE_ZONA = _a[8], NUMERO = _a[9], INTERIOR = _a[10], LOTE = _a[11], DEPARTAMENTO = _a[12], MANZANA = _a[13], KILOMETRO = _a[14];
    return {
        RUC: RUC.trim(),
        NOMBRE_O_RAZON_SOCIAL: NOMBRE_O_RAZON_SOCIAL.trim(),
        ESTADO_DEL_CONTRIBUYENTE: ESTADO_DEL_CONTRIBUYENTE.trim(),
        CONDICION_DE_DOMICILIO: CONDICION_DE_DOMICILIO.trim(),
        UBIGEO: UBIGEO.trim(),
        TIPO_DE_VIA: TIPO_DE_VIA.trim(),
        NOMBRE_DE_VIA: NOMBRE_DE_VIA.trim(),
        CODIGO_DE_ZONA: CODIGO_DE_ZONA.trim(),
        TIPO_DE_ZONA: TIPO_DE_ZONA.trim(),
        NUMERO: NUMERO.trim(),
        INTERIOR: INTERIOR.trim(),
        LOTE: LOTE.trim(),
        DEPARTAMENTO: DEPARTAMENTO.trim(),
        MANZANA: MANZANA.trim(),
        KILOMETRO: KILOMETRO.trim()
    };
}
/**
 * Escribe datos procesados en un WriteStream como un arreglo JSON.
 * @param writeStream Stream de escritura.
 * @param data Datos a procesar.
 */
function writeStreamAsync(writeStream, data) {
    return __awaiter(this, void 0, void 0, function () {
        var buffer, isFirstObject, _i, data_1, line, processedResult, jsonString;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    buffer = [];
                    isFirstObject = true;
                    _i = 0, data_1 = data;
                    _a.label = 1;
                case 1:
                    if (!(_i < data_1.length)) return [3 /*break*/, 4];
                    line = data_1[_i];
                    processedResult = parseLineToObject(line);
                    jsonString = JSON.stringify(processedResult);
                    if (!isFirstObject) {
                        buffer.push("," + jsonString);
                    }
                    else {
                        buffer.push(jsonString);
                        isFirstObject = false; // A partir de ahora, no será el primer objeto
                    }
                    if (!(buffer.length >= 30000)) return [3 /*break*/, 3];
                    return [4 /*yield*/, writeToStream(writeStream, buffer.join('\n') + '\n')];
                case 2:
                    _a.sent();
                    buffer.length = 0; // Limpiar el buffer después de escribir
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    if (!(buffer.length > 0)) return [3 /*break*/, 6];
                    return [4 /*yield*/, writeToStream(writeStream, buffer.join('\n') + '\n')];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6: return [4 /*yield*/, writeToStream(writeStream, ']')];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Escribe texto directamente al WriteStream.
 * @param writeStream Stream de escritura.
 * @param text Texto a escribir.
 */
function writeToStream(writeStream, text) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                        writeStream.write(text, 'utf-8', function (err) {
                            if (err)
                                reject(err);
                            else
                                resolve();
                        });
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Envía un mensaje de confirmación desde el worker.
 * @param index Índice del worker.
 */
function mensaje(index) {
    return "Procesado thread " + index + " ";
}
worker_threads_1.parentPort === null || worker_threads_1.parentPort === void 0 ? void 0 : worker_threads_1.parentPort.on('message', function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var port, index, result, outputFile, writeStream;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                port = data.port, index = data.index, result = data.result;
                outputFile = path_1["default"].join(app_root_path_1["default"].path, envConfig_1.envConfig.metadataDirectoryPath + "/processedResults-" + index + ".json");
                writeStream = fs_1["default"].createWriteStream(outputFile, { encoding: 'utf-8', highWaterMark: utils_1.bufferSizeCalculator.calculateBufferSize() });
                writeStream.write('[\n', 'utf-8');
                return [4 /*yield*/, writeStreamAsync(writeStream, result)];
            case 1:
                _a.sent();
                writeStream.end();
                writeStream.on('finish', function () { });
                port.postMessage(mensaje(index));
                return [2 /*return*/];
        }
    });
}); });
