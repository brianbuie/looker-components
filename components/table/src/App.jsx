import { useEffect, useState } from 'react';
import { subscribeToData, objectTransform } from '@google/dscc';
import Theme from './Theme.jsx';
import Table from './Table.jsx';

function App() {
  const [data, setData] = useState({});
  const [windowSize, setWindowSize] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  /**
   * Subscribe to changes from Looker if in prod
   * Or use mock data if in development
   */
  useEffect(() => {
    if (import.meta.env.PROD) {
      subscribeToData(setData, { transform: objectTransform });
    } else {
      setData(window.__MOCK_DATA__);
    }
  }, []);

  /**
   * Listen for window size updates (resizing component in looker)
   * Used for adjusting font size to prevent overflow
   */
  useEffect(() => {
    function handleResize() {
      setWindowSize({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });

  /**
   * Issue loading data or currently debugging
   */
  if (!data || !data.style) return null;
  if (data.style.showDataModel?.value) return <pre>{JSON.stringify(data, null, 2)}</pre>;

  /**
   * Mapping Looker's data structure to less confusing names
   */
  const settings = data.style;
  const lookerTheme = data.theme;
  const values = data.tables.DEFAULT;
  const fields = data.fields;

  return (
    <Theme settings={settings} lookerTheme={lookerTheme} windowSize={windowSize}>
      <Table settings={settings} values={values} fields={fields} />
    </Theme>
  );
}

export default App;
