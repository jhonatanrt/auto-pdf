import '../styles/globals.css'
import LayoutComponent from '../component/Layout'
/**
 * Encapsula toda las paginas y le envia props
 */
function MyApp({ Component, pageProps }) {
  return (
    <LayoutComponent>
      <Component {...pageProps} />
    </LayoutComponent>
  )
}

export default MyApp
