import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class GetDataService {

  constructor(private db: AngularFireDatabase) { }

  getFeed(batch, uid, lastKey?) {
    if (lastKey) {
      return this.db.list('/feeds/' + uid, ref =>
        ref.orderByKey().limitToLast(batch).endAt(lastKey)
      )
    } else {
      return this.db.list('/feeds/' + uid, ref =>
        ref.orderByKey().limitToLast(batch)
      )
    }
  }

  getPopular(batch) {
    return this.db.list('/topTunes', ref =>
      ref.orderByKey().limitToLast(batch)
    )
  }
}
