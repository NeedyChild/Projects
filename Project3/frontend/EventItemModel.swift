import Foundation

struct EventItemModel: Identifiable, Codable {
    var id: String
    
    var date: String?
    var time: String?
    var eventName: String?
    var venueName: String?
    var imageUrl: String?
    
}
