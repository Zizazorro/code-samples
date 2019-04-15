import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { Tune } from '../../interfaces/tune';
import { Follower } from '../../interfaces/follower';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class LikeTuneService {

  currentUserUid: string;
  likedTunesRef: AngularFireObject<any>;
  followers$: Observable<any>;

  constructor(public db: AngularFireDatabase) { }

  likeTune(tune: Tune){

    // Add the tune to the liked tunes of the user that is logged in
    this.likedTunesRef = this.db.object(`/likedTunes/` + this.currentUserUid + '/' + tune.key);
    this.likedTunesRef.set(tune);

    // Push the activity (liking the tune) to each of your followers
    this.followers$ = this.db.list('/followers/' + this.currentUserUid).valueChanges();
    this.followers$.pipe(first()).subscribe(followers => {
      followers.forEach((follower: Follower) => {

        // Don't push it to the author of the tune if he/she is one of your followers
        if (follower.uid !== tune.author) {
          let activityRef = this.db.object('/activityLog/' + follower.uid + '/' + (this.currentUserUid + tune.key + 'like'));

          let activityObject = {
            date: firebase.database.ServerValue.TIMESTAMP,
            liked: true,
            author: tune.author,
            key: tune.key,
            title: tune.uploadTitle,
            uploadUrl: tune.uploadUrl
          }

          activityRef.set(activityObject);
        }
      })
    })
  }

}
