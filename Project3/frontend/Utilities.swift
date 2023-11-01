import Foundation
import SwiftUI

extension View {
    func hideKeyboard() {
        UIApplication.shared.sendAction(#selector(UIResponder.resignFirstResponder), to: nil, from: nil, for: nil)
    }
}


// Code Reference: This code block refers to the content of this link: "https://developer.apple.com/forums/thread/708933"
extension Array: RawRepresentable where Element: Codable {
    public init?(rawValue: String) {
        guard let data: Data = rawValue.data(using: .utf8),
              let result: [Element] = try? JSONDecoder().decode([Element].self, from: data)
        else {
            return nil
        }
        self = result
    }
    public var rawValue: String {
        guard let data: Data = try? JSONEncoder().encode(self),
              let result: String = String(data: data, encoding: .utf8)
        else {
            return "[]"
        }
        return result
    }
}


struct IfView<Content: View, TrueContent: View>: View {
    let condition: Bool
    let content: Content
    let transform: (Content) -> TrueContent
    
    init(condition: Bool, @ViewBuilder content: @escaping () -> Content, @ViewBuilder transform: @escaping (Content) -> TrueContent) {
        self.condition = condition
        self.content = content()
        self.transform = transform
    }
    
    var body: some View {
        if condition {
            transform(content)
        } else {
            content
        }
    }
}

extension View {
    func `if`<TrueContent: View>(_ condition: Bool, transform: @escaping (Self) -> TrueContent) -> some View {
        IfView(condition: condition, content: { self }, transform: transform)
    }
}



// Code Reference: This code block refer to the link provided by HW9 iOS Description PDF: "https://stackoverflow.com/questions/56550135/swiftui-global-overlay-that-can-be-triggered-from-any-view"
struct Toast<Presenting>: View where Presenting: View {
    
    /// The binding that decides the appropriate drawing in the body.
    @Binding var isShowing: Bool
    /// The view that will be "presenting" this toast
    let presenting: () -> Presenting
    /// The text to show
    let text: Text
    
    var body: some View {
        
        if self.isShowing {
            DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
                withAnimation {
                    self.isShowing = false
                }
            }
        }
        
        return GeometryReader { geometry in
            
            ZStack(alignment: Alignment.bottom) {
                
                self.presenting()
                
                HStack(alignment: .bottom) {
                    self.text
                }
                .frame(width: geometry.size.width * 0.6,
                       height: geometry.size.height / 7)
                .background(Color.secondary.colorInvert())
                .foregroundColor(Color.primary)
                .cornerRadius(20)
                .transition(.slide)
                .opacity(self.isShowing ? 1 : 0)
                
            }
        }
    }
}

extension View {
    func toast(isShowing: Binding<Bool>, text: Text) -> some View {
        Toast(isShowing: isShowing, presenting: { self }, text: text)
    }
}
