import SwiftUI

struct DetailsTabView: View {
    @State var id: String
    
    @EnvironmentObject var eventSearchViewModel: EventSearchViewModel
    
    var body: some View {
        TabView {
            EventsView()
                .tabItem {
                    Label("Events", systemImage: "text.bubble.fill")
                }
            ArtistsView()
                .tabItem {
                    Label("Artist/Team", systemImage: "guitars.fill")
                }
            VenueView()
                .tabItem {
                    Label("Venue", systemImage: "location.fill")
                }
        }
        .onAppear {
            eventSearchViewModel.getAllDetails(id: id)
        }
        
    }
}

