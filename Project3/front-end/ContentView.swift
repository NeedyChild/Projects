//
//  ContentView.swift
//  TicketMasterSearch
//
//  Created by Qiangli Shi on 4/11/23.
//

import SwiftUI
import Alamofire
import Kingfisher
import Combine


struct ContentView: View {
    @EnvironmentObject var eventSearchViewModel: EventSearchViewModel
    @State var keyword: String = ""
    @State var distance: String = "10"
    @State var category: String = "Default"
    @State var location: String = ""
    @State var autoDetect: Bool = false
    
    @State var showAutoCompleteSheet: Bool = false
    @State var showResultTable: Bool = false
    
    var categoryOptions = ["Default", "Music", "Sports", "Arts & Theatre", "Film", "Miscellaneous"]
    
    
    func isFormValid()->Bool {
        if (autoDetect) {
            if(keyword.count > 0 && distance.count > 0) {
                return true
            } else {
                return false
            }
        } else {
            if (keyword.count > 0 && distance.count > 0 && location.count > 0) {
                return true
            } else {
                return false
            }
        }
    }
    
    func submit() {
        hideKeyboard()
        if (autoDetect == true) {
            eventSearchViewModel.getEventsAutoDetect(keyword: keyword, category: category, distance: distance)
        } else {
            eventSearchViewModel.getEventsNotAutoDetect(keyword: keyword, category: category, distance: distance, location: location)
        }
        self.showResultTable = true
    }
    
    func clear() {
        keyword = ""
        distance = "10"
        category = "Default"
        location = ""
        autoDetect = false
        hideKeyboard()
        eventSearchViewModel.reset()
        self.showResultTable = false
    }
    
    var body: some View {
        NavigationView {
            searchForm.navigationTitle("Event Search").toolbar {
                ToolbarItemGroup(placement: .navigationBarTrailing) {
                    NavigationLink(destination: FavoritesView().navigationTitle("Favorites")) {
                        Image(systemName: "heart.circle").foregroundColor(Color.blue)
                    }
                }
            }
        }
    }
    
    var searchForm: some View {
        Form {
            Section{
                HStack{
                    Text("Keyword:").foregroundColor(Color.secondary)
                    TextField("Required", text: $keyword)
                        .onSubmit {
                            if(keyword.count > 0) {
                                showAutoCompleteSheet = true
                                eventSearchViewModel.getAutoCompletions(keyword: keyword)
                            }
                            else {
                                showAutoCompleteSheet = false
                                eventSearchViewModel.autoCompletionResults = [String]()
                            }
                        }
                        .sheet(isPresented: $showAutoCompleteSheet) {
                            AutoCompleteSheetView(autoCompleteKeyword: $keyword)
                        }
        
                }
                
                HStack {
                    Text("Distance:").foregroundColor(Color.secondary)
                    TextField("distance", text: $distance)
                }
                
                HStack {
                    Text("Category:").foregroundColor(Color.secondary)
                    
                    Spacer()
                    
                    Picker("", selection: $category) {
                        ForEach(categoryOptions, id:\.self) { item in
                            Text(item)
                        }
                    }
                    .labelsHidden()
                    .pickerStyle(.menu)
                }
                
                if autoDetect == false {
                    HStack {
                        Text("Location:").foregroundColor(Color.secondary)
                        TextField("Required", text: $location)
                    }
                }
                
                Toggle(isOn: $autoDetect) {
                    HStack {
                        Text("Auto-detect my location").foregroundColor(Color.secondary)
                    }
                }
                
                HStack {
                    Spacer()
                    
                    Button {
                        submit()
                    } label: {
                        HStack {
                            Spacer()
                            Text("Submit")
                            Spacer()
                        }
                    }
                    .frame(width: 110, height: 48, alignment: Alignment.center)
                    .foregroundColor(Color.white)
                    .background(isFormValid() ? Color.red : Color.secondary)
                    .cornerRadius(10)
                    .disabled(!isFormValid())
                                        
                    Spacer()
                    
                    Button {
                        clear()
                    } label: {
                        HStack {
                            Spacer()
                            Text("Clear")
                            Spacer()
                        }
                    }
                    .frame(width: 110, height: 48, alignment: Alignment.center)
                    .foregroundColor(Color.white)
                    .background(Color.blue)
                    .cornerRadius(10)
                    
                    Spacer()

                }
                .buttonStyle(BorderlessButtonStyle())
                .padding(11)
                
            }
            
//            if showResultTable {
//                List {
//                    Text("Results")
//                        .font(.title)
//                        .fontWeight(.bold)
//
//                    if eventSearchViewModel.isLoading {
//                        HStack(alignment: .center) {
//                            ProgressView(label: { Text("Please wait...") })
//                        }
//                        .frame(maxWidth: .infinity, alignment: .center)
//                    } else if eventSearchViewModel.isLoaded && eventSearchViewModel.events.count > 0 {
//                        ForEach(eventSearchViewModel.events.indices, id: \.self) { i in
//                            let event = eventSearchViewModel.events[i]
//                            let dateAndTime = ((event.date!) + "|" + (event.time!))
//
//                            NavigationLink(destination: DetailsTabView(id: event.id)) {
//                                rowItem(dateAndTime: dateAndTime, imageUrl: event.imageUrl!, eventName: event.eventName!, venueName: event.venueName!)
//                            }
//                        }
//                    } else {
//                        Text("No result available")
//                            .foregroundColor(Color.red)
//                    }
//                }
//            }

            if(showResultTable) {
                List {
                    Text("Results").font(.title).fontWeight(.bold)
                    if (eventSearchViewModel.isLoading == false) {
                        if ((eventSearchViewModel.isLoaded == false) || eventSearchViewModel.events.count > 0) {
                            List {

                                ForEach(eventSearchViewModel.events.indices, id: \.self) { i in
                                    let event = eventSearchViewModel.events[i]
                                    let dateAndTime = ((event.date!) + "|" + (event.time!))

//                                    rowItem(dateAndTime: dateAndTime, imageUrl: event.imageUrl!, eventName: event.eventName!, venueName: event.venueName!)
                                    NavigationLink(destination:DetailsTabView(id: event.id)){
                                        rowItem(dateAndTime: dateAndTime, imageUrl: event.imageUrl!, eventName: event.eventName!, venueName: event.venueName!)
                                    }
                                }
                            }

                        } else {
                            List {
                                Text("No result available").foregroundColor(Color.red)
                            }
                        }
                    } else {
                        HStack(alignment: .center) {
                            List {
                                    ProgressView(label: {Text("Please wait...")})

                            }
                            .frame(maxWidth: .infinity, alignment: .center)

                        }

                    }
                }
            }


        }

    }
    
    
}

struct rowItem: View {
    let dateAndTime: String
    let imageUrl: String
    let eventName: String
    let venueName: String
    
    var body: some View {
        HStack {
            
            Text(dateAndTime)
                .frame(width: 80)
                .foregroundColor(Color.secondary)
            
            HStack{
                KFImage(URL(string: imageUrl)!)
                    .resizable()
                    .scaledToFill()
                    .frame(width: 50, height: 50)
                    .cornerRadius(5)
                    .clipped()
            }
            
            Text(eventName)
                .multilineTextAlignment(.leading)
                .lineLimit(3)
                .foregroundColor(Color.black)
                .fontWeight(.bold)
                .frame(width: 70)
            
            Text(venueName)
                .multilineTextAlignment(.leading)
                .lineLimit(3)
                .foregroundColor(Color.secondary)
                .fontWeight(.bold)
                .frame(width: 70)
            
        }
        .frame(height: 70)
        
    }
}


struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
