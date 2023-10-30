//
//  TicketMasterSearchApp.swift
//  TicketMasterSearch
//
//  Created by Qiangli Shi on 4/11/23.
//

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

