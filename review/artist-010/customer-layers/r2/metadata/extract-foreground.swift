import CoreImage
import Foundation
import Vision

guard CommandLine.arguments.count == 3 else {
    fputs("usage: swift extract-foreground.swift <source.png> <mask.png>\n", stderr)
    exit(2)
}

let sourceURL = URL(fileURLWithPath: CommandLine.arguments[1])
let outputURL = URL(fileURLWithPath: CommandLine.arguments[2])

guard let sourceImage = CIImage(contentsOf: sourceURL) else {
    fputs("unable to read source image\n", stderr)
    exit(3)
}

let request = VNGenerateForegroundInstanceMaskRequest()
let handler = VNImageRequestHandler(ciImage: sourceImage, orientation: .up)
try handler.perform([request])

guard let observation = request.results?.first else {
    fputs("foreground segmentation returned no result\n", stderr)
    exit(4)
}

let scaledMask = try observation.generateScaledMaskForImage(
    forInstances: observation.allInstances,
    from: handler
)
let maskImage = CIImage(cvPixelBuffer: scaledMask)
let context = CIContext(options: [.cacheIntermediates: false])

guard let colorSpace = CGColorSpace(name: CGColorSpace.linearGray) else {
    fputs("unable to create grayscale color space\n", stderr)
    exit(5)
}

try context.writePNGRepresentation(
    of: maskImage,
    to: outputURL,
    format: .L8,
    colorSpace: colorSpace,
    options: [:]
)
