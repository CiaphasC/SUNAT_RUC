import {DataSource} from 'typeorm';
import {Record} from '../entities/Record';
import {envConfig} from './envConfig';
export const AppDataSource = new DataSource({
   type: 'mssql',
   host: envConfig.db.host,
   port: 1433,
   username: envConfig.db.username,
   password: envConfig.db.password,
   database: envConfig.db.database,
   entities: [Record],
   synchronize: true,
   options: {
      encrypt: false,
      trustServerCertificate: true, // Esto ayuda a evitar errores de SSL
   },
});