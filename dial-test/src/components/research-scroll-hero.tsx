"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Scroll-driven manifesto hero.
 *
 * A pinned "DIAL research prioritises" holds a one-line reveal window while
 * DIAL's research commitments step through it, one whole line at a time. Once
 * the list finishes, the headline scales down and blurs as the dark panel
 * rises over it and takes the screen.
 *
 * The scroll track is a fixed multiple of the viewport and the list is moved by
 * a percentage of its own height, so the timing holds no matter how many items
 * the list grows to or how tall the viewport is.
 *
 * With reduced motion the pin, scale, blur and slide are all dropped: the
 * commitments render as a static line of text and the panel follows in flow.
 *
 * Adapted from Skiper UI's Skiper44 (ScrollAnimation_006) by @gurvinder-singh02
 * (https://gxuri.me), itself an inspired rebuild of scroll treatments on
 * nextjs.org and devouringdetails.com. Free tier requires attribution.
 */

// Drawn from the lab's participatory approach and the nine research themes.
const focusAreas = [
  "listening",
  "lived experience",
  "marginalised communities",
  "feminist futures",
  "women in tech",
  "low-literacy users",
  "digital safety",
  "rural health",
  "computing education",
  "mental wellbeing",
  "the next researcher",
];

// The slot holds an absolutely-positioned list, so it needs the widest item
// rendered invisibly to give the row a real width to centre against.
const widestArea = focusAreas.reduce((a, b) => (b.length > a.length ? b : a));

interface ResearchScrollHeroProps {
  className?: string;
  /** Rendered inside the dark panel that rises over the opening stage. */
  children?: React.ReactNode;
}

const ResearchScrollHero = ({ className, children }: ResearchScrollHeroProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const overlayRef = useRef<HTMLElement | null>(null);
  const scopeRef = useRef<HTMLElement | null>(null);
  const panelRadius = useRef<string>("0px");
  const [siteIsDark, setSiteIsDark] = useState(false);
  const reduceMotion = useReducedMotion();

  // Progress runs 0 -> 1 across the pinned portion of the track.
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });
  // Raw scroll, because `scrollYProgress` clamps to 1 once the track ends and
  // the band runs far past it. Driving nav state off the track would freeze it.
  const { scrollY } = useScroll();

  // Snap to whole lines, then spring between them, so the slot never rests on
  // two half-cut words.
  const lineIndex = useTransform(
    scrollYProgress,
    [0, 0.45],
    [0, focusAreas.length - 1],
  );
  const snappedLine = useSpring(useTransform(lineIndex, Math.round), {
    stiffness: 400,
    damping: 40,
  });
  const listOffset = useTransform(
    snappedLine,
    (line) => -(line / focusAreas.length) * 100,
  );
  const stageScale = useTransform(scrollYProgress, [0.5, 0.85], [1, 0.5]);
  const stageBlur = useTransform(scrollYProgress, [0.5, 0.8], [0, 8]);
  const panelScale = useTransform(scrollYProgress, [0.5, 0.68], [0.98, 1]);

  // Full transform strings rather than Motion's `y`/`scale` shorthands, which
  // are not hardware-accelerated and drop frames while the page is loading.
  const listTransform = useMotionTemplate`translateY(${listOffset}%)`;
  const stageTransform = useMotionTemplate`scale(${stageScale})`;
  const panelTransform = useMotionTemplate`scale(${panelScale})`;
  const stageBackdrop = useMotionTemplate`blur(${stageBlur}px)`;

  // The band is always the opposing theme, so the transition reads either way.
  const bandScope = siteIsDark ? "light" : "dark";

  /**
   * Paints the nav from the band's own edges: the clipped copy shows exactly
   * the slice of the nav strip the band currently covers, with the panel's own
   * corner radius, so the colour arrives with the moving edge rather than in
   * one flip. Writes `clip-path` straight onto the element — no React state, so
   * scrolling never re-renders the tree.
   */
  const paintNav = useCallback(() => {
    const panel = panelRef.current;
    const scope = (scopeRef.current ??= document.querySelector("[data-site-nav-scope]"));
    if (!panel || !scope) return;
    const nav = (navRef.current ??= scope.querySelector(":scope > [data-site-nav]"));
    const overlay = (overlayRef.current ??= scope.querySelector("[data-nav-overlay]"));
    if (!nav || !overlay) return;

    const navHeight = nav.getBoundingClientRect().height;
    const rect = panel.getBoundingClientRect();
    const top = Math.min(Math.max(rect.top, 0), navHeight);
    const bottom = Math.min(Math.max(rect.bottom, 0), navHeight);
    // Only round while the band's own top edge is inside the strip; past that
    // the slice is a plain rectangle.
    const round = rect.top > 0 ? ` round ${panelRadius.current} ${panelRadius.current} 0 0` : "";
    overlay.style.clipPath = `inset(${top}px 0 ${navHeight - bottom}px 0${round})`;
    // Once the band's bottom edge has climbed past the strip, the page behind
    // the nav is ordinary content again, so the real nav takes its bar back.
    scope.toggleAttribute("data-nav-solid", rect.bottom < navHeight);
  }, []);

  useMotionValueEvent(scrollY, "change", paintNav);

  // Follow the site theme so the band can always be its opposite.
  useEffect(() => {
    const html = document.documentElement;
    const read = () => setSiteIsDark(html.classList.contains("dark"));
    read();
    const observer = new MutationObserver(read);
    observer.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // The copy carries the band's theme. The class, not just a token override:
  // descendants need the inherited colour and the `dark:` variants (the logo
  // inverts through one) to follow.
  useEffect(() => {
    const overlay = (overlayRef.current ??= document.querySelector("[data-nav-overlay]"));
    if (!overlay) return;
    overlay.classList.toggle("dark", bandScope === "dark");
    overlay.classList.toggle("light", bandScope === "light");
  }, [bandScope]);

  // Paint once on mount and whenever the strip's geometry can change; the
  // panel's radius is read once, since it comes from a token.
  useEffect(() => {
    if (panelRef.current) {
      panelRadius.current = getComputedStyle(panelRef.current).borderTopLeftRadius || "0px";
    }
    paintNav();
    window.addEventListener("resize", paintNav);
    const scope = scopeRef.current;
    return () => {
      window.removeEventListener("resize", paintNav);
      // Leave the shared nav exactly as it was found.
      scope?.removeAttribute("data-nav-solid");
      overlayRef.current?.style.removeProperty("clip-path");
      overlayRef.current?.classList.remove("dark", "light");
    };
  }, [paintNav]);

  return (
    // `data-hero-root` ships in the server-rendered HTML, so the CSS that takes
    // the nav out of flow applies on the very first paint, with no JS.
    <div
      data-hero-root
      className={cn(
        "relative w-full overflow-x-clip bg-background text-foreground",
        className,
      )}
    >
      {reduceMotion ? (
        <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 pt-24 text-center">
          <p className="font-display text-4xl tracking-tight md:text-6xl">
            DIAL research prioritises
          </p>
          <p className="max-w-3xl text-lg text-balance text-muted-foreground md:text-xl">
            {focusAreas.join(" · ")}
          </p>
        </div>
      ) : (
        // Scroll track: 300vh means the stage stays pinned for 200vh — about
        // 90vh for the list, then a full viewport for the panel to rise. The
        // panel's -mt-[100vh] ties its entry to this height, so shortening the
        // track means re-deriving every range below (or trimming the list).
        <div ref={trackRef} className="relative h-[300vh]">
          <div className="sticky top-0 z-10 h-screen overflow-hidden">
            <motion.div
              style={{ transform: stageTransform }}
              className="flex h-full items-center justify-center"
            >
              {/* Stacked below xl: side by side needs ~1100px, so anything
                  narrower clipped the list at the viewport edge. */}
              <div className="flex flex-col px-6 font-display text-4xl tracking-tight md:text-6xl xl:flex-row xl:gap-4 xl:px-0">
                <p className="leading-[1.4] whitespace-nowrap">
                  DIAL research prioritises
                </p>
                <div className="relative h-[1.4em] overflow-hidden xl:overflow-visible">
                  <span aria-hidden className="invisible block leading-[1.4] font-light italic">
                    {widestArea}
                  </span>
                  <motion.ul
                    style={{ transform: listTransform }}
                    className="absolute top-0 left-0 w-max leading-[1.4] font-light italic"
                  >
                    {focusAreas.map((area) => (
                      <li key={area}>{area}</li>
                    ))}
                  </motion.ul>
                  {/* Leave a single-line slot, ghosting the lines either side. */}
                  <div
                    aria-hidden
                    className="absolute bottom-full left-0 z-10 hidden h-[60vh] w-screen bg-background/90 xl:block"
                  />
                  <div
                    aria-hidden
                    className="absolute top-full left-0 z-10 hidden h-[60vh] w-screen bg-background/90 xl:block"
                  />
                </div>
              </div>
            </motion.div>
            {/* Sits outside the scaled block so it veils the whole viewport,
                including list lines that spill past the headline. */}
            <motion.div
              aria-hidden
              style={{ backdropFilter: stageBackdrop }}
              className="pointer-events-none absolute inset-0 z-20 bg-background/10"
            />
          </div>
        </div>
      )}

      {/* Pulled up so it rises over the pinned stage rather than after it.
          The scope class re-scopes the theme tokens, so everything inside
          renders in the opposite theme to the rest of the page. */}
      <motion.section
        ref={panelRef}
        style={reduceMotion ? undefined : { transform: panelTransform }}
        className={cn(
          bandScope,
          // The band has to be a full viewport tall for its rise to finish, so
          // its contents are centred in it rather than parked at the top with
          // the remainder left as dead space under them. pt clears the fixed
          // nav plus breathing room, so the second hero does not arrive tight
          // under it, and is a floor on the centring rather than a gap.
          "relative z-20 flex min-h-screen w-full flex-col justify-center overflow-hidden rounded-4xl bg-background pt-28 pb-16 text-foreground md:pt-32 md:pb-20",
          !reduceMotion && "-mt-[100vh]",
        )}
      >
        {children}
      </motion.section>
    </div>
  );
};

export { ResearchScrollHero };
