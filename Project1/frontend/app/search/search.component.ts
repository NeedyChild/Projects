import { Component, OnInit } from '@angular/core';
import { EventDetailsService } from '../services/event-details.service';
import { EventSearchService } from '../services/event-search.service';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  public whichToShow: any;

  constructor(
    private eventSearchService: EventSearchService,
    private eventDetailsService: EventDetailsService
  ) { 
    this.eventSearchService.elementToShow$.subscribe((data) => {
      this.whichToShow = data;
    });

    this.eventDetailsService.elementToShow$.subscribe((data) => {
      this.whichToShow = data;
    })

  }

  ngOnInit(): void {
  }

}
