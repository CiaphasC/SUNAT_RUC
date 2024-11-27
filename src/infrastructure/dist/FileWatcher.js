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
exports.FileWatcher = void 0;
var promises_1 = require("fs/promises");
var rxjs_1 = require("rxjs");
var FileWatcher = /** @class */ (function () {
    function FileWatcher() {
        this.fileSubject = new rxjs_1.Subject();
        this.abortControllers = new Map();
        this.delay = 900; // 1 segundo entre verificaciones
    }
    /**
     * Espera que un archivo se estabilice (su tamaño no cambia).
     * @param filePath Ruta del archivo a verificar.
     */
    FileWatcher.prototype.waitForFileToBeStable = function (filePath) {
        return __awaiter(this, void 0, Promise, function () {
            var abortController, lastSize, stats, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        abortController = new AbortController();
                        this.abortControllers.set(filePath, abortController);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, 7, 8]);
                        lastSize = 0;
                        _a.label = 2;
                    case 2:
                        if (!!abortController.signal.aborted) return [3 /*break*/, 5];
                        return [4 /*yield*/, promises_1["default"].stat(filePath)];
                    case 3:
                        stats = _a.sent();
                        if (stats.size === lastSize) {
                            console.log("[INFO] Archivo estable: " + filePath);
                            this.fileSubject.next(filePath);
                            return [3 /*break*/, 5]; // Salimos del ciclo si el archivo está estable
                        }
                        lastSize = stats.size;
                        return [4 /*yield*/, this.delayPromise(this.delay, abortController.signal)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        error_1 = _a.sent();
                        if (error_1 instanceof Error) {
                            if (error_1.name === 'AbortError') {
                                console.log("[INFO] Monitoreo cancelado para: " + filePath);
                            }
                            else {
                                console.error("[ERROR] Error al verificar el archivo " + filePath + ": " + error_1.message);
                            }
                        }
                        else {
                            console.error("[ERROR] Se lanz\u00F3 un valor desconocido: " + error_1);
                        }
                        return [3 /*break*/, 8];
                    case 7:
                        this.abortControllers["delete"](filePath); // Limpiar referencias
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Retarda la ejecución por un tiempo determinado.
     * @param ms Tiempo en milisegundos para esperar.
     * @param signal Señal de abortar.
     */
    FileWatcher.prototype.delayPromise = function (ms, signal) {
        return new Promise(function (resolve, reject) {
            var timeout = setTimeout(function () { return resolve(); }, ms);
            signal.addEventListener('abort', function () {
                clearTimeout(timeout);
                reject(new Error('AbortError'));
            });
        });
    };
    /**
     * Cancela el monitoreo de un archivo.
     * @param filePath Ruta del archivo.
     */
    FileWatcher.prototype.cancelFileWatch = function (filePath) {
        var controller = this.abortControllers.get(filePath);
        if (controller) {
            controller.abort();
        }
    };
    /**
    * Devuelve un observable que emite las rutas de los archivos detectados.
    */
    FileWatcher.prototype.getFileObservable = function () {
        return this.fileSubject.asObservable();
    };
    return FileWatcher;
}());
exports.FileWatcher = FileWatcher;
