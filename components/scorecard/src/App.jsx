import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { subscribeToData, objectTransform, sendInteraction, clearInteraction } from '@google/dscc';
import Theme from './Theme';

const Header = styled.h1`
  margin: 0;
  color: green;
`;

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
  const rows = data.tables.DEFAULT;
  const fields = data.fields;
  const activeFilters = data.interactions.interaction?.value?.data || {};

  const toggleFilter = (id, value) => {
    if (activeFilters.concepts?.includes(id)) {
      console.log('clearing interaction');
      clearInteraction('interaction', 'FILTER');
    } else {
      console.log('sending interaction', id, value);
      sendInteraction('interaction', 'FILTER', { concepts: [id], values: [[value]] });
    }
  };

  return (
    <Theme settings={settings} lookerTheme={lookerTheme}>
      <Header>Hello World</Header>
    </Theme>
  );
}

export default App;
