"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.RecordEntity = void 0;
// src/entities/Contribuyente.ts
var typeorm_1 = require("typeorm");
var RecordEntity = /** @class */ (function () {
    function RecordEntity() {
        this.ruc = "";
        this.nombreRazonSocial = "";
        this.estadoContribuyente = "";
        this.condicionDomicilio = "";
        this.ubigeo = "";
        this.tipoVia = "";
        this.nombreVia = "";
        this.codigoZona = "";
        this.tipoZona = "";
        this.numero = "";
        this.interior = "";
        this.lote = "";
        this.departamento = "";
        this.manzana = "";
        this.kilometro = "";
    }
    __decorate([
        typeorm_1.PrimaryColumn({ name: 'RUC', length: 11 })
    ], RecordEntity.prototype, "ruc");
    __decorate([
        typeorm_1.Column({ name: 'NOMBRE_O_RAZON_SOCIAL', length: 255 })
    ], RecordEntity.prototype, "nombreRazonSocial");
    __decorate([
        typeorm_1.Column({ name: 'ESTADO_DEL_CONTRIBUYENTE', length: 20 })
    ], RecordEntity.prototype, "estadoContribuyente");
    __decorate([
        typeorm_1.Column({ name: 'CONDICION_DE_DOMICILIO', length: 50 })
    ], RecordEntity.prototype, "condicionDomicilio");
    __decorate([
        typeorm_1.Column({ name: 'UBIGEO', length: 50 })
    ], RecordEntity.prototype, "ubigeo");
    __decorate([
        typeorm_1.Column({ name: 'TIPO_DE_VIA', length: 50, nullable: true })
    ], RecordEntity.prototype, "tipoVia");
    __decorate([
        typeorm_1.Column({ name: 'NOMBRE_DE_VIA', length: 255, nullable: true })
    ], RecordEntity.prototype, "nombreVia");
    __decorate([
        typeorm_1.Column({ name: 'CODIGO_DE_ZONA', length: 50, nullable: true })
    ], RecordEntity.prototype, "codigoZona");
    __decorate([
        typeorm_1.Column({ name: 'TIPO_DE_ZONA', length: 55, nullable: true })
    ], RecordEntity.prototype, "tipoZona");
    __decorate([
        typeorm_1.Column({ name: 'NUMERO', length: 15, nullable: true })
    ], RecordEntity.prototype, "numero");
    __decorate([
        typeorm_1.Column({ name: 'INTERIOR', length: 15, nullable: true })
    ], RecordEntity.prototype, "interior");
    __decorate([
        typeorm_1.Column({ name: 'LOTE', length: 15, nullable: true })
    ], RecordEntity.prototype, "lote");
    __decorate([
        typeorm_1.Column({ name: 'DEPARTAMENTO', length: 15, nullable: true })
    ], RecordEntity.prototype, "departamento");
    __decorate([
        typeorm_1.Column({ name: 'MANZANA', length: 15, nullable: true })
    ], RecordEntity.prototype, "manzana");
    __decorate([
        typeorm_1.Column({ name: 'KILOMETRO', length: 15, nullable: true })
    ], RecordEntity.prototype, "kilometro");
    RecordEntity = __decorate([
        typeorm_1.Entity('Contribuyentes')
    ], RecordEntity);
    return RecordEntity;
}());
exports.RecordEntity = RecordEntity;
