import 'reflect-metadata';
import {DataSource} from 'typeorm';
import {RecordEntity} from '../data/entities/RecordEntity';
import {envConfig} from './envConfig';
class AppDataSource {
   private static instance: DataSource;

   public static getInstance(): DataSource {
      if (!AppDataSource.instance) {
         AppDataSource.instance = new DataSource({
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
            },pool: {
               max: 40, // Número máximo de conexiones
               min: 0,  // Número mínimo de conexiones
               idleTimeoutMillis: 100000 // Tiempo de espera antes de cerrar una conexión inactiva
            },
            connectionTimeout: 100000, // Aumentar el tiempo de conexión
            requestTimeout: 400000,
         });
      }
      return AppDataSource.instance;
   }

   public static async initialize(): Promise<void> {
      const dataSource = AppDataSource.getInstance();
      if (!dataSource.isInitialized) {
         await dataSource.initialize();
         console.log("[INFO] Base de datos inicializada.");
      }
   }

   public static async close(): Promise<void> {
      const dataSource = AppDataSource.getInstance();
      if (dataSource.isInitialized) {
         await dataSource.destroy();
         console.log("[INFO] Conexión a la base de datos cerrada.");
      }
   }
}

export const appDataSource = AppDataSource;
