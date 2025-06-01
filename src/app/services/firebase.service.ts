import { Injectable } from '@angular/core';
import { getDatabase, ref, set, get, update, remove, push, child, onValue } from 'firebase/database';
import { initializeApp } from "firebase/app";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'; 
import { Observable } from 'rxjs';
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  db: any;
  storage: any;

  constructor() {
    this.setupFirebase();  
    this.db = getDatabase();    
    this.storage = getStorage();
  }
  
        // on click ==> on value changes ==> callback when data is recived we latch ==> proccess data

        
      setupFirebase(){ //got from FB
        const firebaseConfig = {
          apiKey: "AIzaSyDjMxGJHxPIQ4SSap_KLhKPzj3prIJfe6U",
          authDomain: "ospro-ff232.firebaseapp.com",
          databaseURL: "https://ospro-ff232-default-rtdb.firebaseio.com",
          projectId: "ospro-ff232",
          storageBucket: "ospro-ff232.appspot.com",
          messagingSenderId: "144185506544",
          appId: "1:144185506544:web:fc28a2dc82a0e495bc2035",
          measurementId: "G-S941Q680ZV"
        };
        
        initializeApp(firebaseConfig);
        const auth = getAuth(initializeApp(firebaseConfig));
      }                 

      createObject(path: string, data: any) {
        return set(ref(this.db, path), data);
      }

      async readObject(path: string, key: string): Promise<string>{
        return get(child(ref(this.db), `${path}/${key}`)).then((snapshot) => {
          if (snapshot.exists()) return snapshot.val(); 
        })      
       }

      updateObject(path: string, key: string, data: any) { //wrapping service
        update(ref(this.db, `${path}/${key}`), data);
      }

      deleteObject(path: string, key: string){
        remove(ref(this.db, `${path}/${key}`));
      }

      async readList(path: string): Promise<any[]> {
        const snapshot = await get(ref(this.db, path));
        const list: any[] = [];
        snapshot.forEach(childSnapshot => {
          list.push(childSnapshot.val());
        });
        return list;
      }
    
      addToList(path: string, data: any){
        return push(ref(this.db, path), data).key;
      }
    
      removeFromList(path: string, key: string){
        remove(ref(this.db, `${path}/${key}`));
      }

     getDataContinuosly(field: string): Observable<[]>{
      return new Observable((observer) => {
        onValue(ref(this.db, field), (data) => {
          if(data.valueOf()!= null)
            observer.next(data.val());
        });
      });
     }
     
     reset(){
        remove(ref(this.db, '/'));
     }

     uploadImage(file: File, filePath: string): Promise<string> {
      const fileRef = storageRef(this.storage, filePath);
      return uploadBytes(fileRef, file).then(snapshot => {
        return getDownloadURL(snapshot.ref);
      });
    }

    registerUser(email: string, password: string): Promise<any> {
      const auth = getAuth();
      return createUserWithEmailAndPassword(auth, email, password);
    }
  
    signInUser(email: string, password: string): Promise<any> {
      const auth = getAuth();
      return signInWithEmailAndPassword(auth, email, password);
    }
  
    resetPassword(email: string): Promise<void> {
      const auth = getAuth();
      return sendPasswordResetEmail(auth, email);
    }

   deleteMessage(key: string): void {
      const confirmDelete = confirm("Are you sure you want to delete this message?");
      if (confirmDelete) {
        remove(ref(this.db, `/messages/${key}`));
      }
    }
    // Method to reset the messages (delete all messages)
    resetMessages(): void {
      remove(ref(this.db, '/messages'));
    }
}


