import { Component, OnDestroy, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { FavoriteService } from '../services/favorite.service';
import { Subscription } from 'rxjs';
import { EventDetailsService } from '../services/event-details.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';

export class MusicArtist {
  public id!: string;
  public name!: string;
  public followers!: string;
  public popularity!: string;
  public spotifyLink!: string;
  // other properties and methods
}

@Component({
  selector: 'app-detail-card',
  templateUrl: './detail-card.component.html',
  styleUrls: ['./detail-card.component.css']
})

export class DetailCardComponent implements OnInit, OnDestroy {

  private favoriteSubscription!: Subscription;
  private eventDetailsSubscription!: Subscription;
  private venueDetailsSubscription!: Subscription;


  public ticketStatus = '';
  public eventFavored = false;
  public buyTicketLink = '';
  public seatmapUrl = '';
  public eventName = '';
  public localDate = '';
  public venueName = '';
  public priceRange = '';
  public eventId = '';
  public venueAddress = '';
  public phoneNumber = '';
  public openHours = '';
  public generalRule = '';
  public childRule = '';

  public openHoursShowFullText = false;
  public generalRuleShowFullText = false;
  public childRuleShowFullText = false;

  public artists = '';
  public genres = '';
  public musicRelatedArtists: any = [];
  public musicRelatedArtistsInfo: any = [];
  public musicRelatedAlbums: any = [];


  private searchArtistsApi = 'http://hfsidahfigr78475-env.eba-d67v4yj3.us-west-1.elasticbeanstalk.com/searchArtists';
  private getArtistAlbumsApi = 'http://hfsidahfigr78475-env.eba-d67v4yj3.us-west-1.elasticbeanstalk.com/getArtistAlbums';

  public showMap = false;
  public mapOptions: google.maps.MapOptions = {
    center: { lat: 38.9987208, lng: -77.2538699 },
    zoom : 14
  }
  public marker = {
    position: { lat: 38.9987208, lng: -77.2538699 },
  }

  constructor(
    private favoriteService: FavoriteService, 
    private eventDetailsService: EventDetailsService,
    private http: HttpClient,
    private changeDetectorRef: ChangeDetectorRef) { 
    
    this. eventDetailsSubscription = this.eventDetailsService.eventDetails$.subscribe((data) => {
      let res: any = data;

      this.eventId = res.id;
      this.eventName = res.name;
      this.localDate = '';
      if(res.dates != undefined) {
        if(res.dates.start != undefined){
          this.localDate = res.dates.start.localDate;
        }
      }

      this.artists = '';
      this.musicRelatedArtists = [];
      if(res._embedded != undefined){
        if(res._embedded.attractions != undefined){
          let resArtists = res._embedded.attractions;
          let curArtists = '';
          for(let i = 0; i < resArtists.length - 1; i++) {
            if(typeof(resArtists[i].name) != "undefined"){
              curArtists += resArtists[i].name;
              curArtists += ' | ';
              if(typeof(resArtists[i].classifications) != "undefined"){
                if(typeof(resArtists[i].classifications[0].segment) != "undefined"){
                  if(resArtists[i].classifications[0].segment.name === "Music") {
                    this.musicRelatedArtists.push(resArtists[i].name);
                  }
                }
              }
            }
          }
          if(typeof(resArtists[resArtists.length - 1]) != "undefined"){
            if(typeof(resArtists[resArtists.length - 1].classifications) != "undefined"){
              if(typeof(resArtists[resArtists.length - 1].classifications[0].segment) != "undefined"){
                if(resArtists[resArtists.length - 1].classifications[0].segment.name === "Music") {
                  this.musicRelatedArtists.push(resArtists[resArtists.length - 1].name);
                }
              }
            }
            curArtists += resArtists[resArtists.length - 1].name;
          }
          this.artists = curArtists;
        } else {
          this.musicRelatedArtists = [];
          this.artists = '';
        }
      } else {
        this.musicRelatedArtists = [];
        this.artists = ''
      }

      this.venueName = '';
      if(res._embedded != undefined){
        if(typeof(res._embedded.venues) != "undefined"){
          this.venueName = res._embedded.venues[0].name;
        }
      }

      this.genres = '';
      if(res.classifications != undefined){
        if((res.classifications[0].segment != undefined) && (res.classifications[0].segment.name != undefined) && res.classifications[0].segment.name != "Undefined") {
          this.genres += res.classifications[0].segment.name;
        }
        if(res.classifications[0].genre != undefined && res.classifications[0].genre.name != undefined && res.classifications[0].genre.name != "Undefined") {
          if(this.genres != ''){
            this.genres += ' | ';
          }
          this.genres += res.classifications[0].genre.name;
        }
        if(res.classifications[0].subGenre != undefined && res.classifications[0].subGenre.name != undefined && res.classifications[0].subGenre.name != "Undefined") {
          if(this.genres != ''){
            this.genres += ' | ';
          }
          this.genres += res.classifications[0].subGenre.name;
        }
        if(res.classifications[0].type != undefined && res.classifications[0].type.name != undefined && res.classifications[0].type.name != "Undefined") {
          if(this.genres != ''){
            this.genres += ' | ';
          }
          this.genres += res.classifications[0].type.name;
        }
        if(res.classifications[0].subType != undefined && res.classifications[0].subType.name != undefined && res.classifications[0].subType.name != "Undefined") {
          if(this.genres != ''){
            this.genres += ' | ';
          }
          this.genres += res.classifications[0].subType.name;
        }
      }

      this.priceRange = '';
      if(res.priceRanges != undefined) {
        this.priceRange += res.priceRanges[0].min;
        this.priceRange += "-";
        this.priceRange += res.priceRanges[0].max;
      }

      this.ticketStatus = '';
      if(res.dates != undefined){
        if(res.dates.status != undefined){
          if(res.dates.status.code != undefined){
            const statusInformation = res.dates.status.code;
            if(statusInformation === "onsale"){
              this.ticketStatus = "On Sale";
            } else if(statusInformation === "cancelled"){
              this.ticketStatus = "Canceled";
            } else if(statusInformation === "offsale"){
              this.ticketStatus = "Off Sale";
            } else if(statusInformation === "rescheduled"){
              this.ticketStatus = "Rescheduled";
            } else {
              this.ticketStatus = "Postponed";
            }
          }
        }
      }

      this.buyTicketLink = '';
      this.buyTicketLink = res.url;

      this.seatmapUrl = '';
      if(res.seatmap != undefined){
        if(res.seatmap.staticUrl != undefined) {
          this.seatmapUrl = res.seatmap.staticUrl;
        }
      }

    })

    this.venueDetailsSubscription = this.eventDetailsService.venueDetails$.subscribe((data) => {
      let res: any = data;
      this.showMap = false;
      
      this.venueAddress = '';
      this.openHours = '';
      this.generalRule = '';
      this.childRule = '';
      this.phoneNumber = '';
      
      if(res._embedded != undefined){
        const venueDetailsValue = res._embedded.venues[0];
  
        if(venueDetailsValue.address != undefined){
          if(venueDetailsValue.address.line1 != undefined){
            this.venueAddress += venueDetailsValue.address.line1;
          }
        }
        if(venueDetailsValue.city != undefined){
          if(venueDetailsValue.city.name != undefined){
            if(this.venueAddress != ''){
              this.venueAddress += ', ';
            }
            this.venueAddress += venueDetailsValue.city.name;
          }
        }
  
        if(venueDetailsValue.state != undefined){
          if(venueDetailsValue.state.name != undefined){
            if(this.venueAddress != ''){
              this.venueAddress += ', ';
            }
            this.venueAddress += venueDetailsValue.state.name;
          }
        }
  
        if(venueDetailsValue.boxOfficeInfo != undefined){
          this.phoneNumber = venueDetailsValue.boxOfficeInfo.phoneNumberDetail;
        }
        if(venueDetailsValue.boxOfficeInfo != undefined){
          this.openHours = venueDetailsValue.boxOfficeInfo.openHoursDetail;
        }
  
        if(venueDetailsValue.generalInfo != undefined){
          this.generalRule = venueDetailsValue.generalInfo.generalRule;
        }
  
        if(venueDetailsValue.generalInfo != undefined){
          this.childRule = venueDetailsValue.generalInfo.childRule;
        }
  
        this.mapOptions.center!.lat = parseFloat(venueDetailsValue.location.latitude);
        this.mapOptions.center!.lng = parseFloat(venueDetailsValue.location.longitude);
  
        this.marker.position.lat = parseFloat(venueDetailsValue.location.latitude);
        this.marker.position.lng = parseFloat(venueDetailsValue.location.longitude);
  
        this.showMap = true;
      }
    })

    this.favoriteSubscription = this.favoriteService.favorites$.subscribe((data) => {
      this.eventFavored = this.favoriteService.isFavored(this.eventId);
      console.log('is favored?' + this.eventFavored);
    })
  }
    
  ngOnInit(): void {
    this.eventDetailsService.loadCard();
    
    this.eventFavored = this.favoriteService.isFavored(this.eventId);
    console.log('is favored? ' + this.eventFavored);

    console.log(this.musicRelatedArtists);
  
    this.musicRelatedArtistsInfo = [];
    this.musicRelatedAlbums = [];
    const requests = [];
  
    for(let i = 0; i < this.musicRelatedArtists.length; i++) {
      let params = new HttpParams();
      params = params.append('name', this.musicRelatedArtists[i]);
      requests.push(this.http.get(this.searchArtistsApi, { params: params }));
    }
  
    forkJoin(requests).subscribe(responses => {
      responses.forEach((data, i) => {
        let res: any = data;
        // console.log(res);
        let resultArr = res.artists.items;
        for(let j = 0; j < resultArr.length; j++) {
          if(this.musicRelatedArtists[i].toLowerCase() === resultArr[j].name.toLowerCase()){
            const obj = {
              imgHref: resultArr[j].images[0].url,
              name: resultArr[j].name,
              id: resultArr[j].id,
              followers: Number(resultArr[j].followers.total).toLocaleString(),
              popularity: resultArr[j].popularity,
              spotifyLink: resultArr[j].external_urls.spotify
            }
            this.musicRelatedArtistsInfo.push(obj);
            break;
          }
        }
      });
  
  
      for(let artistInfo of this.musicRelatedArtistsInfo){
        console.log(artistInfo);
      }

      console.log('');

      // Start the second API request after the first one is completed
      const albumRequests = [];
  
      for(let i = 0; i < this.musicRelatedArtistsInfo.length; i++){
        let params = new HttpParams();
        params = params.append('id', this.musicRelatedArtistsInfo[i].id);
        albumRequests.push(this.http.get(this.getArtistAlbumsApi, { params: params }));  
      }
  
      forkJoin(albumRequests).subscribe(responses => {
        responses.forEach((data, i) => {
          let res: any = data;
          console.log(res);
          const albums = {
            firstHref: res.items[0].images[0].url,
            secondHref: res.items[1].images[0].url,
            thirdHref: res.items[2].images[0].url
          };
          this.musicRelatedAlbums.push(albums);
        });

        for(let albumsInfo of this.musicRelatedAlbums){
          console.log(albumsInfo);
        }
      });


      
    });
  }
  

  // ngOnInit(): void {
  //   this.eventDetailsService.loadCard();
  
  //   console.log(this.musicRelatedArtists);
  
  //   this.musicRelatedArtistsInfo = [];
  //   const requests = [];
  
  //   for(let i = 0; i < this.musicRelatedArtists.length; i++) {
  //     let params = new HttpParams();
  //     params = params.append('name', this.musicRelatedArtists[i]);
  //     requests.push(this.http.get(this.searchArtistsApi, { params: params }));
  //   }
  
  //   forkJoin(requests).subscribe(responses => {
  //     responses.forEach((data, i) => {
  //       let res: any = data;
  //       let resultArr = res.artists.items;
  //       for(let j = 0; j < resultArr.length; j++) {
  //         if(this.musicRelatedArtists[i].toLowerCase() === resultArr[j].name.toLowerCase()){
  //           const obj = {
  //             name: resultArr[j].name,
  //             id: resultArr[j].id,
  //             followers: resultArr[j].followers.total,
  //             popularity: resultArr[j].popularity,
  //             spotifyLink: resultArr[j].external_urls.spotify
  //           }
  //           this.musicRelatedArtistsInfo.push(obj);
  //           break;
  //         }
  //       }
  //     });
  
  //     // console.log(this.musicRelatedArtistsInfo);
  //     // console.log(this.musicRelatedArtistsInfo.length);
  //     // console.log(this.musicRelatedArtistsInfo);
  
  //     for(let artistInfo of this.musicRelatedArtistsInfo){
  //       console.log(artistInfo.name);
  //     }
     
  //   });

  //   const albumRequests = [];

  //   for(let i = 0; i < this.musicRelatedArtistsInfo.length; i++){
  //     let params = new HttpParams();
  //     params = params.append('id', this.musicRelatedArtistsInfo[i].id);
  //     albumRequests.push(this.http.get(this.getArtistAlbumsApi, { params: params }));  
  //   }

  //   forkJoin(albumRequests).subscribe(responses => {
  //     responses.forEach((data, i) => {
  //       let res: any = data;
  //       console.log(res);
  //     });
  
  //     // console.log(this.musicRelatedArtistsInfo);
  //     // console.log(this.musicRelatedArtistsInfo.length);
  //     // console.log(this.musicRelatedArtistsInfo);
  
  //     // for(let artistInfo of this.musicRelatedArtistsInfo){
  //     //   console.log(artistInfo.name);
  //     // }
     
  //   });
    
  // }
  


  // ngOnInit(): void {
  //   this.eventDetailsService.loadCard();

  //   console.log(this.musicRelatedArtists);

  //   this.musicRelatedArtistsInfo = [];
  //   for(let i = 0; i < this.musicRelatedArtists.length; i++) {
  //     let params = new HttpParams();
  //     params = params.append('name', this.musicRelatedArtists[i]);
  //     this.http.get(this.searchArtistsApi, { params: params }).subscribe( data => {
  //       let res: any = data;
  //       let resultArr = res.artists.items;
  //       for(let j = 0; j < resultArr.length; j++) {
  //         if(this.musicRelatedArtists[i].toLowerCase() === resultArr[j].name.toLowerCase()){
  //           console.log(typeof(resultArr[j]));
  //           // let musicArtist = new MusicArtist();
  //           // musicArtist.name = resultArr[j].name;
  //           // musicArtist.id = resultArr[j].id;
  //           // musicArtist.followers = resultArr[j].followers.total;
  //           // musicArtist.popularity = resultArr[j].popularity;
  //           // musicArtist.spotifyLink = resultArr[j].external_urls.spotify;
  //           const obj = {
  //             name: resultArr[j].name,
  //             id: resultArr[j].id,
  //             followers: resultArr[j].followers.total,
  //             popularity: resultArr[j].popularity,
  //             spotifyLink: resultArr[j].external_urls.spotify
  //           }
  //           this.musicRelatedArtistsInfo.push(obj);
  //           // this.changeDetectorRef.detectChanges();
  //           break;
  //         }
  //       }
  //     })
  //   }

  //   console.log(this.musicRelatedArtistsInfo);

  //   console.log(this.musicRelatedArtistsInfo.length);

  //   console.log(this.musicRelatedArtistsInfo);

  //   for(let artistInfo of this.musicRelatedArtistsInfo){
  //     console.log(artistInfo.name);
  //   }
    
  // }

  goBackToTable() {
    this.eventDetailsService.backToResultTable();
  }

  favorOrNot() {
    this.eventFavored = this.favoriteService.isFavored(this.eventId);
    if(this.eventFavored == false) {
      window.alert("Event Added to Favorites!")
      this.favoriteService.addFavorites(this.eventId, this.localDate, this.eventName, this.genres, this.venueName);
      this.eventFavored = true;
    } else {
      window.alert("Event Removed from Favorites!")
      this.favoriteService.cancelFavorites(this.eventId);
      this.eventFavored = false;
    }
  }



  ngOnDestroy(): void {
    this.favoriteSubscription.unsubscribe();
    this.eventDetailsSubscription.unsubscribe();
    this.venueDetailsSubscription.unsubscribe();
  }
}
