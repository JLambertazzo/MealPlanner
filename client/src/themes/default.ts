import { createMuiTheme } from '@material-ui/core/styles'

const defaultTheme = createMuiTheme({
  palette: {
    primary: {
      light: '#666ad1',
      main: '#303F9F',
      dark: '#001970',
      contrastText: '#fff'
    },
    secondary: {
      light: '#fafafa',
      main: '#f5f5f5',
      dark: '#f0f0f0',
      contrastText: '#3c3c3c'
    }
  }
})

export default defaultTheme
