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
var DatabaseInserter = /** @class */ (function () {
    function DatabaseInserter() {
        this.batchSize = 132;
    }
    /**
    * Procesa archivos emitidos por el observable en orden.
    * @param fileObservable Observable que emite rutas de archivos.
    */
    DatabaseInserter.prototype.processFilesInOrder = function (fileObservable) {
        var _this = this;
        fileObservable
            .pipe(operators_1.tap(function (filePath) { return console.log("[INFO] Procesando archivo " + filePath); }), operators_1.concatMap(function (filePath) { return _this.insertFromJsonStream(filePath); }) // Procesamiento secuencial
        )
            .subscribe({
            complete: function () {
                console.log('[INFO] Todos los archivos han sido procesados.');
                data_1.dataRepository.cleanup();
            },
            error: function (err) {
                console.error('[ERROR] Error procesando archivos:', err);
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
            var fileStream, jsonStream, batch, lineNumber, jsonStream_1, jsonStream_1_1, jsonLine, record, e_1_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("[INFO] Procesando archivo grande: " + filePath);
                        fileStream = fs_1["default"].createReadStream(filePath, { encoding: 'utf-8' });
                        jsonStream = fileStream.pipe(StreamArray_1["default"].withParser());
                        batch = [];
                        lineNumber = 0;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 7, 8, 13]);
                        jsonStream_1 = __asyncValues(jsonStream);
                        _b.label = 2;
                    case 2: return [4 /*yield*/, jsonStream_1.next()];
                    case 3:
                        if (!(jsonStream_1_1 = _b.sent(), !jsonStream_1_1.done)) return [3 /*break*/, 6];
                        jsonLine = jsonStream_1_1.value.value;
                        record = this.mapJsonToRecord(jsonLine);
                        batch.push(record);
                        lineNumber++;
                        if (!(batch.length === this.batchSize)) return [3 /*break*/, 5];
                        return [4 /*yield*/, data_1.dataRepository.insertData(batch)];
                    case 4:
                        _b.sent(); // Usamos el repositorio para insertar
                        console.log("[INFO] Insertadas " + lineNumber + " l\u00EDneas.");
                        batch = [];
                        _b.label = 5;
                    case 5: return [3 /*break*/, 2];
                    case 6: return [3 /*break*/, 13];
                    case 7:
                        e_1_1 = _b.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 13];
                    case 8:
                        _b.trys.push([8, , 11, 12]);
                        if (!(jsonStream_1_1 && !jsonStream_1_1.done && (_a = jsonStream_1["return"]))) return [3 /*break*/, 10];
                        return [4 /*yield*/, _a.call(jsonStream_1)];
                    case 9:
                        _b.sent();
                        _b.label = 10;
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 12: return [7 /*endfinally*/];
                    case 13:
                        if (!(batch.length < this.batchSize)) return [3 /*break*/, 15];
                        return [4 /*yield*/, data_1.dataRepository.insertData(batch)];
                    case 14:
                        _b.sent();
                        console.log("[INFO] Insertadas las \u00FAltimas " + lineNumber + " l\u00EDneas.");
                        _b.label = 15;
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    /**
    * Convierte un objeto JSON a la entidad RecordEntity.
    * @param data Objeto JSON.
    */
    DatabaseInserter.prototype.mapJsonToRecord = function (data) {
        var record = new data_1.RecordEntity();
        record.ruc = data.RUC;
        record.nombreRazonSocial = data.NOMBRE_O_RAZON_SOCIAL;
        record.estadoContribuyente = data.ESTADO_DEL_CONTRIBUYENTE;
        record.condicionDomicilio = data.CONDICION_DE_DOMICILIO;
        record.ubigeo = data.UBIGEO;
        record.tipoVia = data.TIPO_DE_VIA;
        record.nombreVia = data.NOMBRE_DE_VIA;
        record.codigoZona = data.CODIGO_DE_ZONA;
        record.tipoZona = data.TIPO_DE_ZONA;
        record.numero = data.NUMERO;
        record.interior = data.INTERIOR;
        record.lote = data.LOTE;
        record.departamento = data.DEPARTAMENTO;
        record.manzana = data.MANZANA;
        record.kilometro = data.KILOMETRO;
        return record;
    };
    return DatabaseInserter;
}());
exports.DatabaseInserter = DatabaseInserter;
exports.databaseInserter = new DatabaseInserter();
