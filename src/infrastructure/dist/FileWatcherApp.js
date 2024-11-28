"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.FileWatcherApp = void 0;
var chokidar_1 = require("chokidar");
var FileWatcher_1 = require("./FileWatcher"); // Importa FileWatcher
var FileWatcherApp = /** @class */ (function (_super) {
    __extends(FileWatcherApp, _super);
    /**
    * Inicia el observador sobre una carpeta.
    * @param folderPath Ruta de la carpeta a observar.
    */
    function FileWatcherApp(folderPath) {
        var _this = _super.call(this) || this;
        _this.filesInProgress = new Set();
        _this.watcher = chokidar_1["default"].watch(folderPath, { persistent: true, ignoreInitial: true });
        return _this;
    }
    /**
     * Inicia la observación de la carpeta.
     */
    FileWatcherApp.prototype.startWatching = function () {
        var _this = this;
        this.watcher
            .on('add', function (filePath) {
            console.log("[INFO] Nuevo archivo detectado: " + filePath);
            _this.filesInProgress.add(filePath); // Agregar al conjunto de archivos en progreso
            _this.waitForFileToBeStable(filePath)
                .then(function () {
                console.log("[INFO] Procesamiento finalizado para: " + filePath);
                _this.filesInProgress["delete"](filePath); // Eliminar del conjunto cuando termine
                if (_this.filesInProgress.size === 0) {
                    console.log('[INFO] Todos los archivos han sido procesados. Deteniendo la observación.');
                    _this.stopWatching();
                }
            })["catch"](function (err) { return console.error("[ERROR] Error procesando " + filePath + ": " + err.message); });
        })
            .on('unlink', function (filePath) {
            console.log("[INFO] Archivo eliminado: " + filePath);
            _this.cancelFileWatch(filePath); // Cancelar monitoreo si el archivo ya no existe
            _this.filesInProgress["delete"](filePath);
        });
    };
    /**
     * Detiene la observación de la carpeta.
     */
    FileWatcherApp.prototype.stopWatching = function () {
        this.watcher.close();
        this.abortControllers.forEach(function (controller) { return controller.abort(); });
        this.abortControllers.clear();
    };
    return FileWatcherApp;
}(FileWatcher_1.FileWatcher));
exports.FileWatcherApp = FileWatcherApp;
