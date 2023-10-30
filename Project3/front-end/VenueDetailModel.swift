//
//  VenueDetailModel.swift
//  TicketMasterSearch
//
//  Created by Qiangli Shi on 4/13/23.
//

import Foundation

struct VenueDetailModel: Codable, Identifiable {
    
//    use venue["id"] as id, or just let id be an empty string ("")
    var id: String
    
//    var venueName: String?
    var address: String?
    var phoneNumber: String?
    var openHours: String?
    var generalRule: String?
    var childRule: String?
    var lat: String?
    var lng: String?
}
