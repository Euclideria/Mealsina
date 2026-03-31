import './dna-helix.css'

export function DNAHelix() {
  return (
    <div className='dna-helix-container'>
      <div className='helix-wrapper'>
        {/* Backbone 1 */}
        <div className='backbone backbone-1'>
          {[0, 25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350, 375].map((y, i) => (
            <div key={i} className='backbone-dot' style={{ top: `${y}px` }} />
          ))}
        </div>
        {/* Backbone 2 */}
        <div className='backbone backbone-2'>
          {[0, 25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350, 375].map((y, i) => (
            <div key={i} className='backbone-dot' style={{ top: `${y}px` }} />
          ))}
        </div>
        {/* Base pairs */}
        {[0, 25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350, 375].map((y, i) => (
          <div key={i} className='base-pair' style={{ top: `${y}px` }}>
            <div className='sphere'></div>
            <div className='sphere'></div>
          </div>
        ))}
      </div>
    </div>
  )
}
