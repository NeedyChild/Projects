import SwiftUI
import CoreLocation
import MapKit

struct VenueView: View {
    @EnvironmentObject var eventSearchViewModel: EventSearchViewModel
    @State private var showMap = false
    
    var body: some View {
        
        VStack {
            VStack(alignment: .center) {
                Text(eventSearchViewModel.eventDetails.eventName ?? "")
                    .font(Font.title2)
                    .fontWeight(.bold)
                    .padding(.bottom)
                    .padding(.horizontal)
                    .lineLimit(1)
                
                VStack {
                    Text("Name").font(Font.title3).fontWeight(.bold)
                    Text(eventSearchViewModel.eventDetails.venueName ?? "")
                        .foregroundColor(Color.secondary)
                }
                .padding(.bottom)
                .padding(.horizontal)
                
                if(eventSearchViewModel.venueDetails.address != "") {
                    VStack {
                        Text("Address").font(Font.title3).fontWeight(.bold)
                        Text(eventSearchViewModel.venueDetails.address ?? "")
                            .foregroundColor(Color.secondary)
                    }
                    .padding(.bottom)
                    .padding(.horizontal)
                }
                
                if(eventSearchViewModel.venueDetails.phoneNumber != "") {
                    VStack {
                        Text("Phone Number").font(Font.title3).fontWeight(.bold)
                        Text(eventSearchViewModel.venueDetails.phoneNumber ?? "")
                            .foregroundColor(Color.secondary)
                    }
                    .padding(.bottom)
                    .padding(.horizontal)
                }
                
                if(eventSearchViewModel.venueDetails.openHours != "") {
                    VStack {
                        Text("Open Hours")
                            .font(Font.title3)
                            .fontWeight(.bold)
                        ScrollView {
                            VStack {
                                Text(eventSearchViewModel.venueDetails.openHours ?? "")
                            }
                        }
                        .frame(height: 50)
                        .foregroundColor(Color.secondary)
                    }
                    .padding(.bottom, 2)
                    .padding(.horizontal)
                }
                
                if(eventSearchViewModel.venueDetails.generalRule != "") {
                    VStack {
                        Text("General Rule")
                            .font(Font.title3)
                            .fontWeight(.bold)
                        ScrollView {
                            VStack {
                                Text(eventSearchViewModel.venueDetails.generalRule ?? "")
                            }
                        }
                        .frame(height: 70)
                        .foregroundColor(Color.secondary)
                    }
                    .padding(.bottom, 2)
                    .padding(.horizontal)
                }
                
                if(eventSearchViewModel.venueDetails.childRule != "") {
                    VStack {
                        Text("Child Rule")
                            .font(Font.title3)
                            .fontWeight(.bold)
                        ScrollView {
                            VStack {
                                Text(eventSearchViewModel.venueDetails.childRule ?? "")
                            }
                        }
                        .frame(height: 70)
                        .foregroundColor(Color.secondary)
                    }
                    .padding(.bottom, 2)
                    .padding(.horizontal)
                }

                
                Button {
                    showMap = true
                } label: {
                    Spacer()
                    Text("Show venue on maps")
                    Spacer()
                }
                .frame(width: 200, height: 50, alignment: .center)
                .background(Color.red)
                .foregroundColor(Color.white)
                .cornerRadius(13)
                .padding(.horizontal)
                .padding(.bottom)
                
                Spacer()
            }
        }
        .frame(maxHeight: .infinity)
        .sheet(isPresented: $showMap) {
            MapSheetView(region: MKCoordinateRegion(center: CLLocationCoordinate2D(
                            latitude: Double(eventSearchViewModel.venueDetails.lat ?? "0") ?? 0,
                            longitude: Double(eventSearchViewModel.venueDetails.lng ?? "0") ?? 0),
                                                    span: MKCoordinateSpan(latitudeDelta: 0.01, longitudeDelta: 0.01)),
                         place: Marker(lat: Double(eventSearchViewModel.venueDetails.lat ?? "0") ?? 0,
                                              lng: Double(eventSearchViewModel.venueDetails.lng ?? "0") ?? 0))
        }
    }
}

struct VenueView_Previews: PreviewProvider {
    static var previews: some View {
        VenueView()
    }
}
