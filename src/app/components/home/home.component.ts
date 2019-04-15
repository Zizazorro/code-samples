import { Component, OnInit } from '@angular/core';
import { GetDataService } from '../../services/get-data/get-data.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { BehaviorSubject } from 'rxjs';
import { tap, take } from 'rxjs/operators';
import * as lodash from 'lodash';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  feedList = new BehaviorSubject([]);
  batch: number = 5;
  currentUserUid: string;
  lastKey: string = '';
  finished: boolean = false;
  nothingOnFeed: boolean = false;

  constructor(public _getDataService: GetDataService, public db: AngularFireDatabase) { }

  ngOnInit() {
    this.loadFeed();
  }

  loadFeed() {

    if (this.finished) return

    // Get the keys from the database and load the data from those tunes into the feedList array
    // Executes every inital page load and everytime the InfiniteScroll is triggered
    this._getDataService.getFeed(this.batch + 1, this.currentUserUid, this.lastKey).valueChanges()
      .pipe(tap((feedKeys: any) => {

        let newKeys = [];
        let newTunes: any = [];

        // Checks if there are any tunes on someone's feed
        // Stop trying to load more tunes when the last tune is loaded
        if (feedKeys.length == 0) {
          this.finished = true;
          this.nothingOnFeed = true;
        } else if (feedKeys.length < this.batch + 1) {
          this.finished = true;
          newKeys = lodash.slice(feedKeys, 0, this.batch)
        } else {
          newKeys = lodash.slice(feedKeys, 1, this.batch + 1)
        }

        // Gets the key that will be the last key for the next batch
        if (feedKeys.length > 0) {
          this.lastKey = lodash.first(feedKeys)['key']
        }

        // Get the tunes that are currently in the feedList array (BehaviorSubject)
        let currentTunes = this.feedList.getValue();

        // Get the data from the new tunes and push them into the existing feedList array
        newKeys.forEach((newKey, index) => {
          newTunes[index] = {};

          let tunesRef = this.db.object('/tunes/' + newKey);
          tunesRef.snapshotChanges().pipe(take(1)).subscribe(val => {

            let valueObj = val.payload.val();

            for (var key in valueObj) {
              if (valueObj.hasOwnProperty(key)) {
                newTunes[index][key] = valueObj[key];
              }
            }

            // Concat the currentTunes and the newTunes
            this.feedList.next(lodash.concat(currentTunes, newTunes))
          });
        });
      }))
  } // End of loadFeed
}
