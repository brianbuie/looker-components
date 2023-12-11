const formatNumber = (value, type, role) => {
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
    });
  return _intl({
    notation: 'compact',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    trailingZeroDisplay: 'stripIfInteger',
  });
};

export default formatNumber;
