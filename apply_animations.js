const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Add CSS rules in <head>
const animationCSS = `
    <style>
        /* Native Entry Animations */
        .estado-inicial {
            opacity: 0;
        }
        @keyframes fadeUp {
            from {
                opacity: 0;
                transform: translateY(40px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        @keyframes slideLeft {
            from {
                opacity: 0;
                transform: translateX(-60px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        .animar-up {
            animation: fadeUp 0.8s ease-out forwards;
        }
        .animar-left {
            animation: slideLeft 0.8s ease-out forwards;
        }
    </style>
</head>`;

if (!html.includes('.estado-inicial {')) {
    html = html.replace('</head>', animationCSS);
}

// 2. Add IntersectionObserver JS before </body>
const observerJS = `
    <script>
        document.addEventListener("DOMContentLoaded", function () {
            const observerCustom = new IntersectionObserver((entries, observerObj) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        const animacao = el.getAttribute('data-animacao');
                        if (animacao) {
                            el.classList.remove('estado-inicial');
                            el.classList.add(animacao);
                            observerObj.unobserve(el);
                        }
                    }
                });
            }, { threshold: 0.1 });

            const elementosAnimar = document.querySelectorAll('.observar-animacao');
            elementosAnimar.forEach(el => observerCustom.observe(el));
        });
    </script>
</body>`;

if (!html.includes('observarCustom')) {
    html = html.replace('</body>', observerJS);
}

// 3. Add classes and data-attributes to specific elements.

// Let's create a helper function to add attributes to an img tag matching a URL
function addAnimationToImg(imageName, animationType) {
    const srcPath = './wp-content/uploads/2025/06/' + imageName;
    const parts = html.split(srcPath);
    if (parts.length > 1) {
        for (let i = 0; i < parts.length - 1; i++) {
            // Find the closest <img before this src
            let fragment = parts[i];
            let imgStart = fragment.lastIndexOf('<img');
            if (imgStart !== -1) {
                // Check if class exists
                let classIdx = fragment.indexOf('class="', imgStart);
                if (classIdx !== -1) {
                    // Inject our classes
                    fragment = fragment.substring(0, classIdx + 7) + 'observar-animacao estado-inicial ' + fragment.substring(classIdx + 7);
                } else {
                    // Create class attribute
                    fragment = fragment.substring(0, imgStart + 4) + ' class="observar-animacao estado-inicial"' + fragment.substring(imgStart + 4);
                }

                // Add data-animacao attribute
                fragment = fragment.substring(0, imgStart + 4) + ' data-animacao="' + animationType + '"' + fragment.substring(imgStart + 4);

                parts[i] = fragment;
            }
        }
        html = parts.join(srcPath);
    }
}

// A. Logo (PodCast-Tatico-2048-x-1152-px.png) - animar-up
addAnimationToImg('PodCast-Tatico-2048-x-1152-px.png', 'animar-up');

// B. 6 Social buttons - animar-left
addAnimationToImg('podcast.tatico-1024x512.png', 'animar-left');   // YouTube, Spotify
addAnimationToImg('@podcast-tatico-1024x512.png', 'animar-left');  // Instagram
addAnimationToImg('podcasttatico-1024x512.png', 'animar-left');    // TikTok
addAnimationToImg('@podcast.tatico-1024x512.png', 'animar-left');  // Deezer
addAnimationToImg('@podcasttatico-1024x512.png', 'animar-left');   // Google Podcasts

fs.writeFileSync('index.html', html, 'utf8');
console.log('Added native animations effectively!');
