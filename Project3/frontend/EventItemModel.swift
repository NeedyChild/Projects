//
//  EventItemModel.swift
//  TicketMasterSearch
//
//  Created by Qiangli Shi on 4/12/23.
//

import Foundation

struct EventItemModel: Identifiable, Codable {
    var id: String
    
    var date: String?
    var time: String?
    var eventName: String?
    var venueName: String?
    var imageUrl: String?
    
}
