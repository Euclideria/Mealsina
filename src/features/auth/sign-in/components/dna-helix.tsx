import './dna-helix.css'

export function DNAHelix() {
  return (
    <div className='dna-helix-container'>
      <div className='dna-wrapper'>
        {/* Strand 1 */}
        <div className='strand strand-1'>
          <div></div><div></div><div></div><div></div><div></div>
          <div></div><div></div><div></div><div></div><div></div>
          <div></div><div></div><div></div><div></div><div></div>
        </div>
        {/* Strand 2 */}
        <div className='strand strand-2'>
          <div></div><div></div><div></div><div></div><div></div>
          <div></div><div></div><div></div><div></div><div></div>
          <div></div><div></div><div></div><div></div><div></div>
        </div>
      </div>
    </div>
  )
}
