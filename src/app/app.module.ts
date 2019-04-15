import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';

import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { PopularComponent } from './components/popular/popular.component';

import { LikeTuneService } from './services/like-tune/like-tune.service';
import { TuneInService } from './services/tune-in/tune-in.service';
import { GetDataService } from './services/get-data/get-data.service';

const appRoutes: Routes = [
  {path:'', component:HomeComponent},
  {path:'home', component:HomeComponent},
  {path:'popular', component:PopularComponent},
  {path:'**', component:HomeComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PopularComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule
  ],
  providers: [
    LikeTuneService,
    TuneInService,
    GetDataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
