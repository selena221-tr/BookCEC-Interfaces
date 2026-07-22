import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION_NAME = "libros";

export function subscribeToBooks(callback) {
  const q = query(collection(db, COLLECTION_NAME), orderBy("id"));
  return onSnapshot(q, (snapshot) => {
    const books = snapshot.docs.map((d) => ({
      firestoreId: d.id,
      ...d.data(),
    }));
    callback(books);
  });
}

export function subscribeToUserBooks(userId, callback) {
  const q = query(
    collection(db, COLLECTION_NAME),
    where("user_id", "==", userId)
  );
  return onSnapshot(q, (snapshot) => {
    const books = snapshot.docs
      .map((d) => ({
        firestoreId: d.id,
        ...d.data(),
      }))
      .sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
    callback(books);
  });
}

export async function getBooks() {
  const snapshot = await getDocs(collection(db, COLLECTION_NAME));
  return snapshot.docs.map((d) => ({
    firestoreId: d.id,
    ...d.data(),
  }));
}

export async function addBook(bookData) {
  const snapshot = await getDocs(collection(db, COLLECTION_NAME));
  const maxId = snapshot.docs.reduce((max, d) => {
    const data = d.data();
    return data.id > max ? data.id : max;
  }, 0);

  const newBook = {
    id: maxId + 1,
    nombre: bookData.nombre,
    nivel: bookData.nivel,
    condicion: bookData.condicion,
    precio: Number(bookData.precio),
    estado: "Disponible",
    imagen: bookData.imagen || "",
    user_id: bookData.user_id || null,
    createdAt: new Date().toISOString(),
  };

  const docRef = await addDoc(collection(db, COLLECTION_NAME), newBook);
  return { firestoreId: docRef.id, ...newBook };
}

export async function updateBook(firestoreId, bookData) {
  const bookRef = doc(db, COLLECTION_NAME, firestoreId);
  const updateData = {
    nombre: bookData.nombre,
    nivel: bookData.nivel,
    condicion: bookData.condicion,
    precio: Number(bookData.precio),
  };
  if (bookData.estado) updateData.estado = bookData.estado;
  if (bookData.imagen) updateData.imagen = bookData.imagen;
  await updateDoc(bookRef, updateData);
}

export async function deleteBook(firestoreId) {
  await deleteDoc(doc(db, COLLECTION_NAME, firestoreId));
}

export async function buyBook(firestoreId, currentStatus, buyerUid = null, buyerName = null) {
  if (currentStatus !== "Disponible") return null;
  const bookRef = doc(db, COLLECTION_NAME, firestoreId);
  const updateData = { estado: "Vendido" };
  if (buyerUid) updateData.comprador_uid = buyerUid;
  if (buyerName) updateData.comprador_nombre = buyerName;
  updateData.vendidoEn = new Date().toISOString();
  await updateDoc(bookRef, updateData);
}

export async function changeBookStatus(firestoreId, nuevoEstado) {
  const validStates = ["Disponible", "Pendiente", "Vendido"];
  if (!validStates.includes(nuevoEstado)) return null;
  const bookRef = doc(db, COLLECTION_NAME, firestoreId);
  await updateDoc(bookRef, { estado: nuevoEstado });
}
