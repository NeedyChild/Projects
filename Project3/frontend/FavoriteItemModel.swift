import Foundation

struct FavoriteItemModel: Equatable, Codable, Identifiable {
    var id: String

    var date: String?
    var eventName: String?
    var genres: String?
    var venueName: String?
}
