const $cru = (e) => document.querySelector(e),
    $crus = (e) => document.querySelectorAll(e),
    $cruConfig = {
        prefix_url: '',
        headers: { 'Content-Type': 'application/json' },
        callbacks: {},
    },
    $C = (e = !1) => {
        if (e) for (let t of Object.keys(e)) $cruConfig[t] = e[t];
        $cruLoadEvents();
    },
    $cruLoadEvents = () => {
        $cruLoadRequests(), $cruLoadFormIntercept(), $cruLoadAllContainers();
    },
    $cruLoadContainer = async (e) => {
        e.classList.add('loaded');
        const t = e.closest('[c-container]') || e,
            c = t.getAttribute('c-container'),
            r = t.getAttribute('c-target') || !1,
            a = t.getAttribute('c-type') || 'html',
            o = t.getAttribute('c-callback') || !1,
            n = await fetch($cruConfig.prefix_url + c, {
                method: 'GET',
                headers: $cruConfig.headers,
            }),
            s = await $cruTypeResponse(a, n),
            d = r ? $cru(r) : t;
        (r || 'off' != r) && (r ? (d.innerHTML = s) : 'html' == a && (d.innerHTML = s)),
            o && $cruConfig.callbacks[o](s, d),
            $cruLoadEvents();
    },
    $cruLoadAllContainers = async () => {
        $crus('[c-container]:not(.loaded)').forEach(async (e) => {
            e.classList.add('loaded'), $cruLoadContainer(e);
        }),
            $crus('[c-reload]:not(.loaded)').forEach(async (e) => {
                e.classList.add('loaded'),
                    e.addEventListener('click', (t) => $cruLoadContainer(e));
            });
    },
    cruRequest = async (e, t) => {
        const c = e.getAttribute(`c-${t}`),
            r = e.getAttribute('c-type') || 'html',
            a = e.getAttribute('c-reload-container') || !1,
            o = e.getAttribute('c-remove-closest') || !1,
            n = e.getAttribute('c-swap') || !1,
            s = e.getAttribute('c-callback') || !1,
            d = e.getAttribute('c-target') || !1,
            u = await fetch($cruConfig.prefix_url + c, {
                method: t,
                headers: $cruConfig.headers,
            }),
            i = await $cruTypeResponse(r, u),
            l = !!d && $cru(d);
        o && e.closest(o).remove(),
            n && ($cru(n).outerHTML = i),
            a && $cruLoadContainer(e),
            l && (l ? (l.innerHTML = i) : 'html' == r && (e.innerHTML = i)),
            s && $cruConfig.callbacks[s](i, l),
            $cruLoadEvents();
    },
    $cruLoadRequests = () => {
        $crus('[c-delete]:not(.loaded)').forEach((e) => {
            e.classList.add('loaded'),
                e.addEventListener('click', async (t) => {
                    cruRequest(e, 'delete');
                });
        }),
            $crus('[c-put]:not(.loaded)').forEach((e) => {
                e.classList.add('loaded'),
                    e.addEventListener('click', async (t) => {
                        cruRequest(e, 'put');
                    });
            }),
            $crus('[c-get]:not(.loaded)').forEach((e) => {
                e.classList.add('loaded'),
                    e.addEventListener('click', async (t) => {
                        cruRequest(e, 'get');
                    });
            }),
            $crus('[c-post]:not(.loaded)').forEach((e) => {
                e.classList.add('loaded'),
                    e.addEventListener('click', async (t) => {
                        cruRequest(e, 'post');
                    });
            });
    },
    $cruLoadFormIntercept = () => {
        $crus('.c-form:not(.loaded)').forEach((e) => {
            e.classList.add('loaded'),
                e.addEventListener('submit', async (t) => {
                    t.preventDefault();
                    const c = e.getAttribute('action'),
                        r = e.getAttribute('method').toUpperCase() || 'POST',
                        a = e.getAttribute('c-type') || 'html',
                        o = e.getAttribute('c-append') || !1,
                        n = e.getAttribute('c-swap') || !1,
                        s = e.getAttribute('c-target') || !1,
                        d = e.getAttribute('c-reload-container') || !1,
                        u = e.getAttribute('c-callback') || !1,
                        i = $cruIsRead(r),
                        l = Object.fromEntries(new FormData(t.target).entries()),
                        $ = cruFormatURL(c, i, l),
                        L = await fetch($, {
                            method: r,
                            headers: $cruConfig.headers,
                            body: i ? null : JSON.stringify(l),
                        }),
                        g = await $cruTypeResponse(a, L);
                    n && ($cru(n).outerHTML = g),
                        o && $cru(o).insertAdjacentHTML('beforeend', g),
                        s && ($cru(s).innerHTML = g),
                        d && $cruLoadContainer(e),
                        u && $cruConfig.callbacks[u](g, e),
                        $cruLoadEvents();
                });
        });
    },
    cruFormatURL = (e, t, c) => {
        let r = $cruConfig.prefix_url + e;
        if (t)
            try {
                r = new URL(e);
            } catch (t) {
                try {
                    r = new URL(window.location.origin + e);
                } catch (t) {
                    throw e;
                }
            } finally {
                (r.search = new URLSearchParams(c).toString()), (r = r.href);
            }
        return r;
    },
    $cruCallback = (e, t) => {
        $cruConfig.callbacks[e] = t;
    },
    $cruIsRead = (e) => ['GET', 'HEAD'].includes(e),
    $cruTypeResponse = async (e, t) => ('html' == e ? await t.text() : await t.json());
$C();
