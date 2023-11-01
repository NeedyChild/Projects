import SwiftUI

struct FavoritesView: View {
    @EnvironmentObject var eventSearchViewModel: EventSearchViewModel
    
    func removeRow(at offsets: IndexSet) {
        eventSearchViewModel.favorites.remove(atOffsets: offsets)
    }
    
    var body: some View {
        if(eventSearchViewModel.favorites.count != 0) {
            List {
                ForEach(eventSearchViewModel.favorites) {row in
                    FavoritesItem(date: row.date ?? "", eventName: row.eventName ?? "", genres: row.genres ?? "", venueName: row.venueName ?? "")
                }
                .onDelete(perform: removeRow)
            }
        } else {
            Text("No favorites found").foregroundColor(Color.red)
        }
    }
}

struct FavoritesItem: View {
    let date: String
    let eventName: String
    let genres: String
    let venueName: String
    
    var body: some View {
        HStack {
            Text(date).multilineTextAlignment(.leading).font(.caption)
            Text(eventName).multilineTextAlignment(.leading).font(.caption).lineLimit(2)
            Text(genres).multilineTextAlignment(.leading).font(.caption)
            Text(venueName).multilineTextAlignment(.leading).font(.caption)
        }
    }
}

struct FavoritesView_Previews: PreviewProvider {
    static var previews: some View {
        FavoritesView()
    }
}
