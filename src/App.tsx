import ConstructionTape from './components/ConstructionTape'
import Hero from './components/Hero'
import GameInvite from './components/GameInvite'
import Works from './components/Works'
import Stamp from './components/Stamp'
import StickyNote from './components/StickyNote'
import EasterEgg from './components/EasterEgg'
import './App.css'

export default function App() {
  return (
    <div className="page">
      <ConstructionTape position="top" />
      <ConstructionTape position="bottom" />
      <EasterEgg />

      <main className="page__main">
        <Hero />

        {/* 漂浮便签：散落在 Hero 周围 */}
        <StickyNote
          text="翻修中。"
          variant="paper"
          rotation={-3}
          withTape
          className="page__note page__note--float-1"
          enterDelay={1500}
        />

        <GameInvite />
        <Works />

        {/* 印章 */}
        <div className="page__stamp">
          <Stamp rotation={-10} size={140} />
        </div>
      </main>
    </div>
  )
}
