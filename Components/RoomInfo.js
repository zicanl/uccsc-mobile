import React from 'react';
import { View, Text } from 'react-native';
import styles from './Styles/RoomInfoStyle';

const RoomInfo = (props) => {
  const { building, room } = props;

  return (
    <View style={styles.container}>
      <View style={styles.detail}>
        <Text style={styles.detailLabel}>
          Building
        </Text>
        <Text style={styles.detailText}>
          { building }
        </Text>
      </View>
      <View style={styles.detail}>
        <Text style={styles.detailLabel}>
          Room
        </Text>
        <Text style={styles.detailText}>
          { room }
        </Text>
      </View>
    </View>
  );
};

export default RoomInfo;
