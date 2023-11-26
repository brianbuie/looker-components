import styled from 'styled-components';

const Row = styled.main`
  display: flex;
  flex-direction: row;
  justify-content: stretch;
  width: 100%;
`;

const Column = styled.div`
  text-align: right;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const Label = styled.h4`
  margin: 0 0 0.25rem 0;
  font-size: 0.6rem;
  opacity: 0.5;
`;

const Value = styled.h2`
  margin: 0;
  font-size: 1rem;
  opacity: ${props => (props.$role === 'PREVIOUS' ? 0.5 : 1)};
  color: ${props => {
    if (props.$role === 'CHANGE') {
      if (props.$value < 0) return props.theme.decreaseColor;
      if (props.$value > 0) return props.theme.increaseColor;
    }
    return 'inherit';
  }};
`;

const formatNumber = (value, type, role) => {
  const format = options => Intl.NumberFormat('en-US', options).format(value);
  if (type === 'PERCENT')
    return format({
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      signDisplay: role === 'CHANGE' ? 'exceptZero' : 'auto',
    });
  if (type === 'CURRENCY_ USD')
    return format({
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      minimumFractionDigits: 2,
    });
  return format({
    notation: 'compact',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    trailingZeroDisplay: 'stripIfInteger',
  });
};

function Scorecard({ settings, values, fields }) {
  const columns = values.map((val, key) => ({
    label: val.breakdown?.[0] || '',
    value: val.metric[0],
    type: fields.metric[0].type,
    role: settings.showComparison.value && key === 0 && 'PREVIOUS',
  }));

  if (settings.showComparison.value) {
    columns.push({
      label: 'Change',
      value: (columns.at(-1).value - columns[0].value) / columns[0].value,
      type: 'PERCENT',
      role: 'CHANGE',
    });
  }

  return (
    <Row>
      {columns.map(({ label, value, type, role }, key) => (
        <Column key={key}>
          {settings.showLabels.value && <Label>{label}</Label>}
          <Value $value={value} $role={role}>
            {formatNumber(value, type, role)}
          </Value>
        </Column>
      ))}
    </Row>
  );
}

export default Scorecard;
