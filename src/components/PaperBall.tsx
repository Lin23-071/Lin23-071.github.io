import { useState } from 'react'
import './PaperBall.css'

export default function PaperBall() {
  const [unfolded, setUnfolded] = useState(false)

  return (
    <div className="paperball-root">
      {!unfolded ? (
        <div
          className="paperball-ball"
          onClick={() => setUnfolded(true)}
          title="点击展开纸团"
        />
      ) : (
        <div className="paperball-sheet" onClick={() => setUnfolded(false)}>
          <div className="paperball-half paperball-left" />
          <div className="paperball-half paperball-right" />
        </div>
      )}
    </div>
  )
}
