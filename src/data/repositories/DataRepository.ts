import { Repository, DataSource  } from 'typeorm';
import { RecordEntity } from '../';
import { AppDataSource } from '../../config/Database';
class DataRepository {
   private repository: Repository<RecordEntity>;
   private dataSource: DataSource;
   constructor() {
     // Inicializamos el repositorio usando AppDataSource
      AppDataSource.initialize()
         .then(() => console.log('Data Source Initialized'))
         .catch((error) => console.error('Error initializing data source:', error));
      this.repository = AppDataSource.getRepository(RecordEntity);
      this.dataSource = AppDataSource;
   }
   /**
   * Inserta nuevos datos en la base de datos.
   * @param data Array de entidades RecordEntity a insertar.
   */
   public async insertData(data: RecordEntity[]): Promise<void> {
      try {
         await this.repository.insert(data); // Inserta o actualiza registros.
      } catch (error) {
         console.error('Error al insertar datos:', error);
         throw error;
      }
   }
   public async truncateData():Promise<void>{
      try {
         const tableName = this.dataSource.getMetadata(RecordEntity).tableName;
         await this.dataSource.query(`TRUNCATE TABLE ${tableName}`); // Usa query directamente
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
   * Actualiza los datos en la base de datos, eliminando primero los existentes.
   * @param data Array de entidades RecordEntity con los datos actualizados.
   */
   public async updateData(data: RecordEntity[]): Promise<void> {
      try {
        await this.deleteData(); // Limpia la tabla primero.
        await this.insertData(data); // Inserta los nuevos datos.
      } catch (error) {
         console.error('Error al actualizar datos:', error);
         throw error;
      }
   }
   /**
   * Obtiene todos los registros de la tabla.
   * @returns Array de registros.
   */
   async getAllRecords(): Promise<RecordEntity[]> {
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
   async findByCriteria(criteria: Partial<RecordEntity>): Promise<RecordEntity[]> {
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
         if (AppDataSource.isInitialized) {
            await AppDataSource.destroy(); // Desconecta el DataSource
            console.log('[INFO] Conexión con la base de datos cerrada.');
         }
      } catch (error) {
         console.error('[ERROR] Error al liberar recursos:', error);
      }
   }
}

export const dataRepository = new DataRepository();