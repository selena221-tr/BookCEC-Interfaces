import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Tus credenciales reales del proyecto bookcec-app-v2
const firebaseConfig = {
  apiKey: "AIzaSyCDWYlOGFemZdqQ_jrYCl1tJV1WEyQ1AYE",
  authDomain: "bookcec-app-v2.firebaseapp.com",
  projectId: "bookcec-app-v2",
  storageBucket: "bookcec-app-v2.firebasestorage.app",
  messagingSenderId: "429232419616",
  appId: "1:429232419616:web:7a4ad1c85edc1d7660dd45"
};

// Inicializar la aplicación de Firebase
const app = initializeApp(firebaseConfig);

// Exportar los servicios para usarlos en toda la aplicación
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;