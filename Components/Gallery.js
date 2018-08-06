import React from 'react';
import { TouchableOpacity, Image, View, Text, LayoutAnimation, TouchableWithoutFeedback } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Colors, Images } from '../Themes';
import styles from './Styles/GalleryStyle';

export default class Gallery extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      activeTab: Object.keys(props.data)[0],
    };
  }

  setActiveTab = (tab) => {
    LayoutAnimation.configureNext({ ...LayoutAnimation.Presets.linear, duration: 250 });
    this.setState({ activeTab: tab });
  }

  renderTab = (tab) => {
    const { activeTab } = this.state;
    const isActive = activeTab === tab;

    const textStyle = [
      styles.tabText,
      isActive && styles.activeTabText
    ];

    return (
      <TouchableOpacity
        key={tab}
        style={[styles.tab, isActive && styles.activeTab]}
        onPress={() => this.setActiveTab(tab)}
        accessible
        accessibilityLabel={tab}
        accessibilityTraits='button'
        accessibilityComponentType='button'
      >
        <Text style={textStyle}>
          {tab}
        </Text>
        { tab === 'Food' && <FontAwesome name="cutlery" style={[textStyle, { marginLeft: 5 }]}/> }
        { tab === 'Coffee' && <FontAwesome name="coffee" style={[textStyle, { marginLeft: 5 }]}/> }
        { tab === 'Dessert' && <FontAwesome name="birthday-cake" style={[textStyle, { marginLeft: 5 }]}/> }
      </TouchableOpacity>
    );
  }

  renderItem = (itemData) => {
    const { onItemPress } = this.props;
    const { name, image, link } = itemData;
    return (
      <TouchableWithoutFeedback
        key={name}
        onPress={() => onItemPress(link)}
        accessible
        accessibilityLabel={name}
        accessibilityTraits='button'
        accessibilityComponentType='button'
      >
        <View style={styles.item}>
          <Image source={Images[image]} resizeMode={'cover'} style={styles.itemImage} />
          <View style={styles.itemDetail}>
            <Text style={styles.itemTitle}>{name}</Text>
            <View style={styles.itemActionContainer}>
              <Text style={styles.itemAction}>
                More
              </Text>
              <FontAwesome name="long-arrow-right" size={12} color={Colors.darkPurple} style={styles.rightArrow} />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  render() {
    const { activeTab } = this.state;
    const { data } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.tabs}>
          { Object.keys(data).map((t) => this.renderTab(t)) }
        </View>
        <View style={styles.gallery}>
          { data[activeTab].map(this.renderItem) }
        </View>
      </View>
    );
  }
}
