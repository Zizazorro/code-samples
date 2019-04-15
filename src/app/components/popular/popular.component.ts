import { Component, OnInit } from '@angular/core';
import { GetDataService } from '../../services/get-data/get-data.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { tap, take } from 'rxjs/operators';
import { Tune } from 'src/app/interfaces/tune';

@Component({
  selector: 'app-popular',
  templateUrl: './popular.component.html',
  styleUrls: ['./popular.component.sass']
})
export class PopularComponent implements OnInit {

  popularTunes: Tune[] = [];

  constructor(public _getDataService: GetDataService) { }

  ngOnInit() {
    this.getPopular();
  }

  getPopular() {

    let timeNow = Date.now();

    // Get the last 150 tunes and push them to the array if they are posted within the last 30 days
    this._getDataService.getPopular(150).valueChanges()
      .pipe(tap((tunes: any) => {

        tunes.forEach((tune: Tune) => {
          if ((timeNow - 604800000) < tune.date) {
            this.popularTunes.push(tune)
          }
        })

        // Sort the array by the amount of likes
        this.popularTunes.sort((a, b) => {
          if (a.likes < b.likes) return 1;
          else if (a.likes > b.likes) return -1;
          else return 0;
        })

      }),
      take(1))
      .subscribe()
  }

}
