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
        NSLog("[DogID] removeBackground called")

        guard let base64 = call.getString("base64") else {
            NSLog("[DogID] no base64 string on call")
            call.reject("Ogiltig bilddata")
            return
        }
        guard let data = Data(base64Encoded: base64) else {
            NSLog("[DogID] base64 decode failed")
            call.reject("Ogiltig bilddata")
            return
        }
        guard let image = UIImage(data: data), let cgImage = image.cgImage else {
            NSLog("[DogID] UIImage/cgImage creation failed")
            call.reject("Ogiltig bilddata")
            return
        }

        NSLog("[DogID] input image %.0fx%.0f", image.size.width, image.size.height)

        DispatchQueue.global(qos: .userInitiated).async {
            if let pngData = Self.cutOutSubject(cgImage: cgImage) {
                NSLog("[DogID] segmentation SUCCESS, output bytes: %d", pngData.count)
                call.resolve(["base64": pngData.base64EncodedString(), "removed": true])
            } else if let fallback = image.pngData() {
                NSLog("[DogID] segmentation FAILED/unavailable, falling back to original")
                call.resolve(["base64": fallback.base64EncodedString(), "removed": false])
            } else {
                NSLog("[DogID] could not even encode fallback PNG")
                call.reject("Kunde inte bearbeta bilden")
            }
        }
    }

    private static func cutOutSubject(cgImage: CGImage) -> Data? {
        guard #available(iOS 17.0, *) else {
            NSLog("[DogID] iOS < 17, VNGenerateForegroundInstanceMaskRequest unavailable")
            return nil
        }

        let request = VNGenerateForegroundInstanceMaskRequest()
        let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])

        do {
            try handler.perform([request])
            NSLog("[DogID] vision request performed, results: %d", request.results?.count ?? -1)

            guard let result = request.results?.first else {
                NSLog("[DogID] no results from request")
                return nil
            }

            NSLog("[DogID] instance count: %d", result.allInstances.count)
            guard !result.allInstances.isEmpty else {
                NSLog("[DogID] allInstances empty, nothing detected")
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
                NSLog("[DogID] createCGImage from masked buffer failed")
                return nil
            }

            NSLog("[DogID] masked output %dx%d", outputCgImage.width, outputCgImage.height)
            return UIImage(cgImage: outputCgImage).pngData()
        } catch {
            NSLog("[DogID] vision error: %@", error.localizedDescription)
            return nil
        }
    }
}
