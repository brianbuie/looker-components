import { ThemeProvider, createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
	* {
		box-sizing: border-box;
	}

	:root {
		font-family: ${props => props.theme.fontFamily}, sans-serif;
		font-size: ${props => props.theme.fontSize}px;
		color: ${props => props.theme.textColor};
		line-height: 1;
		font-weight: 400;
		font-synthesis: none;
		text-rendering: optimizeLegibility;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		-webkit-text-size-adjust: 100%;
	}

	html, body {
		margin: 0;
	}

	body {
		font-family: inherit !important;
	}
`;

const Theme = ({ settings, lookerTheme, windowSize, children }) => {
  const idealSize = settings.fontSize?.value || 24;
  const fontSize = idealSize * 1.85 < windowSize.height ? idealSize : windowSize.height / 1.8;

  const theme = {
    fontFamily: settings.fontFamily?.value || lookerTheme.themeFontFamily || '',
    fontSize,
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
