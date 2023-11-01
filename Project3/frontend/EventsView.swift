import SwiftUI
import Kingfisher
import SwiftUI_SimpleToast

struct EventsView: View {
    @EnvironmentObject var eventSearchViewModel: EventSearchViewModel
    
    @State private var justAdded: Bool = false
    @State private var showToast: Bool = false
    @State private var addOrRemove: Int = 0
    
    
    var body: some View {
        var isAdded: Bool = eventSearchViewModel.favorites.contains(where: {$0.id == eventSearchViewModel.eventDetails.id})
        
        
        VStack {
            if (eventSearchViewModel.eventDetails.loadedOrNot == true) {
                HStack(alignment: .top) {
                    Text(eventSearchViewModel.eventDetails.eventName ?? "")
                        .font(Font.title)
                        .fontWeight(.bold)
                        .lineLimit(1)
                        .padding(.bottom)
                }
                
                InfoSection
                
                if (!isAdded) {
                    Button {
                        eventSearchViewModel.addFavoriteItem()
                        showToast.toggle()
                        isAdded.toggle()
                    } label: {
                        HStack {
                            Spacer()
                            Text("Save Event")
                            Spacer()
                        }
                    }
                    .frame(width: 125, height: 47, alignment: .center)
                    .background(Color.blue)
                    .foregroundColor(Color.white)
                    .cornerRadius(13)
                    .padding(.bottom)
                    
                } else {
                    Button  {
                        eventSearchViewModel.removeFavoriteItem()
                        showToast.toggle()
                        isAdded.toggle()
                    } label: {
                        HStack {
                            Spacer()
                            Text("Remove F...")
                                .lineLimit(1)
                            Spacer()
                        }
                    }
                    .frame(width: 125, height: 47, alignment: .center)
                    .background(Color.red)
                    .foregroundColor(Color.white)
                    .cornerRadius(13)
                    .padding(.bottom)

                }
                
                KFImage(URL(string: eventSearchViewModel.eventDetails.imageUrl ?? "")!)
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                
                HStack(alignment: .center) {
                    Text("Buy Ticket At:").fontWeight(.bold)
                    
                    if let buyTicketAtUrl = eventSearchViewModel.eventDetails.buyTicketAtUrl, let url = URL(string: buyTicketAtUrl) {
                        Link("Ticketmaster", destination: url)
                    }
                }
                .padding(.vertical)
                
                HStack(alignment: .center) {
                    Text("Share on:").fontWeight(.bold)
//                    Image("Facebook").resizable().frame(width: 45, height: 45)
                    
                    if let buyTicketAtUrl = eventSearchViewModel.eventDetails.buyTicketAtUrl,
                       let encodedBuyTicketAtUrl = buyTicketAtUrl.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) {
                        let facebookUrlString = "https://www.facebook.com/sharer/sharer.php?u=\(encodedBuyTicketAtUrl)"
                        
                        let name: String = eventSearchViewModel.eventDetails.eventName ?? ""
                        if let encodedName = name.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) {
                            let twitterUrlString = "https://twitter.com/intent/tweet?text=\(encodedName)%0D%0A&url=\(encodedBuyTicketAtUrl)"
                            
                            if let facebookUrl = URL(string: facebookUrlString), let twitterUrl = URL(string: twitterUrlString) {
                                Link(destination: facebookUrl) {
                                    Image("Facebook").resizable().frame(width: 48, height: 48)
                                }

                                Link(destination: twitterUrl) {
                                    Image("Twitter").resizable().frame(width: 48, height: 48)
                                }
                            }
                        }
                    }

                    
                    if let buyTicketAtUrl = eventSearchViewModel.eventDetails.buyTicketAtUrl {
                        let facebookUrlString = "https://www.facebook.com/sharer/sharer.php?u=\(buyTicketAtUrl)"
                        let name: String = eventSearchViewModel.eventDetails.eventName ?? ""
                        let twitterUrlString = "https://twitter.com/intent/tweet?text=\(name)%0D%0A&url=\(buyTicketAtUrl)"

                        if let facebookUrl = URL(string: facebookUrlString), let twitterUrl = URL(string: twitterUrlString) {
                            Link(destination: facebookUrl) {
                                Image("Facebook").resizable().frame(width: 48, height: 48)
                            }

                            Link(destination: twitterUrl) {
                                Image("Twitter").resizable().frame(width: 48, height: 48)
                            }
                        }
                    }
                }


            } else {
                HStack {
                    Spacer()
                    ProgressView(label: {Text("Please wait...")})
                    Spacer()
                }
            }

        }
        .padding(.all)
        .toast(isShowing: $showToast, text: isAdded ?  Text("Added to favorites.") : Text("Remove Favorite"))
    }
    
    var InfoSection: some View {
        VStack {
            
            VStack {
                HStack {
                    Text("Date").fontWeight(.bold)
                    Spacer()
                    Text("Artist | Team").fontWeight(.bold)
                }
                HStack {
                    Text(eventSearchViewModel.eventDetails.date ?? "")
                        .foregroundColor(Color.secondary)
                        .lineLimit(1)
                    
                    Spacer()
                    
                    Text(eventSearchViewModel.eventDetails.artistOrTeam ?? "")
                        .foregroundColor(Color.secondary)
                        .lineLimit(1)
                }
            }
            .padding(.bottom)
            
            VStack {
                HStack {
                    Text("Venue").fontWeight(.bold)
                    Spacer()
                    Text("Genre").fontWeight(.bold)
                }
                HStack {
                    Text(eventSearchViewModel.eventDetails.venueName ?? "")
                        .foregroundColor(Color.secondary)
                        .lineLimit(1)
                    
                    Spacer()
                    
                    Text(eventSearchViewModel.eventDetails.genres ?? "")
                        .foregroundColor(Color.secondary)
                        .lineLimit(1)
                }
            }
            .padding(.bottom)
            
            HStack(alignment: .top) {
                VStack(alignment: .leading) {
                    Text("Price Range").fontWeight(.bold)
                    Text(eventSearchViewModel.eventDetails.priceRange ?? "")
                        .foregroundColor(Color.secondary)
                        .lineLimit(1)
                }
                
                Spacer()
                
                VStack(alignment: .trailing, spacing: 3) {
                    Text("Ticket Status").fontWeight(.bold)
                    
                    if (eventSearchViewModel.eventDetails.ticketStatus == "Onsale") {
                        Text("Onsale")
                            .font(.headline)
                            .foregroundColor(.white)
                            .padding(.horizontal, 10)
                            .padding(.vertical, 5)
                            .background(
                                RoundedRectangle(cornerRadius: 10)
                                    .fill(Color.green)
                            )
                    } else if (eventSearchViewModel.eventDetails.ticketStatus == "Canceled") {
                        Text("Canceled")
                            .font(.headline)
                            .foregroundColor(.white)
                            .padding(.horizontal, 10)
                            .padding(.vertical, 5)
                            .background(
                                RoundedRectangle(cornerRadius: 10)
                                    .fill(Color.black)
                            )
                    } else if(eventSearchViewModel.eventDetails.ticketStatus == "Offsale") {
                        Text("Offsale")
                            .font(.headline)
                            .foregroundColor(.white)
                            .padding(.horizontal, 10)
                            .padding(.vertical, 5)
                            .background(
                                RoundedRectangle(cornerRadius: 10)
                                    .fill(Color.red)
                            )
                    } else {
                        Text(eventSearchViewModel.eventDetails.ticketStatus ?? "")
                            .font(.headline)
                            .foregroundColor(.white)
                            .padding(.horizontal, 10)
                            .padding(.vertical, 5)
                            .background(
                                RoundedRectangle(cornerRadius: 10)
                                    .fill(Color.orange)
                            )

                    }
                }
            }
            .padding(.bottom)
            
            
//            VStack(spacing: 0) {
//                HStack {
//                    Text("Price Range").fontWeight(.bold)
//                    Spacer()
//                    Text("Ticket Status").fontWeight(.bold)
//                }
//                HStack {
//                    VStack {
//                        Text(eventSearchViewModel.eventDetails.priceRange ?? "")
//                            .foregroundColor(Color.secondary)
//                            .lineLimit(1)
//                    }
//
//                    Spacer()
//
//                    VStack {
//                        if (eventSearchViewModel.eventDetails.ticketStatus == "Onsale") {
//                            Text("Onsale")
//                                .font(.headline)
//                                .foregroundColor(.white)
//                                .padding(.horizontal, 10)
//                                .padding(.vertical, 5)
//                                .background(
//                                    RoundedRectangle(cornerRadius: 10)
//                                        .fill(Color.green)
//                                )
//                        } else if (eventSearchViewModel.eventDetails.ticketStatus == "Canceled") {
//                            Text("Canceled")
//                                .font(.headline)
//                                .foregroundColor(.white)
//                                .padding(.horizontal, 10)
//                                .padding(.vertical, 5)
//                                .background(
//                                    RoundedRectangle(cornerRadius: 10)
//                                        .fill(Color.black)
//                                )
//                        } else if(eventSearchViewModel.eventDetails.ticketStatus == "Offsale") {
//                            Text("Offsale")
//                                .font(.headline)
//                                .foregroundColor(.white)
//                                .padding(.horizontal, 10)
//                                .padding(.vertical, 5)
//                                .background(
//                                    RoundedRectangle(cornerRadius: 10)
//                                        .fill(Color.red)
//                                )
//                        } else {
//                            Text(eventSearchViewModel.eventDetails.ticketStatus ?? "")
//                                .font(.headline)
//                                .foregroundColor(.white)
//                                .padding(.horizontal, 10)
//                                .padding(.vertical, 5)
//                                .background(
//                                    RoundedRectangle(cornerRadius: 10)
//                                        .fill(Color.orange)
//                                )
//
//                        }
//
//                    }
//                }
//
//            }
//            .padding(.bottom)
        }
    }
    
}



struct EventsView_Previews: PreviewProvider {
    static var previews: some View {
        EventsView()
    }
}
