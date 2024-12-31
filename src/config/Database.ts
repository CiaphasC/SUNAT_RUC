import 'reflect-metadata';
import {DataSource} from 'typeorm';
import {Contribuyentes} from '../data/entities/Contribuyentes';
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
            entities: [Contribuyentes],
            logging: false,
            synchronize: process.env.NODE_ENV === 'production' ? false : true,
            options: {
               encrypt: true,
               trustServerCertificate: true, // Esto ayuda a evitar errores de SSL
            },pool: {
               max: 150, // Número máximo de conexiones
               min: 5,  // Número mínimo de conexiones
               idleTimeoutMillis: 600000 // Tiempo de espera antes de cerrar una conexión inactiva
            },
            connectionTimeout: 290000, // Aumentar el tiempo de conexión
            requestTimeout: 550000,
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
