//
//  MusicArtistModel.swift
//  TicketMasterSearch
//
//  Created by Qiangli Shi on 4/15/23.
//

import Foundation

struct MusicArtistModel: Codable, Identifiable {
    var id: String
    
    var artistName: String?
    var followers: String?
    var popularity: String?
    var spotifyLink: String?
    var imgHref: String?
    var firstHref: String?
    var secondHref: String?
    var thirdHref: String?
}
