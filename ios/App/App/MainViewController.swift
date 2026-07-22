import Capacitor
import WebKit

// CAPBridgeViewController.loadView() är `final` och sätter sin egen interna
// WebViewDelegationHandler som uiDelegate, så en override av WKUIDelegate-metoder
// direkt i MainViewController anropas aldrig. Den här proxyn tar över webView.uiDelegate
// efter att Capacitor satt upp sitt, stänger av den inbyggda long-press-kontextmenyn
// (Look Up / Visual Look Up / Save Image), och vidarebefordrar allt annat oförändrat
// till Capacitors egen handler via Objective-C message forwarding.
class ContextMenuDisablingUIDelegate: NSObject, WKUIDelegate {
    weak var original: WKUIDelegate?

    init(original: WKUIDelegate?) {
        self.original = original
    }

    func webView(
        _ webView: WKWebView,
        contextMenuConfigurationForElement elementInfo: WKContextMenuElementInfo,
        completionHandler: @escaping (UIContextMenuConfiguration?) -> Void
    ) {
        completionHandler(nil)
    }

    override func responds(to aSelector: Selector!) -> Bool {
        if super.responds(to: aSelector) {
            return true
        }
        return original?.responds(to: aSelector) ?? false
    }

    override func forwardingTarget(for aSelector: Selector!) -> Any? {
        if super.responds(to: aSelector) {
            return nil
        }
        return original
    }
}

class MainViewController: CAPBridgeViewController {
    private var contextMenuDelegate: ContextMenuDisablingUIDelegate?

    override open func capacitorDidLoad() {
        bridge?.registerPluginInstance(BackgroundRemovalPlugin())

        if let webView = self.webView {
            let proxy = ContextMenuDisablingUIDelegate(original: webView.uiDelegate)
            contextMenuDelegate = proxy
            webView.uiDelegate = proxy
        }
    }
}
