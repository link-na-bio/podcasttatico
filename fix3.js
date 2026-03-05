const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Fix the broken CSS caused by the previous wildcard replace
html = html.replace('img:is([ i], [sizes^="auto," i])', 'img:is([sizes="auto" i], [sizes^="auto," i])');

// 2. Add overflow-x: hidden to prevent the white bar on desktop
if (!html.includes('overflow-x: hidden')) {
    html = html.replace('</head>', `
    <style>
        html, body {
            overflow-x: hidden !important;
            max-width: 100%;
            margin: 0;
            padding: 0;
        }
    </style>
</head>`);
}

// 3. Fix the image sources for each social link accurately.
function fixImageInsideAnchor(anchorHrefGlob, correctImage) {
    const parts = html.split(anchorHrefGlob);
    if (parts.length > 1) {
        for (let i = 0; i < parts.length - 1; i++) {
            let fragment = parts[i + 1];
            let imgStart = fragment.indexOf('<img');
            if (imgStart !== -1) {
                let srcStart = fragment.indexOf('src="', imgStart);
                if (srcStart !== -1) {
                    let srcEnd = fragment.indexOf('"', srcStart + 5);
                    parts[i + 1] = fragment.substring(0, srcStart + 5) + './wp-content/uploads/2025/06/' + correctImage + fragment.substring(srcEnd);
                }
            }
        }
        html = parts.join(anchorHrefGlob);
    }
}

fixImageInsideAnchor('href="https://www.youtube.com/@podcast.tatico"', 'podcast.tatico-1024x512.png');
fixImageInsideAnchor('href="https://www.instagram.com/podcast_tatico/"', '@podcast-tatico-1024x512.png');
fixImageInsideAnchor('href="https://www.tiktok.com/@podcasttatico"', 'podcasttatico-1024x512.png');
fixImageInsideAnchor('href="https://open.spotify.com/show/5arqmmohPQVB0WDPxaYFcY?si=Q5nQbKr_S5mC6fvOlLf__w"', 'podcast_tatico-1024x512.png');
fixImageInsideAnchor('href="https://www.deezer.com/br/show/1001768901"', '@podcast.tatico-1024x512.png');
fixImageInsideAnchor('href="https://youtube.com/playlist?list=PLiOS0z_v86zFm-aF4f_3iwR-Jm4EiGh54&si=5yYL8D82OHBv7urV"', '@podcasttatico-1024x512.png');

// Fix Kerfin banners accurately without touching other images
const kerfinGlob = 'class="attachment-large size-large wp-image-13"';
const kParts = html.split(kerfinGlob);
for (let i = 0; i < kParts.length - 1; i++) {
    let fragment = kParts[i];
    let srcStart = fragment.lastIndexOf('src="');
    if (srcStart !== -1) {
        let srcEnd = fragment.indexOf('"', srcStart + 5);
        if (srcEnd !== -1) {
            kParts[i] = fragment.substring(0, srcStart + 5) + './wp-content/uploads/2025/06/Kerfin7-NEA-2080.jpg' + fragment.substring(srcEnd);
        }
    }
}
html = kParts.join(kerfinGlob);

// Fix the main Logo image accurately
const logoGlob = 'class="attachment-large size-large wp-image-12"';
const lParts = html.split(logoGlob);
for (let i = 0; i < lParts.length - 1; i++) {
    let fragment = lParts[i];
    let srcStart = fragment.lastIndexOf('src="');
    if (srcStart !== -1) {
        let srcEnd = fragment.indexOf('"', srcStart + 5);
        if (srcEnd !== -1) {
            lParts[i] = fragment.substring(0, srcStart + 5) + './wp-content/uploads/2025/06/PodCast-Tatico-2048-x-1152-px.png' + fragment.substring(srcEnd);
        }
    }
}
html = lParts.join(logoGlob);

// 4. Remove opacity: 0 and Elementor observer code that hides elements initially
html = html.replace(/el\.style\.opacity = 0;/g, '// el.style.opacity = 0;');

// 5. Remove srcset, sizes, loading, decoding from all images by replacing attributes using regex without backslashes
function removeAttribute(attr) {
    let match;
    const regex = new RegExp(` ${attr}="[^"]*"`, 'g');
    html = html.replace(regex, '');
}

removeAttribute('srcset');
removeAttribute('sizes');
removeAttribute('loading');
removeAttribute('decoding');
removeAttribute('fetchpriority');

fs.writeFileSync('index.html', html, 'utf8');
console.log('Fixed index.html perfectly!');
