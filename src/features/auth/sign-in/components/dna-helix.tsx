import './dna-helix.css'

export function DNAHelix() {
  return (
    <div className='dna-helix-container'>
      {/* Glow effect behind */}
      <div className='dna-glow' />

      {/* DNA Helix */}
      <div className='dna-wrapper'>
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className='dna-bar' />
        ))}
      </div>
    </div>
  )
}
