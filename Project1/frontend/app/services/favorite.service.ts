import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({providedIn: 'root'})
export class FavoriteService {
    private favorites = new Subject();
    public favorites$ = this.favorites.asObservable();
    constructor() {}

    addFavorites(
        eventId: string,
        eventDate: string,
        eventName: string,
        eventCategory: string,
        eventVenue: string
    ){
        let favorite = {
            eventId: eventId,
            eventDate: eventDate,
            eventName: eventName,
            eventCategory: eventCategory,
            eventVenue: eventVenue
        }
        localStorage.setItem(eventId, JSON.stringify(favorite));
        this.updateFavoritesList();
    }

    cancelFavorites(eventId: string){
        localStorage.removeItem(eventId);
        this.updateFavoritesList();
    }

    updateFavoritesList() {
        const valuesArray = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if(typeof(key) === "string"){
                const value = localStorage.getItem(key);
                if(typeof(value) === "string"){
                    valuesArray.push(JSON.parse(value));
                }
            }
        }

        console.log(valuesArray);

        this.favorites.next(valuesArray);
    }

    isFavored(eventId: string) {
        if((localStorage.getItem(eventId)) == null){
            return false;
        } else {
            return true;
        }
    }
}