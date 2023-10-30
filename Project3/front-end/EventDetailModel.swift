//
//  EventDetailModel.swift
//  TicketMasterSearch
//
//  Created by Qiangli Shi on 4/13/23.
//

import Foundation

struct EventDetailModel: Codable, Identifiable {
    var id: String
    
    var eventName: String?
    var date: String?
    var artistOrTeam: String?
    var venueName: String?
    var genres: String?
    var priceRange: String?
    var ticketStatus: String?
    var imageUrl: String?
    var buyTicketAtUrl: String?
    var loadedOrNot: Bool = false
}
