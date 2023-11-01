import SwiftUI

@main
struct TicketMasterSearchApp: App {
    @StateObject var eventSearchViewModel = EventSearchViewModel()
    var body: some Scene {
        WindowGroup {
            ContentView().environmentObject(eventSearchViewModel)
        }
    }
}

