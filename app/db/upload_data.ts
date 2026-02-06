import * as admin from 'firebase-admin';
import * as fs from 'fs';

const serviceAccount = require('./firebaseConfig');

console.log('Service Account Loaded:', typeof serviceAccount, serviceAccount ? Object.keys(serviceAccount).length : 'null');

try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
} catch (error) {
    console.error("Error al inicializar Firebase Admin SDK:", error);
    process.exit(1); // Sale del script si la inicialización falla
}

const db = admin.firestore();

// --- CORRECCIÓN AQUI: Obtener el projectId directamente de serviceAccount ---
// En lugar de admin.app().options.projectId, lo obtenemos directamente del objeto que cargamos.
const projectId = serviceAccount.project_id;
console.log(`Proyecto de Firestore conectado: ${projectId}`);
// --- FIN DE CORRECCIÓN ---


// --- BLOQUE DE PRUEBA: INTENTAR UNA ESCRITURA SIMPLE ---
async function testFirestoreWrite() {
    console.log("Intentando una escritura de prueba simple a Firestore...");
    const testDocRef = db.collection("test_uploads").doc("test_document");
    try {
        await testDocRef.set({ timestamp: admin.firestore.FieldValue.serverTimestamp(), test_value: "hello" });
        console.log("Escritura de prueba exitosa a 'test_uploads/test_document'.");
        return true;
    } catch (error) {
        console.error("ERROR: Falló la escritura de prueba simple:", error);
        console.error("Esto probablemente indica un problema con los permisos IAM o la configuración de la cuenta de servicio.");
        return false;
    }
}
// --- FIN BLOQUE DE PRUEBA ---


async function uploadDataFromJson(filepath: string, collectionName: string) {
    console.log(`Intentando leer el archivo: ${filepath}`);
    let fileContent;
    try {
        fileContent = fs.readFileSync(filepath, 'utf-8');
        console.log(`Archivo '${filepath}' leído exitosamente.`);
    } catch (error) {
        console.error(`Error al leer el archivo ${filepath}:`, error);
        return; // Detener la ejecución si el archivo no se puede leer
    }

    const words = fileContent.split('\n')
                             .map(word => word.trim())
                             .filter(Boolean);

    let batch = db.batch();
    let count = 0;

    console.log(`Iniciando la carga de ${words.length} palabras a la colección '${collectionName}' desde '${filepath}'...`);


    for (const word of words) {
        if (!word) {
            continue;
        }

        const docRef = db.collection(collectionName).doc(word);
        batch.set(docRef, {});
        count++;

        if (count % 500 === 0){ // Mantendremos 500 para el batch para no cambiar mucho
            console.log(`Commiting batch #${count / 500} con ${count} palabras...`);
            try {
                await batch.commit();
                console.log(`${count} palabras cargadas exitosamente.`);
                batch = db.batch(); // Inicia un nuevo batch
            } catch (error) {
                console.error(`ERROR: Falló el commit del batch después de ${count} palabras:`, error);
                throw error; // Relanza el error para que el .catch() final lo capture
            }
        }
    }


    if (count % 500 !== 0 || words.length === 0) {
        console.log(`Commiting el batch final con ${count} palabras...`);
        try {
            await batch.commit();
            console.log(`Total de ${count} palabras cargadas.`);
        } catch (error) {
            console.error(`ERROR: Falló el commit del batch final:`, error);
            throw error; // Relanza el error
        }
    }

    console.log(`Carga completa de ${collectionName}.`);
}

// Llama primero a la función de prueba
(async () => {
    const testSuccess = await testFirestoreWrite();
    if (testSuccess) {
        console.log("La prueba de escritura fue exitosa. Procediendo con la carga de datos principal.");
        // Asegúrate de que la ruta sea correcta para tu entorno
        await uploadDataFromJson('/words/six_letter_words.txt', 'valid_words');
    } else {
        console.error("La prueba de escritura falló. NO se procederá con la carga de datos principal.");
    }
})().catch(console.error);

