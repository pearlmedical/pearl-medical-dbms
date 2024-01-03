// pages/_app.js
import { AuthProvider } from '@/context/AuthContext';
import '@/styles/globals.css';
import Layout from '@/components/Layout';
import 'bootstrap/dist/css/bootstrap.min.css';

function App({ Component,pageProps }) {
  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
}

export default App;
