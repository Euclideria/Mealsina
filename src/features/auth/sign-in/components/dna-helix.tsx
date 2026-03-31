import './dna-helix.css'

export function DNAHelix() {
  return (
    <div className='dna-helix-container'>
      <div id='dna'>
        {/* Strand 1 - 15 bars rotating with rotateY */}
        <div className='strand strand-1'>
          <div className='bar'><div className='ball-top' /><div className='ball-bottom' /></div>
          <div className='bar'><div className='ball-top' /><div className='ball-bottom' /></div>
          <div className='bar'><div className='ball-top' /><div className='ball-bottom' /></div>
          <div className='bar'><div className='ball-top' /><div className='ball-bottom' /></div>
          <div className='bar'><div className='ball-top' /><div className='ball-bottom' /></div>
          <div className='bar'><div className='ball-top' /><div className='ball-bottom' /></div>
          <div className='bar'><div className='ball-top' /><div className='ball-bottom' /></div>
          <div className='bar'><div className='ball-top' /><div className='ball-bottom' /></div>
          <div className='bar'><div className='ball-top' /><div className='ball-bottom' /></div>
          <div className='bar'><div className='ball-top' /><div className='ball-bottom' /></div>
          <div className='bar'><div className='ball-top' /><div className='ball-bottom' /></div>
          <div className='bar'><div className='ball-top' /><div className='ball-bottom' /></div>
          <div className='bar'><div className='ball-top' /><div className='ball-bottom' /></div>
          <div className='bar'><div className='ball-top' /><div className='ball-bottom' /></div>
          <div className='bar'><div className='ball-top' /><div className='ball-bottom' /></div>
        </div>

        {/* Strand 2 - 15 bars 180 degrees out of phase */}
        <div className='strand strand-2'>
          <div className='bar'><div className='ball-top' /><div className='ball-bottom' /></div>
          <div className='bar'><div className='ball-top' /><div className='ball-bottom' /></div>
          <div className='bar'><div className='ball-top' /><div className='ball-bottom' /></div>
          <div className='bar'><div className='ball-top' /><div className='ball-bottom' /></div>
          <div className='bar'><div className='ball-top' /><div className='ball-bottom' /></div>
          <div className='bar'><div className='ball-top' /><div className='ball-bottom' /></div>
          <div className='bar'><div className='ball-top' /><div className='ball-bottom' /></div>
          <div className='bar'><div className='ball-top' /><div className='ball-bottom' /></div>
          <div className='bar'><div className='ball-top' /><div className='ball-bottom' /></div>
          <div className='bar'><div className='ball-top' /><div className='ball-bottom' /></div>
          <div className='bar'><div className='ball-top' /><div className='ball-bottom' /></div>
          <div className='bar'><div className='ball-top' /><div className='ball-bottom' /></div>
          <div className='bar'><div className='ball-top' /><div className='ball-bottom' /></div>
          <div className='bar'><div className='ball-top' /><div className='ball-bottom' /></div>
          <div className='bar'><div className='ball-top' /><div className='ball-bottom' /></div>
        </div>
      </div>
    </div>
  )
}
