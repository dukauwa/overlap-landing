import React from 'react'

export default function AlphaBadge() {
  return (
    <div
      className="inline-flex items-center justify-center px-3 py-2 rounded-[14px] border-2 border-white/20 backdrop-blur-[12px]"
      style={{
        background: 'rgba(250, 250, 250, 0.2)',
      }}
    >
      <span
        className="text-white font-geist text-sm"
        style={{
          letterSpacing: '0px',
          lineHeight: '20px',
        }}
      >
        Alpha
      </span>
    </div>
  )
}
