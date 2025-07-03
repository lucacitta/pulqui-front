import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseStorageService {

  constructor(
    private _storage: AngularFireStorage
  ) { }

  // Subir archivo a firebase storage.
  /**
   * 
   * @param file archivo
   * @param path ruta de guardado
   * @returns Promese string con la url dónde de guardó el archivo
   */
  uploadFile(file: any, path: any): Promise<string> {

    const fileRef = this._storage.ref(path);

    // Upload image
    const task = this._storage.upload(path, file);

    // Observe percentage changes
    // this.uploadProgress.push(task.percentageChanges());

    // Wait for the upload to complete and get the download URL
    return new Promise((resolve, reject) => {
      task.snapshotChanges().pipe(
        finalize(async () => {
          try {
            const downloadURL = await fileRef.getDownloadURL().toPromise();
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        })
      ).subscribe();
    });
  }
}
