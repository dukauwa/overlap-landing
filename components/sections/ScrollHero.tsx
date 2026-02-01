'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import AlphaBadge from '../ui/AlphaBadge'
import Button from '../ui/Button'
import Navigation from './Navigation'

export default function ScrollHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const loaderRef = useRef<HTMLDivElement>(null)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  // Configuration
  const frameCount = 147 // Total number of frames
  const framePath = (index: number) =>
    `/animations/hero-clouds/frame-${index.toString().padStart(3, '0')}.png`

  useEffect(() => {
    // Prevent browser from restoring scroll position on reload
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
    // Scroll to top on page load/reload
    window.scrollTo(0, 0)

    gsap.registerPlugin(ScrollTrigger, SplitText)

    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    const images: HTMLImageElement[] = []
    let imagesLoaded = 0
    let playIntroAnimation: (() => void) | null = null

    // Set canvas size to match window
    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      context.scale(dpr, dpr)
    }

    updateCanvasSize()

    // Render function
    const render = (index: number) => {
      const img = images[Math.floor(index) - 1]
      if (img && img.complete) {
        const dpr = window.devicePixelRatio || 1
        context.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr)

        // Calculate scaling to cover the canvas while maintaining aspect ratio
        const canvasAspect = canvas.width / canvas.height
        const imgAspect = img.width / img.height

        let drawWidth, drawHeight, offsetX, offsetY

        if (canvasAspect > imgAspect) {
          drawWidth = canvas.width / dpr
          drawHeight = drawWidth / imgAspect
          offsetX = 0
          offsetY = (canvas.height / dpr - drawHeight) / 2
        } else {
          drawHeight = canvas.height / dpr
          drawWidth = drawHeight * imgAspect
          offsetX = (canvas.width / dpr - drawWidth) / 2
          offsetY = 0
        }

        context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
      }
    }

    // Split the loader text for rolling animation
    const loaderTextElement = document.querySelector('#loader-text')
    const loaderSplit = loaderTextElement ? new SplitText(loaderTextElement, {
      type: 'chars',
      charsClass: 'loader-char'
    }) : null

    // Style each character for 3D rolling effect
    if (loaderSplit) {
      loaderSplit.chars.forEach((char: HTMLElement) => {
        char.style.display = 'inline-block'
        char.style.transformOrigin = 'center center -20px'
        char.style.transformStyle = 'preserve-3d'
      })
    }

    // Animate loader elements
    const loaderTimeline = gsap.timeline({ delay: 0.1 })

    // Initial appearance - characters roll in from bottom
    if (loaderSplit) {
      gsap.set(loaderSplit.chars, { rotateX: -90, opacity: 0 })
      loaderTimeline.to(loaderSplit.chars, {
        rotateX: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.05,
        ease: 'back.out(1.7)',
      })
    }

    // Single rolling animation - each character rolls one full rotation once
    const rollingAnimation = loaderSplit ? gsap.to(loaderSplit.chars, {
      rotateX: 360,
      duration: 1.2,
      stagger: 0.08,
      ease: 'power2.inOut',
    }) : null

    // Preload all frames
    const preloadImages = () => {
      for (let i = 1; i <= frameCount; i++) {
        const img = new Image()
        img.src = framePath(i)
        img.onload = () => {
          imagesLoaded++
          setLoadingProgress(Math.round((imagesLoaded / frameCount) * 100))

          if (imagesLoaded === frameCount) {
            // Render first frame
            render(1)

            // Minimum loader display time (2.5 seconds from page load)
            const minDisplayTime = 2500
            const elapsedTime = performance.now()
            const remainingTime = Math.max(0, minDisplayTime - elapsedTime)

            setTimeout(() => {
              // Kill the rolling animation
              if (rollingAnimation) rollingAnimation.kill()
              loaderTimeline.kill()

              // Nice exit animation - text rolls out and scales up
              const exitTimeline = gsap.timeline({
                onComplete: () => {
                  if (loaderSplit) loaderSplit.revert()
                  setIsLoaded(true)
                  // Trigger the hero intro animation
                  if (playIntroAnimation) playIntroAnimation()
                },
              })

              exitTimeline
                // Roll each character forward and out
                .to(loaderSplit?.chars || [], {
                  rotateX: 90,
                  opacity: 0,
                  scale: 1.2,
                  duration: 0.5,
                  stagger: 0.04,
                  ease: 'power2.in',
                })
                // Fade out the white background
                .to(loaderRef.current, {
                  opacity: 0,
                  duration: 0.6,
                  ease: 'power2.inOut',
                }, '-=0.2')
            }, remainingTime)
          }
        }
        images.push(img)
      }
    }

    preloadImages()

    // Setup scroll animation once images are loaded
    const setupAnimation = () => {
      const frameIndex = { value: 1 }

      const scrollAnimation = gsap.to(frameIndex, {
        value: frameCount,
        snap: 'value',
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
          pin: false,
        },
        onUpdate: () => render(frameIndex.value),
      })

      // Split the hero title into characters for rolling intro and morphing effect
      const heroTitleElement = document.querySelector('#hero-title')
      const heroSplit = heroTitleElement ? new SplitText(heroTitleElement, {
        type: 'chars,words',
        charsClass: 'char'
      }) : null

      // Style each character for 3D rolling effect
      if (heroSplit) {
        heroSplit.chars.forEach((char: HTMLElement) => {
          char.style.display = 'inline-block'
          char.style.transformOrigin = 'center center -20px'
          char.style.transformStyle = 'preserve-3d'
        })
        // Set initial state - rotated back and invisible
        gsap.set(heroSplit.chars, { rotateX: -90, opacity: 0 })
      }

      // Intro animation - paused initially, will be triggered after loader exits
      const introTimeline = gsap.timeline({ paused: true })

      introTimeline
        // Gradient already visible, start with badge and nav together
        .to(['#hero-badge', '#main-nav'], { opacity: 1, duration: 0.4, ease: 'power2.out' })
        // Make title visible (container), then roll in characters
        .to('#hero-title', { opacity: 1, duration: 0.1 }, '-=0.2')
        .to(heroSplit?.chars || [], {
          rotateX: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.03,
          ease: 'back.out(1.7)',
        }, '-=0.1')
        .to(['#hero-description', '#hero-cta'], { opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.3')

      // Set the callback to play intro animation after loader exits
      playIntroAnimation = () => introTimeline.play()

      // Text morph timeline - synced to scroll with automatic reverse on scroll-up
      // Container is 300vh, viewport is 100vh, max scroll is 200vh (66.7% of container)
      // Using 25%-60% range gives: hero fades earlier, gap in middle, final text at end
      const morphTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: '20% top',
          end: '60% top',
          scrub: 0.5, // Smooth scrubbing with 0.5s catch-up
        },
      })

      if (heroSplit) {
        morphTimeline
          // Phase 1: Fade out all hero content (0 - 0.4)
          // Fade out hero badge
          .to('#hero-badge', {
            opacity: 0,
            y: -10,
          }, 0)
          // Fade out hero characters with stagger wave effect
          .to(heroSplit.chars, {
            opacity: 0,
            y: -20,
            stagger: 0.015,
            ease: 'power2.in',
          }, 0)
          // Fade out description
          .to('#hero-description', {
            opacity: 0,
            y: -15,
          }, 0)
          // Fade out hero CTA
          .to('#hero-cta', {
            opacity: 0,
            y: -10,
          }, 0)
          // Fade out gradient
          .to('#hero-gradient', {
            opacity: 0,
          }, 0.1)

          // Phase 2: Empty screen - passing through window (0.5 - 0.7)
          // No animations here - creates the gap

          // Phase 3: Fade in final content (0.7 - 1.0)
          // Fade in soft gradient behind text
          .to('#final-gradient', {
            opacity: 1,
          }, 0.7)
          // Fade in final title
          .to('#final-title', {
            opacity: 1,
            y: 0,
          }, 0.75)
          // Fade in final CTA
          .to('#final-cta', {
            opacity: 1,
            y: 0,
          }, 0.85)
      }

      return () => {
        scrollAnimation.kill()
        if (heroSplit) heroSplit.revert()
        ScrollTrigger.getAll().forEach(trigger => trigger.kill())
      }
    }

    let cleanup: (() => void) | undefined

    // Wait for images to load before setting up animation
    const checkLoaded = setInterval(() => {
      if (imagesLoaded === frameCount) {
        clearInterval(checkLoaded)
        cleanup = setupAnimation()
      }
    }, 100)

    // Handle window resize
    const handleResize = () => {
      updateCanvasSize()
      render(1)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      clearInterval(checkLoaded)
      if (cleanup) cleanup()
    }
  }, [])

  return (
    <section ref={containerRef} className="h-[300vh] relative">
      {/* Navigation - always rendered, animated in after loader */}
      <Navigation />

      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover"
        />

        {/* Loading indicator */}
        {!isLoaded && (
          <div
            ref={loaderRef}
            className="fixed inset-0 flex items-center justify-center z-[100]"
            style={{ perspective: '400px', backgroundColor: '#7FBDE2' }}
          >
            <div
              id="loader-text"
              className="text-white text-[40px] md:text-[60px] lg:text-[80px] font-heading"
              style={{
                letterSpacing: '-1px',
                transformStyle: 'preserve-3d',
              }}
            >
              Loading
            </div>
          </div>
        )}

        {/* Radial gradient overlay - visible from start to blend with loader */}
        <div
          id="hero-gradient"
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 47%, rgba(128, 194, 229, 1) 0%, rgba(255, 255, 255, 0) 100%)',
          }}
        />

        {/* Hero text overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-4">
          <div className="text-center max-w-4xl">
            <div id="hero-badge" className="opacity-0 mb-6">
              <AlphaBadge />
            </div>
            <h1
              id="hero-title"
              className="text-white text-[32px] sm:text-[40px] md:text-[56px] lg:text-[64px] font-heading opacity-0 mb-6 md:mb-8 leading-[1.1]"
              style={{
                letterSpacing: '-1px',
                perspective: '400px',
                transformStyle: 'preserve-3d',
              }}
            >
              <span className="block">Connect once.</span>
              <span className="block">Stay in the loop forever.</span>
            </h1>
            <p
              id="hero-description"
              className="text-white text-[16px] sm:text-[18px] md:text-[20px] lg:text-[21px] font-geist opacity-0 mb-8 md:mb-10 max-w-[564px] mx-auto px-2 leading-[1.5]"
              style={{
                letterSpacing: '-0.7px',
              }}
            >
              Overlap turns scattered work context into an actionable feed to
              help you get through work faster and with more clarity.
            </p>
            <div id="hero-cta" className="opacity-0 pointer-events-auto">
              <Button variant="primary" href="https://tally.so/r/3yBlpg">
                Get early access
              </Button>
            </div>
          </div>
        </div>

        {/* Soft radial gradient overlay for final frame (cockpit view) */}
        <div
          id="final-gradient"
          className="absolute inset-0 pointer-events-none opacity-0"
          style={{
            background: 'radial-gradient(27.33% 27.33% at 50% 72.67%, #4C5256 0%, rgba(76, 82, 86, 0.00) 100%)',
          }}
        />

        {/* Final frame text overlay (cockpit view) */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pointer-events-none px-4 pb-[calc(10vh+78px)] md:pb-[calc(15vh+40px)]">
          <div className="text-center max-w-4xl">
            <h2
              id="final-title"
              className="text-white text-[32px] sm:text-[40px] md:text-[56px] lg:text-[64px] font-heading opacity-0 mb-4 md:mb-6 leading-[1.1]"
              style={{
                letterSpacing: '-1px',
                transform: 'translateY(20px)',
              }}
            >
              <span className="block">The only dashboard</span>
              <span className="block">you need</span>
            </h2>
            <div id="final-cta" className="opacity-0 pointer-events-auto" style={{ transform: 'translateY(20px)' }}>
              <Button variant="primary" href="https://tally.so/r/3yBlpg">
                Get early access
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
