import React from 'react';
import { View, Text } from 'react-native';
import { format } from 'date-fns';
import RemindMeButton from './RemindMeButton';
import styles from './Styles/TalkInfoStyle';

const TalkInfo = (props) => {
  const { start, duration, starred, toggleReminder } = props;

  return (
    <View style={styles.container}>
      <View style={styles.details}>
        <View style={styles.detail}>
          <Text style={styles.detailLabel}>
            Start
          </Text>
          <Text style={styles.detailText}>
            { format(new Date(start), 'H:mm') }
          </Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.detailLabel}>
            Duration
          </Text>
          <Text style={styles.detailText}>
            {duration}
          </Text>
        </View>
        <View style={styles.remindMe}>
          <RemindMeButton onPress={toggleReminder} on={starred} />
        </View>
      </View>
    </View>
  );
};

export default TalkInfo;
