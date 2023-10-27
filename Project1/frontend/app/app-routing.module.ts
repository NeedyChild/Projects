import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { FavoritiesListComponent } from './favorities-list/favorities-list.component';

const routes: Routes = [
  { path: 'search', component: SearchComponent },
  { path: 'favorites', component: FavoritiesListComponent },
  { path: '', redirectTo: 'search', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
