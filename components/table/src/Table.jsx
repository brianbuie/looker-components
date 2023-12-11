import styled from 'styled-components';
import { formatNumber } from 'common';

const StyledTable = styled.table`
  min-width: 100%;
  /* max-height: 100%; */
  th,
  td {
    min-width: 3rem;
    max-width: 6rem;
  }
`;

const Cell = styled.td`
  border-top: 1px solid black;
  font-weight: ${props => (props.$bold ? 'bold' : 'auto')};
  text-align: ${props => (props.$concept === 'DIMENSION' ? 'left' : 'right')};
  font-family: ${props => (props.$concept === 'DIMENSION' ? 'inherit' : "'Ubuntu Mono', monospace")};
`;

function Table({ settings, values, fields }) {
  const bdLabels = values.reduce((all, cur) => {
    all[cur.breakdownLabel[0]] = cur.breakdownSort[0];
    return all;
  }, {});
  const bdKeys = Object.keys(bdLabels).sort((a, z) => bdLabels[a] - bdLabels[z]);

  const data = values.reduce((all, cur) => {
    // concat dimension values should be unique
    const id = cur.dimension.join(',');

    // First time encountering this combination of dimensions
    // Replace metrics with empty arrays, to be filled with each breakdown value
    if (!all[id])
      all[id] = {
        id,
        dimension: cur.dimension,
        metric: cur.metric.map(_ => bdKeys.map(l => null)),
      };

    // Get the index for inserting into each metric array
    const bdKey = bdKeys.indexOf(cur.breakdownLabel[0]);

    // Replace the null value for this metric in the spot for this breakdown value
    cur.metric.forEach((val, metricKey) => {
      all[id].metric[metricKey][bdKey] = val;
    });

    return all;
  }, {});

  console.log(values);
  console.log(bdLabels);
  console.log(bdKeys);
  console.log(data);

  return (
    <StyledTable>
      <thead>
        <tr>
          {fields.dimension.map(dim => (
            <Cell as="th" key={dim.id} $concept="DIMENSION">
              {dim.name}
            </Cell>
          ))}
          {fields.metric.map(met => (
            <Cell as="th" key={met.id} colSpan={bdKeys.length}>
              {met.name}
            </Cell>
          ))}
        </tr>
        <tr>
          {fields.dimension.map(dim => (
            <Cell key={dim.id} $concept="DIMENSION"></Cell>
          ))}
          {fields.metric.map(met =>
            bdKeys.map(key => (
              <Cell as="th" key={key}>
                {key}
              </Cell>
            ))
          )}
        </tr>
      </thead>
      <tbody>
        {Object.values(data).map(row => (
          <tr key={row.id}>
            {row.dimension.map((dim, key) => (
              <Cell key={key} $concept="DIMENSION">
                {dim}
              </Cell>
            ))}
            {row.metric.map(met =>
              met.map((bdMet, key) => (
                <Cell key={key} $bold={key === met.length - 1}>
                  {bdMet ? formatNumber(bdMet) : ''}
                </Cell>
              ))
            )}
          </tr>
        ))}
      </tbody>
    </StyledTable>
  );
}

export default Table;
