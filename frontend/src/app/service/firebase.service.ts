import { Injectable } from '@angular/core';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { environment } from '../enviroment/environment';
import { GlobalVariables } from '../shared/global-variables';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private firebaseApp = initializeApp(environment.firebase);
  private storage = getStorage(this.firebaseApp);

  constructor() {}

  /** Sube una imagen a Firebase Storage */
  async uploadImage(
    file: File,
    path: string = GlobalVariables.apiEndpoints.products.defaultFolder
  ): Promise<string> {
    const storageRef = ref(this.storage, `${path}/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref);
  }

  /** Elimina una imagen de Firebase Storage */
  async deleteImage(imageUrl: string): Promise<void> {
    try {
      // Usamos la URL base global
      const baseUrl = GlobalVariables.firebaseStorageBaseUrl;
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
