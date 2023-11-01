import SwiftUI
import Kingfisher
struct TestView: View {
    var body: some View {
        VStack {
            HStack(alignment: .top) {
                KFImage(URL(string: "https://i.scdn.co/image/ab6761610000e5eb9e690225ad4445530612ccc9")!)
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .cornerRadius(5)
                    .padding(.leading, 2)
                    .frame(width: 100, height: 100)
                VStack(alignment: .leading) {
                    Text("Ed Sheeran")
                        .fontWeight(.bold).font(Font.system(size: 19))
                        .padding(.bottom, 6)
                    HStack {
                        Text("111M")
                            .fontWeight(.bold).font(Font.system(size: 16))
                        Text("Followers").font(Font.system(size: 13)).lineLimit(1)
                    }
                    .padding(.bottom, 5)
                    HStack {
                        Image("Spotify")
                            .resizable()
                            .frame(width: 35, height: 35)
                            .padding(.trailing, 2)
                        Link("Spotify", destination: URL(string: "https://open.spotify.com/artist/6eUKZXaKkcviH0Ku9w2n3V")!)
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
                        Circle().trim(from: 0, to: 0.91).stroke(Color.orange, lineWidth: 13)
                            .frame(width: 50, height: 80)
                        Text("91")
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
                KFImage(URL(string: "https://i.scdn.co/image/ab6761610000e5eb9e690225ad4445530612ccc9")!)
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .cornerRadius(5)
                    .padding(.leading, 5)
                Spacer()
                KFImage(URL(string: "https://i.scdn.co/image/ab6761610000e5eb9e690225ad4445530612ccc9")!)
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .cornerRadius(5)
                    .padding(.horizontal, 5)
                    
                Spacer()
                KFImage(URL(string: "https://i.scdn.co/image/ab6761610000e5eb9e690225ad4445530612ccc9")!)
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

struct TestView_Previews: PreviewProvider {
    static var previews: some View {
        TestView()
    }
}
