import './dna-helix.css'

export function DNAHelix() {
  return (
    <div className='dna-helix-container'>
      <div className='dna-wrapper'>
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className='dna-line' />
        ))}
      </div>
    </div>
  )
}
