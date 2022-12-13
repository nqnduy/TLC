$(document).ready(function() {
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t)=>Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: "vertical",
        gestureDirection: "vertical",
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false
    });
    //get scroll value
    lenis.on("scroll", ({ scroll , limit , velocity , direction , progress  })=>{
    // console.log({ scroll, limit, velocity, direction, progress });
    });
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    gsap.registerPlugin(ScrollTrigger);
    let header = $(".header"), btnMenu = $(".header__btnmenu"), screen = {
        mobile: 767,
        tablet: 991,
        desktop: 1199
    };
    // DETECT DEVICE
    function mobileDetect() {
        let md = new MobileDetect(window.navigator.userAgent);
        if (md.mobile() != null || md.tablet() != null) {
            mobile = true;
            tablet = true;
        } else {
            mobile = false;
            tablet = false;
        }
    }
    mobileDetect();
    // WINDOW SCROLLING
    $(window).on("scroll", function() {});
    let $hamburger = $("#hamburger");
    $hamburger.click(function() {
        $("body").toggleClass("openNav");
    });
    let lastScrollTop = 0;
    $(window).scroll(function(e) {
        var st = $(this).scrollTop();
        if (st > lastScrollTop) {
            if (st > 440) $("header").addClass("hide");
        } else if (st > 440) {
            $("header").addClass("hide");
            $("header").removeClass("hide");
        }
        lastScrollTop = st;
    });
    select = (e)=>document.querySelector(e);
    selectAll = (e)=>document.querySelectorAll(e);
    function initFooter() {
        const DOM = {
            stage: select(".footer"),
            background: select(".footer__bg"),
            title: select(".footer__content h2"),
            button: select(".footer__content a"),
            logo: select(".footer .logo"),
            inforItem: selectAll(".footer .infor__item"),
            menuItem: selectAll(".footer .menu-item")
        };
        const splitTitle = new SplitType(DOM.title, {
            type: "lines, chars",
            linesClass: "line",
            charsClass: "char",
            position: "relative"
        });
        tl = gsap.timeline({
            scrollTrigger: {
                trigger: DOM.stage,
                start: "top 60%"
            }
        });
        tl.from(DOM.title, {
            ease: "power4",
            y: "+=5vh",
            duration: 2
        }).from(DOM.title.querySelectorAll(".line__inner"), {
            ease: "power4",
            y: 200,
            duration: 1.5,
            stagger: 0.1
        }, 0).from(DOM.logo, {
            ease: "power4",
            opacity: 0,
            y: 50,
            duration: 1.5
        }, "<= 0.5").from(DOM.inforItem, {
            ease: "power4",
            opacity: 0,
            y: 50,
            duration: 1.5,
            stagger: 0.1
        }, "<= 0.5").from(DOM.menuItem, {
            ease: "power4",
            opacity: 0,
            y: 50,
            duration: 1.5,
            stagger: 0.1
        }, "<= 0.5");
        let tl2 = gsap.timeline({
            scrollTrigger: {
                trigger: DOM.stage,
                scrub: true,
                start: "top bottom",
                end: "bottom bottom"
            }
        });
        tl2.from(DOM.stage.querySelector(".footer__bg img"), {
            yPercent: -100,
            ease: "none"
        });
    }
    function init() {
        $("body").imagesLoaded().progress({
            background: true
        }, function(instance, image) {}).always(function(instance) {
            $(".loading").addClass("--hide");
        }).fail(function() {
        // console.log('all images loaded, at least one is broken');
        }).done(function(instance) {
        // console.log('all images successfully loaded');
        });
        initFooter();
        // barba.use(barbaCss);
        barba.init({
            transition: [
                {
                    namespace: "home",
                    beforeOnce () {
                        console.log("beforeOnce \uD83D\uDC49️");
                    },
                    once () {},
                    afterOnce () {
                        console.log("afterOnce \uD83D\uDC49️");
                    }
                },
                {
                    namespace: "about",
                    to: {
                        namespace: [
                            "about"
                        ]
                    },
                    leave () {},
                    enter () {}
                }
            ]
        });
    }
    init();
});

//# sourceMappingURL=index.aa69868b.js.map
