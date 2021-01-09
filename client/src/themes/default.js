import { createMuiTheme } from '@material-ui/core/styles'

const defaultTheme = createMuiTheme({
  palette: {
    primary: {
      light: '#666ad1',
      main: '#303F9F',
      dark: '#001970',
      contrastText: '#fff',
    },
    secondary: {
      light: '#439889',
      main: '#00695C',
      dark: '#003d33',
      contrastText: '#fff',
    },
  },
})

export default defaultTheme