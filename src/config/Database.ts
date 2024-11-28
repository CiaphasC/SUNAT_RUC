import {DataSource} from 'typeorm';
import {RecordEntity} from '../data/entities/RecordEntity';
import {envConfig} from './envConfig';
export const AppDataSource = new DataSource({
   type: 'mssql',
   host: envConfig.db.host,
   port: 1433,
   username: envConfig.db.username,
   password: envConfig.db.password,
   database: envConfig.db.database,
   entities: [RecordEntity],
   logging: false,
   synchronize: true,
   options: {
      encrypt: false,
      trustServerCertificate: true, // Esto ayuda a evitar errores de SSL
   },
});