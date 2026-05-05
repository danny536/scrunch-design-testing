import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "react-material-symbols/sharp";
import { ThemeProvider } from "@/components/theme-provider";

const inter = localFont({
  src: [
    { path: "../fonts/Inter-VariableFont.ttf",        style: "normal" },
    { path: "../fonts/Inter-Italic-VariableFont.ttf", style: "italic" },
  ],
  variable: "--font-inter",
  display: "swap",
});

const newsreader = localFont({
  src: [
    { path: "../fonts/Newsreader-VariableFont.ttf",        style: "normal" },
    { path: "../fonts/Newsreader-Italic-VariableFont.ttf", style: "italic" },
  ],
  variable: "--font-newsreader-var",
  display: "swap",
});

const ibmPlexMono = localFont({
  src: [
    { path: "../fonts/IBMPlexMono-Regular.ttf",        weight: "400", style: "normal" },
    { path: "../fonts/IBMPlexMono-Italic.ttf",         weight: "400", style: "italic" },
    { path: "../fonts/IBMPlexMono-Medium.ttf",         weight: "500", style: "normal" },
    { path: "../fonts/IBMPlexMono-MediumItalic.ttf",   weight: "500", style: "italic" },
    { path: "../fonts/IBMPlexMono-SemiBold.ttf",       weight: "600", style: "normal" },
    { path: "../fonts/IBMPlexMono-SemiBoldItalic.ttf", weight: "600", style: "italic" },
  ],
  variable: "--font-plex-mono-var",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Scrunch Design Testing",
  description: "Scrunch component library and design system reference",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${newsreader.variable} ${ibmPlexMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      {/* figma-capture-script: temporary — removed after export */}
      <head>
        <script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async></script>
        {/* Expand all scroll/height constraints so the full page content is captured */}
        <script dangerouslySetInnerHTML={{ __html: `
(function(){
  if(!window.location.hash.includes('figmacapture'))return;
  var head=document.head||document.getElementsByTagName('head')[0];
  function inject(el){ if(head)head.appendChild(el); else document.addEventListener('DOMContentLoaded',function(){document.head.appendChild(el);}); }

  /* Layout expansion styles */
  var s=document.createElement('style');
  s.id='figma-expand';
  s.textContent=[
    'html{min-width:1440px!important;}',
    'html,body{height:auto!important;min-height:0!important;overflow:visible!important;}',
    '.h-screen{height:auto!important;}',
    '.overflow-y-auto{overflow-y:visible!important;max-height:none!important;}',
    '.overflow-x-hidden{overflow-x:visible!important;}',
  ].join('');
  inject(s);

  /*
   * Icon fix: Figma's html-to-design serializer creates Figma text nodes for icon spans,
   * but "Material Symbols Sharp" isn't available in Figma's renderer so PUA codepoints
   * render as nothing. Fix: each Icon component renders a data-icon-path attribute
   * containing the SVG path data (embedded at build time — no network request needed).
   * This script reads that attribute and swaps each span for an inline <svg> so Figma
   * imports the icons as native vector shapes.
   *
   * Uses requestAnimationFrame loop to wait for React hydration before replacing.
   */
  function replaceIconSpans() {
    var els = document.querySelectorAll('.material-symbols[data-icon-path]');
    if (!els.length) return false;
    els.forEach(function(el) {
      try {
        var pathData = el.getAttribute('data-icon-path');
        if (!pathData) return;
        var cs  = window.getComputedStyle(el);
        var sz  = Math.round(parseFloat(cs.fontSize) || 20);
        var col = cs.color || '#1D1107';
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.setAttribute('viewBox', '0 -960 960 960');
        svg.setAttribute('width',  sz);
        svg.setAttribute('height', sz);
        svg.style.cssText = 'display:inline-block;vertical-align:middle;flex-shrink:0;';
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathData);
        path.setAttribute('fill', col);
        svg.appendChild(path);
        el.parentNode.replaceChild(svg, el);
      } catch(e) {}
    });
    return true;
  }

  /*
   * Delay replacement until after React has finished hydrating.
   * React hydration typically completes in <500ms; waiting 1500ms is safe.
   * The capture fires at 4000ms, so there is ample time after the delay.
   * Running too early causes a hydration mismatch (server: <span>, DOM: <svg>).
   */
  setTimeout(function() {
    var iconPollStart = Date.now();
    function pollIcons() {
      if (replaceIconSpans()) return;
      if (Date.now() - iconPollStart < 2000) requestAnimationFrame(pollIcons);
    }
    pollIcons();
  }, 1500);
})();
        `}} />
      </head>
      <body className="min-h-full flex flex-col">
          <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </body>
    </html>
  );
}
