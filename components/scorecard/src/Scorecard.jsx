import { Fragment } from 'react';
import styled from 'styled-components';
import { formatNumber } from 'common';

const Container = styled.main`
  display: grid;
  grid-auto-flow: column;
  justify-content: end;
  column-gap: 2rem;
`;

const Column = styled.div`
  text-align: right;
  font-weight: bold;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: end;
  align-content: start;
  column-gap: 0.3rem;
  row-gap: 0.1rem;
`;

const Text = styled.span`
  font-size: ${props => props.$scale || 1}rem;
  opacity: 0.6;
  grid-column-start: ${props => (props.$wide ? 'span 2' : 'auto')};
`;

const Num = styled(Text)`
  opacity: ${props => (props.$role === 'PREVIOUS' ? 0.7 : 1)};
  font-family: 'Ubuntu Mono', monospace;
  color: ${props => {
    if (props.$role === 'CHANGE') {
      if (props.$value < 0) return props.theme.decreaseColor;
      if (props.$value > 0) return props.theme.increaseColor;
    }
    return 'inherit';
  }};
`;

function Scorecard({ settings, values, fields }) {
  const showComparison = settings.showComparison && values.length > 1;

  const columns = values.map((val, key) => ({
    label: val.breakdown[0],
    value: val.metric[0],
    type: fields.metric[0].type,
    role: showComparison && key !== values.length - 1 ? 'PREVIOUS' : null,
    comps: showComparison
      ? values
          .slice(0, key)
          .toReversed()
          .map(comp => ({
            label: `vs ${comp.breakdown[0]}`,
            value: (val.metric[0] - comp.metric[0]) / comp.metric[0],
          }))
      : [],
  }));

  return (
    <Container>
      {columns.map(({ label, value, type, role, comps }, key) => (
        <Column key={key} $columnsLength={columns.length}>
          <Text $scale={0.6} $wide>
            {label}
          </Text>
          <Num $value={value} $role={role} $wide>
            {formatNumber(value, type, role)}
          </Num>
          {comps.map((c, cKey) => (
            <Fragment key={cKey}>
              <Num $scale={0.7} $role="CHANGE" $value={c.value}>
                {formatNumber(c.value, 'PERCENT', 'CHANGE')}
              </Num>
              <Text $scale={0.6}>{c.label}</Text>
            </Fragment>
          ))}
        </Column>
      ))}
    </Container>
  );
}

export default Scorecard;
