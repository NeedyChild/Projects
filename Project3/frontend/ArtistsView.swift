import SwiftUI
import Kingfisher

struct ArtistsView: View {
    @EnvironmentObject var eventSearchViewModel: EventSearchViewModel
    
    var body: some View {
        if(eventSearchViewModel.musicRelatedArtists.count == 0) {
            VStack(alignment: .center) {
                Text("No music related artist")
                    .font(.title)
                    .fontWeight(.bold)
                    .padding(.horizontal)
                Text("details to show")
                    .font(.title)
                    .fontWeight(.bold)
                    .padding(.horizontal)
            }
        } else {
            if eventSearchViewModel.musicArtistsDataLoaded == true {
                ScrollView {
                    VStack(alignment: .center) {
                        ForEach(eventSearchViewModel.musicArtistsDetails.indices, id: \.self) { i in
                            let artist = eventSearchViewModel.musicArtistsDetails[i]
                            var popPercentage = Double(artist.popularity!)!
                            
                            VStack {
                                HStack(alignment: .top) {
                                    KFImage(URL(string: artist.imgHref ?? "")!)
                                        .resizable()
                                        .aspectRatio(contentMode: .fit)
                                        .cornerRadius(5)
                                        .padding(.leading, 2)
                                        .frame(width: 100, height: 100)
                                    VStack(alignment: .leading) {
                                        Text(artist.artistName ?? "")
                                            .fontWeight(.bold).font(Font.system(size: 19))
                                            .padding(.bottom, 6)
                                        HStack {
                                            Text(artist.followers ?? "")
                                                .fontWeight(.bold).font(Font.system(size: 16))
                                            Text("Followers").font(Font.system(size: 13)).lineLimit(1)
                                        }
                                        .padding(.bottom, 5)
                                        HStack {
                                            Image("Spotify")
                                                .resizable()
                                                .frame(width: 35, height: 35)
                                                .padding(.trailing, 2)
                                            Link("Spotify", destination: URL(string: artist.spotifyLink ?? "")!)
                                                .foregroundColor(Color.green)
                                        }
                                    }
                                    .padding(.horizontal, 10)
                                    
                                    VStack {
                                        Text("Popularity").font(Font.system(size: 17))
                                            .padding(.bottom, 1)
                                        
                                        
                                        ZStack {
                                            Circle()
                                                .stroke(Color.orange.opacity(0.5), lineWidth: 13)
                                                .frame(width: 50, height: 80)
                                            Circle().trim(from: 0, to: CGFloat(popPercentage / 100)).stroke(Color.orange, lineWidth: 13)
                                                .frame(width: 50, height: 80)
                                            Text(artist.popularity ?? "")
                                        }
                                        

                                        
                                    }
                                    .padding(.trailing, 3)
                                    
                                }
                                .padding(.vertical)
                                
                                HStack {
                                    Text("Popular Albums")
                                        .fontWeight(.bold).font(Font.system(size: 19))
                                        .padding(.bottom, 14)
                                    Spacer()

                                }
                                .padding(.leading)
                                
                                HStack {
                                    KFImage(URL(string: artist.firstHref ?? "")!)
                                        .resizable()
                                        .aspectRatio(contentMode: .fit)
                                        .cornerRadius(5)
                                        .padding(.leading, 5)
                                    Spacer()
                                    KFImage(URL(string: artist.secondHref ?? "")!)
                                        .resizable()
                                        .aspectRatio(contentMode: .fit)
                                        .cornerRadius(5)
                                        .padding(.horizontal, 5)
                                        
                                    Spacer()
                                    KFImage(URL(string: artist.thirdHref ?? "")!)
                                        .resizable()
                                        .aspectRatio(contentMode: .fit)
                                        .cornerRadius(5)
                                        .padding(.trailing)
                                }
                                .padding(.leading)
                                .padding(.bottom)
                                
                                    
                            }
                            .foregroundColor(Color.white)
                            .frame(height: 300)
                            .background(Color(white: 0.3).cornerRadius(8))
                            .padding(.all)
                            
                        }

                    }
                }
            } else {
                ProgressView()
            }

            

            
        }


    }
}

struct ArtistsView_Previews: PreviewProvider {
    static var previews: some View {
        ArtistsView()
    }
}
