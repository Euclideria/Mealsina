import './dna-helix.css'

export function DNAHelix() {
  return (
    <div className='dna-helix-container'>
      {/* DNA Helix with two intertwined strands */}
      <div className='dna-wrapper'>
        {/* Strand 1 */}
        <div className='dna-strand'>
          {/* Nucleotides (horizontal bars with balls) */}
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={`n1-${i}`} className='dna-nucleotide' />
          ))}
          {/* Backbone dots */}
          {Array.from({ length: 11 }).map((_, i) => (
            <div key={`b1-${i}`} className='dna-backbone strand1' />
          ))}
        </div>

        {/* Strand 2 */}
        <div className='dna-strand'>
          {/* Nucleotides (horizontal bars with balls) */}
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={`n2-${i}`} className='dna-nucleotide' />
          ))}
          {/* Backbone dots */}
          {Array.from({ length: 11 }).map((_, i) => (
            <div key={`b2-${i}`} className='dna-backbone strand2' />
          ))}
        </div>
      </div>
    </div>
  )
}
