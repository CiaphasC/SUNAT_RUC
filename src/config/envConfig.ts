import dotenv from 'dotenv';
dotenv.config();

export const envConfig = {
   sunatUrl: process.env.SUNAT_URL || 'http://www2.sunat.gob.pe/padron_reducido_ruc.zip',
   // Rutas de directorios
   downloadDirectoryPath: process.env.DOWNLOAD_DIRECTORY_PATH || './data',
   metadataDirectoryPath: process.env.META_DATA_DIRECTORY_PATH || '../metadata',
   // Archivos específicos
   downloadedZipFileName: process.env.DOWNLOADED_ZIP_FILENAME,
   headerMetadataJsonFileName: process.env.HEADER_METADATA_JSON_FILENAME,
   headerMetadataAuditJsonFileName: process.env.HEADER_MEDADATA_JSON_CHANGE_FILENAME,
   //
   downloadIntervalDays: 3,
   //BASE DE DATOS
   db:{
      host: process.env.DB_HOST,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
   },
};

