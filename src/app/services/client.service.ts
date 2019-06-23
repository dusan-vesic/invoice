import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  constructor(
    private http: HttpClient,
    public db: AngularFirestore) { }

  url = 'assets/client.json';

  getClient(id: number) {
    return this.http.get(this.url)
      .pipe(
        map(res => (res as any[]).filter(r => r.id === id)[0])
      );
  }

  getAll() {
    return this.http.get(this.url);
  }

  getClients2() {
    return this.db.collection('clients').snapshotChanges();
  }
}
