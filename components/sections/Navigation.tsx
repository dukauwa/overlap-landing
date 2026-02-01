'use client'

import Image from 'next/image'
import Button from '../ui/Button'

export default function Navigation() {
  return (
    <nav id="main-nav" className="fixed top-0 left-0 right-0 z-50 bg-black/0 opacity-0">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-10 py-4 md:py-8 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src="/logo.png"
            alt="Overlap"
            width={120}
            height={32}
            className="h-8 w-auto"
            priority
          />
        </div>

        {/* CTA Button */}
        <Button variant="secondary" href="https://tally.so/r/3yBlpg">
          Get early access
        </Button>
      </div>
    </nav>
  )
}
