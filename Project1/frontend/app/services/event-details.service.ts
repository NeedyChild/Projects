import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Subject, lastValueFrom } from "rxjs";

@Injectable({providedIn: 'root'})
export class EventDetailsService {
    detailsForEvent!: any;
    detailsForVenue!: any;

    private apikey =  'fFWL1pAuuxApZPwgMkxGHr6CEnUPLz7o';
    private elementToShow = new Subject();
    public elementToShow$ = this.elementToShow.asObservable();

    private eventDetails = new Subject();
    public eventDetails$ = this.eventDetails.asObservable();

    private venueDetails = new Subject();
    public venueDetails$ = this.venueDetails.asObservable();

    private eventDetailsApi = 'http://hfsidahfigr78475-env.eba-d67v4yj3.us-west-1.elasticbeanstalk.com/eventDetails';
    private venueDetailsApi = 'http://hfsidahfigr78475-env.eba-d67v4yj3.us-west-1.elasticbeanstalk.com/venueDetails'

    constructor(private http: HttpClient) {}

    async getEventAndVenueDetails(eventId: string, venueName: string) {
        console.log(venueName);

        let eventDetailsUrl = this.eventDetailsApi;
        eventDetailsUrl += '?id=';
        eventDetailsUrl += eventId;
        eventDetailsUrl += '&apikey=';
        eventDetailsUrl += this.apikey;

        let venueDetailsUrl = this.venueDetailsApi;
        venueDetailsUrl += '?apikey=';
        venueDetailsUrl += this.apikey;
        venueDetailsUrl += '&keyword=';
        venueDetailsUrl += venueName;


        this.detailsForEvent = await lastValueFrom(this.http.get(eventDetailsUrl));
        this.detailsForVenue = await lastValueFrom(this.http.get(venueDetailsUrl));

        console.log(this.detailsForEvent);
        console.log(this.detailsForVenue);

        this.elementToShow.next('card');
    }

    async loadCard() {
        this.eventDetails.next(this.detailsForEvent);
        this.venueDetails.next(this.detailsForVenue);
    }


    backToResultTable() {
        this.elementToShow.next('table');
    }
    
}