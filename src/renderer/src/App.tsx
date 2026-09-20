import { TitleBar } from './shell/TitleBar'
import { Toolbar } from './shell/Toolbar'
import { StatusBar } from './shell/StatusBar'
import { Workspace } from './dock/Workspace'
import './shell/shell.css'

export default function App() {
  return (
    <div className="app-shell">
      <TitleBar />
      <Toolbar />
      <Workspace />
      <StatusBar />
    </div>
  )
}
