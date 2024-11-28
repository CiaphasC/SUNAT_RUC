"use strict";
exports.__esModule = true;
exports.AppDataSource = void 0;
var typeorm_1 = require("typeorm");
var RecordEntity_1 = require("../data/entities/RecordEntity");
var envConfig_1 = require("./envConfig");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'mssql',
    host: envConfig_1.envConfig.db.host,
    port: 1433,
    username: envConfig_1.envConfig.db.username,
    password: envConfig_1.envConfig.db.password,
    database: envConfig_1.envConfig.db.database,
    entities: [RecordEntity_1.RecordEntity],
    logging: false,
    synchronize: true,
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
});
