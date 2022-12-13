import $ from "jquery";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MobileDetect from "mobile-detect";
import SplitType from "split-type";
import "flickity/dist/flickity.min.css";
import Flickity from "flickity";
import barba from "@barba/core";
import barbaCss from "@barba/css";

gsap.registerPlugin(ScrollTrigger);

$(document).ready(function () {
    const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
    direction: "vertical", // vertical, horizontal
    gestureDirection: "vertical", // vertical, horizontal, both
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
    });

    //get scroll value
	lenis.on("scroll", ({ scroll, limit, velocity, direction, progress }) => {
	// console.log({ scroll, limit, velocity, direction, progress });
	});

	function raf(time) {
		lenis.raf(time);
		requestAnimationFrame(raf);
	}

	requestAnimationFrame(raf);

	let header = $(".header"),
	btnMenu = $(".header__btnmenu"),
	screen = {
		mobile: 767,
		tablet: 991,
		desktop: 1199,
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
    $(window).on("scroll", function () {});

    let $hamburger = $("#hamburger");

		$hamburger.click(function () {
		$("body").toggleClass("openNav");
		});

    let lastScrollTop = 0;
    $(window).scroll(function (e) {
    var st = $(this).scrollTop();
    if (st > lastScrollTop) {
        if (st > 440) {
        $("header").addClass("hide");
        }
    } else {
        if (st > 440) {
        $("header").addClass("hide");
        $("header").removeClass("hide");
        }
    }
    lastScrollTop = st;
    });

    select = (e) => document.querySelector(e);
    selectAll = (e) => document.querySelectorAll(e);

    function initFooter() {
    const DOM = {
        stage: select(".footer"),
        background: select(".footer__bg"),
        title: select(".footer__content h2"),
        button: select(".footer__content a"),
        logo: select(".footer .logo"),
        inforItem: selectAll(".footer .infor__item"),
        menuItem: selectAll(".footer .menu-item"),
    };

    const splitTitle = new SplitType(DOM.title, {
        type: "lines, chars",
        linesClass: "line",
        charsClass: "char",
        position: "relative",
    });

    tl = gsap.timeline({
        scrollTrigger: {
        trigger: DOM.stage,
        start: "top 60%",
        },
    });

    tl.from(DOM.title, {
        ease: "power4",
        y: "+=5vh",
        duration: 2,
    })
        .from(
        DOM.title.querySelectorAll(".line__inner"),
        {
            ease: "power4",
            y: 200,
            duration: 1.5,
            stagger: 0.1,
        },
        0
        )
        .from(
        DOM.logo,
        {
            ease: "power4",
            opacity: 0,
            y: 50,
            duration: 1.5,
        },
        "<= 0.5"
        )
        .from(
        DOM.inforItem,
        {
            ease: "power4",
            opacity: 0,
            y: 50,
            duration: 1.5,
            stagger: 0.1,
        },
        "<= 0.5"
        )
        .from(
        DOM.menuItem,
        {
            ease: "power4",
            opacity: 0,
            y: 50,
            duration: 1.5,
            stagger: 0.1,
        },
        "<= 0.5"
        );
    let tl2 = gsap.timeline({
        scrollTrigger: {
        trigger: DOM.stage,
        scrub: true,
        start: "top bottom",
        end: "bottom bottom",
        },
    });

    tl2.from(DOM.stage.querySelector(".footer__bg img"), {
    yPercent: -100,
    ease: "none",
    });
}

    function init() {
        initFooter();
        }
        init();
});

select = (e) => document.querySelector(e);
selectAll = (e) => document.querySelectorAll(e);

// barba.use(barbaCss);

const overlayPath = select(".overlay__path");

const delay = (n) => {
	n = n || 2000;
	return new Promise((done) => {
		setTimeout(() => {
			done();
		}, n)
	});
}
const coverLoading = select(".cover-loading");


const enterPage = () => {
	const tlEnter = gsap.timeline({
		delay: 0.3,
		onStart: () => {
			window.scrollTo(0, 0);

		},
		onComplete: () => {
			ScrollTrigger.refresh(true);
		}
	});
	tlEnter
    .to(coverLoading, {
		duration: 1.2,
		yPercent: 100,
		ease: "Expo.easeInOut",
    })
    .set(coverLoading, {
		yPercent: 0,
		zIndex: -1,
    });
}

const leavePage = () => {
	const tlLeave = gsap.timeline();

	tlLeave
    .set(coverLoading, {
		yPercent: -100,
		zIndex: 101,
    })
    .to(coverLoading, {
		duration: 1.2,
		yPercent: 0,
		ease: "Expo.easeInOut",
    });
}

barba.hooks.beforeLeave(() => {
	let triggers = ScrollTrigger.getAll();
	triggers.forEach((trigger) => {
		trigger.kill();
	});
});

barba.init({
	sync: true,
	transitions: [
		{
			async leave(data) {
				const done = this.async();

				leavePage();
				await delay(1000);
				done();
			},
			async enter(data) {
				enterPage();
			},
			once(data) {
				enterPage();
			},
		},
	],
	views: [
		{
			namespace: "home",
			beforeEnter() {
				ScrollTrigger.refresh();

				homeScript();
			},
			// afterEnter(data) {
			// },
		},
		{
			namespace: "about",
			beforeEnter() {
				ScrollTrigger.refresh();

				aboutScript();
			},
			// afterEnter(data) {
			// },
		},
	],
});

function homeScript() {
	const weDoSlider = new Flickity("#weDo-slider", {
		cellAlign: "center",
		contain: true,
		wrapAround: true,
		initialIndex: 1,
		prevNextButtons: false,
		pageDots: false,
	});

	const weDoSliderMb = new Flickity("#weDo-sliderMb", {
		cellAlign: "left",
		contain: true,
		wrapAround: true,
		initialIndex: 0,
		prevNextButtons: false,
		pageDots: false,
	});

	document.querySelector(".control-left").addEventListener("click", function () {
		weDoSlider.previous();
    });

	document.querySelector(".control-right").addEventListener("click", function () {
		weDoSlider.next();
    });

	const introSlider = new Flickity("#intro-slider", {
		cellAlign: "center",
		contain: true,
		wrapAround: true,
		initialIndex: 1,
		prevNextButtons: false,
		pageDots: false,
	});

	function initBanner() {
		const splitH1 = new SplitType("h1", { type: "lines, chars", linesClass: "line", charsClass: "char", position: "relative" });
		const splitTextWrap = new SplitType(".banner .banner__text-right p", { type: "lines, chars", linesClass: "line", charsClass: "char", position: "relative" });
		const splitBtn = new SplitType(".banner a", { type: "lines, chars", linesClass: "line", charsClass: "char", position: "relative" });

		const  tl = gsap.timeline({ delay: 0.2 });
		tl
			.from("h1", { ease: "power4", y: "+=5vh", duration: 2.5 })
			.from("h1 .line__inner", { y: 200, duration: 2, ease: "power4", stagger: 0.1 }, 0)
			.from(".home .banner .banner__text-right p", { ease: "power4", y: "+=5vh", duration: 2.5 }, "<= .5")
			.from(".banner .banner__text-right p .line__inner", { y: 200, duration: 2, ease: "power4", stagger: 0.1, }, 0)
			.from(".banner a", { ease: "power4", y: "+=5vh", duration: 2.5, }, "<= .6")
			.from(".banner a .line__inner", { y: 200, duration: 2, ease: "power4", stagger: 0.1 }, 0);
			// .set([ "h1", ".banner .banner__text-right p", ".banner .line__inner", ".banner .btnMain"], { clearProps: "all" });
    }

    function initIntro() {
		const splitTitle = new SplitType(".intro h3", { type: "lines, chars", linesClass: "line", charsClass: "char", position: "relative" });

		const tl1 = gsap.timeline({ scrollTrigger: { trigger: ".intro", start: "top 60%" } });

		const tl2 = gsap.timeline({ scrollTrigger: {trigger: ".intro__showcase-item-img",start: "bottom 90%" }});

		tl1
			.from(".intro h3", { ease: "power4", y: "+=5vh", duration: 2, })
			.from(".intro h3 .line__inner", { y: 200, duration: 1.5, ease: "power4", stagger: 0.1, }, 0)
			.to( ".intro__showcase-item-img", { duration: 0.8, ease: "power4", clipPath: "inset(0% 0% 0% 0%)", stagger: 0.1 }, "<= .5" );

		tl2.from(".intro__showcase-item .text-default", { duration: 0.8, ease: "power4", opacity: 0, y: "-20", stagger: 0.2 });
	}

    function initWeDo() {
		const splitHeadline = new SplitType(".weDo__content .headline", { type: "lines, chars", linesClass: "line", charsClass: "char", position: "relative" });
		const splitH2 = new SplitType(".weDo h2", { type: "lines, chars", linesClass: "line", charsClass: "char", position: "relative" });

		const tl = gsap.timeline({ scrollTrigger: { trigger: ".weDo", start: "top 70%" }, });
		const taglineTl = gsap.timeline({ scrollTrigger: { trigger: ".weDo__library", start: "top 20%" }});

		tl
			.from(".weDo__content .headline", { ease: "power4", y: "+=5vh", duration: 1.8, })
			.from(".weDo__content .headline .line__inner", { ease: "power4", y: 200, duration: 1.3, }, "<= 0")
			.from(".weDo h2", { ease: "power4", y: "+=5vh", duration: 2, }, "<= 0.5")
			.from(".weDo h2 .line__inner", { ease: "power4", y: 200, duration: 1.5 }, "<= 0" )
			.from(".weDo__wrapText-right", { ease: "power4", opacity: 0, y: -50, duration: 1.5 }, 0.8)
			.from(".weDo a", { ease: "power4", opacity: 0, y: -20, duration: 1.5, }, "<= 0.5")
			.from( ".weDo__library", { ease: "power4", opacity: 0, y: "+=5vh", duration: 1.5 }, "<= 0.2" );

		taglineTl.from(".weDo__tagline", { ease: "power4", y: "+=5vh", duration: 1 });
	}

    function initProcess() {
		const splitHeadline = new SplitType(".process .headline", { type: "lines, chars", linesClass: "line", charsClass: "char", position: "relative" });
		const splitTitle = new SplitType(".process h2", { type: "lines, chars", linesClass: "line", charsClass: "char", position: "relative" });
		const splitTitleStep = new SplitType(".process h4", { type: "lines, chars", linesClass: "line", charsClass: "char", position: "relative" });
		const slitNumberStep = new SplitType(".process .number", { type: "lines, chars", linesClass: "line", charsClass: "char", position: "relative" });

		const pinWeDo = gsap.timeline({ scrollTrigger: { trigger: ".weDo", start: "bottom 40%", end: "+=250", pin: true, pinSpacing: false, }});
		const processTl = gsap.timeline({ scrollTrigger: { trigger: ".process", start: "top 70%", }});

		processTl
			.from(".process .headline", { ease: "power4", y: "+=5vh", duration: 1.8 })
			.from(".process .headline .line__inner", { ease: "power4", y: 200, duration: 1.3 }, "<= 0" )
			.from(".process h2", { ease: "power4", y: "+=5vh", duration: 2, }, " <= 0.5")
			.from(".process h2 .line__inner", { ease: "power", y: 200, duration: 1.5, stagger: 0.1 }, "<= 0" )
			.from( ".process__content-desc", { ease: "power4", opacity: 0, y: "+=5vh", duration: 2 }, 0.8);

		const processStepTl = gsap.timeline({ scrollTrigger: { trigger: ".process__content-desc", start: "top 70%", }});

		processStepTl
			.from(".process__content-step .number", { ease: "power4", y: "+=200", filter: "blur(6px)", duration: 2.5, stagger: 0.2 })
			.from(".process__content-step .number .line__inner", { ease: "power4", y: 200, duration: 2, stagger: 0.2, }, "<= 0")
			.from(".process__content-step .img", { ease: "power4", y: 20, opacity: 0, duration: 1.5, stagger: 0.1 }, "<= 0.5")
			.from(".process__content-step h4", { ease: "power4", y: "+=5vh", duration: 2.5, stagger: 0.1, }, "<= 0")
			.from(".process__content-step h4 .line__inner", { ease: "power4", y: 200, duration: 2, stagger: 0.1, }, "<= 0")
			.from(".process__content-step .text-default", { ease: "power4", opacity: 0, y: "+=5vh", duration: 2.5, stagger: 0.2 }, "<= 0.5"
        );
    }

    function initGuarantee() {
		const DOM = {
			section: select(".guarantee"),
			headline: select(".guarantee .headline"),
			title: select(".guarantee h2"),
			desc: select(".guarantee__content .text-default"),
			guaranteeList: select(".guarantee__list"),
			guaranteeItem: selectAll(".guarantee__item .wrap-hidden"),
		};

		const splitHeadline = new SplitType(DOM.headline, { type: "lines, chars", linesClass: "line", charsClass: "char", position: "relative"});
		const splitTitle = new SplitType(DOM.title, { type: "lines, chars", linesClass: "line", charsClass: "char", position: "relative"});

		let tl1 = gsap.timeline({ scrollTrigger: { trigger: DOM.section, start: "top 60%" }});

		let guaranteeListTl = gsap.timeline({ scrollTrigger: { trigger: DOM.desc, start: "top 70%" }});

		tl1
			.from(DOM.headline, { ease: "power4", y: "+=5vh", duration: 1.8, })
			.from(DOM.headline.querySelector(".line__inner"), { ease: "power4", y: 200, duration: 1.3 }, "<= 0")
			.from(DOM.title,{ ease: "power4", y: "+=5vh", duration: 2 }, "<= 0.5")
			.from(DOM.title.querySelector(".line__inner"), { ease: "power4", y: 200, duration: 1.5 }, "<= 0")
			.from(DOM.desc, { ease: "power4", opacity: 0, y: "+=5vh", duration: 2 }, 0.8);

		guaranteeListTl
			.set(DOM.guaranteeList, { pointerEvents: "none" })
			.from(DOM.guaranteeItem, { ease: "power4", opacity: 0, y: 50, duration: 2, stagger: 0.2 }, 0)
			.to(DOM.guaranteeList, { pointerEvents: "auto" });
    }

    function initParallax() {
		const DOM = {
			bannerSection: select(".banner"),
			bannerImg: select(".banner .banner__img img"),
		};

		let tl = gsap.timeline({ scrollTrigger: { trigger: DOM.bannerSection, scrub: true, start: "top 90px"}});

		tl.to(DOM.bannerImg, { yPercent: 30, ease: "none" });
	}

	const init = () => {
		initBanner();
		initParallax();
		initIntro();
		initWeDo();
		initProcess();
		initGuarantee();
	}

	init();

}

function aboutScript() {
	const showcaseSlide = new Flickity(".showcase__slide", {
		contain: true,
		initialIndex: 1,
		prevNextButtons: false,
		pageDots: false,
		wrapAround: true,
		autoPlay: true,
    });

	function initBanner() {
        const splitH1 = new SplitType("h1", { type: "lines, chars", linesClass: "line", charsClass: "char", position: "relative" });

		const tl = gsap.timeline({ delay: 0.5 });
		tl
			.from("h1", { ease: "power4", y: "+=5vh", duration: 2 })
			.from("h1 .line__inner", { ease: "power4", y: 200, duration: 1.5}, "<= 0");
	}

	function initIntro() {
		const DOM = {
			stage: select(".intro"),
			headline: select(".intro__content .headline"),
			h2: select("h2"),
			desc: select(".intro__content-desc"),
			img: select(".intro__img img"),

			statisticNumber: selectAll(".intro .statistic-number"),
			statisticDesc: selectAll(".intro .statistic-desc"),

			textItem: selectAll(".intro__textWrap p"),
		};

		console.log("DOM 👉️", DOM)

		const splitHeadline = new SplitType(DOM.headline, { type: "lines, chars", linesClass: "line", charsClass: "char", position: "relative" });
		const splitH2 = new SplitType(DOM.h2, { type: "lines, chars", linesClass: "line", charsClass: "char", position: "relative" });
		const splitStatisticNumber = new SplitType(DOM.statisticNumber, { type: "lines, chars", linesClass: "line", charsClass: "char", position: "relative" });

		const tl1 = gsap.timeline({ scrollTrigger: { trigger: DOM.stage, start: "top 70%"}});
		const tl2 = gsap.timeline({ scrollTrigger: { trigger: DOM.desc, start: "top 85%"}});
		const tl3 = gsap.timeline({ scrollTrigger: { trigger: DOM.img, start: "top 5%" }});

		tl1
			.from(DOM.headline, { ease: "power4", y: "+=5vh", duration: 1.8 })
			.from(DOM.headline.querySelector(".line__inner"), { ease: "power4", y: 200, duration: 1.3, }, "<= 0")
			.from(DOM.h2,{ ease: "power4",y: "+=5vh",duration: 2 },"<= .3")
			.from(DOM.h2.querySelector(".line__inner"), { ease: "power4", y: 200, duration: 1.5 }, "<= 0")
			.from(DOM.desc, { ease: "power4", opacity: 0, y: "+=5vh", duration: 2 }, "<= 0.5");

		tl2
			.from(DOM.statisticNumber, { ease: "power4", y: "+=5vh", duration: 2, stagger: 0.2, })
			.from(".intro .statistic-number .line__inner", { ease: "power4", y: 200, duration: 1.5, stagger: 0.2, }, 0)
			.from(DOM.statisticDesc, { ease: "power4", opacity: 0, y: "+=5vh", duration: 2, stagger: 0.1, }, "<= 0.5")
			.from(DOM.img, { ease: "power4", opacity: 0, scale: 1.04, filter: "blur(3px)", y: "+=5vh", duration: 2.5, }, "<= 0.3");

		tl3
			.from(DOM.textItem, { ease: "power4", y: "+=5vh", opacity: 0, duration: 1.5, stagger: 0.2, }, 0);

	}

	function initSolution() {
		const DOM = {
		stage: select(".solution"),

		headline: select(".solution .headline"),
		h2: select(".solution h2"),

		imgLeft: select(".solution #solution-img1"),
		imgCenter: select(".solution #solution-img2"),
		imgRight: select(".solution #solution-img3"),

		textSolution: selectAll(".solution__textWrap p"),
		};

		const splitHeadline = new SplitType(DOM.headline, { type: "lines, chars", linesClass: "line", charsClass: "char", position: "relative" });
		const splitH2 = new SplitType(DOM.h2, { type: "lines, chars", linesClass: "line", charsClass: "char", position: "relative" });


		const tl1 = gsap.timeline({ scrollTrigger: { trigger: DOM.stage, start: "top 60%"}});
		const tl2 = gsap.timeline({ scrollTrigger: { trigger: DOM.h2, start: "top 48%" }});
		const tl3 = gsap.timeline({ scrollTrigger: { trigger: DOM.imgCenter, start: "top 50%"}});

		tl1
			.from(DOM.headline,{ease: "power4",y: "+=5vh",duration: 1.8,},0)
			.from(DOM.headline.querySelector(".line__inner"),{ease: "power4",y: 200,duration: 1.3},"<= 0")
			.from(DOM.h2,{ease: "power4",y: "+=5vh",duration: 2,},"<= .3")
			.from(DOM.h2.querySelector(".line__inner"),{ease: "power4",y: 200,duration: 1.5},"<= 0");
		tl2
			.from(DOM.imgCenter,{ease: "power4",opacity: 0,y: 50,duration: 1.5,},0)
			.from(DOM.imgLeft,{ease: "power4",opacity: 0,x: 50,duration: 2,},"<= 0.5")
			.from(DOM.imgRight,{ease: "power4",opacity: 0,x: -50,duration: 2,},"<= 0");

		tl3.from(DOM.textSolution, { ease: "power4", y: "+=5vh", opacity: 0, duration: 1.5, stagger: 0.2 }, 0)
	}

	function initShowcase() {
		const DOM = {
			stage: select(".showcase"),

			h2: select(".showcase h2"),
			desc: select(".showcase__content p"),

			showcaseSlide: select(".showcase__slide"),
		};

		const splitH2 = new SplitType(DOM.h2, {type: "lines, chars",linesClass: "line",charsClass: "char", position: "relative"});

		const tl1 = gsap.timeline({scrollTrigger: {trigger: DOM.stage,start: "top 60%"}});

		const tl2 = gsap.timeline({scrollTrigger: {trigger: DOM.showcaseSlide,start: "top 80%"}});

		tl1
			.from(DOM.h2, { ease: "power4", y: "+=5vh", duration: 2 }, 0)
			.from(DOM.h2.querySelector(".line__inner"),{ease: "power4",y: 200,duration: 1.5},"<= 0")
			.from(DOM.desc,{ease: "power4",opacity: 0,x: -100,duration: 2.5},0.3);

		tl2
			.from(DOM.showcaseSlide, { ease: "power4", opacity: 0, y: 100, duration: 3 });
	}

    function initQuote() {
		const DOM = {
			stage: select(".quote"),

			circle: select(".quote .circle"),
			content: selectAll(".quote p")
	};

	const tl = gsap.timeline({scrollTrigger: {trigger: DOM.stage,start: "top 60%"}});

		tl
			.from(DOM.circle, { ease: "power4", scale: 0.85, opacity: 0, duration: 1.5, }, 0)
			.from(DOM.content,{ease: "power4",y: 30,opacity: 0,duration: 2,stagger: 0.4},"<= 0.5");
	}

	function initTeam() {
		const DOM = {
			stage: select(".team"),

			headline: select(".team__content .headline"),
			h2: select(".team h2"),
			desc: select(".team__content-desc"),

			btn: select(".team a"),

			libraries: selectAll(".team__libraries .img"),
		};

		const splitHeadline = new SplitType(DOM.headline, {type: "lines, chars",linesClass: "line",charsClass: "char",position: "relative"});
		const splitH2 = new SplitType(DOM.h2, {type: "lines, chars",linesClass: "line",charsClass: "char",position: "relative"});

		const tl1 = gsap.timeline({scrollTrigger: {trigger: DOM.stage,start: "top 60%"}});

		const tl2 = gsap.timeline({scrollTrigger: {trigger: DOM.libraries,start: "top 80%"}});

		tl1
			.from(DOM.headline, { ease: "power4", y: "+=5vh", duration: 1.8 }, 0)
			.from(DOM.headline.querySelector(".line__inner"),{ease: "power4",y: 200,duration: 1.3},"<= 0")
			.from(DOM.h2, { ease: "power4", y: "+=5vh", duration: 2.5, }, "<= 0.5")
			.from(DOM.h2.querySelector(".line__inner"), { ease: "power4", y: 200, duration: 2, }, "<= 0")
			.from(DOM.desc, { ease: "power4", opacity: 0, y: 50, duration: 1.5 }, "<= 0.8")
			.from(DOM.btn, { ease: "power4", opacity: 0, y: 50, duration: 1.5 }, "<= 0.3");

		tl2.from(DOM.libraries,{ease: "power4",opacity: 0,y: 50,duration: 2.5,stagger: 0.2},0.5);
	}

	function initEfficiency() {
		const DOM = {
			stage: select(".efficiency"),

			headline: select(".efficiency__content .headline"),
			h2: select(".efficiency h2"),
			desc: select(".efficiency .right p"),

			point: selectAll(".efficiency .point"),

			chartStage: select(".efficiency__chart"),

			chartLine: selectAll(".efficiency__chart-wrap .dash-line"),
			chartColumn: selectAll(".efficiency__chart-item"),
		};

		const splitHeadline = new SplitType(DOM.headline, {type: "lines, chars",linesClass: "line",charsClass: "char",position: "relative"});
		const splitH2 = new SplitType(DOM.h2, {type: "lines, chars",linesClass: "line",charsClass: "char",position: "relative"});

		let tl1 = gsap.timeline({scrollTrigger: {trigger: DOM.stage,start: "top 80%",},});

		let tl2 = gsap.timeline({scrollTrigger: {trigger: DOM.chartStage,start: "top 86%"},});

		tl1
			.from(DOM.headline, { ease: "power4", y: "+=5vh", duration: 1.8, }, 0)
			.from(DOM.headline.querySelector(".line__inner"),{ease: "power4",y: 200,duration: 1.3,},"<= 0")
			.from(DOM.h2,{ease: "power4",y: "+=5vh",duration: 2},"<= .3")
			.from(DOM.h2.querySelector(".line__inner"),{ease: "power4",y: 200,duration: 1.5,},"<= 0")
			.from(DOM.desc,{ease: "power4",opacity: 0,x: -50,duration: 2},1)
			.from(DOM.point,{ease: "power4",opacity: 0,x: -50,duration: 1.8,stagger: 0.2},"<= 0.5");

		tl2
			.from(DOM.chartColumn,{ease: "power4",opacity: 0,x: -50,duration: 1.8,stagger: 0.2,},0)
			.from(DOM.chartLine,{ease: "power4",filter: "blur(1px)",borderColor: "rgba(47, 66, 115, 0.8)",y: -200,duration: 2,stagger: 0.3},"<= 0.5");
	}

	function initParallax() {
		const DOM = {
			bannerSection: select(".banner"),
			bannerImg: select(".banner .banner__img img"),

			footer: select(".footer"),
		};

		gsap.fromTo(DOM.bannerImg, { y: "-20vh", },{y: "20vh", scrollTrigger: {trigger: DOM.bannerSection,scrub: true,start: "-90px bottom"},ease: "none"});
	}

	const init = () => {
		initBanner();
		initIntro();
		initSolution();
		initShowcase();
		initQuote();
		initTeam();
		initEfficiency();
		initParallax();
	}

    init();
}
