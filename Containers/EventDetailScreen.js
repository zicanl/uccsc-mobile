import React from 'react';
import { connect } from 'react-redux';
import { StackActions } from 'react-navigation';
import {
  BackHandler,
  ScrollView,
  Text,
  View,
  Image,
  Linking,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { MarkdownView } from 'react-native-markdown-view';
import { MaterialIcons } from '@expo/vector-icons';

import AppConfig from '../Config/AppConfig';

import Gradient from '../Components/Gradient';
import RoomInfo from '../Components/RoomInfo';
import TalkInfo from '../Components/TalkInfo';

import styles from './Styles/EventDetailScreenStyles';

class EventDetailScreen extends React.Component {
  static navigationOptions = {
    title: 'EventDetail',
    tabBarLabel: 'Schedule',
    tabBarIcon: ({ focused }) => (
      <MaterialIcons name="schedule" size={24} color="white" />
    ),
  };

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.goBack);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.goBack);
  }

  goBack = () => {
    this.props.navigation.dispatch(StackActions.popToTop());
    return true;
  };

  onLinkPress = (url) => {
    if (!url.startsWith('http')) {
      url = `${AppConfig.conferenceUrl}${url}`;
    }

    if (Linking.canOpenURL(url)) {
      Linking.openURL(url);
    }
  }

  renderTalkInfo() {
    const { title, time, duration, eventType } = this.props;

    let showToggleReminder = false;
    if (!eventType) {
      showToggleReminder = true;
    }

    return (
      <TalkInfo showDay start={time} duration={duration} showToggleReminder={showToggleReminder} toggleReminderData={{ title }} />
    );
  }

  renderAvatar(speaker) {
    if (!speaker.photo) {
      return null;
    }

    return (
      <Image
        style={styles.avatar}
        source={{ uri: `${AppConfig.conferenceUrl}/${speaker.photo.url}` }}
      />
    );
  }

  render() {
    const { title, description, venue, eventType } = this.props;

    const descriptionStyles = {
      link: StyleSheet.flatten(styles.descriptionLink),
      paragraph: StyleSheet.flatten(styles.descriptionText),
    };

    return (
      <Gradient style={styles.gradient}>
        <ScrollView>
          <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={this.goBack}>
              <MaterialIcons name="chevron-left" size={24} style={styles.backButtonIcon} />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <View style={styles.cardShadow1} />
            <View style={styles.cardShadow2} />
            <View style={styles.card}>
              <Text style={styles.sectionHeading}>{ eventType }</Text>
              <Text style={styles.heading}>{ title }</Text>
            </View>
            <View style={styles.section}>
              { this.renderTalkInfo() }
            </View>
            { venue && 
              <View style={styles.section}>
                  <RoomInfo building={venue.building} room={venue.room} />
              </View>
            }
            <View style={[styles.section, styles.lastSection]}>
              <MarkdownView
                style={styles.descriptionView}
                styles={descriptionStyles}
                onLinkPress={this.onLinkPress}
              >
                { description }
              </MarkdownView>
            </View>
          </View>
        </ScrollView>
      </Gradient>
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state.schedule.selectedEvent,
    currentTime: new Date(state.schedule.currentTime)
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(EventDetailScreen);
