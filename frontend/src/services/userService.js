import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION_NAME = "usuarios";

export function subscribeToUsuarios(callback) {
  const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt"));
  return onSnapshot(q, (snapshot) => {
    const usuarios = snapshot.docs.map((d) => ({
      firestoreId: d.id,
      ...d.data(),
    }));
    callback(usuarios);
  });
}

export async function getUsuarios() {
  const snapshot = await getDocs(collection(db, COLLECTION_NAME));
  return snapshot.docs.map((d) => ({
    firestoreId: d.id,
    ...d.data(),
  }));
}

export async function updateUsuario(firestoreId, data) {
  const userRef = doc(db, COLLECTION_NAME, firestoreId);
  const updateData = {};
  if (data.nombre !== undefined) updateData.nombre = data.nombre;
  if (data.rol !== undefined) updateData.rol = data.rol;
  if (data.estado !== undefined) updateData.estado = data.estado;
  await updateDoc(userRef, updateData);
}

export async function deleteUsuario(firestoreId) {
  await deleteDoc(doc(db, COLLECTION_NAME, firestoreId));
}
