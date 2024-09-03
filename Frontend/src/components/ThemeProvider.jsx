import { useSelector } from 'react-redux'

export default function ThemeProvider({ children }) {
  const { theme } = useSelector((state) => state.theme)
  return (
    <div className={theme}>
      <div className= {` ${theme==='dark' ? 'text-gray-200 bg-[rgb(16,23,42)]' : 'bg-white text-gray-700' } min-h-screen`} >
        {children}
      </div>
    </div>
  )
}