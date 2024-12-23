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
exports.dataRepository = void 0;
var __1 = require("../");
var Database_1 = require("../../config/Database");
var DataRepository = /** @class */ (function () {
    function DataRepository() {
        // Inicializamos el repositorio usando AppDataSource
        Database_1.AppDataSource.initialize()
            .then(function () { return console.log('Data Source Initialized'); })["catch"](function (error) { return console.error('Error initializing data source:', error); });
        this.repository = Database_1.AppDataSource.getRepository(__1.RecordEntity);
        this.dataSource = Database_1.AppDataSource;
    }
    /**
    * Inserta nuevos datos en la base de datos.
    * @param data Array de entidades RecordEntity a insertar.
    */
    DataRepository.prototype.insertData = function (data) {
        return __awaiter(this, void 0, Promise, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.repository.insert(data)];
                    case 1:
                        _a.sent(); // Inserta o actualiza registros.
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Error al insertar datos:', error_1);
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DataRepository.prototype.truncateData = function () {
        return __awaiter(this, void 0, Promise, function () {
            var tableName, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        tableName = this.dataSource.getMetadata(__1.RecordEntity).tableName;
                        return [4 /*yield*/, this.dataSource.query("TRUNCATE TABLE " + tableName)];
                    case 1:
                        _a.sent(); // Usa query directamente
                        console.log("Tabla '" + tableName + "' truncada con \u00E9xito.");
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Error al truncar la tabla:', error_2);
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
    * Elimina todos los datos existentes en la tabla.
    */
    DataRepository.prototype.deleteData = function () {
        return __awaiter(this, void 0, Promise, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.repository.clear()];
                    case 1:
                        _a.sent(); // Limpia todos los registros de la tabla.
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        console.error('Error al eliminar datos:', error_3);
                        throw error_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
    * Actualiza los datos en la base de datos, eliminando primero los existentes.
    * @param data Array de entidades RecordEntity con los datos actualizados.
    */
    DataRepository.prototype.updateData = function (data) {
        return __awaiter(this, void 0, Promise, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.deleteData()];
                    case 1:
                        _a.sent(); // Limpia la tabla primero.
                        return [4 /*yield*/, this.insertData(data)];
                    case 2:
                        _a.sent(); // Inserta los nuevos datos.
                        return [3 /*break*/, 4];
                    case 3:
                        error_4 = _a.sent();
                        console.error('Error al actualizar datos:', error_4);
                        throw error_4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
    * Obtiene todos los registros de la tabla.
    * @returns Array de registros.
    */
    DataRepository.prototype.getAllRecords = function () {
        return __awaiter(this, void 0, Promise, function () {
            var error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.repository.find()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_5 = _a.sent();
                        console.error('Error al obtener registros:', error_5);
                        throw error_5;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
    * Encuentra registros por criterio.
    * @param criteria Criterios de búsqueda.
    * @returns Array de registros que cumplen con el criterio.
    */
    DataRepository.prototype.findByCriteria = function (criteria) {
        return __awaiter(this, void 0, Promise, function () {
            var error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.repository.find({ where: criteria })];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        error_6 = _a.sent();
                        console.error('Error al buscar registros:', error_6);
                        throw error_6;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    DataRepository.prototype.cleanup = function () {
        return __awaiter(this, void 0, Promise, function () {
            var error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('[INFO] Liberando recursos...');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        if (!Database_1.AppDataSource.isInitialized) return [3 /*break*/, 3];
                        return [4 /*yield*/, Database_1.AppDataSource.destroy()];
                    case 2:
                        _a.sent(); // Desconecta el DataSource
                        console.log('[INFO] Conexión con la base de datos cerrada.');
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_7 = _a.sent();
                        console.error('[ERROR] Error al liberar recursos:', error_7);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return DataRepository;
}());
exports.dataRepository = new DataRepository();
