import styled from 'styled-components';

const Row = styled.main`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const Column = styled.div`
  text-align: right;
  flex-grow: 1;
  max-width: ${props => 100 / props.$columnsLength}%;
`;

const Label = styled.h4`
  margin: 0 0 0.2rem 0;
  font-size: 0.6rem;
  opacity: 0.6;
`;

const Figure = styled.h2`
  margin: 0;
  opacity: ${props => (props.$role === 'PREVIOUS' ? 0.6 : 1)};
  font-size: 1rem;
  color: ${props => {
    if (props.$role === 'CHANGE') {
      if (props.$value < 0) return props.theme.decreaseColor;
      if (props.$value > 0) return props.theme.increaseColor;
    }
    return 'inherit';
  }};
`;

const format = (value, type, role) => {
  const _intl = options => Intl.NumberFormat('en-US', options).format(value);
  if (type === 'PERCENT')
    return _intl({
      style: 'percent',
      notation: 'compact',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      signDisplay: role === 'CHANGE' ? 'always' : 'auto',
    });
  if (type === 'CURRENCY_ USD')
    return _intl({
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  if (type === 'DURATION') {
    const time = new Date(value * 1000).toTimeString().split(' ')[0];
    return value < 60 * 60 ? time.slice(3) : time;
  }
  return _intl({
    notation: 'compact',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    trailingZeroDisplay: 'stripIfInteger',
  });
};

function Scorecard({ settings, values, fields }) {
  const showComparison = settings.showComparison && values.length > 1;

  const columns = values.map((val, key) => ({
    label: val.breakdown?.[0] || fields.metric[0].name,
    value: val.metric[0],
    type: fields.metric[0].type,
    role: showComparison && key === 0 && 'PREVIOUS',
  }));

  if (showComparison) {
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
        <Column key={key} $columnsLength={columns.length}>
          <Label>{label}</Label>
          <Figure $value={value} $role={role}>
            {format(value, type, role)}
          </Figure>
        </Column>
      ))}
    </Row>
  );
}

export default Scorecard;
