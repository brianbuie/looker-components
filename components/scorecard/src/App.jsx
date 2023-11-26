import { useEffect, useState } from 'react';
import { subscribeToData, objectTransform } from '@google/dscc';
import Theme from './Theme';
import Scorecard from './Scorecard';

function App() {
  const [data, setData] = useState({});

  useEffect(() => {
    if (import.meta.env.PROD) {
      subscribeToData(setData, { transform: objectTransform });
    } else {
      setData(window.__MOCK_DATA__);
    }
  }, []);

  if (!data || !data.style) return null;
  if (data.style.showDataModel?.value) return <pre>{JSON.stringify(data, null, 2)}</pre>;

  const settings = data.style;
  const lookerTheme = data.theme;
  const values = data.tables.DEFAULT;
  const fields = data.fields;

  return (
    <Theme settings={settings} lookerTheme={lookerTheme}>
      <Scorecard settings={settings} values={values} fields={fields} />
    </Theme>
  );
}

export default App;
