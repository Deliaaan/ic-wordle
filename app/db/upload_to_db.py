import firebase_admin
from firebase_admin import credentials, firestore

# 1. Inicializar Firebase
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

def upload_words(file_path, collection_name):
    # Abrir el archivo .txt
    with open(file_path, 'r', encoding='utf-8') as f:
        # Leer líneas, quitar espacios/saltos de línea y filtrar vacíos
        words = [line.strip().lower() for line in f if line.strip()]

    total_words = len(words)
    print(f"Total de palabras a subir: {total_words}")

    # Firestore permite máximo 500 escrituras por batch
    batch_size = 500
    for i in range(0, total_words, batch_size):
        batch = db.batch()
        chunk = words[i : i + batch_size]
        
        for word in chunk:
            # Creamos una referencia de documento nueva
            # 'word_id' puede ser la palabra misma para evitar duplicados
            doc_ref = db.collection(collection_name).document(word)
            batch.set(doc_ref, {
                'texto': word,
                'longitud': len(word)
            })
        
        # Ejecutar el lote
        batch.commit()
        print(f"Progreso: {min(i + batch_size, total_words)} / {total_words}")

    print("¡Carga completada con éxito!")

# Ejecutar la función
if __name__ == "__main__":
    # Asegúrate de que 'palabras.txt' esté en la misma carpeta
    upload_words("D:/repos/ic-wordle/words/db_test.txt", "valid_words")