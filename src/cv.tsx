import React from 'react'
import ReactDOM from 'react-dom/client'
import CvApp from './CvApp'
import '@fontsource-variable/bricolage-grotesque/standard.css'
import '@fontsource/instrument-serif/400.css'
import '@fontsource/zcool-xiaowei/index.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'
import './styles/cv.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CvApp />
  </React.StrictMode>,
)
