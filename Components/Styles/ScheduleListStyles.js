import { StyleSheet, Platform } from 'react-native';
import { ApplicationStyles, Colors, Fonts, Metrics } from '../../Themes/';

export default StyleSheet.create({
  // ...ApplicationStyles.screen,
  container: {
    flex: 1,
    zIndex: 0,
  },
  headerContainer: {
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    height: 150,
    zIndex: 10,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    zIndex: 10,
  },
  headerLogoContainer: {
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    zIndex: 20,
    paddingTop: Platform.OS === 'ios' ? 28 : 38,
  },
  headerLogo: {
    padding: Metrics.baseMargin,
    width: 100,
    height: 100,
  },
  dayToggle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 20,
  },
  listContent: {
    // paddingBottom: Metrics.baseMargin * 8,
  },
});
