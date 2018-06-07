import React from 'react';
import {
  ImageBackground,
  Image,
  Text,
  View,
  Animated,
  SectionList,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import Config from '../Config/AppConfig';
import { Images, Metrics } from '../Themes';
import NotificationActions from '../Redux/NotificationRedux';
import ScheduleActions from '../Redux/ScheduleRedux';
import PushNotifications from '../Services/PushNotifications';

import Activity from '../Components/Activity';
import Event from '../Components/Event';
import Meal from '../Components/Meal';
import Talk from '../Components/Talk';
import ScheduleSectionHeader from '../Components/ScheduleSectionHeader';

import styles from './Styles/ScheduleListStyles';

import { GroupBy, FindIndexAll, Sum } from '../Utils/Array';
import { GetItemLayout } from '../Utils/SectionList';
import { startOfDay, isSameDay, isWithinRange, isBefore } from 'date-fns';
import AppConfig from '../Config/AppConfig';

const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);

class ScheduleList extends React.Component {

  setStarProperty = (talks, starredTalks) => {
    if (!starredTalks || !starredTalks.length) {
      return talks;
    }

    return talks.map(s => {
      const starred = starredTalks.indexOf(s.title) > -1;
      return { ...s, starred };
    });
  }

  async toggleReminder(item) {
    const { starred, title } = item;
    const { starTalk, unstarTalk, trackLocalNotification, untrackLocalNotification, localNotifications } = this.props;

    // create schedule local notification, track it, update star status
    if (!starred) {
      const id = await PushNotifications.scheduleTalkReminder(item);
      trackLocalNotification(id, title);
      starTalk(title);
      return;
    }

    // find local notification, cancel it, update star status
    const notification = localNotifications.find(n => n.title === title);
    if (notification) {
      await PushNotifications.cancelTalkReminder(notification.id);
      untrackLocalNotification(notification.id);
    }

    unstarTalk(title);
  }

  createOnEventPress = (item) => () => {
    const { navigation, setSelectedEvent } = this.props;

    setSelectedEvent(item);

    if (item.type === 'talk') {
      navigation.navigate('TalkDetail');
    } else if (item.type === 'event') {
      navigation.navigate('ActivityDetail');
    }
  }

  getItemLayout = GetItemLayout({
    getItemHeight: (item) => {
      if (item.type === 'talk') {
        // use best guess for variable height rows
        return 205 + (1.002936 * item.title.length + 6.77378);
      }
      return 145;
    },
    getSectionHeaderHeight: () => 39,
  });

  async toggleReminder(item) {
    const { starred, title } = item;
    const { starTalk, unstarTalk, trackLocalNotification, untrackLocalNotification, localNotifications } = this.props;

    // create schedule local notification, track it, update star status
    if (!starred) {
      const id = await PushNotifications.scheduleTalkReminder(item);
      trackLocalNotification(id, title);
      starTalk(title);
      return;
    }

    // find local notification, cancel it, update star status
    const notification = localNotifications.find(n => n.title === title);
    if (notification) {
      await PushNotifications.cancelTalkReminder(notification.id);
      untrackLocalNotification(notification.id);
    }

    unstarTalk(title);
  }

  renderSectionHeader = ({ section }) => { 
    return ( 
      <ScheduleSectionHeader time={section.time} /> 
    ); 
  } 

  renderItem = ({ item }) => {
    if (item.type === 'talk') {
      return this.renderTalk(item);
    }

    if (item.eventType === "Activity") {
      return this.renderActivity(item);
    }

    if (item.eventType === "Meal/Snack") {
      return this.renderMeal(item);
    }

    return this.renderEvent(item);
  }

  renderTalk = (item) => {
    const toggleReminder = this.toggleReminder.bind(this, item);

    let avatarUrl = '';
    if (!!item.speakers && item.speakers.length) {
      // find first speaker with a photo
      const photoUrl = item.speakers.reduce((prev, s) => s.photo ? s.photo.url : prev, '');
      avatarUrl = AppConfig.conferenceUrl + photoUrl;
    }

    return (
      <Talk
        type={item.type}
        name={item.speaker}
        avatarUrl={avatarUrl}
        title={item.title}
        start={item.time}
        duration={item.duration}
        onPress={this.createOnEventPress(item)}
        starred={item.starred}
        toggleReminder={toggleReminder}
        venue={item.venue}
      />
    );
  }

  renderActivity = (item) => {
    return (
      <Activity
        type={item.eventType}
        title={item.title}
        sponsor={item.sponsor}
        start={item.time}
        end={item.end}
        duration={item.duration}
        name={item.speaker}
        onPress={this.createOnEventPress(item)}
        venue={item.venue}
        image={item.image}
      />
    );
  }

  renderMeal = (item) => {
    return (
      <Meal
        type={item.eventType}
        title={item.title}
        sponsor={item.sponsor}
        start={item.time}
        end={item.end}
        duration={item.duration}
        name={item.speaker}
        onPress={this.createOnEventPress(item)}
        venue={item.venue}
        image={item.image}
      />
    );
  }

  renderEvent = (item) => {
    return (
      <Event
        type={item.eventType}
        title={item.title}
        sponsor={item.sponsor}
        start={item.time}
        end={item.end}
        duration={item.duration}
        name={item.speaker}
        onPress={this.createOnEventPress(item)}
        venue={item.venue}
        image={item.image}
      />
    );
  }

  render () {
    const { events } = this.props;
    console.log(events);
    if (!events || !events.length) {
      return null;
    }

    return (
      <AnimatedSectionList
        renderItem={this.renderItem}
        renderSectionHeader={this.renderSectionHeader}
        sections={events}
        keyExtractor={(item, idx) => item.title}
        contentContainerStyle={styles.listContent}
        getItemLayout={this.getItemLayout}
        stickySectionHeadersEnabled
        scrollEventThrottle={1}
        // initialNumToRender={10}
        // maxToRenderPerBatch={1}
        // updateCellsBatchingPeriod={100}
        ref={(r) => this.scheduleList = r}
      />
    );
  }
}

buildScheduleList = (activities, talks, dayIndex) => {
  // fetch day
  const day = new Date(Config.conferenceDates[dayIndex]);

  // combine events
  let events = [
    ...activities,
    ...talks,
  ];

  // filter events
  events = events.filter(e => isSameDay(day, e.time));

  // group events by time slot
  let timeslots = GroupBy(events, e => e.time);

  // map the events, and sort the timeslot by title
  // use property data for sectionlists
  timeslots = timeslots.map(g => {
    const data = g.values;
    data.sort((a, b) => {
      // sort by type first
      if (a.eventType === 'Meal/Snack') {
        return -1;
      }
      if (b.eventType === 'Meal/Snack') {
        return 1;
      }

      if (a.eventType === 'Keynote') {
        return -1;
      }
      if (b.eventType === 'Keynote') {
        return 1;
      }

      if (a.eventType === 'Activity' && b.type === 'talk') {
        return -1;
      }
      if (b.eventType === 'Activity' && a.type === 'talk') {
        return 1;
      }

      if (a.title < b.title) {
        return -1;
      }
      if (a.title > b.title) {
        return 1;
      }
      return 0;
    });

    return {
      time: g.key,
      data,
    };
  });

  // sort timeslots
  timeslots.sort((a, b) => {
    if (isBefore(new Date(a.time), new Date(b.time))) {
      return -1;
    }
    if (isBefore(new Date(b.time), new Date(a.time))) {
      return 1;
    }
    return 0;
  });

  return timeslots;
};

const mapStoreToProps = (dayIndex) => (store) => {
  return {
    currentTime: new Date(store.schedule.currentTime),
    isCurrentDay: isSameDay(store.schedule.currentTime, new Date(Config.conferenceDates[dayIndex])),
    events: buildScheduleList(store.schedule.activities, store.schedule.talks, dayIndex),
    starredTalks: store.schedule.starredTalks,
    localNotifications: store.notifications.localNotifications,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setSelectedEvent: data => dispatch(ScheduleActions.setSelectedEvent(data)),
    starTalk: title => dispatch(ScheduleActions.starTalk(title)),
    unstarTalk: title => dispatch(ScheduleActions.unstarTalk(title)),
    trackLocalNotification: (id, title) =>
      dispatch(NotificationActions.trackLocalNotification(id, title)),
    untrackLocalNotification: (id) => dispatch(NotificationActions.untrackLocalNotification(id)),
  };
};

export const MondayScheduleList = connect(mapStoreToProps(0), mapDispatchToProps)(ScheduleList);
export const TuesdayScheduleList = connect(mapStoreToProps(1), mapDispatchToProps)(ScheduleList);
export const WednesdayScheduleList = connect(mapStoreToProps(2), mapDispatchToProps)(ScheduleList);
