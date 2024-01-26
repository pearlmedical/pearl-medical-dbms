// pages/_app.js
import { AuthProvider } from '@/context/AuthContext';
import { AccessProvider } from '@/context/AccessContext';
import '@/styles/globals.css';
import Layout from '@/components/Layout';
import 'bootstrap/dist/css/bootstrap.min.css';

function App({ Component,pageProps }) {
  return (
    <>
      <h1> Site Down </h1>
      <h5> Developers were not paid </h5>
    </>
    // <AuthProvider>
    //   <AccessProvider>
    //     <Layout>
    //       <Component {...pageProps} />
    //     </Layout>
    //   </AccessProvider>
    // </AuthProvider>
  );
}

export default App;
