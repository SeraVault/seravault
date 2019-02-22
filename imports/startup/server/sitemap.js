var pages = function() {
    var pages = [];
    var page = {page: '/', xhtmlLinks: [
        { rel: 'alternate', hreflang: 'en', href: '/en' },
        { rel: 'alternate', hreflang: 'fr', href: '/fr' },
        { rel: 'alternate', hreflang: 'de', href: '/de' },
        { rel: 'alternate', hreflang: 'es', href: '/es' },
        { rel: 'alternate', hreflang: 'zh-CN', href: '/zh-CN'},
        { rel: 'alternate', hreflang: 'da', href: '/da' },
        { rel: 'alternate', hreflang: 'nl', href: '/nl' }
    ], priority: 1}
    pages.push(page);
    
    page = {page: '/login', priority: .8};
    pages.push(page);
    
    page = {page: '/register', priority: .8};
    pages.push(page);

    page = {page: '/security-tips', priority: .8};
    pages.push(page);

    BlogPosts.find().forEach(function(data){ 
        page = {
            page: '/security-tips/' + data.canonical_name,
            lastmod: data.updatedAt,
            priority: .5
        }
        pages.push(page);
    })

    return pages;
}

sitemaps.add('/sitemap.xml', pages());

