import { Component, OnInit } from '@angular/core';
import { FavoriteService } from '../services/favorite.service';

@Component({
  selector: 'app-favorities-list',
  templateUrl: './favorities-list.component.html',
  styleUrls: ['./favorities-list.component.css']
})
export class FavoritiesListComponent implements OnInit {

  public favoriteEventArray: any = [];
  constructor(private favoritesService: FavoriteService) {
    this.favoritesService.favorites$.subscribe((data) => {
      this.favoriteEventArray = data;
    })
  }

  ngOnInit(): void {
    this.favoritesService.updateFavoritesList();
    console.log(this.favoriteEventArray);
  }

  cancelFavoriteEvent(eventId: string){
    window.alert("Removed from favorites!");
    this.favoritesService.cancelFavorites(eventId);
  }
}
