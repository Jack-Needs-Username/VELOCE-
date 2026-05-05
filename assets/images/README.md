# Veloce Image Workflow

Use this folder for images that should live inside the Veloce site instead of being loaded from a source page.

For each image, collect:

- The image file, ideally `.jpg` or `.webp`, at least 1200px wide.
- The exact source URL where it came from.
- The photographer/owner credit.
- The license or permission note.
- The car profile it belongs to.
- A useful alt-text description for screen readers.

Recommended filenames:

- `mazda-mx-5-miata-na-nb.jpg`
- `honda-s2000.jpg`
- `bmw-m3-e46.jpg`
- `porsche-911-air-cooled.jpg`
- `porsche-911-997.jpg`
- `porsche-cayman-gt4.jpg`
- `porsche-930-turbo.jpg`
- `toyota-supra-mk4.jpg`
- `acura-honda-nsx-na1-na2.jpg`
- `mazda-rx-7-fd.jpg`
- `nissan-skyline-gt-r-r32-r34.jpg`
- `mitsubishi-lancer-evolution-viii-ix.jpg`

Once the files are in this folder, update the `ownedImages` map in `app.js`:

```js
"porsche-911-air-cooled": {
  src: "assets/images/porsche-911-air-cooled.jpg",
  alt: "Silver air-cooled Porsche 911 viewed from the front three-quarter angle.",
  credit: "Photo: Author name / Wikimedia Commons.",
  sourceUrl: "https://commons.wikimedia.org/wiki/File:example.jpg",
  license: "CC BY-SA 4.0"
}
```

Best source order for this project:

1. Your own photos.
2. Wikimedia Commons images with clear reuse licenses.
3. Manufacturer press images only if the terms allow this kind of school/project use.

Avoid saving images from auction listings, dealer listings, blogs, magazines, or social media unless you have explicit permission.
