import { ThemeProvider, createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
	:root {
		font-family: ${props => props.theme.fontFamily}, sans-serif;
		font-size: ${props => props.theme.fontSizePx}px;
		color: ${props => props.theme.textColor};
		line-height: 1;
		font-weight: 400;
		font-synthesis: none;
		text-rendering: optimizeLegibility;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		-webkit-text-size-adjust: 100%;
	}

	body {
		margin: 0;
		font-family: inherit !important;
	}
`;

const Theme = ({ settings, lookerTheme, children }) => {
  const theme = {
    fontFamily: settings.fontFamily?.value || lookerTheme.themeFontFamily || 'Roboto',
    fontSizePx: settings.fontSize?.value || 24,
    textColor: lookerTheme.themeFontColor?.color || 'black',
    increaseColor: lookerTheme.themeIncreaseColor?.color || 'green',
    decreaseColor: lookerTheme.themeDecreaseColor?.color || 'red',
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );
};

export default Theme;
