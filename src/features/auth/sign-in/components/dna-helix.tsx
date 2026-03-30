import './dna-helix.css'

export function DNAHelix() {
  return (
    <div className='dna-helix-container'>
      {/* Glass Orbs Background */}
      <div className='glass-orb' />
      <div className='glass-orb' />
      <div className='glass-orb' />

      {/* Particle Field */}
      <div className='particle-field'>
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className='particle'
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${-Math.random() * 20}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* DNA Helix */}
      <div className='dna-helix-wrapper'>
        {/* Strand 1 */}
        <svg
          className='helix-strand'
          viewBox='0 0 200 400'
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          {/* Simplified helix using sine waves */}
          <path
            d='M50,0 Q150,50 50,100 Q-50,150 50,200 Q150,250 50,300 Q-50,350 50,400'
            fill='none'
            stroke='var(--primary)'
            strokeWidth='3'
            opacity='0.8'
          />
          <path
            d='M150,0 Q50,50 150,100 Q250,150 150,200 Q50,250 150,300 Q250,350 150,400'
            fill='none'
            stroke='var(--ring)'
            strokeWidth='3'
            opacity='0.6'
          />
          {/* Base pairs */}
          {[50, 150, 250, 350].map((y) => (
            <line
              key={y}
              x1='50'
              y1={y}
              x2='150'
              y2={y}
              stroke='var(--ring)'
              strokeWidth='2'
              opacity='0.4'
            />
          ))}
        </svg>
      </div>
    </div>
  )
}
