"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
exports.__esModule = true;
exports.databaseInserter = exports.DatabaseInserter = void 0;
var operators_1 = require("rxjs/operators");
var fs_1 = require("fs");
var StreamArray_1 = require("stream-json/streamers/StreamArray");
var data_1 = require("../data"); // Importamos el repositorio
var utils_1 = require("../utils");
var Database_1 = require("../config/Database");
/**
 * Clase responsable de insertar datos en la base de datos a partir de archivos procesados.
 * Utiliza streams para manejar grandes volúmenes de datos y realiza inserciones en lotes.
 */
var DatabaseInserter = /** @class */ (function () {
    function DatabaseInserter() {
        this.batchSize = 139;
        this.maxConcurrent = 5; // Número máximo de procesos paralelos
    }
    /**
    * Procesa archivos emitidos por el observable de forma paralela.
    * @param fileObservable Observable que emite rutas de archivos.
    */
    DatabaseInserter.prototype.processFilesInOrder = function (fileObservable) {
        var _this = this;
        fileObservable
            .pipe(operators_1.tap(function (filePath) { return console.log("[INFO] Procesando archivo " + filePath); }), operators_1.mergeMap(function (filePath) { return _this.insertFromJsonStream(filePath); }, this.maxConcurrent), operators_1.catchError(function (error) {
            console.error('[ERROR] Error durante el procesamiento:', error);
            // Emitimos un valor vacío para que el flujo continúe
            return [];
        }))
            .subscribe({
            complete: function () {
                console.log('[INFO] Todos los archivos han sido procesados.');
                data_1.dataRepository.cleanup();
            },
            error: function (err) {
                console.error('[ERROR] Error procesando archivos:', err);
                data_1.dataRepository.cleanup();
            }
        });
    };
    /**
    * Inserta registros desde un archivo JSON usando stream-json.
    * @param filePath Ruta del archivo JSON.
    */
    DatabaseInserter.prototype.insertFromJsonStream = function (filePath) {
        var e_1, _a;
        return __awaiter(this, void 0, Promise, function () {
            var queryRunner, fileStream, jsonStream, batch, lineNumber, jsonStream_1, jsonStream_1_1, jsonLine, record, e_1_1, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("[INFO] Procesando archivo grande: " + filePath);
                        queryRunner = Database_1.appDataSource.getInstance().createQueryRunner();
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 18, 19, 22]);
                        // Conectar el QueryRunner
                        return [4 /*yield*/, queryRunner.connect()];
                    case 2:
                        // Conectar el QueryRunner
                        _b.sent();
                        console.log('[INFO] QueryRunner conectado.');
                        fileStream = fs_1["default"].createReadStream(filePath, {
                            encoding: 'utf-8',
                            highWaterMark: utils_1.bufferSizeCalculator.calculateBufferSize()
                        });
                        jsonStream = fileStream.pipe(StreamArray_1["default"].withParser());
                        batch = [];
                        lineNumber = 0;
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 9, 10, 15]);
                        jsonStream_1 = __asyncValues(jsonStream);
                        _b.label = 4;
                    case 4: return [4 /*yield*/, jsonStream_1.next()];
                    case 5:
                        if (!(jsonStream_1_1 = _b.sent(), !jsonStream_1_1.done)) return [3 /*break*/, 8];
                        jsonLine = jsonStream_1_1.value.value;
                        record = this.mapJsonToRecord(jsonLine);
                        batch.push(record);
                        lineNumber++;
                        if (!(batch.length === this.batchSize)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.safeInsert(batch, queryRunner)];
                    case 6:
                        _b.sent(); // Usamos el repositorio para insertar
                        console.log("[INFO] Insertadas " + lineNumber + " l\u00EDneas.");
                        batch = [];
                        _b.label = 7;
                    case 7: return [3 /*break*/, 4];
                    case 8: return [3 /*break*/, 15];
                    case 9:
                        e_1_1 = _b.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 15];
                    case 10:
                        _b.trys.push([10, , 13, 14]);
                        if (!(jsonStream_1_1 && !jsonStream_1_1.done && (_a = jsonStream_1["return"]))) return [3 /*break*/, 12];
                        return [4 /*yield*/, _a.call(jsonStream_1)];
                    case 11:
                        _b.sent();
                        _b.label = 12;
                    case 12: return [3 /*break*/, 14];
                    case 13:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 14: return [7 /*endfinally*/];
                    case 15:
                        if (!(batch.length > 0)) return [3 /*break*/, 17];
                        return [4 /*yield*/, this.safeInsert(batch, queryRunner)];
                    case 16:
                        _b.sent();
                        console.log("[INFO] Insertadas las \u00FAltimas " + batch.length + " l\u00EDneas.");
                        _b.label = 17;
                    case 17: return [3 /*break*/, 22];
                    case 18:
                        error_1 = _b.sent();
                        console.error('[ERROR] Error al procesar archivo JSON:', error_1);
                        throw error_1; // Re-lanzamos el error para manejarlo a nivel superior si es necesario
                    case 19:
                        if (!!queryRunner.isReleased) return [3 /*break*/, 21];
                        return [4 /*yield*/, queryRunner.release()];
                    case 20:
                        _b.sent();
                        console.log('[INFO] QueryRunner liberado.');
                        _b.label = 21;
                    case 21: return [7 /*endfinally*/];
                    case 22: return [2 /*return*/];
                }
            });
        });
    };
    DatabaseInserter.prototype.safeInsert = function (batch, queryRunner) {
        return __awaiter(this, void 0, Promise, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 7]);
                        return [4 /*yield*/, data_1.dataRepository.insertData(batch, queryRunner)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 2:
                        error_2 = _a.sent();
                        if (!(this.isDatabaseError(error_2) && error_2.code === 'ECONNCLOSED')) return [3 /*break*/, 5];
                        console.log('[INFO] Reconectando a la base de datos...');
                        return [4 /*yield*/, this.connectToDatabase()];
                    case 3:
                        _a.sent();
                        console.log('[INFO] Reconexión exitosa. Reintentando inserción...');
                        return [4 /*yield*/, this.safeInsert(batch, queryRunner)];
                    case 4:
                        _a.sent(); // Reintenta la inserción
                        return [3 /*break*/, 6];
                    case 5:
                        console.error('[ERROR] Error al insertar datos:', error_2);
                        throw error_2; // Lanza el error si no es de conexión
                    case 6: return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    DatabaseInserter.prototype.connectToDatabase = function (maxRetries, delay) {
        if (maxRetries === void 0) { maxRetries = 12; }
        if (delay === void 0) { delay = 19000; }
        return __awaiter(this, void 0, Promise, function () {
            var retries, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        retries = 0;
                        _a.label = 1;
                    case 1:
                        if (!(retries < maxRetries)) return [3 /*break*/, 7];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 6]);
                        console.log("[INFO] Intentando conectar a la base de datos. Intento " + (retries + 1));
                        return [4 /*yield*/, data_1.dataRepository.ensureQueryRunner()];
                    case 3:
                        _a.sent();
                        console.log('[INFO] Conexión exitosa a la base de datos.');
                        return [2 /*return*/];
                    case 4:
                        error_3 = _a.sent();
                        retries++;
                        console.error("[ERROR] Error al conectar: " + error_3 + ". Reintentando en " + delay + " ms...");
                        if (retries >= maxRetries) {
                            console.error('[ERROR] No se pudo establecer conexión después de varios intentos.');
                            throw error_3;
                        }
                        return [4 /*yield*/, new Promise(function (res) { return setTimeout(res, delay * retries); })];
                    case 5:
                        _a.sent(); // Retraso exponencial
                        return [3 /*break*/, 6];
                    case 6: return [3 /*break*/, 1];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    DatabaseInserter.prototype.isDatabaseError = function (error) {
        return typeof error === 'object' && error !== null && 'code' in error;
    };
    /**
    * Convierte un objeto JSON a la entidad RecordEntity.
    * @param data Objeto JSON.
    */
    DatabaseInserter.prototype.mapJsonToRecord = function (data) {
        var record = new data_1.Contribuyentes();
        record.RUC = data.RUC;
        record.NOMBRE_O_RAZON_SOCIAL = data.NOMBRE_O_RAZON_SOCIAL;
        record.ESTADO_DEL_CONTRIBUYENTE = data.ESTADO_DEL_CONTRIBUYENTE;
        record.CONDICION_DE_DOMICILIO = data.CONDICION_DE_DOMICILIO;
        record.UBIGEO = data.UBIGEO;
        record.TIPO_DE_VIA = data.TIPO_DE_VIA;
        record.NOMBRE_DE_VIA = data.NOMBRE_DE_VIA;
        record.CODIGO_DE_ZONA = data.CODIGO_DE_ZONA;
        record.TIPO_DE_ZONA = data.TIPO_DE_ZONA;
        record.NUMERO = data.NUMERO;
        record.INTERIOR = data.INTERIOR;
        record.LOTE = data.LOTE;
        record.DEPARTAMENTO = data.DEPARTAMENTO;
        record.MANZANA = data.MANZANA;
        record.KILOMETRO = data.KILOMETRO;
        return __assign({}, record);
    };
    return DatabaseInserter;
}());
exports.DatabaseInserter = DatabaseInserter;
exports.databaseInserter = new DatabaseInserter();
