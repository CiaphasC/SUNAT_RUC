import { Repository, QueryRunner   } from 'typeorm';
import { Contribuyentes } from '../';
import { appDataSource } from '../../config/Database';

class DataRepository {
   private repository: Repository<Contribuyentes>;
   private queryRunner: QueryRunner|null=null;
   constructor() {
      if (!appDataSource.getInstance().isInitialized) {
         console.log('[INFO] Inicializando DataSource...');
         appDataSource.getInstance().initialize()
            .then(() => console.log('[INFO] DataSource inicializado correctamente.'))
            .catch((error) => {
               console.error('[ERROR] Error al inicializar DataSource:', error);
               throw error;
            });
      }
      this.repository = appDataSource.getInstance().getRepository(Contribuyentes);
   }

   public async ensureQueryRunner(): Promise<void> {
      const appDataSourceInstance = appDataSource.getInstance();
      // Verifica si el DataSource está inicializado y la conexión es válida
      if (!appDataSourceInstance.isInitialized) {
         console.log('[INFO] Reconectando a la base de datos...');
         await appDataSourceInstance.initialize();
         console.log('[INFO] Conexión restablecida.');
      } else {
         try {
            // Verifica que la conexión siga activa
            await appDataSourceInstance.query('SELECT 1');
         } catch (error) {
            console.log('[ERROR] La conexión parece estar cerrada. Intentando reiniciar...');
            await appDataSourceInstance.initialize(); // Reestablece la conexión
         }
      }
      // Verifica el estado del QueryRunner
      if (!this.queryRunner || this.queryRunner.isReleased) {
         console.log('[INFO] Inicializando nuevo QueryRunner...');
         this.queryRunner = appDataSourceInstance.createQueryRunner();
      }
   }
   /**
   * Inserta nuevos datos en la base de datos.
   * @param data Array de entidades Contribuyentes a insertar.
   */

   public async insertData(data: Contribuyentes[], queryRunner: QueryRunner): Promise<void> {
      try {
         await queryRunner.manager
            .createQueryBuilder()
            .insert()
            .into(Contribuyentes)
            .values(data)
            .execute();
      } catch (error) {
         if (queryRunner.isTransactionActive) {
            await queryRunner.rollbackTransaction(); // Revertir la transacción si hay error
         }
         console.error('[ERROR] Error al insertar datos:', error);
         throw error;
      }
   }
   public async truncateData():Promise<void>{
      try {
         const tableName = appDataSource.getInstance().getMetadata(Contribuyentes).tableName;
         await appDataSource.getInstance().query(`TRUNCATE TABLE ${tableName}`);// Usa query directamente
         console.log(`Tabla '${tableName}' truncada con éxito.`);
      } catch (error) {
         console.error('Error al truncar la tabla:', error);
         throw error;
      }
   }
   /**
   * Elimina todos los datos existentes en la tabla.
   */
   public async deleteData(): Promise<void> {
      try {
         await this.repository.clear(); // Limpia todos los registros de la tabla.
      } catch (error) {
         console.error('Error al eliminar datos:', error);
         throw error;
      }
   }
   /**
   * Obtiene todos los registros de la tabla.
   * @returns Array de registros.
   */
   async getAllRecords(): Promise<Contribuyentes[]> {
      try {
         return await this.repository.find();
      } catch (error) {
         console.error('Error al obtener registros:', error);
         throw error;
      }
   }
   /**
   * Encuentra registros por criterio.
   * @param criteria Criterios de búsqueda.
   * @returns Array de registros que cumplen con el criterio.
   */
   async findByCriteria(criteria: Partial<Contribuyentes>): Promise<Contribuyentes[]> {
      try {
         return await this.repository.find({ where: criteria });
      } catch (error) {
         console.error('Error al buscar registros:', error);
         throw error;
      }
   }
   public async cleanup(): Promise<void> {
      console.log('[INFO] Liberando recursos...');
      try {
         // Cerrar conexión con la base de datos, si está activa
         if (appDataSource.getInstance().isInitialized) {
            appDataSource.getInstance().destroy(); // Desconecta el DataSource
            console.log('[INFO] Conexión con la base de datos cerrada.');
         }
      } catch (error) {
         console.error('[ERROR] Error al liberar recursos:', error);
      }
   }
}

export const dataRepository = new DataRepository();