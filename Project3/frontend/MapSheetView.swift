//
//  MapSheetView.swift
//  TicketMasterSearch
//
//  Created by Qiangli Shi on 4/16/23.
//

import SwiftUI
import CoreLocation
import MapKit

struct Marker: Identifiable {
    let id: UUID
    let location: CLLocationCoordinate2D
    
    init(lat: Double, lng: Double) {
        self.id = UUID()
        self.location = CLLocationCoordinate2D(latitude: lat, longitude: lng)
    }
}

struct MapSheetView: View {
    @Environment(\.presentationMode) var presentationMode
    @State var region: MKCoordinateRegion
    let place: Marker
    
    var body: some View {
        VStack {
            Map(coordinateRegion: $region, annotationItems: [place]) { place in
                MapMarker(coordinate: place.location, tint: Color.red)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color(.systemBackground))
        .gesture(
            DragGesture(minimumDistance: 20, coordinateSpace: .local)
                .onEnded { value in
                    if value.translation.height > 0 {
                        self.presentationMode.wrappedValue.dismiss()
                    }
                }
        )
        .edgesIgnoringSafeArea(.all)
        .padding(.all)
        
    }
    
}
