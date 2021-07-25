// Styles
import { useState } from 'react';
import { useQuery } from 'react-query';
import { Wrapper } from './styles/App.styles';

type BitcoinData = {
  '15m': number;
  buy: number;
  last: number;
  sell: number;
  symbol: string;
}

type Currencies = {
  [key: string]: BitcoinData;
}

const getBCData = async (): Promise<Currencies> =>
  await (await fetch('https://blockchain.info/ticker')).json();

const INTERVAL_TIME = 1000;

const App = () => {
  const [currency, setCurrency] = useState('USD');
  const { data, isLoading, error } = useQuery<Currencies>(
    'bc-data', 
    getBCData,
    {
      // Refetch the data every second
      refetchInterval: INTERVAL_TIME
    }
  );
  
  const handleCurrencySelection = (e: any) => {
    setCurrency(e.currentTarget.value);
  }

  // useEffect(() => {
  //   const interval = setInterval(refetch, INTERVAL_TIME);
  //   return () => clearInterval(interval);
  // }, [refetch])

  if (isLoading) return <h3>Loading...</h3>
  if (error) return <h3>Something went wrong!</h3>

  return(
    <Wrapper>
      <>
        <h2>Bitcoin Price</h2>
        <select value={currency} onChange={handleCurrencySelection}>
          {data && Object.keys(data).map(currency => (
            <option key={currency} value={currency}>  
              {currency}
            </option>
          ))}
        </select>
        <div>
          <h2>
            {data && data[currency].symbol}: {data && data[currency].last}
          </h2>
        </div>
      </>
    </Wrapper>
  );
}

export default App;
