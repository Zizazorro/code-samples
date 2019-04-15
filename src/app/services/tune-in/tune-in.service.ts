import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from '@angular/fire/database';
import { first } from 'rxjs/operators';
import { User } from '../../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class TuneInService {

  currentUserUid: string;

  uploadsRef: AngularFireList<any>;
  followingUsernamesRef: AngularFireObject<any>;
  followingCountRef: AngularFireObject<any>;

  constructor(public db:AngularFireDatabase) {

  }

  tuneIn(otherUser:User) {

    // Adds the uploads of the other person to your feed
    this.uploadsRef = this.db.list('/uploads/' + otherUser.uid);
    this.uploadsRef.snapshotChanges().pipe(first()).subscribe(uploads => {
      uploads.forEach(upload => {
        let feedRef = this.db.object('/feeds/' + this.currentUserUid + '/' + upload.key);
        feedRef.set({
          key: upload.key
        })
      })
    })

    // Adds the other user to your followingUsernames
    this.followingUsernamesRef = this.db.object('/followingUsernames/' + this.currentUserUid + '/' + otherUser.username);
    this.followingUsernamesRef.set(true);

    // Update the amount of people you follow
    this.followingCountRef = this.db.object('/followingCount/' + this.currentUserUid);
    this.followingCountRef.snapshotChanges().pipe(first()).subscribe(value => {
      let amountOfFollowing = value.payload.val().followingCount;
      this.followingCountRef.update({ followingCount: amountOfFollowing + 1 });
    });

  }
}
