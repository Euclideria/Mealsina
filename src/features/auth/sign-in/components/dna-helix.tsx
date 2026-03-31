import './dna-helix.css'

export function DNAHelix() {
  return (
    <div className='dna-helix-container'>
      <svg className='dna-svg' viewBox='0 0 800 400' xmlns='http://www.w3.org/2000/svg'>
        <defs>
          <linearGradient id='lineGrad' x1='0%' y1='0%' x2='100%' y2='0%'>
            <stop offset='0%' stopColor='rgba(255,255,255,0.05)' />
            <stop offset='50%' stopColor='rgba(255,255,255,0.15)' />
            <stop offset='100%' stopColor='rgba(255,255,255,0.05)' />
          </linearGradient>
        </defs>

        {/* 30 vertical lines with spheres */}
        {Array.from({ length: 30 }).map((_, i) => {
          const x = 80 + i * 24
          const delay = i * 0.15
          return (
            <g key={i} className='dna-group' style={{ animationDelay: `-${delay}s` }}>
              {/* Vertical line */}
              <line
                x1={x}
                y1='120'
                x2={x}
                y2='280'
                stroke='rgba(255,255,255,0.1)'
                strokeWidth='2'
              />
              {/* Top sphere */}
              <circle
                cx={x}
                cy='115'
                r='6'
                fill='white'
              />
              {/* Bottom sphere */}
              <circle
                cx={x}
                cy='285'
                r='6'
                fill='white'
              />
            </g>
          )
        })}
      </svg>
    </div>
  )
}
