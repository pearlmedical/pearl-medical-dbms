import Head from 'next/head';
import Image from 'next/image';
import styles from '@/styles/Home.module.css';
import Layout from '@/components/Layout';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
  return (
    <>
      {/* <Layout> */}
        <Head>
          <title>Pearl Medical</title>
          <meta name="description" content="Pearl Medical DBMS" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/Graphic1.jpg" />
        </Head>

        <main className={styles.main}>
          Home Page
        </main>
      {/* </Layout> */}
    </>
  );
}