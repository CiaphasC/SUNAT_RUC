import { Repository } from 'typeorm';
import { RecordEntity } from '../';
import { AppDataSource } from '../../config/Database';
class DataRepository {
   private repository: Repository<RecordEntity>;

   constructor() {
     // Inicializamos el repositorio usando AppDataSource
      AppDataSource.initialize()
         .then(() => console.log('Data Source Initialized'))
         .catch((error) => console.error('Error initializing data source:', error));
      this.repository = AppDataSource.getRepository(RecordEntity);
   }
   /**
   * Inserta nuevos datos en la base de datos.
   * @param data Array de entidades RecordEntity a insertar.
   */
   public async insertData(data: RecordEntity[]): Promise<void> {
      try {
         await this.repository.save(data); // Inserta o actualiza registros.
      } catch (error) {
         console.error('Error al insertar datos:', error);
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
}

export const dataRepository = new DataRepository();