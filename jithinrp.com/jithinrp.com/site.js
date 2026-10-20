/* =========================================================
   Site runtime — shared by every page (landing + case studies)
   Everything is opt-in by markup, so a page only gets what it uses:
   [data-liquid] planes, [data-reveal], [data-pixel-title],
   [data-intro-lines], [data-cursor-pill], .band hairlines, etc.
   - Lenis smooth scroll drives GSAP ScrollTrigger
   - One fixed Three.js canvas mirrors every [data-liquid] element
     as a shader plane (images, videos + procedural gradients)
   - Phones (<768px) skip all of this and see a "desktop" note
   - Planes respond to cursor (liquid lens + ripples),
     scroll velocity (sheet bends and smears) and reveal (noisy wipe)
   ========================================================= */
(() => {
    const SITE_ROOT = new URL(".", document.currentScript.src).href; // site root, even from /memory/
    const root = document.documentElement;
    // The light version: plain pages, no motion, no WebGL, no music. Chosen from the Z screen (?lite),
    // or taken automatically on a very slow connection / Data Saver. Remembered until ?full.
    const lite = (() => {
        try {
            const q = new URLSearchParams(location.search);
            if (q.has("full")) localStorage.setItem("kug-lite", "0");
            if (q.has("lite")) localStorage.setItem("kug-lite", "1");
            const pick = localStorage.getItem("kug-lite");
            if (pick) return pick === "1";
        } catch (e) {}
        const c = navigator.connection;
        return !!(c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || "")));
    })();
    const reduceMotion = lite || matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) root.classList.add("no-motion");
    if (lite) root.classList.add("is-lite");

    /* ---------------- Loader + wordmark ---------------- */
    const BALL = {
        value: 0.03,
        rest: 0.03,
        scroll: 0.07
    };
    let arrivedTorn = false;
    let throughGate = false;
    let scriptReady = false;
    const afterScript = [];
    const whenReady = (fn) => (scriptReady ? fn() : afterScript.push(fn));
    if (lite) {
        const chip = document.createElement("a");
        chip.className = "lite-chip";
        chip.href = "?full";
        chip.innerHTML = "Light version <span>Switch to full site</span>";
        document.addEventListener("DOMContentLoaded", () => document.body.appendChild(chip));
        if (document.body) document.body.appendChild(chip);
    }
    const loaderDone = setupLoader();
    window.siteReady = loaderDone;
    setupSignature();
    const navbar = setupNavbar();

    gsap.registerPlugin(ScrollTrigger, SplitText);

    /* ---------------- Smooth scroll ---------------- */
    let lenis = null;
    if (!reduceMotion && window.Lenis) {
        lenis = new Lenis({
            lerp: 0.09,
            smoothWheel: true
        });
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((t) => lenis.raf(t * 1000));
        gsap.ticker.lagSmoothing(0);
        lenis.stop();
        loaderDone.then(() => lenis.start());
    }

    document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener("click", (e) => {
            const id = a.getAttribute("href");
            if (id === "#") return e.preventDefault();
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            if (lenis) lenis.scrollTo(target, {
                duration: 1.4,
                offset: -(navbar.compactHeight() + 24)
            });
            else target.scrollIntoView({
                behavior: reduceMotion ? "auto" : "smooth"
            });
        });
    });

    let Liquid = null;

    /* ---------------- Interactivity ---------------- */
    setupBallLens();
    setupCursorPill();
    setupCursorTrail();
    setupCounterAnimation();

    /* ---------------- Motion (starts as the loader lifts) ---------------- */
    Promise.all([document.fonts.ready, loaderDone]).then(() => {
        setupFooter();
        if (reduceMotion) return;
        introTimeline();
        readingProgress();
        scrollReveals();
        setupMarquee();
        ScrollTrigger.refresh();
    });


    // After a tear the page was already seen, settled, through the rip: so the first screen's entrances
    // finish at once instead of playing again. Scrubbed effects and endless loops are left alone.
    function settleEntrances() {
        const fold = window.scrollY + innerHeight;
        gsap.globalTimeline.getChildren(false, true, true).forEach((a) => {
            if (a.repeat && a.repeat() === -1) return;
            const st = a.scrollTrigger;
            if (st && (st.vars.scrub || st.start > fold)) return;
            a.progress(1);
        });
    }

    // Lazy images grow the page as they arrive; keep trigger positions in sync
    const refreshSoon = gsap.delayedCall(0.2, () => ScrollTrigger.refresh()).pause();
    document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
        if (!img.complete) img.addEventListener("load", () => refreshSoon.restart(true), {
            once: true
        });
    });

    /* =========================================================
       Wordmark: plain text for KUG Coimbatore
       ========================================================= */
    function setupSignature() {
        return;
    }


    /* =========================================================
       Fixed navbar: toggles a compact, frosted state once the page has
       scrolled, and sizes the spacer to the navbar's resting height so the
       layout below never shifts.
       ========================================================= */
    function setupNavbar() {
        const bar = document.querySelector(".navbar");
        const spacer = document.querySelector(".navbar-spacer");
        if (!bar) return {
            compactHeight: () => 0
        };
        let scrolled = false;
        const measure = () => {
            const was = bar.classList.contains("is-scrolled");
            bar.style.transition = "none";
            bar.classList.remove("is-scrolled");
            if (spacer) spacer.style.height = bar.offsetHeight + "px";
            bar.classList.toggle("is-scrolled", was);
            void bar.offsetHeight; // flush before restoring the transition
            bar.style.transition = "";
        };
        const update = () => {
            const next = window.scrollY > 12;
            if (next === scrolled) return;
            scrolled = next;
            bar.classList.toggle("is-scrolled", scrolled);
        };
        measure();
        update();
        window.addEventListener("scroll", update, {
            passive: true
        });
        window.addEventListener("resize", measure);
        document.fonts.ready.then(measure);
        return {
            // height once compacted (for anchor offsets): 16px top + nav row + 16px bottom
            compactHeight: () => 32 + (bar.querySelector(".nav") || bar).offsetHeight,
        };
    }

    /* =========================================================
       Loader: the signature fills left→right over a grey ghost as the
       page's fonts and above-the-fold images arrive, then the sheet
       lifts away with a liquid bottom edge. A minimum write time keeps
       the signature legible (shorter on later pages in the session).
       ========================================================= */
    function setupLoader() {
        const el = document.querySelector(".loader");
        const tpl = document.getElementById("signature-template");
        if (lite) {
            if (el) el.remove();
            root.classList.remove("is-loading");
            return Promise.resolve();
        }
        if (!el || !tpl || !window.gsap) {
            if (el) el.remove();
            return Promise.resolve();
        }
        root.classList.add("is-loading");

        const box = el.querySelector(".loader__sig");
        const ghost = tpl.content.firstElementChild.cloneNode(true);
        const fill = tpl.content.firstElementChild.cloneNode(true);
        ghost.classList.add("loader__ghost");
        fill.classList.add("loader__fill");
        box.append(ghost, fill);

        let seen = false;
        try {
            seen = sessionStorage.getItem("kug-loaded") === "1";
            sessionStorage.setItem("kug-loaded", "1");
        } catch (e) {}
        const MIN_WRITE = reduceMotion ? 0 : seen ? 0.4 : 1.2;
        const MAX_WAIT = 4000;

        const imgs = [...document.images].filter((img) => img.loading !== "lazy");
        const tasks = [
            document.fonts.ready,
            ...imgs.map((img) => (img.complete ? Promise.resolve() : new Promise((r) => {
                img.addEventListener("load", r, { once: true });
                img.addEventListener("error", r, { once: true });
            }))),
        ];
        let done = 0, ready = 0;
        tasks.forEach((t) => t.then(() => {
            done++;
            ready = Math.max(ready, done / tasks.length);
        }));
        setTimeout(() => (ready = 1), Math.max(0, MAX_WAIT - performance.now()));

        return new Promise((resolve) => {
            const start = performance.now();
            let shown = 0;
            const tick = () => {
                const byTime = MIN_WRITE ? Math.min(1, (performance.now() - start) / 1000 / MIN_WRITE) : 1;
                const target = Math.min(ready, byTime);
                shown += (target - shown) * 0.12;
                if (target === 1 && shown > 0.995) shown = 1;
                fill.style.setProperty("--p", (shown * 100).toFixed(2) + "%");
                if (shown < 1) return;

                gsap.ticker.remove(tick);

                const exit = gsap.timeline({
                    delay: reduceMotion ? 0 : 0.2,
                    onComplete: () => el.remove()
                });
                exit.call(() => {
                    root.classList.remove("is-loading");
                    resolve();
                }, null, reduceMotion ? 0 : 0.3);
                if (reduceMotion) return;
                exit.to(box, {
                        y: -24,
                        opacity: 0,
                        duration: 0.5,
                        ease: "power3.in"
                    }, 0)
                    .to(el, {
                        yPercent: -100,
                        borderBottomLeftRadius: "50% 18vh",
                        borderBottomRightRadius: "50% 18vh",
                        duration: 0.9,
                        ease: "expo.inOut",
                    }, 0.1);
            };
            gsap.ticker.add(tick);
        });
    }

    function setupCounterAnimation() {
        const stats = document.querySelectorAll("[data-count]");
        if (!stats.length) return;
        stats.forEach((el) => {
            const raw = el.getAttribute("data-count") || el.textContent;
            const num = parseInt(raw, 10);
            const suffix = raw.replace(/^[0-9]+/, "");
            if (isNaN(num)) return;
            ScrollTrigger.create({
                trigger: el,
                start: "top 92%",
                once: true,
                onEnter: () => {
                    const obj = { val: 0 };
                    gsap.to(obj, {
                        val: num,
                        duration: 1.4,
                        ease: "power2.out",
                        onUpdate: () => {
                            el.textContent = Math.round(obj.val) + suffix;
                        }
                    });
                }
            });
        });
    }


    /* =========================================================
       Project modals & page transitions removed for KUG Coimbatore
       ========================================================= */
    function setupProjectModals() {}

    /* =========================================================
       Footer: the footnote rises in as it arrives; live Melbourne time,
       and "Back to top" glides home.
       ========================================================= */
    function setupFooter() {
        const footer = document.querySelector("[data-footer]");
        if (!footer) return;

        // live local time
        const timeEl = footer.querySelector("[data-local-time]");
        if (timeEl) {
            const fmt = new Intl.DateTimeFormat("en-IN", {
                timeZone: "Asia/Kolkata",
                hour: "numeric",
                minute: "2-digit",
                hour12: true
            });
            const tick = () => (timeEl.textContent = "Coimbatore, " + fmt.format(new Date()).toUpperCase());
            tick();
            setInterval(tick, 20000);
        }
        // back to top
        const top = footer.querySelector("[data-back-top]");
        if (top) top.addEventListener("click", (e) => {
            e.preventDefault();
            if (lenis) lenis.scrollTo(0, {
                duration: 1.8,
                easing: (t) => 1 - Math.pow(1 - t, 4)
            });
            else window.scrollTo({
                top: 0,
                behavior: reduceMotion ? "auto" : "smooth"
            });
        });

        if (reduceMotion) return;
        const note = footer.querySelector(".footer__note");
        const meta = footer.querySelector(".footer__meta");
        if (note || meta) {
            const tl = gsap.timeline({
                    paused: true
                });
            if (note) {
                tl.fromTo(note, {
                    y: 34,
                    opacity: 0
                }, {
                    y: 0,
                    opacity: 1,
                    duration: 1.1,
                    ease: "expo.out"
                }, 0);
            }
            if (meta) {
                tl.fromTo(meta, {
                    opacity: 0,
                    y: 12
                }, {
                    opacity: 1,
                    y: 0,
                    duration: 0.9,
                    ease: "power3.out"
                }, 0.3);
            }
            ScrollTrigger.create({
                trigger: footer,
                start: "top 92%",
                once: true,
                onEnter: () => tl.play()
            });
            if (footer.getBoundingClientRect().top < innerHeight * 0.92) tl.progress(1);
        }
    }

    /* =========================================================
       Intro
       ========================================================= */
    function introTimeline() {
        const tl = gsap.timeline({
            defaults: {
                ease: "expo.out"
            }
        });
        tl.from(".nav > *", {
            y: -20,
            autoAlpha: 0,
            duration: 1.1,
            stagger: 0.08,
            clearProps: "transform,opacity,visibility"
        }); // leave no inline transform behind (it fought the sound button)

        // Lede / subtitle lines rise out of a mask
        document.querySelectorAll("[data-intro-lines]").forEach((el) => {
            const split = SplitText.create(el, {
                type: "lines",
                mask: "lines"
            });
            el.removeAttribute("data-reveal");
            tl.set(el, {
                opacity: 1
            }, 0).from(split.lines, {
                yPercent: 110,
                duration: 1.3,
                stagger: 0.09
            }, 0.1);
        });

        const items = document.querySelectorAll("[data-intro-item]");
        if (items.length) tl.from(items, {
            y: 14,
            autoAlpha: 0,
            duration: 1,
            stagger: 0.05
        }, 0.35);

        // Pixel titles: letters rise, starting as droplets and settling into squares
        document.querySelectorAll("[data-pixel-title]").forEach((el) => {
            const {
                chars
            } = SplitText.create(el, {
                type: "words,chars",
                wordsClass: "word",
                charsClass: "char",
                mask: "chars"
            });
            tl.from(chars, {
                    yPercent: 105,
                    duration: 1.5,
                    stagger: 0.045
                }, 0.3)
                .fromTo(chars, {
                    "--elsh": 20
                }, {
                    "--elsh": 1,
                    duration: 1.6,
                    stagger: 0.045,
                    ease: "power2.out"
                }, 0.45);
        });

        if (document.querySelector(".hero__linkedin")) {
            tl.fromTo(".hero__linkedin", {
                scale: 0
            }, {
                scale: 1,
                duration: 1,
                ease: "back.out(2)"
            }, 1);
        }

        const heroLine = document.querySelector(".hero");
        if (heroLine) {
            gsap.set(heroLine, {
                "--draw": 0
            });
            tl.to(heroLine, {
                "--draw": 1,
                duration: 1.6,
                ease: "expo.inOut"
            }, 0.6);
        }
        return tl;
    }

    /* =========================================================
       Scroll reveals + hairline drawing
       ========================================================= */
    function scrollReveals() {
        gsap.set("[data-reveal]", {
            y: 40,
            opacity: 0
        });
        ScrollTrigger.batch("[data-reveal]", {
            start: "top 88%",
            once: true,
            onEnter: (els) =>
                gsap.to(els, {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: "expo.out",
                    stagger: 0.08,
                    overwrite: "auto"
                }),
        });

        // Horizontal rules draw left→right as their band enters
        document.querySelectorAll(".band, .about").forEach((el) => {
            if (el.classList.contains("hero") || el.hasAttribute("data-story")) return; // stories draw their own line
            gsap.fromTo(el, {
                "--draw": 0
            }, {
                "--draw": 1,
                duration: 1.6,
                ease: "expo.inOut",
                scrollTrigger: {
                    trigger: el,
                    start: "bottom 95%",
                    once: true
                },
            });
        });

        // Vertical dividers grow downward
        const verticals = [
            ...document.querySelectorAll(".pillar + .pillar"),
            ...document.querySelectorAll(".work__mid"),
            ...document.querySelectorAll(".quote + .quote"),
            ...document.querySelectorAll("[data-draw-v]"),
        ];
        verticals.forEach((el) => {
            gsap.fromTo(el, {
                "--draw": 0
            }, {
                "--draw": 1,
                duration: 1.4,
                ease: "expo.inOut",
                scrollTrigger: {
                    trigger: el,
                    start: "top 90%",
                    once: true
                },
            });
        });
    }

    /* =========================================================
       Hero name: pixels melt into droplets under the cursor
       (Geist Pixel ELSH axis: 1 = square, 20 = circle)
       ========================================================= */
    function liquidPixels() {
        const chars = document.querySelectorAll("[data-pixel-title] .char");
        chars.forEach((c) => {
            c.addEventListener("pointerenter", () => {
                gsap.to(c, {
                    "--elsh": 20,
                    duration: 0.5,
                    ease: "power2.out",
                    overwrite: "auto"
                });
                gsap.to(c, {
                    "--elsh": 1,
                    duration: 1.4,
                    delay: 0.5,
                    ease: "elastic.out(1, 0.4)"
                });
            });
        });
    }

    /* =========================================================
       Hero kinetics
       - The name melts toward the cursor: letters near it round into droplets
         (per-letter --field, added to the ELSH axis in CSS) and firm up behind it.
       - An idle ripple of melt drifts across the name every few seconds.
       - Scroll speed rounds every letter and leans it, each letter lagging the
         last, so the word sloshes like liquid and settles when scrolling stops.
       - The lede and meta drift up at different speeds as the hero leaves.
       ========================================================= */
    function heroKinetics() {
        const title = document.querySelector(".hero__name");
        const hero = document.querySelector(".hero");
        if (!title || !hero) return;
        const chars = [...title.querySelectorAll(".char")];
        if (!chars.length) return;

        let mx = -1e4,
            my = -1e4;
        window.addEventListener("pointermove", (e) => {
            if (e.pointerType === "mouse") {
                mx = e.clientX;
                my = e.clientY;
            }
        }, {
            passive: true
        });
        document.documentElement.addEventListener("pointerleave", () => {
            mx = my = -1e4;
        });

        const field = chars.map(() => 0);
        const lean = chars.map(() => ({
            v: 0,
            x: 0
        })); // per-letter spring
        const RIPPLE_EVERY = 6.5; // seconds between idle ripples

        gsap.ticker.add((time, dt) => {
            const tr = title.getBoundingClientRect();
            if (tr.bottom < -200 || tr.top > innerHeight + 200) { // off screen: rest upright and solid
                if (lean[0].x !== 0 || field[0] !== 0) {
                    lean.forEach((s) => {
                        s.x = 0;
                        s.v = 0;
                    });
                    field.fill(0);
                    chars.forEach((c) => {
                        c.style.setProperty("--field", "0");
                        gsap.set(c, {
                            skewX: 0
                        });
                    });
                }
                return;
            }
            const step = Math.min(dt, 50) / 1000;
            const vel = lenis ? gsap.utils.clamp(-60, 60, lenis.velocity) : 0;
            const ripple = ((time % RIPPLE_EVERY) / 1.6) * 1.5 - 0.25; // sweeps 0→1 over ~1.6s, then rests
            chars.forEach((c, i) => {
                const r = c.getBoundingClientRect();
                const cx = r.left + r.width / 2,
                    cy = r.top + r.height / 2;
                const d2 = (mx - cx) ** 2 + ((my - cy) * 1.3) ** 2;
                const u = (cx - tr.left) / tr.width;
                let target = 13 * Math.exp(-d2 / (2 * 170 * 170)); // warmth of the cursor
                target += 6 * Math.exp(-((u - ripple) ** 2) / (2 * 0.07 * 0.07)); // idle ripple
                target += Math.min(9, Math.abs(vel) * 0.3); // speed rounds the pixels
                field[i] += (target - field[i]) * (1 - Math.exp(-step * 9));
                c.style.setProperty("--field", field[i].toFixed(2));
                // lean: a damped spring per letter, later letters respond a touch slower
                const s = lean[i],
                    k = 70 - i * 4;
                s.v += (k * (gsap.utils.clamp(-9, 9, -vel * 0.22) - s.x) - 11 * s.v) * step;
                s.x += s.v * step;
                gsap.set(c, {
                    skewX: Math.round(s.x * 100) / 100
                });
            });
        });

        // Depth: lede and meta drift up at different rates as the hero scrolls away
        const scrub = {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: 0.6
        };
        gsap.to(".hero__lede", {
            y: -140,
            ease: "none",
            scrollTrigger: scrub
        });
        gsap.to(".hero__meta", {
            y: -70,
            ease: "none",
            scrollTrigger: { ...scrub
            }
        });
    }

    /* =========================================================
       Kinetic marquee: pixel type that runs on its own, speeds up with the
       scroll, flips direction with it, and melts (rounder pixels) the faster
       you go. Leans into the motion like the rest of the page.
       ========================================================= */
    function setupMarquee() {
        const root = document.querySelector("[data-marquee]");
        if (!root) return;
        const track = root.querySelector(".marquee__track");
        const group = track.querySelector(".marquee__group");
        // enough copies to cover the screen twice, so the loop never shows a gap
        const copies = Math.max(2, Math.ceil((innerWidth * 2) / group.offsetWidth) + 1);
        for (let i = 1; i < copies; i++) track.appendChild(group.cloneNode(true));
        const span = group.offsetWidth;

        let x = 0,
            dir = 1,
            speed = 0,
            lean = 0,
            leanV = 0;
        gsap.ticker.add((time, dt) => {
            const r = root.getBoundingClientRect();
            const step = Math.min(dt, 50) / 1000;
            const vel = lenis ? lenis.velocity : 0;
            if (Math.abs(vel) > 0.4) dir = vel > 0 ? 1 : -1; // follow the scroll direction
            const targetSpeed = 70 + Math.min(1400, Math.abs(vel) * 38); // px/s: drift, then rush
            speed += (targetSpeed - speed) * (1 - Math.exp(-step * 5));
            x -= dir * speed * step;
            x = ((x % span) - span) % span; // wrap within one copy
            leanV += (60 * (gsap.utils.clamp(-10, 10, -vel * 0.25) - lean) - 10 * leanV) * step;
            lean += leanV * step;
            if (r.bottom < 0 || r.top > innerHeight) return; // off screen: keep time, skip paint
            gsap.set(track, {
                x,
                skewX: Math.round(lean * 100) / 100
            });
            root.style.setProperty("--speed", Math.min(19, Math.abs(vel) * 0.45).toFixed(2));
        });
    }

    /* =========================================================
       Scroll lean: content tilts in the direction of travel with scroll
       speed and springs back when the page stops (matches the WebGL bend).
       ========================================================= */
    function scrollLean() {
        const els = [...document.querySelectorAll(".pillar, .work__intro, .quote, .award")];
        if (!els.length || !lenis) return;
        let lean = 0,
            leanV = 0,
            shown = null;
        gsap.ticker.add((time, dt) => {
            const step = Math.min(dt, 50) / 1000;
            const target = gsap.utils.clamp(-3.2, 3.2, -lenis.velocity * 0.09);
            leanV += (55 * (target - lean) - 10 * leanV) * step;
            lean += leanV * step;
            const next = Math.round(lean * 100) / 100;
            if (next === shown) return;
            shown = next;
            gsap.set(els, {
                skewY: next,
                transformOrigin: "50% 50%"
            });
        });
    }

    /* =========================================================
       The ball lens. The page reads as if wrapped on a slowly turning ball:
       things come up from the bottom small and squeezed, swell to full size
       in the middle of the screen, and curve away again at the top. Gentle
       at rest, deeper the faster you scroll. Pictures bend in their WebGL
       mesh (VERT, uLens); text blocks get the same curve as a shift and a
       scale (CSS translate / scale, so they never fight other transforms).
       ========================================================= */
    function setupBallLens() {
        if (reduceMotion) {
            BALL.value = 0;
            return;
        }
        const SEL = "main p, main li, main dt, main dd, main blockquote, main figcaption, .footer p, .footer__meta > *"; // not headings: their reveals key off their place
        let els = [],
            lastKey = "";
        const collect = () => {
            els = [...document.querySelectorAll(SEL)].filter((el) => !el.closest(".hero, .loader, .page-cover"));
            els = els.filter((el) => !els.some((o) => o !== el && el.contains(o))); // leaves only: no doubled curves
            lastKey = "";
        };
        const clear = () => els.forEach((el) => {
            if (el._ball) {
                el.style.translate = el.style.scale = "";
                el._ball = 0;
                el._dx = el._dy = 0;
            }
        });
        collect();
        window.addEventListener("load", collect, {
            once: true
        });
        if (window.ScrollTrigger) {
            ScrollTrigger.addEventListener("refreshInit", clear); // measure the page without the curve
            ScrollTrigger.addEventListener("refresh", collect);
        }
        let speed = 0;
        gsap.ticker.add(() => {
            const v = lenis ? Math.abs(lenis.velocity) : 0;
            speed += (Math.min(1, v / 40) - speed) * 0.08; // eases in and settles out with the glide
            BALL.value = BALL.rest + BALL.scroll * speed;
            const L = BALL.value,
                W = innerWidth,
                H = innerHeight,
                y0 = window.scrollY;
            const key = `${y0}|${L.toFixed(4)}|${W}|${H}`;
            if (key === lastKey) return;
            lastKey = key;
            const rects = els.map((el) => el.getBoundingClientRect()); // read everything first…
            els.forEach((el, i) => { // …then write
                const r = rects[i];
                if (r.bottom < -80 || r.top > H + 80 || r.height === 0) {
                    if (el._ball) {
                        el.style.translate = el.style.scale = "";
                        el._ball = 0;
                    }
                    return;
                }
                // undo the curve already applied, to work from the block's true place
                const cy = r.top + r.height / 2 - (el._dy || 0),
                    cx = r.left + r.width / 2 - (el._dx || 0);
                const ny = 1 - (2 * cy) / H,
                    k = L * ny * ny; // same curve as the pictures' mesh
                const dx = (cx - W / 2) * -0.55 * k,
                    dy = ny * k * H / 2;
                el._dx = dx;
                el._dy = dy;
                el._ball = 1;
                el.style.translate = `${dx.toFixed(1)}px ${dy.toFixed(1)}px`;
                el.style.scale = `${(1 - 0.55 * k).toFixed(4)} ${Math.max(0.85, 1 - 2 * k).toFixed(4)}`; // never squashed past 85%
            });
        });
    }

    /* =========================================================
       Hero parallax. The headline, the details line and the name move at
       different rates as the hero scrolls away (the headline lags, the name
       leads), so they read as layers at different depths; while the hero is
       in view the pointer tilts them apart a touch, eased. Uses the CSS
       translate property, so it never fights the intro or the melt.
       ========================================================= */
    function heroParallax() {
        const hero = document.querySelector(".hero");
        if (!hero) return;
        const layers = [
                [".hero__lede", 0.28, -12],
                [".hero__meta", 0.12, -6],
                [".hero__name-row", -0.1, 16]
            ] // + lags the scroll, - leads it
            .map(([q, k, m]) => [hero.querySelector(q), k, m]).filter(([el]) => el);
        if (!layers.length) return;
        const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
        const tilt = {
            x: 0,
            y: 0,
            tx: 0,
            ty: 0
        };
        if (fine) window.addEventListener("pointermove", (e) => {
            tilt.tx = e.clientX / innerWidth * 2 - 1;
            tilt.ty = e.clientY / innerHeight * 2 - 1;
        }, {
            passive: true
        });
        let lastKey = "";
        gsap.ticker.add(() => {
            const y = window.scrollY,
                h = hero.offsetHeight + hero.offsetTop;
            if (y > h + 200) {
                if (lastKey !== "off") {
                    layers.forEach(([el]) => (el.style.translate = ""));
                    lastKey = "off";
                }
                return;
            }
            tilt.x += (tilt.tx - tilt.x) * 0.06;
            tilt.y += (tilt.ty - tilt.y) * 0.06;
            const near = Math.max(0, 1 - y / h); // the tilt fades as the hero leaves
            const key = `${y}|${tilt.x.toFixed(3)}|${tilt.y.toFixed(3)}`;
            if (key === lastKey) return;
            lastKey = key;
            layers.forEach(([el, k, m]) => {
                const tx = tilt.x * m * near,
                    ty = y * k + tilt.y * m * 0.6 * near;
                el.style.translate = `${tx.toFixed(1)}px ${ty.toFixed(1)}px`;
            });
        });
    }

    /* =========================================================
       About: a trail of photos. Moving across the About section leaves a
       trail of moments behind the cursor (coffee, food, places, family),
       one after another every so often along its path. Each pops in at a
       slight angle, carries on a little in the direction you were moving,
       then sinks and fades. Desktop pointers only.
       ========================================================= */
    function setupAboutTrail() {}

    /* =========================================================
       Scroll stories (Apple-style: smooth, physical, unhurried)
       Works rows (played on entry, reversed when scrolling back past): the media
         pans out from close up into its frame and touches down on the water
         (createWater), rings running out from its edges; then the title,
         description and details rise in, one after another.
       The media are WebGL planes that follow their DOM boxes, so moving/scaling
       the box moves the plane and the picture stays sharp and correctly cropped.
       Without WebGL the DOM media moves the same way.
       ========================================================= */
    function storyUniforms(el) {
        const it = Liquid && Liquid.items.find((i) => i.el === el);
        return it ? it.uniforms : null;
    }

    /* =========================================================
       Reading progress: a quiet percentage on the right edge with a hairline that fills as you go.
       White + difference, so it reads on the page and over pictures alike.
       ========================================================= */
    function readingProgress() {
        const el = document.createElement("div");
        el.className = "progress";
        el.setAttribute("aria-hidden", "true");
        el.innerHTML = '<span class="progress__value">0%</span><span class="progress__line"><span class="progress__fill"></span></span>';
        document.body.appendChild(el);
        const value = el.querySelector(".progress__value");
        const fill = el.querySelector(".progress__fill");
        let shown = -1;
        const update = () => {
            const max = document.documentElement.scrollHeight - innerHeight;
            const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
            fill.style.transform = `scaleY(${p.toFixed(4)})`;
            const pct = Math.round(p * 100);
            if (pct !== shown) {
                shown = pct;
                value.textContent = pct + "%";
            }
        };
        update();
        addEventListener("scroll", update, {
            passive: true
        });
        addEventListener("resize", update);
        gsap.fromTo(el, {
            autoAlpha: 0
        }, {
            autoAlpha: 1,
            duration: 1,
            delay: 0.6,
            ease: "power2.out"
        });
    }

    /* =========================================================
       Selected Works, sideways: the section pins and the mouse wheel slides the case studies across,
       one screen each; after the last one the page carries on downward. Only scrolling moves it.
       The words lean with the motion like the testimonials do (a jelly skew that springs back).
       ========================================================= */
    let worksScroll = null,
        worksView = null;

    function horizontalWorks() {
        if (reduceMotion) return;
        const sec = document.querySelector("#works");
        const rows = sec ? [...sec.querySelectorAll(":scope > .work")] : [];
        if (rows.length < 2) return;
        const view = document.createElement("div");
        view.className = "works__view";
        worksView = view;
        const track = document.createElement("div");
        track.className = "works__track";
        rows[0].before(view);
        view.appendChild(track);
        rows.forEach((r) => track.appendChild(r));
        const dist = () => Math.max(0, track.scrollWidth - innerWidth);
        worksScroll = gsap.to(track, {
            x: () => -dist(),
            ease: "none",
            scrollTrigger: {
                trigger: view,
                start: "top top",
                end: () => "+=" + dist(),
                pin: true,
                scrub: true,
                invalidateOnRefresh: true,
                anticipatePin: 1
            },
        });
        // the jelly lean: the words trail the motion and settle with a little wobble
        const els = [...track.querySelectorAll(".work__intro, .work__col .fact")];
        const setSkew = els.map((el) => gsap.quickSetter(el, "skewX", "deg"));
        let last = 0,
            v = 0,
            lean = 0,
            leanV = 0,
            shown = 0;
        gsap.ticker.add((time, dt) => {
            const step = Math.min(dt, 50) / 1000;
            const x = gsap.getProperty(track, "x");
            v += ((x - last) / step - v) * (1 - Math.exp(-step * 10));
            last = x;
            const target = gsap.utils.clamp(-4, 4, v * 0.005);
            leanV += (45 * (target - lean) - 9 * leanV) * step;
            lean += leanV * step;
            const next = Math.round(lean * 100) / 100;
            if (next === shown) return;
            shown = next;
            setSkew.forEach((f) => f(shown));
        });
    }

    function setupStories() {
        // ---------- About: the photo is a screen ----------
        // It simply stays, shown as an image on a screen: a fine dot grid and scanlines, a glitch every
        // few seconds (slices slip sideways, a ghost offsets, a ripple runs through), and now and then it
        // breaks into big pixels for a moment before resolving. All in its shader (uGlitch).
        const aboutPhoto = document.querySelector(".about .about__photo");
        if (aboutPhoto) {
            const u = storyUniforms(aboutPhoto);
            if (u) u.uGlitch.value = 1;
        }

        // ---------- Works rows ----------
        document.querySelectorAll(".work").forEach((row, index) => {
            // in the sideways strip, every card after the first is revealed as it slides in from the right
            const side = worksScroll && index > 0 ? {
                containerAnimation: worksScroll
            } : null;
            const media = row.querySelector(".work__media[data-story-media]");
            const intro = row.querySelector(".work__intro");
            if (!media || !intro) return;
            const facts = [...row.querySelectorAll(".fact")];
            [intro, ...facts].forEach((e) => e.removeAttribute("data-reveal"));
            const u = storyUniforms(media);
            const tLines = SplitText.create(intro.querySelector(".work__title"), {
                type: "lines",
                mask: "lines"
            }).lines;
            // every paragraph of the intro rises with the rest (Community has two)
            const dLines = [...intro.querySelectorAll("p")].flatMap((p) => SplitText.create(p, {
                type: "lines",
                mask: "lines"
            }).lines);

            // 2–3. after the media: the words a line at a time, then the details
            const tl = gsap.timeline({
                    paused: true,
                    defaults: {
                        ease: "expo.out"
                    }
                })
                .fromTo(tLines, {
                    yPercent: 105
                }, {
                    yPercent: 0,
                    duration: 0.9,
                    stagger: 0.06
                }, 0)
                .fromTo(dLines, {
                    yPercent: 105,
                    opacity: 0
                }, {
                    yPercent: 0,
                    opacity: 1,
                    duration: 0.9,
                    stagger: 0.035
                }, 0.1)
                .fromTo(facts, {
                    y: 28,
                    opacity: 0
                }, {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.06,
                    ease: "power3.out"
                }, 0.22);

            // 1. the media pans out: it arrives close and large, pulls back into its frame and touches down
            // on the water just before it settles, so the rings start from its edges; then the words
            const HIDDEN = {
                y: 90,
                scale: 0.86
            };
            gsap.set(media, HIDDEN);
            if (u) u.uFade.value = 0;
            else gsap.set(media, {
                opacity: 0
            });
            let landing = null;
            const show = () => {
                if (landing) landing.kill();
                gsap.fromTo(media, {
                    y: 0,
                    scale: 1.3
                }, {
                    y: 0,
                    scale: 1,
                    duration: 1.5,
                    ease: "power3.inOut",
                    overwrite: "auto"
                });
                if (u) gsap.fromTo(u.uFade, {
                    value: 0
                }, {
                    value: 1,
                    duration: 0.7,
                    ease: "power2.out",
                    overwrite: "auto"
                });
                else gsap.fromTo(media, {
                    opacity: 0
                }, {
                    opacity: 1,
                    duration: 0.7,
                    ease: "power2.out",
                    overwrite: "auto"
                });
                landing = gsap.delayedCall(1.18, () => {
                    if (Liquid) Liquid.land(media, 0.09);
                }); // touchdown
            };
            const playText = () => {
                row._textOn = true;
                tl.timeScale(1).play();
            };
            const rewindText = () => {
                row._textOn = false;
                tl.timeScale(1.8).reverse();
            };
            const hide = () => { // same path back (spatial consistency)
                if (landing) {
                    landing.kill();
                    landing = null;
                }
                gsap.to(media, { ...HIDDEN,
                    duration: 0.7,
                    ease: "power2.in",
                    overwrite: "auto"
                });
                if (u) gsap.to(u.uFade, {
                    value: 0,
                    duration: 0.6,
                    ease: "power2.in",
                    overwrite: "auto"
                });
                else gsap.to(media, {
                    opacity: 0,
                    duration: 0.6,
                    overwrite: "auto"
                });
            };
            // the first card sits inside the pinned strip: its triggers must know, or a refresh pushes them past the pin
            const pinned = worksView ? {
                pinnedContainer: worksView
            } : {};
            ScrollTrigger.create(side ? {
                    trigger: row,
                    ...side,
                    start: "left 72%",
                    onEnter: show,
                    onLeaveBack: hide
                } :
                {
                    trigger: row,
                    ...pinned,
                    start: "top 72%",
                    onEnter: show,
                    onLeaveBack: hide
                });
            // the words don't wait for the media: they rise as soon as the intro is on screen, so a fast scroll never lands on an empty column
            ScrollTrigger.create(side ? {
                    trigger: row,
                    ...side,
                    start: "left 92%",
                    onEnter: playText,
                    onLeaveBack: rewindText
                } :
                {
                    trigger: intro,
                    ...pinned,
                    start: "top 94%",
                    onEnter: playText,
                    onLeaveBack: rewindText
                });
            // opened mid-page below this row: show it settled rather than hidden
            if (!side && row.getBoundingClientRect().top < innerHeight * 0.72) {
                gsap.set(media, {
                    y: 0,
                    scale: 1,
                    opacity: 1
                });
                if (u) u.uFade.value = 1;
                tl.progress(1);
                row._textOn = true;
            }
        });
    }

    /* =========================================================
       Liquid scroll-out for pixel titles ("KUG Coimbatore", case study titles)
       As the title leaves, its pixels round into droplets (title-wide --melt,
       added to each letter's hover --elsh in CSS) and the letters sink into
       their masks at random, like melting into a surface. Scrubbed, so
       scrolling back up re-forms it.
       The sink runs on y (px), not yPercent: the intro owns yPercent, and when
       a page opens mid-scroll both run at once and the intro used to leave the
       name stuck below its mask. GSAP adds the two, so they never collide.
       ========================================================= */
    function liquidTitleExit() {
        document.querySelectorAll("[data-pixel-title]").forEach((title) => {
            const chars = title.querySelectorAll(".char");
            if (!chars.length) return;
            gsap.timeline({
                    scrollTrigger: {
                        trigger: title,
                        start: "top 30%",
                        end: "bottom 5%",
                        scrub: 0.8
                    },
                })
                .fromTo(title, {
                    "--melt": 0
                }, {
                    "--melt": 19,
                    duration: 0.5,
                    ease: "none",
                    immediateRender: false
                }, 0)
                .fromTo(chars, {
                    y: 0,
                    opacity: 1,
                    filter: "blur(0px)"
                }, {
                    y: (i, el) => el.offsetHeight * gsap.utils.random(0.7, 1.3), // 70–130% of a letter
                    opacity: 0,
                    filter: "blur(4px)",
                    duration: 0.6,
                    ease: "power2.in",
                    stagger: {
                        each: 0.06,
                        from: "random"
                    },
                    immediateRender: false,
                }, 0.25);
        });
    }

    /* =========================================================
       Liquid headings: section titles coalesce as they enter (rising out of
       a stretched blur, letters settling at random) and melt the same way
       as they leave the top of the screen. Both halves are scrubbed.
       ========================================================= */
    const LIQUID_HEADINGS = ".site .display, .site .ce-title, .site .cs-heading";

    function liquidHeadings() {
        document.querySelectorAll(LIQUID_HEADINGS).forEach((h) => {
            if (h.closest("[data-story]")) return; // scroll stories animate their own heading
            h.removeAttribute("data-reveal"); // this replaces the generic fade-up
            gsap.set(h, {
                opacity: 1,
                y: 0
            });
            // line by line: each line condenses out of a blur (no masks, so the blur isn't clipped)
            const {
                lines
            } = SplitText.create(h, {
                type: "lines",
                linesClass: "lline"
            });
            gsap.set(lines, {
                transformOrigin: "50% 100%"
            });

            const liquid = {
                opacity: 0,
                yPercent: 35,
                scaleY: 1.25,
                filter: "blur(12px)"
            };
            const solid = {
                opacity: 1,
                yPercent: 0,
                scaleY: 1,
                filter: "blur(0px)"
            };

            // Played, not scrubbed: a fast flick can't strand a line half-melted. The lines condense in one
            // after another as the heading comes up into view and melt away as it leaves at the top (and
            // the reverse on the way back), always running to the end.
            gsap.set(lines, liquid);
            const condense = () => gsap.to(lines, { ...solid,
                duration: 1.1,
                ease: "power3.out",
                stagger: 0.12,
                overwrite: true
            });
            const melt = (up) => gsap.to(lines, {
                opacity: 0,
                yPercent: up ? -30 : 35,
                scaleY: up ? 1.2 : 1.25,
                filter: "blur(10px)",
                duration: 0.55,
                ease: "power2.in",
                stagger: {
                    each: 0.08,
                    from: up ? "start" : "end"
                },
                overwrite: true
            });
            ScrollTrigger.create({
                trigger: h,
                start: "top 92%",
                end: "bottom 8%",
                onEnter: condense,
                onEnterBack: condense,
                onLeave: () => melt(true),
                onLeaveBack: () => melt(false)
            });
            if (h.getBoundingClientRect().top < innerHeight * 0.92 && h.getBoundingClientRect().bottom > innerHeight * 0.08) gsap.set(lines, solid);
        });
    }

    /* =========================================================
       Cursor pill: over [data-cursor-pill] the pointer becomes a
       black pill that trails the mouse and leans into its motion
       ========================================================= */
    function setupCursorPill() {
        if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
        if (!document.querySelector("[data-cursor-pill]")) return;

        const pill = document.createElement("div");
        pill.className = "cursor-pill";
        pill.setAttribute("aria-hidden", "true");
        document.body.appendChild(pill);
        gsap.set(pill, {
            scale: 0,
            autoAlpha: 0
        });

        const xTo = gsap.quickTo(pill, "x", {
            duration: 0.35,
            ease: "power3"
        });
        const yTo = gsap.quickTo(pill, "y", {
            duration: 0.35,
            ease: "power3"
        });
        const lean = gsap.utils.clamp(-10, 10);
        let current = null,
            lastX = 0,
            flipped = false;

        // Near the right edge the pill opens to the left of the pointer instead of running off-screen
        function side(x) {
            const flip = !!current && x + pill.offsetWidth + 16 > window.innerWidth;
            if (flip === flipped) return;
            flipped = flip;
            gsap.to(pill, {
                xPercent: flip ? -100 : 0,
                duration: 0.35,
                ease: "power3.out"
            });
            pill.style.transformOrigin = flip ? "100% 0" : "0 0";
        }

        window.addEventListener("pointermove", (e) => {
            side(e.clientX);
            xTo(e.clientX);
            yTo(e.clientY);
            if (current) gsap.to(pill, {
                skewX: lean((lastX - e.clientX) * 0.6),
                duration: 0.5,
                ease: "power3.out",
                overwrite: "auto"
            });
            lastX = e.clientX;
        }, {
            passive: true
        });

        // Nearest labelled ancestor wins, so a tool chip inside a card swaps the label and back
        function show(el, e) {
            if (el === current) return;
            if (!el) return hide();
            // Optional second line (e.g. what a tool is used for)
            const note = el.dataset.cursorNote;
            pill.textContent = el.dataset.cursorPill;
            pill.classList.toggle("has-note", !!note);
            if (note) {
                const small = document.createElement("span");
                small.className = "cursor-pill__note";
                small.textContent = note;
                pill.appendChild(small);
            }
            if (!current && gsap.getProperty(pill, "scale") < 0.05) gsap.set(pill, {
                x: e.clientX,
                y: e.clientY
            });
            current = el;
            side(e.clientX);
            cursor.pill = true;
            gsap.to(pill, {
                scale: 1,
                autoAlpha: 1,
                duration: reduceMotion ? 0 : 0.55,
                ease: "back.out(2.2)",
                overwrite: "auto"
            });
        }

        function hide() {
            if (!current) return;
            current = null;
            cursor.pill = false;
            gsap.to(pill, {
                scale: 0,
                autoAlpha: 0,
                skewX: 0,
                duration: reduceMotion ? 0 : 0.3,
                ease: "power3.in",
                overwrite: "auto"
            });
        }
        document.addEventListener("pointerover", (e) => {
            if (e.pointerType === "mouse") show(e.target.closest("[data-cursor-pill]"), e);
        });
        document.documentElement.addEventListener("pointerleave", hide);
    }

    /* =========================================================
       Case study cards: the whole row opens the project.
       The title link stays the keyboard / screen-reader target.
       ========================================================= */
    function setupCardLinks() {
        document.querySelectorAll("[data-href]").forEach((card) => {
            const open = (newTab) => {
                if (newTab || card.hasAttribute("data-external")) window.open(card.dataset.href, "_blank", "noopener");
                else location.href = card.dataset.href;
            };
            card.addEventListener("click", (e) => {
                if (card.hasAttribute("data-hold")) return; // hold-to-open cards open themselves (setupLiquidNav)
                if (e.target.closest("a, button")) return; // real links handle themselves
                if (String(window.getSelection())) return; // let people select text
                open(e.metaKey || e.ctrlKey || e.shiftKey);
            });
            card.addEventListener("auxclick", (e) => {
                if (e.button === 1 && !e.target.closest("a, button")) open(true);
            });
        });
    }

    /* =========================================================
       Cursor trail: a short tapered tail that stretches behind the
       pointer while it moves and retracts into it when it stops
       ========================================================= */
    function setupCursorTrail() {
        if (reduceMotion || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;

        const canvas = document.createElement("canvas");
        canvas.className = "cursor-trail";
        canvas.setAttribute("aria-hidden", "true");
        document.body.appendChild(canvas);
        const ctx = canvas.getContext("2d");

        const COUNT = 14; // segments in the tail
        const HEAD = 4; // head radius in px
        const FOLLOW = 0.42; // how tightly each segment chases the one ahead
        const pts = Array.from({
            length: COUNT
        }, () => ({
            x: -100,
            y: -100
        }));
        const mouse = {
            x: -100,
            y: -100
        };
        let alpha = 0,
            seen = false,
            drawn = false;

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio, 1.5);
            canvas.width = innerWidth * dpr;
            canvas.height = innerHeight * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();
        window.addEventListener("resize", resize);

        window.addEventListener("pointermove", (e) => {
            if (e.pointerType !== "mouse") return;
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            if (!seen) {
                pts.forEach((p) => {
                    p.x = mouse.x;
                    p.y = mouse.y;
                });
                seen = true;
            }
        }, {
            passive: true
        });
        document.documentElement.addEventListener("pointerleave", () => {
            seen = false;
            alpha = 0;
        });

        gsap.ticker.add(() => {
            if (!seen && !drawn) return;

            pts[0].x += (mouse.x - pts[0].x) * 0.6;
            pts[0].y += (mouse.y - pts[0].y) * 0.6;
            for (let i = 1; i < COUNT; i++) {
                pts[i].x += (pts[i - 1].x - pts[i].x) * FOLLOW;
                pts[i].y += (pts[i - 1].y - pts[i].y) * FOLLOW;
            }

            // Visible only while the tail is stretched out, and never alongside the pill
            const tail = Math.hypot(pts[0].x - pts[COUNT - 1].x, pts[0].y - pts[COUNT - 1].y);
            const target = seen && !cursor.pill ? Math.min(1, tail / 40) : 0;
            alpha += (target - alpha) * 0.2;

            ctx.clearRect(0, 0, innerWidth, innerHeight);
            drawn = alpha > 0.01;
            if (!drawn) return;

            ctx.globalAlpha = alpha;
            ctx.strokeStyle = ctx.fillStyle = "#fff";
            ctx.lineCap = "round";
            for (let i = 0; i < COUNT - 1; i++) {
                ctx.lineWidth = HEAD * 2 * (1 - i / COUNT);
                ctx.beginPath();
                ctx.moveTo(pts[i].x, pts[i].y);
                ctx.lineTo(pts[i + 1].x, pts[i + 1].y);
                ctx.stroke();
            }
        });
    }

    /* =========================================================
       Testimonials: seamless auto-scroll loop
       Cards are cloned so the strip can wrap without a jump.
       Hover, drag or an arrow/inertia glide takes over; the loop
       resumes from wherever the user left it.
       ========================================================= */
    function setupAutoScroll(track) {
        if (!track || reduceMotion) return;
        const SPEED = 40; // px per second

        const originals = [...track.children];
        for (let k = 0; k < 2; k++) {
            originals.forEach((card) => {
                const clone = card.cloneNode(true);
                clone.setAttribute("aria-hidden", "true");
                track.appendChild(clone);
            });
        }

        let loopWidth = 0;
        const measure = () => {
            loopWidth = track.children[originals.length].offsetLeft - track.children[0].offsetLeft;
        };
        measure();
        window.addEventListener("resize", measure);
        document.fonts.ready.then(measure);

        let hover = false,
            visible = false,
            pos = track.scrollLeft;
        track.addEventListener("pointerenter", () => (hover = true));
        track.addEventListener("pointerleave", () => (hover = false));
        track.addEventListener("focusin", () => (hover = true));
        track.addEventListener("focusout", () => (hover = false));
        new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(track);

        // Liquid stop: speed eases toward its target like moving through thick liquid,
        // and the change in speed leans the cards (a damped spring), so a hover makes the
        // strip glide to a halt with a jelly wobble, and leaving eases it back up.
        const cards = [...track.children];
        let speed = SPEED; // current px/s
        let lean = 0,
            leanV = 0; // skew spring (deg, deg/s)
        let leanShown = 0;
        gsap.ticker.add((time, dt) => {
            if (!visible || !loopWidth) return;
            const step = Math.min(dt, 50) / 1000;
            const grabbed = track.classList.contains("is-dragging") || gsap.isTweening(track);
            if (grabbed) {
                pos = track.scrollLeft;
                speed = 0;
                return;
            }

            const target = hover ? 0 : SPEED;
            const prev = speed;
            speed += (target - speed) * (1 - Math.exp(-step * 3.2)); // ~0.6s viscous ease
            const accel = (speed - prev) / step; // px/s²

            // Spring: slowing down pushes the cards forward (content moves left, so the
            // tops lean left = positive skewX); speeding up leans them back. Then it settles.
            const push = gsap.utils.clamp(-4, 4, -accel * 0.028); // target lean in degrees
            leanV += (70 * (push - lean) - 6 * leanV) * step; // underdamped → a little wobble
            lean += leanV * step;
            const shown = Math.round(lean * 100) / 100;
            if (shown !== leanShown) {
                leanShown = shown;
                for (const c of cards) c.style.transform = shown ? `skewX(${shown}deg)` : "";
            }

            if (hover && speed < 0.5) {
                pos = track.scrollLeft;
                return;
            } // stopped: let people scroll it by hand
            pos += speed * step;
            if (pos >= loopWidth) pos -= loopWidth;
            if (pos < 0) pos += loopWidth;
            track.scrollLeft = pos;
        });
    }

    /* =========================================================
       Jelly lean for a horizontal track: text leans with the track's
       scroll speed (lags behind while moving, springs back with a little
       wobble when it stops). Images get the matching bend in the shader.
       ========================================================= */
    function setupTrackJelly(track, textSelector) {
        if (!track || reduceMotion) return;
        const els = [...track.querySelectorAll(textSelector)];
        let last = track.scrollLeft,
            v = 0,
            lean = 0,
            leanV = 0,
            shown = 0;
        gsap.ticker.add((time, dt) => {
            const step = Math.min(dt, 50) / 1000;
            const sl = track.scrollLeft;
            v += ((sl - last) / step - v) * (1 - Math.exp(-step * 10)); // smoothed px/s
            last = sl;
            const target = gsap.utils.clamp(-4, 4, -v * 0.005); // top trails the motion
            leanV += (45 * (target - lean) - 9 * leanV) * step; // soft, well-damped settle
            lean += leanV * step;
            const next = Math.round(lean * 100) / 100;
            if (next === shown) return;
            shown = next;
            for (const el of els) el.style.transform = shown ? `skewX(${shown}deg)` : "";
        });
    }

    /* =========================================================
       Liquid sounds (synthesised with Web Audio, no files)
       Hover:
       - "bubble": case studies / project cards (deep, double plop)
       - "drop":   links + buttons (single drip)
       - "tick":   tool chips (tiny high plink)
       Music: a looping lofi track (mp3/Lofi BGM.mp3) under the same switch.
       It fades in/out, pauses with the tab, and carries its position across
       pages within the session.
       Browsers keep audio locked until the first click or key press.
       Muted state is remembered per visitor; "M" toggles it too.
       ========================================================= */
    function setupSound() {
        const toggle = document.querySelector("[data-sound-toggle]");
        if (lite && toggle) {
            toggle.hidden = true;
            return;
        } // the light version skips the music download
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!toggle || !AC) {
            if (toggle) toggle.hidden = true;
            return;
        }

        const KEY = "kug-sound";
        // a page shown inside the homepage (the case study promoted after a burst) uses the homepage's
        // sound: its audio is already unlocked and its music already playing
        let host = null;
        try {
            if (window.top !== window && window.top.kugSound) host = window.top.kugSound;
        } catch (e) {}
        let enabled = true;
        try {
            enabled = localStorage.getItem(KEY) !== "off";
        } catch (e) {}

        let ac = null,
            master = null,
            noise = null,
            lastAt = 0;
        const rand = (a, b) => a + Math.random() * (b - a);

        function unlock() {
            if (!ac) {
                ac = new AC();
                master = ac.createGain();
                master.gain.value = 0.3;

                // Dry path, softened so the highs never get shrill
                const soften = ac.createBiquadFilter();
                soften.type = "lowpass";
                soften.frequency.value = 4200;
                master.connect(soften).connect(ac.destination);

                // Wet path: a short generated room so drops ring like they hit water in a sink
                const room = ac.createConvolver();
                room.buffer = impulse(1.1, 3.2);
                const wet = ac.createGain();
                wet.gain.value = 0.22;
                master.connect(room).connect(wet).connect(ac.destination);

                // Shared white noise for the splash transient
                noise = ac.createBuffer(1, ac.sampleRate * 0.05, ac.sampleRate);
                const d = noise.getChannelData(0);
                for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;

                ac.addEventListener("statechange", render); // keep the switch honest about locked/unlocked
            }
            return ac.state === "suspended" ? ac.resume() : Promise.resolve();
        }
        // Browsers only let audio start after a click/tap/key press on *this* page — a new page
        // (e.g. after navigating) starts locked, so unlock on the very first gesture.
        // Until then the switch shows "off"; if that first gesture is on the switch (or "M"),
        // it should turn sound on rather than flip it off, so remember when it happened.
        let unlockedAt = -Infinity;
        const isLocked = () => (host ? host.locked : enabled && !(ac && ac.state === "running"));
        const onGesture = (e) => {
            if (!enabled) return;
            if (isLocked()) unlockedAt = e.timeStamp;
            unlock().then(render, render);
            startMusic();
        };
        const isUnlockGesture = (e) => e.timeStamp - unlockedAt < 1000;
        ["pointerdown", "mousedown", "click", "keydown", "touchend"].forEach((ev) =>
            window.addEventListener(ev, onGesture, {
                passive: true,
                capture: true
            }));

        function impulse(seconds, decay) {
            const len = ac.sampleRate * seconds;
            const buf = ac.createBuffer(2, len, ac.sampleRate);
            for (let c = 0; c < 2; c++) {
                const ch = buf.getChannelData(c);
                for (let i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
            }
            return buf;
        }

        /* One water drop. A falling drop traps an air bubble that rings as a
           sine whose pitch shoots upward as it collapses, plus a tiny splash. */
        function drip({
            f0,
            len,
            level,
            delay = 0,
            rise = 2.6,
            pan = rand(-0.35, 0.35)
        }) {
            const t = ac.currentTime + delay;
            const out = ac.createStereoPanner ? ac.createStereoPanner() : ac.createGain();
            if (out.pan) out.pan.value = pan;
            out.connect(master);

            const osc = ac.createOscillator();
            const amp = ac.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(f0, t);
            osc.frequency.exponentialRampToValueAtTime(f0 * rise, t + len * 0.45);
            amp.gain.setValueAtTime(0.0001, t);
            amp.gain.exponentialRampToValueAtTime(level, t + 0.004);
            amp.gain.exponentialRampToValueAtTime(level * 0.35, t + len * 0.4);
            amp.gain.exponentialRampToValueAtTime(0.0001, t + len);
            osc.connect(amp).connect(out);
            osc.start(t);
            osc.stop(t + len + 0.03);

            const splash = ac.createBufferSource();
            splash.buffer = noise;
            const hp = ac.createBiquadFilter();
            hp.type = "bandpass";
            hp.frequency.value = f0 * 4;
            hp.Q.value = 1.2;
            const sg = ac.createGain();
            sg.gain.setValueAtTime(level * 0.25, t);
            sg.gain.exponentialRampToValueAtTime(0.0001, t + 0.012);
            splash.connect(hp).connect(sg).connect(out);
            splash.start(t);
            splash.stop(t + 0.02);
        }

        const VOICES = {
            bubble() {
                const f = rand(230, 290);
                drip({
                    f0: f,
                    len: 0.24,
                    level: 0.6,
                    rise: 3
                });
                drip({
                    f0: f * 1.7,
                    len: 0.11,
                    level: 0.25,
                    delay: 0.085
                });
            },
            drop() {
                drip({
                    f0: rand(620, 820),
                    len: 0.13,
                    level: 0.5
                });
            },
            tick() {
                drip({
                    f0: rand(1150, 1400),
                    len: 0.07,
                    level: 0.3,
                    rise: 2
                });
            },
        };

        const ready = () => enabled && ac && ac.state === "running" && !document.hidden;

        function play(kind) {
            if (host) {
                host.play(kind);
                return;
            }
            if (!ready()) return;
            const now = performance.now();
            if (now - lastAt < 70) return; // no machine-gunning across dense rows
            lastAt = now;
            VOICES[kind]();
        }

        /* ---- Background music ---- */
        const MUSIC_VOL = 0.22;
        const MUSIC_POS = "kug-bgm-t";
        const music = new Audio();
        music.loop = true;
        music.preload = "none"; // muted visitors never download it
        music.volume = 0;
        let musicSrcSet = false,
            musicWanted = false,
            musicPlaying = false;
        // Track real playback: a blocked autoplay attempt on load can leave play() pending with
        // paused === false, which used to make the first click think music was already on.
        music.addEventListener("playing", () => {
            musicPlaying = true;
        });
        music.addEventListener("pause", () => {
            musicPlaying = false;
        });

        function startMusic() {
            if (host) return; // the homepage's music carries on
            musicWanted = true;
            if (!enabled || document.hidden) return;
            if (!musicSrcSet) {
                music.src = SITE_ROOT + "mp3/" + encodeURIComponent("Lofi BGM.mp3");
                musicSrcSet = true;
                // carry on from where the previous page left off
                let t = 0;
                try {
                    t = parseFloat(sessionStorage.getItem(MUSIC_POS)) || 0;
                } catch (e) {}
                if (t) music.addEventListener("loadedmetadata", () => {
                    music.currentTime = t % (music.duration || Infinity);
                }, {
                    once: true
                });
            }
            if (musicPlaying) return;
            music.play().then(() => {
                if (enabled) gsap.to(music, {
                    volume: MUSIC_VOL,
                    duration: 2.4,
                    ease: "power1.out",
                    overwrite: true
                });
            }).catch(() => {}); // still locked: the first gesture calls startMusic again
        }

        function stopMusic(pauseAfter = true) {
            gsap.to(music, {
                volume: 0,
                duration: 0.8,
                ease: "power1.in",
                overwrite: true,
                onComplete: () => {
                    if (pauseAfter) music.pause();
                },
            });
        }
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                gsap.killTweensOf(music);
                music.pause();
            } else if (enabled && musicWanted) {
                music.volume = 0;
                startMusic();
            }
        });
        window.addEventListener("pagehide", () => {
            try {
                if (musicSrcSet) sessionStorage.setItem(MUSIC_POS, String(music.currentTime));
            } catch (e) {}
        });

        // First matching rule wins, so cards beat the generic link rule
        const RULES = [
            [".tool", "tick"],
            ["[data-href], .ai-card", "bubble"],
            ["a, button", "drop"],
        ];
        let current = null;
        document.addEventListener("pointerover", (e) => {
            if (e.pointerType !== "mouse") return;
            let hit = null,
                kind = null;
            for (const [sel, k] of RULES) {
                const el = e.target.closest(sel);
                if (el) {
                    hit = el;
                    kind = k;
                    break;
                }
            }
            if (hit === current) return;
            const backOut = hit && current && hit.contains(current); // e.g. tool chip → its card
            current = hit;
            if (hit && hit !== toggle && !backOut) play(kind);
        });

        // While the browser holds audio back, show the muted state; the wave appears once it can play
        function render() {
            const locked = isLocked();
            const audible = enabled && !locked;
            toggle.setAttribute("aria-pressed", String(audible));
            toggle.classList.toggle("is-waiting", locked);
            toggle.querySelector(".sound-toggle__label").textContent =
                audible ? "Sound on" : locked ? "Click for sound" : "Sound off";
            toggle.title = locked ? "Click anywhere to turn on music and sounds" : "Music and sounds (M)";
        }

        function set(on) {
            if (host) {
                host.set(on);
                enabled = on;
                render();
                return;
            }
            enabled = on;
            try {
                localStorage.setItem(KEY, on ? "on" : "off");
            } catch (e) {}
            render();
            if (on) {
                unlock().then(() => VOICES.drop());
                startMusic();
            } else stopMusic();
        }
        toggle.addEventListener("click", (e) => {
            if (!isUnlockGesture(e)) set(!enabled);
        });
        window.addEventListener("keydown", (e) => {
            if (e.key.toLowerCase() !== "m" || e.metaKey || e.ctrlKey || e.altKey) return;
            if (e.target.closest("input, textarea, [contenteditable]")) return;
            if (!isUnlockGesture(e)) set(!enabled);
        });
        /* The bubble: a swell while it grows (its skin tightening: a rising tone and a breath of air),
           a pop when it bursts (the film snapping, the pitch falling, a spray of tiny drops), and the
           same run backwards when you come back to the page. */
        function swell(dur, down = false) {
            if (!ready()) return null;
            const t = ac.currentTime;
            const out = ac.createGain();
            out.gain.setValueAtTime(0.0001, t);
            out.gain.exponentialRampToValueAtTime(down ? 0.32 : 0.05, t + (down ? 0.08 : 0.15));
            out.gain.exponentialRampToValueAtTime(down ? 0.05 : 0.34, t + dur);
            const lp = ac.createBiquadFilter();
            lp.type = "lowpass";
            lp.frequency.setValueAtTime(down ? 2600 : 380, t);
            lp.frequency.exponentialRampToValueAtTime(down ? 380 : 2600, t + dur);
            lp.Q.value = 2.2;
            out.connect(lp).connect(master);
            const [fa, fb] = down ? [520, 150] : [150, 520];
            const oscs = [
                ["sine", 1, 0.5],
                ["triangle", 1.5, 0.18],
                ["sine", 2.01, 0.12]
            ].map(([type, mul, lvl]) => {
                const o = ac.createOscillator(),
                    g = ac.createGain();
                o.type = type;
                o.frequency.setValueAtTime(fa * mul, t);
                o.frequency.exponentialRampToValueAtTime(fb * mul, t + dur);
                g.gain.value = lvl;
                o.connect(g).connect(out);
                o.start(t);
                return o;
            });
            // air moving: noise through a band that sweeps with the tone
            const air = ac.createBufferSource();
            const buf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
            const ch = buf.getChannelData(0);
            for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1;
            air.buffer = buf;
            air.loop = true;
            const bp = ac.createBiquadFilter();
            bp.type = "bandpass";
            bp.Q.value = 3;
            bp.frequency.setValueAtTime(down ? 3200 : 600, t);
            bp.frequency.exponentialRampToValueAtTime(down ? 600 : 3200, t + dur);
            const ag = ac.createGain();
            ag.gain.value = 0.16;
            air.connect(bp).connect(ag).connect(out);
            air.start(t);
            const end = (fade) => {
                const n = ac.currentTime;
                out.gain.cancelScheduledValues(n);
                out.gain.setValueAtTime(Math.max(out.gain.value, 0.0001), n);
                out.gain.exponentialRampToValueAtTime(0.0001, n + fade);
                oscs.forEach((o) => o.stop(n + fade + 0.05));
                air.stop(n + fade + 0.05);
            };
            const timer = setTimeout(() => end(0.12), dur * 1000 + 40);
            return {
                stop(fade = 0.15) {
                    clearTimeout(timer);
                    end(fade);
                }
            };
        }

        function pop() {
            if (!ready()) return;
            const t = ac.currentTime;
            // the film snapping: a bright, very short crack
            const crack = ac.createBufferSource();
            crack.buffer = noise;
            const hp = ac.createBiquadFilter();
            hp.type = "highpass";
            hp.frequency.value = 1400;
            const cg = ac.createGain();
            cg.gain.setValueAtTime(0.9, t);
            cg.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
            crack.connect(hp).connect(cg).connect(master);
            crack.start(t);
            crack.stop(t + 0.06);
            // the body of it: a pitch that drops away
            const o = ac.createOscillator(),
                g = ac.createGain();
            o.type = "sine";
            o.frequency.setValueAtTime(980, t);
            o.frequency.exponentialRampToValueAtTime(140, t + 0.16);
            g.gain.setValueAtTime(0.0001, t);
            g.gain.exponentialRampToValueAtTime(0.7, t + 0.006);
            g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
            o.connect(g).connect(master);
            o.start(t);
            o.stop(t + 0.25);
            // the spray landing: a scatter of tiny drops
            for (let i = 0; i < 9; i++) drip({
                f0: rand(1300, 2700),
                len: rand(0.04, 0.08),
                level: rand(0.08, 0.18),
                delay: 0.03 + i * rand(0.02, 0.05),
                rise: 1.8
            });
        }

        function unpop() {
            if (!ready()) return;
            // backwards: the drops gather first, then the bubble closes with a soft plop
            for (let i = 0; i < 7; i++) drip({
                f0: rand(1300, 2400),
                len: 0.06,
                level: rand(0.06, 0.14),
                delay: i * 0.035,
                rise: 1.6
            });
            drip({
                f0: 260,
                len: 0.26,
                level: 0.55,
                delay: 0.32,
                rise: 3
            });
        }
        if (!host) {
            window.kugSound = {
                play: (kind) => play(kind),
                set: (on) => set(on),
                get locked() {
                    return isLocked();
                },
                swell,
                pop,
                unpop,
            };
        }

        render();
        // Try straight away: some browsers allow it (e.g. Chrome for sites you use often).
        // If not, the switch reads "Click for sound" until the first gesture unlocks it.
        if (enabled) {
            unlock().then(render, render);
            startMusic();
        }
    }

    /* =========================================================
       Full-page lens (Lusion-style): text, rules and images all bend.
       A viewport-sized overlay runs an SVG displacement filter through
       backdrop-filter, so everything behind it is warped by one lens
       that stays aligned to the screen. Zero at rest (crisp text, exact
       clicks); strength follows scroll speed. Chromium only — other
       browsers keep the WebGL images-only lens. Returns true when active.
       ========================================================= */
    function setupPageLens() {
        const chromium = !!(navigator.userAgentData && navigator.userAgentData.brands.some((b) => /Chromium/.test(b.brand)));
        if (!chromium || reduceMotion || !lenis || document.body.dataset.lens === "off") return false;
        if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return false;

        const MAX = 150; // px of displacement at the rim during a fast scroll
        const NS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(NS, "svg");
        svg.setAttribute("aria-hidden", "true");
        svg.setAttribute("width", "0");
        svg.setAttribute("height", "0");
        svg.style.position = "absolute";
        svg.innerHTML = `
      <filter id="page-lens" x="0" y="0" filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feImage x="0" y="0" preserveAspectRatio="none" result="map" />
        <feDisplacementMap in="SourceGraphic" in2="map" scale="0" xChannelSelector="R" yChannelSelector="G" />
      </filter>`;
        document.body.appendChild(svg);
        const filter = svg.querySelector("filter");
        const feImage = svg.querySelector("feImage");
        const disp = svg.querySelector("feDisplacementMap");

        const layer = document.createElement("div");
        layer.className = "lens-layer";
        layer.setAttribute("aria-hidden", "true");
        document.body.appendChild(layer);

        // Displacement map: each pixel points outward by r², so sampling inward (negative
        // scale) stretches content near the rim outward like a bulging lens. Sampling stays
        // inside the viewport, so the edges never pull in empty space.
        function buildMap() {
            const W = window.innerWidth,
                H = window.innerHeight,
                a = W / H;
            const mw = Math.round(W / 4),
                mh = Math.round(H / 4);
            const cv = document.createElement("canvas");
            cv.width = mw;
            cv.height = mh;
            const ctx = cv.getContext("2d");
            const img = ctx.createImageData(mw, mh);
            for (let y = 0; y < mh; y++) {
                for (let x = 0; x < mw; x++) {
                    const nx = (x / (mw - 1)) * 2 - 1,
                        ny = (y / (mh - 1)) * 2 - 1;
                    const r2 = (nx * nx * a * a + ny * ny) / (a * a + 1);
                    const i = (y * mw + x) * 4;
                    img.data[i] = 128 + 127 * nx * r2;
                    img.data[i + 1] = 128 + 127 * ny * r2;
                    img.data[i + 2] = 128;
                    img.data[i + 3] = 255;
                }
            }
            ctx.putImageData(img, 0, 0);
            feImage.setAttribute("href", cv.toDataURL());
            for (const el of [filter, feImage]) {
                el.setAttribute("width", W);
                el.setAttribute("height", H);
            }
        }
        buildMap();
        let resizeTimer;
        window.addEventListener("resize", () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(buildMap, 150);
        });

        let strength = 0,
            applied = -1,
            on = false;
        gsap.ticker.add(() => {
            const target = Math.min(1, Math.abs(lenis.velocity) / 40);
            strength += (target - strength) * 0.08;
            if (strength < 0.004) strength = 0;
            const scale = Math.round(-MAX * strength);
            if (scale === applied) return;
            applied = scale;
            disp.setAttribute("scale", scale);
            const want = scale !== 0; // skip the filter entirely at rest
            if (want !== on) {
                on = want;
                layer.classList.toggle("is-on", on);
            }
        });
        return true;
    }

    /* =========================================================
       Carousel arrows
       ========================================================= */
    function setupCarousel() {
        const track = document.querySelector("[data-carousel]");
        const prev = document.querySelector("[data-carousel-prev]");
        const next = document.querySelector("[data-carousel-next]");
        if (!track) return;

        const step = () => {
            const card = track.firstElementChild;
            const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
            return card.getBoundingClientRect().width + gap;
        };
        const update = () => {
            const max = track.scrollWidth - track.clientWidth - 2;
            prev.disabled = track.scrollLeft <= 2;
            next.disabled = track.scrollLeft >= max;
        };
        const go = (dir) => {
            // Aim inside the scrollable range: overshooting the end made the glide hit the wall
            const max = track.scrollWidth - track.clientWidth;
            const to = gsap.utils.clamp(0, max, Math.round(track.scrollLeft + dir * step()));
            // Gentle at both ends: speed builds and fades gradually, so the glide (and the
            // text lean that follows its speed) settles instead of braking
            gsap.to(track, {
                scrollLeft: to,
                duration: reduceMotion ? 0 : 1.5,
                ease: "power2.inOut",
                overwrite: true
            });
        };
        prev.addEventListener("click", () => go(-1));
        next.addEventListener("click", () => go(1));
        track.addEventListener("scroll", update, {
            passive: true
        });
        window.addEventListener("resize", update);
        update();
    }

    /* Mouse drag with inertial glide (touch keeps native scrolling) */
    function setupDragScroll(track) {
        let down = false,
            moved = false,
            startX = 0,
            startScroll = 0,
            lastX = 0,
            lastT = 0,
            v = 0;

        track.addEventListener("pointerdown", (e) => {
            if (e.pointerType !== "mouse" || e.button !== 0) return;
            down = true;
            moved = false;
            startX = lastX = e.clientX;
            startScroll = track.scrollLeft;
            lastT = performance.now();
            v = 0;
            gsap.killTweensOf(track);
        });
        window.addEventListener("pointermove", (e) => {
            if (!down) return;
            const dx = e.clientX - startX;
            if (!moved && Math.abs(dx) > 4) {
                moved = true;
                track.classList.add("is-dragging");
            }
            if (!moved) return;
            track.scrollLeft = startScroll - dx;
            const now = performance.now();
            v = (e.clientX - lastX) / Math.max(1, now - lastT);
            lastX = e.clientX;
            lastT = now;
        });
        window.addEventListener("pointerup", () => {
            if (!down) return;
            down = false;
            if (!moved) return;
            requestAnimationFrame(() => track.classList.remove("is-dragging"));
            const max = track.scrollWidth - track.clientWidth; // glide into the end softly, never into a wall
            gsap.to(track, {
                scrollLeft: gsap.utils.clamp(0, max, track.scrollLeft - v * 480),
                duration: 1.9,
                ease: "expo.out"
            });
        });
        track.addEventListener("click", (e) => {
            if (moved) {
                e.preventDefault();
                moved = false;
            }
        }, true);
        track.addEventListener("dragstart", (e) => e.preventDefault());
    }

    /* =========================================================
       Three.js stage (bypassed: no data-liquid elements)
       ========================================================= */
    function createLiquidStage() {
        return null;
    }

        Liquid = createLiquidStage();
    scriptReady = true;
    afterScript.splice(0).forEach((fn) => fn());
})();