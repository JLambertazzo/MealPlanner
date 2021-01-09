import { createMuiTheme } from '@material-ui/core/styles'

const statusTheme = createMuiTheme({
  palette: {
    primary: {
      light: '#73A942',
      main: '#538D22',
      dark: '#245501',
      contrastText: '#fff',
    },
    secondary: {
      light: '#D00000',
      main: '#9D0208',
      dark: '#6A040F',
      contrastText: '#fff',
    },
  },
})

export default statusTheme