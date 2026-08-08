import { createRoot } from 'react-dom/client'
import { FlashcardRound } from './flashcard-round'

const host = document.getElementById('root')
if (host === null) throw new Error('ui_kits/flows: no #root in the host page')

createRoot(host).render(<FlashcardRound />)
