# 🌐 **SUNAT RUC Processor**

![SUNAT RUC Processor]([https://via.placeholder.com/728x90.png?text=SUNAT+RUC+Processor+Logo](https://github.com/CiaphasC/SUNAT_RUC/blob/main/assets/logo.webp))

> 💼 Procesamiento automatizado y eficiente del padrón reducido de la SUNAT con actualizaciones en tiempo real y gestión avanzada de bases de datos.

---

## 🚀 **Características principales**

- **📥 Descarga Automática**: Descarga y descompresión automática del archivo del padrón reducido de la SUNAT.
- **🔄 Monitoreo de Cambios**: Observador activo de cambios en los metadatos del archivo.
- **⚡ Procesamiento en Paralelo**: División de tareas en hilos para un procesamiento eficiente de grandes volúmenes de datos.
- **💾 Base de Datos Integrada**: Sincronización con bases de datos SQL Server para almacenar información de contribuyentes.
- **⚙️ Configuración Flexible**: Variables de entorno personalizables para adaptarse a diferentes entornos de desarrollo y producción.

---

## 🛠 **Tecnologías Utilizadas**

![Node.js](https://img.shields.io/badge/Node.js-16.x-green?logo=node.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript) ![RxJS](https://img.shields.io/badge/RxJS-7.x-red?logo=rxjs) ![TypeORM](https://img.shields.io/badge/TypeORM-0.3.x-orange)

- **Node.js** y **TypeScript**: Backend robusto y tipado.
- **RxJS**: Manejo reactivo de datos.
- **TypeORM**: Gestor ORM para bases de datos SQL Server.
- **Axios**: Cliente HTTP para descargas eficientes.
- **Stream-JSON**: Manejo de flujos para procesar archivos de gran tamaño.

---

## 🧩 **Configuración del Entorno**

Crea un archivo `.env` en la raíz del proyecto con la siguiente configuración:

```env
# URL del archivo SUNAT
SUNAT_URL=http://www2.sunat.gob.pe/padron_reducido_ruc.zip

# RUTAS DE DIRECTORIO DONDE SE GUARDARÁ EL ARCHIVO DESCARGADO
DOWNLOAD_DIRECTORY_PATH=./data
META_DATA_DIRECTORY_PATH=./metadata

# ARCHIVOS ESPECÍFICOS A GUARDAR
DOWNLOADED_ZIP_FILENAME=padron_reducido_ruc.zip
HEADER_METADATA_JSON_FILENAME=sunatFileMetadata.json
HEADER_MEDADATA_JSON_CHANGE_FILENAME=sunatFileMetadataAudit.json

# CONFIGURACIÓN DE LA BASE DE DATOS
DB_HOST=BRAD
DB_NAME=BD_RegistrosPublicos
DB_USERNAME=soporte
DB_PASSWORD=soporte

# ENTORNO DE DESARROLLO
NODE_ENV=production
```

---

## 🏗 **Instalación y Uso**

1. **Clonar el repositorio**:

   ```bash
   git clone https://github.com/CiaphasC/SUNAT_RUC
   cd SUNAT_RUC
   ```

2. **Instalar dependencias**:

   ```bash
   yarn install
   ```

3. **Iniciar la aplicación**:

   - En entorno de desarrollo:
     ```bash
     yarn start
     ```

   - Construir para producción:
     ```bash
     yarn build && node dist/main.js
     ```

---

## 🗂 **Estructura del Proyecto**

```plaintext
src/
├── common/                # Módulos comunes
├── config/                # Configuración
├── controllers/           # Controladores
├── data/                  # Entidades y repositorios
├── infrastructure/        # Servicios de infraestructura
├── services/              # Servicios principales
├── utils/                 # Utilidades
├── workers/               # Hilos de procesamiento
├── main.ts                # Punto de entrada principal
```

---

## 🌟 **Funcionalidades Clave**

### 📥 **Descarga y Procesamiento**

🚀El sistema descarga automáticamente el archivo del padrón reducido, lo descomprime y procesa los datos en paralelo, garantizando alta eficiencia incluso para volúmenes grandes de datos.

### 💾 **Integración con SQL Server**

🔗Utiliza TypeORM para sincronizar y gestionar datos en una base de datos SQL Server, asegurando consistencia y escalabilidad.

### 🔍 **Observación de Cambios**

🔄Monitoriza los metadatos de los archivos para detectar cambios y ejecutar procesos automáticamente cuando sea necesario.

---

## 📜 **Scripts Disponibles**

- **`yarn start`**: Inicia la aplicación en modo desarrollo.
- **`yarn build`**: Compila el proyecto a JavaScript.
- **`yarn compiler`**: Compila código TypeScript sin ejecutar.

---


---

## 📄 **Licencia**

Este proyecto está bajo la licencia [MIT](LICENSE).

---

## 📧 **Contacto**

**Autor:** Brad  
**Email:** devmaster.learning@gmail.com

---

![Footer](https://via.placeholder.com/728x90.png?text=Gracias+por+usar+SUNAT+RUC+Processor)

