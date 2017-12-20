import { StyleSheet } from 'react-native'
import { Colors } from '../../Themes/'

export default StyleSheet.create({
  tabBar: {
    height: 65,
    paddingTop: 5,
    paddingBottom: 5,
    paddingHorizontal: 28,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.3)',
    backgroundColor: Colors.darkPurple
  },
  tabBarLabel: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    letterSpacing: 0,
    color: Colors.snow
  },
  card: {
    opacity: 1,
    backgroundColor: Colors.darkPurple
  }
})
