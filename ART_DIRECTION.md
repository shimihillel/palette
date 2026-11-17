# Character art 1.9

Created with the built-in ImageGen tool from the Shimi Looks 1.8.2 character reference. The selected direction was the same character in a more pronounced, artistic fashion illustration style. Generative restyling preserves the visual identity approximately, not pixel-for-pixel.

## Generation prompt

Use case: style-transfer.
Asset type: the central full-body character artwork for Shimi Looks, an interactive fashion color styling app.
Input image 1 is the EDIT TARGET and identity/pose reference.
Primary request: Redraw this same woman as a premium expressive fashion illustration with crisp ink contours and sophisticated matte gouache / colored-pencil textures. It should clearly feel hand-drawn and artistic, with elegant lively expressive linework, a more graphic editorial fashion silhouette, confident well-placed brush marks and refined facial rendering. Not photorealistic, not a 3D render, not cartoon or anime. Keep her recognizable auburn long wavy hair with half-up bun, face orientation and expression, gold hoops and heart necklace. Same full-body pose with one hand in trouser pocket and the other lowered. Keep the V-neck short-sleeve T-shirt tucked into soft drawstring wide-leg trousers, ballet flats and one shoulder bag at her right side as seen by the viewer. Keep proportions and garment silhouettes very close to the reference.
Technical color separation for interactive recoloring: shirt a clear matte lilac/purple, trousers muted sage green, bag and its entire strap deep muted blue, both shoes dusty berry pink. Each garment is one coherent local color with tonal hatching/folds that stay in that color family. Sharp, clean garment boundaries. NO strokes, watercolor splatters or loose color washes outside garment silhouettes. Skin warm peach, hair copper, metal hardware gold; these must be visually distinct from the four garment colors. Gold buckles and jewelry remain gold. Keep the bag strap unobstructed where possible, with exact clean edges across shirt.
Background: solid very pale warm ivory #F7F3EC, tiny soft ground shadow only. No room, scenery, decorative blobs, paper swatches, type or layout.
Composition: one full body figure only, tall portrait around 1024x1792; entire hair and both feet visible, figure fills 93% of height with modest equal margins. Crisp beautiful artwork readable at phone size. No text, watermark, duplicates or panels.

## Winter garments, version 3.4

Two built-in ImageGen clothing edits used the original character illustration as their registration reference. The shirt edit requested fitted lilac jersey sleeves covering both arms to the wrists, with a soft cuff and natural elbow folds. The jacket edit requested an unbuttoned, hip-length emerald jacket with narrow notched lapels and a wide opening showing the lilac shirt. Both requested the original framing, hands, pose, bag and strap, hair, face and full-body pencil and gouache treatment. The source pigments separate the clothing for recoloring.

The runtime uses `assets/long-sleeves-v340.webp` with `assets/long-sleeves-roles-v340.png` for the winter shirt, and `assets/open-jacket-v340.png` for the tintable jacket overlay. The shared summer base supplies the rest of the illustration.

## Shoulder strands and shoes, version 3.5

Each view composites the shoulder strands from its own registered reference using separate hair, shirt and jacket coverage. The source copper pigment and subpixel edges are stored in `assets/shoulder-strands-v350.webp`.

Three built-in ImageGen localized edits of the original cropped feet requested lace-up court sneakers, penny loafers with a stitched apron and keeper strap, and flat Y-strap thong flip-flops with a visible toe post. All three retain the original foot positions, trouser hems and illustration style. `assets/footwear-v350.webp` stores the registered textures and recoloring masks.

The denim jacket in 3.5.1 uses a registered built-in ImageGen edit of the open jacket. The prompt requested medium-blue twill, a shoulder yoke, two flap pockets, buttons and double topstitching within the existing silhouette. The app uses the fabric luminance layer in `assets/denim-jacket-v351.png`, keeping the original coverage for the jacket and each strand of hair.

## Three garments, version 4.0

The built-in ImageGen edit used the original v1.9 full-body illustration. The app uses [the edited character](assets/shimi-trio-v400.webp) and three v400 pigment masks. The additional color is a UI swatch.

Generation prompt:

> Precise object edit of supplied fashion illustration for an interactive garment recoloring application. Keep exact same full body woman, face, hair, expression, pose and framing, ivory background, original drawing and colors. Remove the blue shoulder bag completely including its entire blue strap across the shoulder and torso, removing buckles and hardware. Fill that region naturally with continuous lilac fabric of the T-shirt, sage trouser edge, visible natural arm, and warm ivory background where the bag was. Retain the existing clearly defined V-neck and short sleeves. Remove the necklaces and earrings so accessories are entirely the user's choice. Replace the two dusty rose ballet flats with elegant leather penny loafers with a recognizable keeper strap and stitched apron, no bows and no laces. Both loafers solid dusty berry pink to enable dynamic tinting. Shirt exclusively pale lilac/purple, trousers exclusively sage green, shoes dusty pink, as distinct source pigments. Same face, cropped feet positions and trouser hems, original isolated off-white background, no jacket or bag, no item added, no captions, output the whole full-length portrait with comfortable space around all shoes and hair. Match source image bounding box and original aspect ratio closely.

The 4.0.1 renderer uses a matte registered to the v4 illustration where the curls cross the left shoulder of the shirt as seen by the viewer. The two tiles in `assets/shoulder-strands-v401.webp` store the premultiplied foreground pigment and the shirt's fractional coverage and luminance. The same composite supplies the main canvas, garment detail and downloaded look.

## Personal character, version 4.1

The user approved an illustrated portrait based on two supplied photos, followed by a full-length figure with one hand in a trouser pocket and both forearm tattoos. A final built-in ImageGen edit added three necklaces from a supplied close-up. The figure uses a lilac V-neck T-shirt, olive trousers and burgundy penny loafers as its source colors. The original generated PNG is 1086 × 1448 pixels.

The app asset is `assets/shimi-personal-v410.webp`. The three `art-matte-*-v410.png` assets encode the estimated source fabric RGB and fractional garment coverage in their alpha channels. The renderer subtracts the source fabric contribution and adds the selected color with the same coverage. The personal jewelry and tattoo regions have zero garment coverage. `assets/denim-weave-v410.png` registers the existing denim's fine twill texture to the new trouser shape.

The main canvas, enlarged figure and download use the same 528 × 1448 crop starting at x=232. The full hair silhouette and both soles fit within that crop.

### Final image-generation prompt

> Precise localized jewelry edit. Image 1 is the approved full-body illustration AND edit target. Return the same entire full-length composition, identical canvas framing, exactly the same woman, with only her bare neck now wearing the three personalized necklaces explicitly pictured in reference image 2. Image 2 is exclusively the jewelry design reference. The shortest is a very fine warm gold chain with a small horizontally oriented elongated dark almond-shaped marquise, rimmed with tiny pale stones. The middle delicate warm-toned chain carries a tiny asymmetrical cluster of three light stones. The longest is a fine silvery chain with a bright small round radiating sunburst cluster pendant. Three distinct delicate chains on distinct levels, all following the neck with correct perspective, the tiny middle cluster slightly to one side. For legibility at this scale use a couple of controlled glints; faithful everyday size, no chunky chains or oversize medallions. They rest on the bare skin inside the V, its lowest point framing the sun pendant. Match the subtle pencil and matte color wash material of the original, natural shadow. The facial features, expression, hair and curls, tattoos, pose, clothing, background, paper tone, proportions and shoes are already approved: preserve them precisely. No sunglasses, extra jewelry, writing or props. Full head and both feet visible exactly as in image 1. Only change the neck region.


### Neutral background

A built-in ImageGen background extraction supplied the silhouette coverage for the user-approved personal illustration. The runtime uses that coverage with the existing illustrated pixels, removes the peach paper contribution along translucent edges and composites onto the app's cream background, #F7F3EC. The same composite is used for the main canvas, detail and export.

The extraction prompt requested the full-body illustration as a cutout with the original framing and delicate hair edges, using the approved image as its reference. The coverage is stored in `assets/character-coverage-v410.png`.
