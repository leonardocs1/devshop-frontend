import React from 'react'
import '../css/styles.css'

const App = ({ Component, pageProps }) => {
  return (
    <div>
      <Component>{pageProps}</Component>
    </div>
  )
}
export default App
