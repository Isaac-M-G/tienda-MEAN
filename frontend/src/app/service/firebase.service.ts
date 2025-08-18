import { Injectable } from '@angular/core';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { environment } from '../enviroment/environment';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private firebaseApp = initializeApp(environment.firebase);
  private storage = getStorage(this.firebaseApp);

  constructor() {}

  async uploadImage(file: File, path: string = 'products'): Promise<string> {
    const storageRef = ref(this.storage, `${path}/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref);
  }

  async deleteImage(imageUrl: string): Promise<void> {
    try {
      // ⚠️ Necesitas el path relativo del archivo en storage
      const baseUrl = `https://firebasestorage.googleapis.com/v0/b/${environment.firebase.storageBucket}/o/`;
      const filePath = decodeURIComponent(
        imageUrl.replace(baseUrl, '').split('?')[0]
      );

      const fileRef = ref(this.storage, filePath);
      await deleteObject(fileRef);
      console.log('Imagen eliminada de Firebase:', filePath);
    } catch (error) {
      console.error('Error eliminando la imagen de Firebase:', error);
    }
  }
}
