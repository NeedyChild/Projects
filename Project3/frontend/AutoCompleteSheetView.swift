import SwiftUI

struct AutoCompleteSheetView: View {
    
    @Environment(\.presentationMode) var presentationMode
    @EnvironmentObject var eventSearchViewModel: EventSearchViewModel
    @Binding var autoCompleteKeyword: String
    var body: some View {
        VStack {
            if (eventSearchViewModel.autoCompletionResults.count == 0) {
                ProgressView(label: {Text("loading...")})
                    .frame( width: 490, height: 38 )
            }
            else {
                Text("Suggestions")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .padding(.top)
                
                Form {
                    ForEach(eventSearchViewModel.autoCompletionResults, id: \.self) { result in
                        Text(result)
                            .onTapGesture {
                                self.presentationMode.wrappedValue.dismiss()
                                autoCompleteKeyword = result
                            }
                        
                    }
                }
            }

        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .gesture(
            DragGesture(minimumDistance: 20, coordinateSpace: .local)
                .onEnded { value in
                    if value.translation.height > 0 {
                        self.presentationMode.wrappedValue.dismiss()
                    }
                }
        )
        .edgesIgnoringSafeArea(.all)
    }
}

