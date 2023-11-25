import { ThemeProvider, createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
	:root {
		font-family: ${props => props.theme.fontFamily || 'Roboto'}, sans-serif;
		font-size: ${props => props.theme.fontSize || 14}px;
		line-height: 1.5;
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
    fontFamily: settings.fontFamily?.value || lookerTheme.themeFontFamily,
    fontSize: settings.fontSize?.value,
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );
};

export default Theme;
