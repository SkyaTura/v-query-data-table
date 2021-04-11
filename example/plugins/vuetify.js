// eslint-disable-next-line import/no-extraneous-dependencies
import Vue from 'vue'
import Vuetify from 'vuetify'
import pt from 'vuetify/es5/locale/pt'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)

const opts = {
  lang: {
    locales: { pt },
    current: 'pt',
  },
  defaultAssets: {
    font: { family: 'Roboto' },
  },
  icons: {
    iconfont: 'md',
  },
  theme: {
    dark: false,
    options: { useCustomProperties: true },
    themes: {
      dark: {
        primary: '#80C342',
        secondary: '#0052A4',
        error: '#E07975',
        warning: '#E16E16',
        info: '#297AA7',
        success: '#80C342',
        yellow: '#BC9D02',
        background: '#F2F6F9',
        greyBlue: '#A7B4C2',
        colorText: '#414141',
      },
      light: {
        primary: '#80C342',
        secondary: '#0052A4',
        error: '#E07975',
        warning: '#E16E16',
        info: '#297AA7',
        success: '#80C342',
        yellow: '#BC9D02',
        background: '#F2F6F9',
        greyBlue: '#A7B4C2',
        colorText: '#414141',
      },
    },
  },
}

export default new Vuetify(opts)
