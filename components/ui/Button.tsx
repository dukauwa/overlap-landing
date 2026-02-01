'use client'

import React, { useRef } from 'react'
import { gsap } from 'gsap'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  variant?: 'primary' | 'secondary'
  href?: string
}

export default function Button({
  children,
  onClick,
  className = '',
  variant = 'primary',
  href
}: ButtonProps) {
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null)

  const handleMouseEnter = () => {
    if (!buttonRef.current) return

    gsap.to(buttonRef.current, {
      scale: 1.05,
      duration: 0.3,
      ease: 'power2.out',
    })

    // Add glow effect for primary, border glow for secondary
    if (variant === 'primary') {
      gsap.to(buttonRef.current, {
        boxShadow: 'inset 0 -2px 2px rgba(54,183,252,0.3), inset 0 2px 2px rgba(155,220,255,0.35), inset -2px 0 4px rgba(221,241,255,1), 0 0 20px rgba(54,183,252,0.3)',
        duration: 0.3,
        ease: 'power2.out',
      })
    } else {
      gsap.to(buttonRef.current, {
        borderColor: 'rgba(255,255,255,0.5)',
        boxShadow: '0 0 15px rgba(255,255,255,0.15)',
        duration: 0.3,
        ease: 'power2.out',
      })
    }
  }

  const handleMouseLeave = () => {
    if (!buttonRef.current) return

    gsap.to(buttonRef.current, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out',
    })

    // Reset shadow
    if (variant === 'primary') {
      gsap.to(buttonRef.current, {
        boxShadow: 'inset 0 -2px 2px rgba(54,183,252,0.2), inset 0 2px 2px rgba(155,220,255,0.25), inset -2px 0 4px rgba(221,241,255,1)',
        duration: 0.3,
        ease: 'power2.out',
      })
    } else {
      gsap.to(buttonRef.current, {
        borderColor: 'rgba(255,255,255,0.2)',
        boxShadow: 'none',
        duration: 0.3,
        ease: 'power2.out',
      })
    }
  }

  const handleMouseDown = () => {
    if (!buttonRef.current) return

    gsap.to(buttonRef.current, {
      scale: 0.98,
      duration: 0.1,
      ease: 'power2.out',
    })
  }

  const handleMouseUp = () => {
    if (!buttonRef.current) return

    gsap.to(buttonRef.current, {
      scale: 1.05,
      duration: 0.1,
      ease: 'power2.out',
    })
  }

  const sharedProps = {
    ref: buttonRef as React.RefObject<HTMLButtonElement & HTMLAnchorElement>,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    className: `
      px-6 py-3 rounded-2xl font-geist font-medium text-sm
      cursor-pointer inline-block
      ${variant === 'primary'
        ? 'bg-white text-overlap-blue-dark'
        : 'bg-transparent text-white border border-white/20'
      }
      ${className}
    `,
    style: {
      letterSpacing: '-0.28px',
      boxShadow: variant === 'primary'
        ? 'inset 0 -2px 2px rgba(54,183,252,0.2), inset 0 2px 2px rgba(155,220,255,0.25), inset -2px 0 4px rgba(221,241,255,1)'
        : 'none',
    },
  }

  if (href) {
    return (
      <a
        {...sharedProps}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    )
  }

  return (
    <button
      {...sharedProps}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
