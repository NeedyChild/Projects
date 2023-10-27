import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchFormComponent } from './search-form/search-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClientModule } from '@angular/common/http';
import { ResultTableComponent } from './result-table/result-table.component';
import { SearchComponent } from './search/search.component';
import { FavoritiesListComponent } from './favorities-list/favorities-list.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DetailCardComponent } from './detail-card/detail-card.component';
import { MatTabsModule } from '@angular/material/tabs'
import { GoogleMapsModule } from '@angular/google-maps';

@NgModule({
  declarations: [
    AppComponent,
    SearchFormComponent,
    ResultTableComponent,
    SearchComponent,
    FavoritiesListComponent,
    NavbarComponent,
    DetailCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    MatTabsModule,
    GoogleMapsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

// import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
// import { MatTabsModule, MAT_TABS_CONFIG } from '@angular/material/tabs';

// import { AppRoutingModule } from './app-routing.module';
// import { AppComponent } from './app.component';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { SearchFormComponent } from './search-form/search-form.component';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MatAutocompleteModule } from '@angular/material/autocomplete'
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { HttpClientModule } from '@angular/common/http';
// import { ResultTableComponent } from './result-table/result-table.component';
// import { SearchComponent } from './search/search.component';
// import { FavoritiesListComponent } from './favorities-list/favorities-list.component';
// import { NavbarComponent } from './navbar/navbar.component';
// import { DetailCardComponent } from './detail-card/detail-card.component';

// @NgModule({
//   declarations: [
//     AppComponent,
//     SearchFormComponent,
//     ResultTableComponent,
//     SearchComponent,
//     FavoritiesListComponent,
//     NavbarComponent,
//     DetailCardComponent
//   ],
//   imports: [
//     BrowserModule,
//     AppRoutingModule,
//     BrowserAnimationsModule,
//     FormsModule,
//     MatAutocompleteModule,
//     ReactiveFormsModule,
//     MatProgressSpinnerModule,
//     HttpClientModule,
//     MatTabsModule,
//   ],
//   providers: [
//     {
//       provide: MAT_TABS_CONFIG,
//       useValue: {
//         colorScheme: {
//           domain: ['#99f6e0', '#E44D25', '#CFC0BB', '#7AA3E5']
//         }
//       }
//     }
//   ],
//   bootstrap: [AppComponent]
// })
// export class AppModule { }

