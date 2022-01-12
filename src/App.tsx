import { BrowserRouter } from 'react-router-dom'
import Main from './screens/Main'
import './styles/app.scss'

function App() {
  return (
    <BrowserRouter>
      <Main />
    </BrowserRouter>
  )
}

export default App
