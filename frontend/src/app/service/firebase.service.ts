import { Injectable } from '@angular/core';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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
}
