import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Subject, lastValueFrom } from "rxjs";

@Injectable({providedIn: 'root'})
export class EventSearchService {

  private autocompleteApi = 'http://hfsidahfigr78475-env.eba-d67v4yj3.us-west-1.elasticbeanstalk.com/autocomplete';
  private eventSearchApi = 'http://hfsidahfigr78475-env.eba-d67v4yj3.us-west-1.elasticbeanstalk.com/eventSearch';
  private geoCodeApi = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
  private ipinfoApi = 'https://ipinfo.io/?token=f7b734d17201ad'

  private apikey = 'fFWL1pAuuxApZPwgMkxGHr6CEnUPLz7o';

  private eventsArray = new Subject();
  public eventsArray$ = this.eventsArray.asObservable();

  private elementToShow = new Subject();
  public elementToShow$ = this.elementToShow.asObservable();

	private eventsData: any;

  constructor(private http: HttpClient) {}

  getAutocompleteResult(keyword: string){
    let params = new HttpParams();
    params = params.append('apikey', this.apikey)
    params = params.append('keyword', keyword);
    return this.http.get(this.autocompleteApi, { params: params });
  }

  async getSearchResults(keyword: string, radius: string, segmentId: string, autoDetect: boolean, location: string) {
    let lat;
    let lng;

    if(autoDetect === true){
      const response = this.http.get(this.ipinfoApi);
      const currentLocation: any = await lastValueFrom(response);

      let currentLoc = currentLocation['loc'];
      lat = currentLoc.split(',')[0];
      lng = currentLoc.split(',')[1];
    } else {

			let finalURL = this.geoCodeApi;
			finalURL += location;
			finalURL += '&key=';
			finalURL += 'AIzaSyBue9gLRaZkFW2ESgjqV-px0WP3N5PeUy4';
			// let params = new HttpParams();
			// let nameOfLocation = encodeURIComponent(location)
			// params.append('address', nameOfLocation);
			// params.append('key', 'AIzaSyBue9gLRaZkFW2ESgjqV-px0WP3N5PeUy4');

			const response = this.http.get(finalURL);

			const tempLocation: any = await lastValueFrom(response);

			if (tempLocation['status'] != 'ZERO_RESULTS') {
        lat = tempLocation['results'][0]['geometry']['location']['lat'];
        lng = tempLocation['results'][0]['geometry']['location']['lng'];
      } else {
        lat = undefined;
        lng = undefined;
      }
    }
    console.log(lat);
    console.log(lng);
    if(lng == undefined){
      this.eventsData = [];
      
      console.log(this.eventsData);
      this.eventsArray.next(this.eventsData);
      this.elementToShow.next('table');

    } else {

      let params = new HttpParams();
      
      params = params.append('apikey', this.apikey);
      params = params.append('keyword', keyword);
      params = params.append('segmentId', segmentId);
      params = params.append('radius', radius);
      params = params.append('unit', 'miles');
      params = params.append('lat', lat);
      params = params.append('lng', lng);

      const eventsSearchResponse = this.http.get(this.eventSearchApi, { params: params });
      const tempBusiness: any = await lastValueFrom(eventsSearchResponse);

      this.eventsData = [];
      if(typeof(tempBusiness._embedded) != "undefined"){
        this.eventsData = tempBusiness._embedded.events;
      }
      
      console.log(this.eventsData);
      this.eventsArray.next(this.eventsData);

      this.elementToShow.next('table');
    }
  }

  loadTable() {
    this.eventsArray.next(this.eventsData);
  }

  clearResults(){
    this.elementToShow.next('none');
  }


}
