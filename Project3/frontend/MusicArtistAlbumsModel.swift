import Foundation

struct MusicArtistAlbumsModel: Codable, Identifiable {
    var id: String
    
    var firstHref: String?
    var secondHref: String?
    var thirdHref: String?
}
