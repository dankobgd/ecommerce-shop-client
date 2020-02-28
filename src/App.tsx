import React from 'react';

type a = {
  rofl: string;
  a: number;
  b?: boolean;
};

const App: React.FC = () => {
  const [count, setCount] = React.useState<number>(0);

  React.useEffect(() => {
    if (count >= 0) {
      setCount(1);
    }
  }, [count]);

  return (
    <div className='App'>
      <header className='App-header'>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a className='App-link' href='https://reactjs.org' target='_blank' rel='noopener noreferrer'>
          Q Learn React
        </a>

        <a>rifk</a>
      </header>
    </div>
  );
};

export default App;
