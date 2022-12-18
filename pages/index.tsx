import { Button } from '@mui/material';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import css from '../styles/mint.module.css';

const Home: NextPage = () => {
  const router = useRouter();

  return (
    <div className={css.root}>
      <div className={css.container}>
        <Button variant="contained" onClick={() => router.push('/mint')}>GET A FIGHTER</Button>
        <br/>
        <Button variant="contained" onClick={() => router.push('/fight')}>FIGHT</Button>
      </div>

    </div>
  );
};

export default Home;
