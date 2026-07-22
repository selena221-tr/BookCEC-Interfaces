import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  writeBatch,
  runTransaction,
} from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION_NAME = "peticiones";
const BOOKS_COLLECTION = "libros";

// El comprador solicita un libro
export async function crearPeticion({
  libroFirestoreId,
  libroNombre,
  vendedorId,
  compradorUid,
  compradorNombre,
}) {
  // Evita que el mismo usuario pida el mismo libro dos veces mientras esté pendiente
  const q = query(
    collection(db, COLLECTION_NAME),
    where("libroFirestoreId", "==", libroFirestoreId),
    where("compradorUid", "==", compradorUid),
    where("estado", "==", "pendiente")
  );
  const existentes = await getDocs(q);
  if (!existentes.empty) {
    throw new Error("Ya tienes una solicitud pendiente para este libro.");
  }

  const bookRef = doc(db, BOOKS_COLLECTION, libroFirestoreId);
  const peticionRef = doc(collection(db, COLLECTION_NAME));

  // Transacción: verifica que el libro siga "Disponible" y lo marca "Pendiente"
  // junto con la creación de la petición, todo o nada.
  await runTransaction(db, async (transaction) => {
    const bookSnap = await transaction.get(bookRef);
    if (!bookSnap.exists()) {
      throw new Error("El libro ya no existe.");
    }
    const bookData = bookSnap.data();
    if (bookData.estado !== "Disponible") {
      throw new Error("Este libro ya no está disponible (alguien más lo solicitó o ya fue vendido).");
    }

    transaction.set(peticionRef, {
      libroFirestoreId,
      libroNombre,
      vendedorId,
      compradorUid,
      compradorNombre,
      estado: "pendiente",
      createdAt: new Date().toISOString(),
    });

    transaction.update(bookRef, { estado: "Pendiente" });
  });
}

// El vendedor escucha en tiempo real TODAS las peticiones de sus libros
export function subscribeToPeticionesVendedor(vendedorId, callback) {
  const q = query(
    collection(db, COLLECTION_NAME),
    where("vendedorId", "==", vendedorId),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((d) => ({ firestoreId: d.id, ...d.data() })));
  });
}

// El vendedor acepta: marca el libro como Vendido (CONFIRMACIÓN DE VENTA)
// y rechaza las demás peticiones pendientes de ese libro (por seguridad, aunque
// normalmente solo puede existir una petición pendiente a la vez por libro).
export async function aceptarPeticion(peticion) {
  const batch = writeBatch(db);

  batch.update(doc(db, COLLECTION_NAME, peticion.firestoreId), { estado: "aceptada" });

  const q = query(
    collection(db, COLLECTION_NAME),
    where("libroFirestoreId", "==", peticion.libroFirestoreId),
    where("estado", "==", "pendiente")
  );
  const otras = await getDocs(q);
  otras.docs.forEach((d) => {
    if (d.id !== peticion.firestoreId) {
      batch.update(doc(db, COLLECTION_NAME, d.id), { estado: "rechazada" });
    }
  });

  batch.update(doc(db, BOOKS_COLLECTION, peticion.libroFirestoreId), {
    estado: "Vendido",
    comprador_uid: peticion.compradorUid,
    comprador_nombre: peticion.compradorNombre,
    vendidoEn: new Date().toISOString(),
  });

  await batch.commit();
}

// El vendedor rechaza una petición puntual → el libro vuelve a "Disponible"
export async function rechazarPeticion(peticion) {
  const batch = writeBatch(db);

  batch.update(doc(db, COLLECTION_NAME, peticion.firestoreId), { estado: "rechazada" });
  batch.update(doc(db, BOOKS_COLLECTION, peticion.libroFirestoreId), {
    estado: "Disponible",
  });

  await batch.commit();
}