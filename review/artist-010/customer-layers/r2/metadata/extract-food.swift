import CoreImage
import Foundation
import Vision

guard CommandLine.arguments.count == 3 else {
    fputs("usage: swift extract-food.swift <source.png> <mask.png>\n", stderr)
    exit(2)
}

let sourceURL = URL(fileURLWithPath: CommandLine.arguments[1])
let outputURL = URL(fileURLWithPath: CommandLine.arguments[2])

guard let sourceImage = CIImage(contentsOf: sourceURL) else {
    fputs("unable to read source image\n", stderr)
    exit(3)
}

struct Crop {
    let id: String
    let x: CGFloat
    let y: CGFloat
    let width: CGFloat
    let height: CGFloat
}

// 좌표는 승인 FHD 화면의 좌상단 원점이다. 손에 든 꼬치·잔과 카메라·주문표는 제외하고
// 카운터에 접지한 접시·잔·그릇만 작은 crop으로 분할한다.
let crops = [
    Crop(id: "seat-01", x: 150, y: 440, width: 220, height: 140),
    Crop(id: "seat-02", x: 405, y: 445, width: 240, height: 135),
    Crop(id: "seat-03-plate", x: 670, y: 490, width: 175, height: 90),
    Crop(id: "seat-03-bowl", x: 845, y: 460, width: 90, height: 85),
    Crop(id: "seat-03-glass", x: 910, y: 450, width: 75, height: 110),
    Crop(id: "seat-04", x: 1015, y: 480, width: 165, height: 100),
    Crop(id: "seat-05", x: 1320, y: 515, width: 135, height: 65),
    Crop(id: "seat-06", x: 1540, y: 470, width: 220, height: 115),
]

let fullWidth = sourceImage.extent.width
let fullHeight = sourceImage.extent.height
var combined = CIImage(color: .black).cropped(to: sourceImage.extent)

for crop in crops {
    let cropRect = CGRect(
        x: crop.x,
        y: fullHeight - crop.y - crop.height,
        width: crop.width,
        height: crop.height
    )
    let localImage = sourceImage
        .cropped(to: cropRect)
        .transformed(by: CGAffineTransform(translationX: -cropRect.minX, y: -cropRect.minY))

    let request = VNGenerateForegroundInstanceMaskRequest()
    let handler = VNImageRequestHandler(ciImage: localImage, orientation: .up)
    try handler.perform([request])

    guard let observation = request.results?.first else {
        fputs("foreground segmentation returned no result for \(crop.id)\n", stderr)
        exit(4)
    }

    let pixelBuffer = try observation.generateScaledMaskForImage(
        forInstances: observation.allInstances,
        from: handler
    )
    let localMask = CIImage(cvPixelBuffer: pixelBuffer)
        .transformed(
            by: CGAffineTransform(
                translationX: cropRect.minX,
                y: cropRect.minY
            )
        )
    combined = localMask.applyingFilter(
        "CIMaximumCompositing",
        parameters: [kCIInputBackgroundImageKey: combined]
    )
}

let context = CIContext(options: [.cacheIntermediates: false])
guard let colorSpace = CGColorSpace(name: CGColorSpace.linearGray) else {
    fputs("unable to create grayscale color space\n", stderr)
    exit(5)
}

try context.writePNGRepresentation(
    of: combined,
    to: outputURL,
    format: .L8,
    colorSpace: colorSpace,
    options: [:]
)
