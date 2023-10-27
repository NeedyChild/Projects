import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormControl } from '@angular/forms';

import { tap, map, switchAll, debounceTime, finalize, distinctUntilChanged, filter } from 'rxjs/operators';

import { EventSearchService } from '../services/event-search.service';
@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css']
})
export class SearchFormComponent implements OnInit {

  @ViewChild('searchForm') searchForm!: NgForm;
  // auto!: MatAutocomplete;
  isLoading = false;
  keywordInputControl = new FormControl();

  autoKeywords: any;
  autoDetetected = false;
  locationInput = '';
  eventsList: any;

  constructor(private eventSearchService: EventSearchService) { }

  ngOnInit(): void {
    this.keywordInputControl.valueChanges.pipe(
      tap(() => {
        this.autoKeywords = [];
      }),

      filter((res: string) => (res != null && res.length >= 1)),

      distinctUntilChanged(),

      debounceTime(935),

      tap(() => {
        this.isLoading = true;
      }),

      map((word) => this.eventSearchService.getAutocompleteResult(word).pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )),
      switchAll()
    )
    .subscribe((data: any) => {
      this.autoKeywords = [];
      console.log(data);
      console.log(typeof(data._embedded));
      if((typeof(data._embedded) != "undefined")){
        if(typeof(data._embedded.attractions) != "undefined"){
          const attractions = data._embedded.attractions;
          for(let element of attractions){
            this.autoKeywords.push(element.name);
          }
          // console.log(this.autoKeywords)
        }
      }
    })
  }

  async onSubmit() {

    this.eventsList = [];
    
    let keyword = this.keywordInputControl.value;
    // console.log(keyword);

    let num = 10;
    if(this.searchForm.value.distanceInput != ''){
      num = this.searchForm.value.distanceInput;
    }

    let radius = num.toString();

    let segmentId = "";
    const category = this.searchForm.value.categoryInput;

    

    if(category === "Music"){
      segmentId = "KZFzniwnSyZfZ7v7nJ";
    }
    if(category === "Sports"){
        segmentId = "KZFzniwnSyZfZ7v7nE";
    }
    if(category === "Arts & Theatre"){
        segmentId = "KZFzniwnSyZfZ7v7na";
    }
    if(category === "Film"){
        segmentId = "KZFzniwnSyZfZ7v7nn";
    }
    if(category === "Miscellaneous"){
        segmentId = "KZFzniwnSyZfZ7v7n1";
    }

    let autoDetect = this.autoDetetected;

    let location = '';
    if(typeof(this.searchForm.value.locationInput) != "undefined"){
      location = this.searchForm.value.locationInput
    }

    console.log(typeof(location));
    
    console.log(keyword);
    console.log(category);
    console.log(segmentId);
    console.log(radius);
    console.log(location);
    console.log(autoDetect);
    this.eventSearchService.getSearchResults(keyword, radius, segmentId, autoDetect, location);

  }

  clearLocationInput() {
    this.locationInput = '';
  }

  formReset() {
    this.keywordInputControl.reset();
    this.searchForm.reset();
    this.searchForm.form.patchValue({categoryInput: 'Default'});
    this.searchForm.form.patchValue({distanceInput: 10});
    this.eventSearchService.clearResults();
  }

}
