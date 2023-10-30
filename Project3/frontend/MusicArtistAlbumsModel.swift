//
//  MusicArtistAlbumsModel.swift
//  TicketMasterSearch
//
//  Created by Qiangli Shi on 4/15/23.
//

import Foundation

struct MusicArtistAlbumsModel: Codable, Identifiable {
    var id: String
    
    var firstHref: String?
    var secondHref: String?
    var thirdHref: String?
}
