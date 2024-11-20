import React from 'react'
import FileUpload from './components/custom/FileUpload'
import { Toaster } from './components/ui/toaster'

function App() {
  return (
    <div>
      <Toaster />
      <FileUpload/>
    </div>
  )
}

export default App