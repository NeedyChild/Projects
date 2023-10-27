import { Component, OnDestroy, OnInit } from '@angular/core';
import { EventDetailsService } from '../services/event-details.service';
import { EventSearchService } from '../services/event-search.service';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-result-table',
  templateUrl: './result-table.component.html',
  styleUrls: ['./result-table.component.css']
})
export class ResultTableComponent implements OnInit, OnDestroy {
  public eventsArray: any = [];
  public sortedEventsArray: any = [];
  searchSubscription$!: Subscription;
  constructor(private eventSearchService: EventSearchService, private eventDetailsService: EventDetailsService) {
    this.searchSubscription$ = this.eventSearchService.eventsArray$.subscribe((data) => {
      this.eventsArray = data;
    })
    
    // console.log(this.eventsArray);
  }

  ngOnInit(): void {
    this.eventSearchService.loadTable();
    console.log('length ' + this.eventsArray.length);
    interface Event {
      dates: {
        start: {
          localDate: string;
          localTime: string;
        }
      }
    }
       
    this.eventsArray.sort((a: Event, b: Event) => {
      const dateComparison = a.dates.start.localDate.localeCompare(b.dates.start.localDate);
      if (dateComparison !== 0) {
        return dateComparison;
      } else {
        return a.dates.start.localTime.localeCompare(b.dates.start.localTime);
      }
    });

    this.sortedEventsArray = this.eventsArray;
    
  }

  getEventDetails(eventId: string, venueName: string) {
    this.eventDetailsService.getEventAndVenueDetails(eventId, venueName);
  }

  ngOnDestroy(): void {
    this.searchSubscription$.unsubscribe();
  }
}
