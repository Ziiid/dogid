import Capacitor
import Vision
import UIKit

@objc(BackgroundRemovalPlugin)
public class BackgroundRemovalPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "BackgroundRemovalPlugin"
    public let jsName = "BackgroundRemoval"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "removeBackground", returnType: CAPPluginReturnPromise)
    ]

    @objc func removeBackground(_ call: CAPPluginCall) {
        guard let base64 = call.getString("base64"),
              let data = Data(base64Encoded: base64),
              let image = UIImage(data: data),
              let cgImage = image.cgImage else {
            call.reject("Ogiltig bilddata")
            return
        }

        DispatchQueue.global(qos: .userInitiated).async {
            if let pngData = Self.cutOutSubject(cgImage: cgImage) {
                call.resolve(["base64": pngData.base64EncodedString(), "removed": true])
            } else if let fallback = image.pngData() {
                // Ingen bakgrundsborttagning möjlig (äldre iOS eller inget motiv
                // hittades) — spara originalbilden som PNG ändå.
                call.resolve(["base64": fallback.base64EncodedString(), "removed": false])
            } else {
                call.reject("Kunde inte bearbeta bilden")
            }
        }
    }

    private static func cutOutSubject(cgImage: CGImage) -> Data? {
        guard #available(iOS 17.0, *) else { return nil }

        let request = VNGenerateForegroundInstanceMaskRequest()
        let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])

        do {
            try handler.perform([request])
            guard let result = request.results?.first, !result.allInstances.isEmpty else {
                return nil
            }

            let maskedPixelBuffer = try result.generateMaskedImage(
                ofInstances: result.allInstances,
                from: handler,
                croppedToInstancesExtent: true
            )

            let ciImage = CIImage(cvPixelBuffer: maskedPixelBuffer)
            let context = CIContext()
            guard let outputCgImage = context.createCGImage(ciImage, from: ciImage.extent) else {
                return nil
            }

            return UIImage(cgImage: outputCgImage).pngData()
        } catch {
            return nil
        }
    }
}
