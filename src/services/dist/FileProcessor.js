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
exports.FileProcessor = void 0;
var utils_1 = require("../utils");
var WorkerFactory_1 = require("../workers/WorkerFactory");
var os = require("os");
var readline_1 = require("readline");
var fs_1 = require("fs");
var data_1 = require("../data");
var FileProcessor = /** @class */ (function () {
    function FileProcessor(FileSummary) {
        this.processFileLines = FileSummary["lineCount"];
        this.processFileHeaders = FileSummary["headers"];
        this.workerCount = utils_1.SystemUtils.getOptimalWorkers();
        this.chunkSize = Math.ceil(this.processFileLines / this.workerCount);
    }
    FileProcessor.prototype.distributeProcessing = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log("HEADERS: ", this.processFileHeaders);
                console.log("Numero de nucleos en el procesador:", os.cpus().length);
                console.log("Numero de Workers:", this.workerCount);
                console.log("Numero de lineas por Worker:", this.chunkSize);
                data_1.dataRepository.truncateData();
                return [2 /*return*/];
            });
        });
    };
    FileProcessor.prototype.process = function (filePath) {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function () {
            var fileStream, rl, lineWorker, countLine, workercount, results, rl_1, rl_1_1, line, index, e_1_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        fileStream = fs_1["default"].createReadStream(filePath, { highWaterMark: utils_1.bufferSizeCalculator.calculateBufferSize(), encoding: "" + 'binary' });
                        rl = readline_1["default"].createInterface({
                            input: fileStream,
                            crlfDelay: Infinity,
                            terminal: false
                        });
                        lineWorker = 0;
                        countLine = 0;
                        workercount = 0;
                        results = [];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, , 14, 15]);
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 7, 8, 13]);
                        rl_1 = __asyncValues(rl);
                        _b.label = 3;
                    case 3: return [4 /*yield*/, rl_1.next()];
                    case 4:
                        if (!(rl_1_1 = _b.sent(), !rl_1_1.done)) return [3 /*break*/, 6];
                        line = rl_1_1.value;
                        lineWorker++;
                        countLine++;
                        if (countLine === 1) {
                            return [3 /*break*/, 5];
                        }
                        else {
                            results.push(line);
                        }
                        if (lineWorker === this.chunkSize || countLine === this.processFileLines) {
                            index = workercount + 1;
                            this.runWorker(results, index);
                            workercount++;
                            lineWorker = 0;
                            results = [];
                        }
                        _b.label = 5;
                    case 5: return [3 /*break*/, 3];
                    case 6: return [3 /*break*/, 13];
                    case 7:
                        e_1_1 = _b.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 13];
                    case 8:
                        _b.trys.push([8, , 11, 12]);
                        if (!(rl_1_1 && !rl_1_1.done && (_a = rl_1["return"]))) return [3 /*break*/, 10];
                        return [4 /*yield*/, _a.call(rl_1)];
                    case 9:
                        _b.sent();
                        _b.label = 10;
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 12: return [7 /*endfinally*/];
                    case 13: return [3 /*break*/, 15];
                    case 14:
                        rl.close();
                        fileStream.close();
                        return [7 /*endfinally*/];
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    FileProcessor.prototype.runWorker = function (result, index) {
        var _a = WorkerFactory_1.WorkerFactory.createMessageChannel(), port1 = _a.port1, port2 = _a.port2;
        var worker = WorkerFactory_1.WorkerFactory.createWorker("workerProcess");
        port1.on('message', function (result) {
            console.log(result);
            port1.close();
            worker.terminate();
        });
        // Escuchar mensajes del worker
        worker.postMessage({ port: port2, result: result, index: index }, [port2]);
    };
    return FileProcessor;
}());
exports.FileProcessor = FileProcessor;
