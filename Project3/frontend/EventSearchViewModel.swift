//
//  EventSearchViewModel.swift
//  TicketMasterSearch
//
//  Created by Qiangli Shi on 4/11/23.
//


import SwiftUI
import Alamofire
import SwiftyJSON


class EventSearchViewModel: ObservableObject {

    private let ticketMasterApiKey: String = "fFWL1pAuuxApZPwgMkxGHr6CEnUPLz7o"
    @Published var musicRelatedArtists: [String] = []

    @Published var autoCompletionResults: [String] = []

    @Published var isLoaded: Bool = false
    @Published var isLoading: Bool = false
    
    @Published var events: [EventItemModel] = []
    
    @Published var eventDetails = EventDetailModel(id: "")
    @Published var venueDetails = VenueDetailModel(id: "")
    @Published var musicArtistsDetails: [MusicArtistModel] = []
//    @Published var musicArtistAlbumsDetails: [MusicArtistAlbumsModel] = []
    @Published var musicArtistsDataLoaded: Bool = false
    
    @AppStorage("favorites", store: .standard) var favorites: [FavoriteItemModel] = []

    
    private func getAutoComplete(keyword: String, completion: @escaping([String]) -> Void) {
        var autoCompletions: [String] = []
        var autoCompleteUrl = "http://hfsidahfigr78475-env.eba-d67v4yj3.us-west-1.elasticbeanstalk.com/autocomplete"
        autoCompleteUrl += ("?apikey=" + self.ticketMasterApiKey + "&keyword=" + keyword)

        let request = AF.request(autoCompleteUrl.replacingOccurrences(of: " ", with: "+"), method: .get, parameters: nil)

        request.responseJSON{ response in
            switch response.result {
            case .success(let value):

                let results = JSON(value)

                for(_, value) in results["_embedded"]["attractions"] {
                    autoCompletions.append(value["name"].stringValue)
                }

                completion(autoCompletions)

            case .failure(let error):
                print(error)
            }

        }
    }

    private func getGeoCode(location: String, complete: @escaping ([String]) -> Void) {
        var locationInfos: [String] = []
        var geoCodeUrl = "https://maps.googleapis.com/maps/api/geocode/json?address="
        geoCodeUrl += (location + "&key=" + "AIzaSyBue9gLRaZkFW2ESgjqV-px0WP3N5PeUy4")
        
        let request = AF.request(geoCodeUrl.replacingOccurrences(of: " ", with: "+"), method: .get, parameters: nil)
        request.responseJSON { res in
            switch res.result {
            case .success(let value):
                let results = JSON(value)
                locationInfos.append(results["results"][0]["geometry"]["location"]["lat"].stringValue)
                locationInfos.append(results["results"][0]["geometry"]["location"]["lng"].stringValue)
                complete(locationInfos)
                
            case .failure(let err):
                print(err)
            }
            
        }
    }
    
    private func getIpinfo(complete: @escaping ([String]) -> Void) {
        var locationInfos: [String] = []
        let ipinfoUrl = "https://ipinfo.io/?token=f7b734d17201ad"
        
        let request = AF.request(ipinfoUrl, method: .get, parameters: nil)
        request.responseJSON { res in
            switch res.result {
            case .success(let value):
                let results = JSON(value)
                locationInfos = (results["loc"].stringValue).components(separatedBy: ",")
                complete(locationInfos)
                
            case .failure(let err):
                print(err)
            }
        }
    }

    private func getVenueDetailsPriv(keyword: String, complete: @escaping (VenueDetailModel) -> Void) {
        var details = VenueDetailModel(id: "")
        var venueDetailUrl = "http://hfsidahfigr78475-env.eba-d67v4yj3.us-west-1.elasticbeanstalk.com/venueDetails"
        
        venueDetailUrl += ("?apikey=" + self.ticketMasterApiKey + "&keyword=" + keyword)
        
        if let encodedURLString = venueDetailUrl.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed),
           let url = URL(string: encodedURLString) {
            let request = AF.request(url, method: .get, parameters: nil)
            request.responseJSON { res in
                switch res.result {
                case .success(let value):
                    let results = JSON(value)
                    let valueDetailInfo = results["_embedded"]["venues"][0]
                    
                    details.address = valueDetailInfo["address"]["line1"].stringValue
                    
                    details.phoneNumber = valueDetailInfo["boxOfficeInfo"]["phoneNumberDetail"].stringValue
                    
                    details.openHours = valueDetailInfo["boxOfficeInfo"]["openHoursDetail"].stringValue
                    
                    details.generalRule = valueDetailInfo["generalInfo"]["generalRule"].stringValue
                    
                    details.childRule = valueDetailInfo["generalInfo"]["childRule"].stringValue
                    
                    details.lat = valueDetailInfo["location"]["latitude"].stringValue
                    details.lng = valueDetailInfo["location"]["longitude"].stringValue
                    
                    complete(details)
                    
                case .failure(let err):
                    print(err)
                }
            }
        } else {
            print("error")
        }
    }
    
    private func getEvents(keyword: String, category: String, distance: String, lat: String, lng: String, complete: @escaping ([EventItemModel]) -> Void) {
        var events: [EventItemModel] = []
        
        
        var segmentId = ""
        if(category == "Music"){
          segmentId = "KZFzniwnSyZfZ7v7nJ";
        }
        if(category == "Sports"){
            segmentId = "KZFzniwnSyZfZ7v7nE";
        }
        if(category == "Arts & Theatre"){
            segmentId = "KZFzniwnSyZfZ7v7na";
        }
        if(category == "Film"){
            segmentId = "KZFzniwnSyZfZ7v7nn";
        }
        if(category == "Miscellaneous"){
            segmentId = "KZFzniwnSyZfZ7v7n1";
        }
        
        var eventSearchUrl = "http://hfsidahfigr78475-env.eba-d67v4yj3.us-west-1.elasticbeanstalk.com/eventSearch"
        eventSearchUrl += ("?apikey=" + self.ticketMasterApiKey + "&keyword=" + keyword + "&segmentId=" + segmentId
            + "&radius=" + distance + "&unit=miles&lat=" + lat + "&lng=" + lng)
        
        let request = AF.request(eventSearchUrl.replacingOccurrences(of: " ", with: "+"), method: .get, parameters: nil)
        request.responseJSON { res in
            switch res.result {
            case .success(let value):
                let results = JSON(value)
                
                for(_, event) in results["_embedded"]["events"] {
                    var timeValue = event["dates"]["start"]["localTime"].stringValue
                    if(timeValue.count > 3){
                        timeValue = String(timeValue.dropLast(3))
                    }
                    let eventItem = EventItemModel(
                        id: event["id"].stringValue,
                        date: event["dates"]["start"]["localDate"].stringValue,
                        time: timeValue,
                        eventName: event["name"].stringValue,
                        venueName: event["_embedded"]["venues"][0]["name"].stringValue,
                        imageUrl: event["images"][0]["url"].stringValue
                    )
                    events.append(eventItem)
                }
                complete(events)
                
            case .failure(let err):
                print(err)
            }
        }
    }
    
    private func getEventDetailsPriv(id: String, complete: @escaping (EventDetailModel) -> Void) {
        var details = EventDetailModel(id: "")
        var eventDetailUrl = "http://hfsidahfigr78475-env.eba-d67v4yj3.us-west-1.elasticbeanstalk.com/eventDetails"
        
        eventDetailUrl += ("?id=" + id + "&apikey=" + self.ticketMasterApiKey)
        
        let request = AF.request(eventDetailUrl.replacingOccurrences(of: " ", with: "+"), method: .get, parameters: nil)
        request.responseJSON { res in
            switch res.result {
            case .success(let value):
                let results = JSON(value)
                details.id = results["id"].stringValue
                details.eventName = results["name"].stringValue
                details.date = results["dates"]["start"]["localDate"].stringValue
                
                
                var curArtists: String = ""
                for (_, value) in results["_embedded"]["attractions"] {
                    curArtists += value["name"].stringValue
                    if(value["classifications"][0]["segment"]["name"].stringValue == "Music") {
                        self.musicRelatedArtists.append(value["name"].stringValue)
                    }
                }
                details.artistOrTeam = curArtists
   
                
                details.venueName = results["_embedded"]["venues"][0]["name"].stringValue
                
                
                var tempGenres: String = ""
                if((results["classifications"][0]["segment"]["name"].stringValue != "")
                   && (results["classifications"][0]["segment"]["name"].stringValue != "Undefined")) {
                    tempGenres += results["classifications"][0]["segment"]["name"].stringValue
                }
                if((results["classifications"][0]["genre"]["name"].stringValue != "")
                   && (results["classifications"][0]["genre"]["name"].stringValue != "Undefined")) {
                    if(tempGenres != ""){
                        tempGenres += " | "
                    }
                    tempGenres += results["classifications"][0]["genre"]["name"].stringValue
                }
                if((results["classifications"][0]["subGenre"]["name"].stringValue != "")
                   && (results["classifications"][0]["subGenre"]["name"].stringValue != "Undefined")) {
                    if(tempGenres != ""){
                        tempGenres += " | "
                    }
                    tempGenres += results["classifications"][0]["subGenre"]["name"].stringValue
                }
                if((results["classifications"][0]["type"]["name"].stringValue != "")
                   && (results["classifications"][0]["type"]["name"].stringValue != "Undefined")) {
                    if(tempGenres != ""){
                        tempGenres += " | "
                    }
                    tempGenres += results["classifications"][0]["type"]["name"].stringValue
                }
                if((results["classifications"][0]["subType"]["name"].stringValue != "")
                   && (results["classifications"][0]["subType"]["name"].stringValue != "Undefined")) {
                    if(tempGenres != ""){
                        tempGenres += " | "
                    }
                    tempGenres += results["classifications"][0]["subType"]["name"].stringValue
                }

                details.genres = tempGenres
                
 
                let tempPriceRange: String =  (results["priceRanges"][0]["min"].stringValue + ".0-" + results["priceRanges"][0]["max"].stringValue + ".0")

                if (tempPriceRange == ".0-.0") {
                    details.priceRange = ""
                } else {
                    details.priceRange = tempPriceRange
                }

                
                
                details.ticketStatus = ""
                let statusInformation = results["dates"]["status"]["code"].stringValue
                if(statusInformation == "onsale"){
                  details.ticketStatus = "Onsale";
                } else if(statusInformation == "cancelled"){
                  details.ticketStatus = "Canceled";
                } else if(statusInformation == "offsale"){
                  details.ticketStatus = "Offsale";
                } else if(statusInformation == "rescheduled"){
                  details.ticketStatus = "Rescheduled";
                } else {
                  details.ticketStatus = "Postponed";
                }

                
                details.imageUrl = results["seatmap"]["staticUrl"].stringValue
                
                details.buyTicketAtUrl = results["url"].stringValue
                
                complete(details)
                
            case .failure(let err):
                print(err)
            }
        }
    }
    private func getArtistAlbumsPriv(id: String, complete: @escaping ([String]) -> Void) {
        var albumLinks: [String] = []
        
        var getArtistAlbumUrl = "http://hfsidahfigr78475-env.eba-d67v4yj3.us-west-1.elasticbeanstalk.com/getArtistAlbums"
        getArtistAlbumUrl += ("?id=" + id)
        
        let request = AF.request(getArtistAlbumUrl, method: .get, parameters: nil)
        request.responseJSON { res in
            switch res.result {
            case .success(let value):
                let results = JSON(value)
                albumLinks.append(results["items"][0]["images"][0]["url"].stringValue)
                albumLinks.append(results["items"][1]["images"][0]["url"].stringValue)
                albumLinks.append(results["items"][2]["images"][0]["url"].stringValue)
                
                complete(albumLinks)

            case .failure(let err):
                print(err)
            }
        }
        
    }
    
    private func searchArtistPriv(artists: [String], complete: @escaping([MusicArtistModel]) -> Void) {
        
        var musicArtists: [MusicArtistModel] = []
//        var completedRequests = 0
        let semaphore = DispatchSemaphore(value: 0)
        DispatchQueue.global(qos: .userInitiated).async {
            for value in artists {
                            
                var musicArtist = MusicArtistModel(id: "")
                
                var searchArtistsUrl = "http://hfsidahfigr78475-env.eba-d67v4yj3.us-west-1.elasticbeanstalk.com/searchArtists"
                searchArtistsUrl += ("?name=" + value)
                
                let request = AF.request(searchArtistsUrl.replacingOccurrences(of: " ", with: "+"), method: .get, parameters: nil)
                request.responseJSON { res in
                    switch res.result {
                    case .success(let value):
                        let results = JSON(value)
                        let musicArtistInfo = results["artists"]["items"][0]
                        
                        musicArtist.id = musicArtistInfo["id"].stringValue
                        musicArtist.artistName = musicArtistInfo["name"].stringValue
                        
                        let followerCount = musicArtistInfo["followers"]["total"].stringValue
                        var followerCountStr = ""
                        if let followerCountNum = Int(followerCount) {
                            if (followerCountNum < 1000) {
                                followerCountStr = followerCount
                            } else if (followerCountNum >= 1000 && followerCountNum < 1000000) {
                                followerCountStr += (String(followerCountNum / 1000) + "K")
                            } else {
                                followerCountStr += (String(followerCountNum / 1000000) + "M")
                            }
                        }
                        musicArtist.followers = followerCountStr
                        
                        musicArtist.popularity = musicArtistInfo["popularity"].stringValue
                        musicArtist.spotifyLink = musicArtistInfo["external_urls"]["spotify"].stringValue
                        musicArtist.imgHref = musicArtistInfo["images"][0]["url"].stringValue
                        
                        self.getArtistAlbumsPriv(id: musicArtist.id) { response1 in
                            musicArtist.firstHref = response1[0]
                            musicArtist.secondHref = response1[1]
                            musicArtist.thirdHref = response1[2]
                            musicArtists.append(musicArtist)
                            semaphore.signal()
                        }
                       
                        
                    case .failure(let err):
                        print(err)
                    }
                    

                }
                semaphore.wait()
            }
            
            DispatchQueue.main.async {
                complete(musicArtists)
            }

        }
    
    }

    
//    private func searchArtistPriv(artists: [String], complete: @escaping([MusicArtistModel]) -> Void) {
//
//        var musicArtists: [MusicArtistModel] = []
////        var completedRequests = 0
//        let dispatchGroup = DispatchGroup()
//
//        for value in artists {
//            dispatchGroup.enter()
//
//            var musicArtist = MusicArtistModel(id: "")
//
//            var searchArtistsUrl = "http://hfsidahfigr78475-env.eba-d67v4yj3.us-west-1.elasticbeanstalk.com/searchArtists"
//            searchArtistsUrl += ("?name=" + value)
//
//            let request = AF.request(searchArtistsUrl.replacingOccurrences(of: " ", with: "+"), method: .get, parameters: nil)
//            request.responseJSON { res in
//                switch res.result {
//                case .success(let value):
//                    let results = JSON(value)
//                    let musicArtistInfo = results["artists"]["items"][0]
//
//                    musicArtist.id = musicArtistInfo["id"].stringValue
//                    musicArtist.artistName = musicArtistInfo["name"].stringValue
//
//                    let followerCount = musicArtistInfo["followers"]["total"].stringValue
//                    var followerCountStr = ""
//                    if let followerCountNum = Int(followerCount) {
//                        if (followerCountNum < 1000) {
//                            followerCountStr = followerCount
//                        } else if (followerCountNum >= 1000 && followerCountNum < 1000000) {
//                            followerCountStr += (String(followerCountNum / 1000) + "K")
//                        } else {
//                            followerCountStr += (String(followerCountNum / 1000000) + "M")
//                        }
//                    }
//                    musicArtist.followers = followerCountStr
//
//                    musicArtist.popularity = musicArtistInfo["popularity"].stringValue
//                    musicArtist.spotifyLink = musicArtistInfo["external_urls"]["spotify"].stringValue
//
//                    self.getArtistAlbumsPriv(id: musicArtist.id) { response1 in
//                        musicArtist.firstHref = response1[0]
//                        musicArtist.secondHref = response1[1]
//                        musicArtist.thirdHref = response1[2]
//                        musicArtists.append(musicArtist)
//
//                        dispatchGroup.leave()
//                    }
//
//
//                case .failure(let err):
//                    print(err)
//                }
//
////                completedRequests += 1
////                if completedRequests == artists.count {
////                    complete(musicArtists)
////                }
//            }
//        }
//
//        dispatchGroup.notify(queue: .main) {
//            complete(musicArtists)
//        }
//    }

    
    func getAutoCompletions(keyword: String) {
        self.getAutoComplete(keyword: keyword) { res in

            self.autoCompletionResults = res
            print("Auto Completions:")
            print(self.autoCompletionResults)
            print("")
        }
    }
    
    func getEventsAutoDetect(keyword: String, category: String, distance: String) {
        self.isLoading = true
        self.isLoaded = false
        
        self.getIpinfo { res in
            let lat = res[0]
            let lng = res[1]
            self.getEvents(keyword: keyword, category: category, distance: distance, lat: lat, lng: lng) { response in
                self.events = response.sorted{ (event1, event2) -> Bool in
                    if let date1 = event1.date, let date2 = event2.date {
                        if date1 < date2 {
                            return true
                        } else if date1 == date2 {
                            if let time1 = event1.time, let time2 = event2.time {
                                return time1 < time2
                            }
                        }
                    }
                    return false
                }

//                print("Search Results:")
//                print(self.events)
//                print("")
            }
        }
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
            self.isLoaded = true
            self.isLoading = false
        }
                
    }
    
    func getEventsNotAutoDetect(keyword: String, category: String, distance: String, location: String) {
        self.isLoading = true
        self.isLoaded = false
        
        self.getGeoCode(location: location) { res in
            let lat = res[0]
            let lng = res[1]
            self.getEvents(keyword: keyword, category: category, distance: distance, lat: lat, lng: lng) { response in
                self.events = response.sorted { (event1, event2) -> Bool in
                    if let date1 = event1.date, let date2 = event2.date {
                        if date1 < date2 {
                            return true
                        } else if date1 == date2 {
                            if let time1 = event1.time, let time2 = event2.time {
                                return time1 < time2
                            }
                        }
                    }
                    return false
                }

                print("Search Results:")
                print(self.events)
                print("")
                            
            }
        }
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
            self.isLoaded = true
            self.isLoading = false
        }
    }
    
    
    func getAllDetails(id: String) {
        self.getEventDetailsPriv(id: id) { res in
            self.eventDetails = res
            print("")
            print("Event Details:")
            print(self.eventDetails)
            print("")
            
            let name = res.venueName
            self.getVenueDetailsPriv(keyword: name ?? "") { response1 in
                self.venueDetails = response1
                print("")
                print("Venue Details:")
                print(self.venueDetails)
                print("")
            }
            
            print("")
            print("musicArtists:")
            print(self.musicRelatedArtists)
            print("")
            //                add spotify api function here...
            
            self.searchArtistPriv(artists: self.musicRelatedArtists) { response2 in
                self.musicArtistsDetails = response2
                print("")
                print("finalMusicArtistsDetails:")
                print(self.musicArtistsDetails)
                print("")
                self.musicArtistsDataLoaded = true
            }
            
            
            
            
            
        }
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
            self.eventDetails.loadedOrNot = true
        }
    }
    

    
    func addFavoriteItem() {
        self.favorites.append(FavoriteItemModel(id: self.eventDetails.id, date: self.eventDetails.date, eventName: self.eventDetails.eventName, genres: self.eventDetails.genres, venueName: self.eventDetails.venueName))    }
    
    func removeFavoriteItem() {
        if let index = self.favorites.firstIndex(where: { $0.id == self.eventDetails.id }) {
            favorites.remove(at: index)
        }
    }
    
    
    func reset() {
        
        self.events = []
        self.eventDetails = EventDetailModel(id: "")
        self.venueDetails = VenueDetailModel(id: "")
        self.musicRelatedArtists = []
        self.musicArtistsDetails = []
//        self.musicArtistAlbumsDetails = []
        
        self.isLoaded = false
        self.isLoading = false
        self.musicArtistsDataLoaded = false

    }
}

