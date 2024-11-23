import { envConfig } from '../config/envConfig';
import path from 'path';
import appRoot from 'app-root-path';
import fs from 'fs';
import { parentPort } from 'worker_threads';
import { bufferSizeCalculator } from '../utils';

interface IData {
    port: MessagePort;
    result: string[];
    index: number;
}
interface ItemObject {
    RUC: string;
    NOMBRE_O_RAZON_SOCIAL: string;
    ESTADO_DEL_CONTRIBUYENTE: string;
    CONDICION_DE_DOMICILIO: string;
    UBIGEO: string;
    TIPO_DE_VIA: string;
    NOMBRE_DE_VIA: string;
    CODIGO_DE_ZONA: string;
    TIPO_DE_ZONA: string;
    NUMERO: string;
    INTERIOR: string;
    LOTE: string;
    DEPARTAMENTO: string;
    MANZANA: string;
    KILOMETRO: string;
 }
if (!parentPort) throw new Error('Worker must run in a worker thread.');



// Función para analizar una línea en un objeto.
function parseLineToObject(line: string): ItemObject {
    const [
        RUC,
        NOMBRE_O_RAZON_SOCIAL,
        ESTADO_DEL_CONTRIBUYENTE,
        CONDICION_DE_DOMICILIO,
        UBIGEO,
        TIPO_DE_VIA,
        NOMBRE_DE_VIA,
        CODIGO_DE_ZONA,
        TIPO_DE_ZONA,
        NUMERO,
        INTERIOR,
        LOTE,
        DEPARTAMENTO,
        MANZANA,
        KILOMETRO
    ] = line.split('|');
    return {
        RUC: RUC.trim(),
        NOMBRE_O_RAZON_SOCIAL: NOMBRE_O_RAZON_SOCIAL.trim(),
        ESTADO_DEL_CONTRIBUYENTE: ESTADO_DEL_CONTRIBUYENTE.trim(),
        CONDICION_DE_DOMICILIO: CONDICION_DE_DOMICILIO.trim(),
        UBIGEO: UBIGEO.trim(),
        TIPO_DE_VIA: TIPO_DE_VIA.trim(),
        NOMBRE_DE_VIA: NOMBRE_DE_VIA.trim(),
        CODIGO_DE_ZONA: CODIGO_DE_ZONA.trim(),
        TIPO_DE_ZONA: TIPO_DE_ZONA.trim(),
        NUMERO: NUMERO.trim(),
        INTERIOR: INTERIOR.trim(),
        LOTE: LOTE.trim(),
        DEPARTAMENTO: DEPARTAMENTO.trim(),
        MANZANA: MANZANA.trim(),
        KILOMETRO: KILOMETRO.trim(),
    };
}
async function writeStreamAsync(writeStream: fs.WriteStream, data: string[]){
    const buffer: string[] = [];
    for (const line of data) {
        const processedResult = parseLineToObject(line);
        buffer.push(JSON.stringify(processedResult));

        // Si el buffer alcanza un tamaño determinado, escribe el contenido en el stream
        if (buffer.length >= 12000) { // Puedes ajustar este valor
            await new Promise<void>((resolve, reject) => {
                writeStream.write(buffer.join('\n') + '\n', 'utf-8', (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
            buffer.length = 0; // Limpiar el buffer después de escribir
        }
    }

  // Escribe cualquier dato restante en el buffer
    if (buffer.length > 0) {
        await new Promise<void>((resolve, reject) => {
            writeStream.write(buffer.join('\n') + '\n', 'utf-8', (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }
}

function mensaje(index: number): string {
    return `Procesado thread ${index} `;
}


parentPort?.on('message', async(data: IData) => {
    const { port, index, result } = data;

    const outputFile = path.join(appRoot.path,`${envConfig.metadataDirectoryPath}/processedResults-${index}.json`);
    const writeStream = fs.createWriteStream(outputFile, { encoding: 'utf-8',highWaterMark: bufferSizeCalculator.calculateBufferSize() });
    await writeStreamAsync(writeStream, result);
    writeStream.end();
    writeStream.on('finish', () => {});

    port.postMessage(mensaje(index));
});