// js/main.js

document.addEventListener('DOMContentLoaded', async () => {
    const carouselInner = document.querySelector('#ebayCarousel .carousel-inner');
    if (!carouselInner) {
        console.error('Carousel container not found!');
        return;
    }

    // ▶ Use your local proxy
    const proxyUrl = 'http://localhost:3000/ebay-feed';
    console.log('Fetching via local proxy:', proxyUrl);

    try {
        const res  = await fetch(proxyUrl);
        console.log('Fetch status:', res.status);

        const text = await res.text();
        const xml  = new DOMParser().parseFromString(text, 'application/xml');
        const items = Array.from(xml.querySelectorAll('item'));
        console.log('Items found:', items.length);

        if (!items.length) {
            console.warn('No items—check feed or proxy.');
            return;
        }

        // Build up to 8 slides
        items.slice(0, 8).forEach((it, idx) => {
            const title   = it.querySelector('title')?.textContent   || 'No title';
            const link    = it.querySelector('link')?.textContent    || '#';
            const thumbEl = it.querySelector('media\\:thumbnail') || it.querySelector('thumbnail');
            const thumb   = thumbEl?.getAttribute('url')            || '';
            const active  = idx === 0 ? ' active' : '';

            carouselInner.insertAdjacentHTML('beforeend', `
        <div class="carousel-item${active}">
          <a href="${link}" target="_blank">
            <img src="${thumb}"
                 class="d-block w-100"
                 alt="${title}">
            <div class="carousel-caption d-none d-md-block">
              <h5>${title}</h5>
            </div>
          </a>
        </div>`);
        });

        console.log('🎉 Carousel populated!');
    } catch (err) {
        console.error('Error loading eBay feed via local proxy:', err);
    }
});
