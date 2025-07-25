import styled from 'styled-components';
import { formatNumber } from 'common';

const StyledTable = styled.table`
  min-width: 100%;
  max-height: 100%;
  border-spacing: 0;
  border: none;
  th,
  td {
    min-width: 3rem;
    max-width: 6rem;
  }
`;

const TableHead = styled.thead`
  position: sticky;
  top: 0px;
  z-index: 5;
  padding: 0.4em 0;
  th {
    font-weight: bold;
    font-size: 1.1rem;
    background: #dadada;
  }
`;

const TableBody = styled.tbody`
  td {
    border-top: 1px solid #cbcbcb;
    border-right: 1px solid #cbcbcb;
    background: white;
  }
`;

const Cell = styled.td`
  padding: 0.25rem 0.5rem;
  font-weight: ${props => (props.$bold ? 'bold' : 'initial')};
  text-align: ${props => (props.$concept === 'DIMENSION' ? 'left' : 'right')};
  font-family: ${props => (props.$concept === 'DIMENSION' ? 'inherit' : "'Ubuntu Mono', monospace")};
`;

function Table({ settings, values, fields }) {
  const labels = values.reduce((all, cur) => {
    all[cur.breakdownLabel[0]] = cur.breakdownSort[0];
    return all;
  }, {});

  const breakdownKeys = Object.keys(labels).sort((a, z) => labels[a] - labels[z]);

  const totals = values[0].metric.map(() => breakdownKeys.map(() => 0));

  const data = values.reduce((all, cur) => {
    // concat dimension values should be unique
    const id = cur.dimension.join(',');

    // First time encountering this combination of dimensions
    // Replace metrics with empty arrays, to be filled with each breakdown value
    if (!all[id])
      all[id] = {
        id,
        dimension: cur.dimension,
        metric: cur.metric.map(_ => breakdownKeys.map(() => null)),
      };

    // Get the index for inserting into each metric array
    const breakdownKey = breakdownKeys.indexOf(cur.breakdownLabel[0]);

    // Replace the null value for this metric in the spot for this breakdown value
    cur.metric.forEach((value, metricKey) => {
      if (typeof value === 'string') value = parseFloat(value);
      all[id].metric[metricKey][breakdownKey] = value;
      totals[metricKey][breakdownKey] += value;
    });

    return all;
  }, {});

  console.log({ settings, values, fields, data, totals });

  return (
    <StyledTable>
      <TableHead>
        <tr>
          {fields.dimension.map(dimension => (
            <Cell as="th" key={dimension.id} $concept="DIMENSION">
              {dimension.name}
            </Cell>
          ))}
          {fields.metric.map(metric => (
            <Cell as="th" key={metric.id} colSpan={breakdownKeys.length}>
              {metric.name}
            </Cell>
          ))}
        </tr>
        <tr>
          {fields.dimension.map(dimension => (
            <Cell key={dimension.id} $concept="DIMENSION" as="th"></Cell>
          ))}
          {fields.metric.map(() =>
            breakdownKeys.map(key => (
              <Cell as="th" key={key}>
                {key}
              </Cell>
            ))
          )}
        </tr>
      </TableHead>
      <TableBody>
        <tr>
          <td colSpan={fields.dimension.length}>Total</td>
          {totals.map((metricTotals, metricKey) =>
            metricTotals.map((totalValue, totalKey) => (
              <Cell key={totalKey} $bold={totalKey === metricTotals.length - 1}>
                {['NUMBER', 'CURRENCY_ USD'].includes(fields.metric[metricKey].type) &&
                  formatNumber(totalValue, fields.metric[metricKey].type)}
              </Cell>
            ))
          )}
        </tr>
        {Object.values(data).map(row => (
          <tr key={row.id}>
            {row.dimension.map((dimension, key) => (
              <Cell key={key} $concept="DIMENSION">
                {dimension}
              </Cell>
            ))}
            {row.metric.map((metricValues, metricKey) =>
              metricValues.map((metricValue, valueKey) => (
                <Cell key={valueKey} $bold={valueKey === metricValues.length - 1}>
                  {metricValue ? formatNumber(metricValue, fields.metric[metricKey].type) : ''}
                </Cell>
              ))
            )}
          </tr>
        ))}
      </TableBody>
    </StyledTable>
  );
}

export default Table;
