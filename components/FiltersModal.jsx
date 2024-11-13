import { View, Text, StyleSheet, Pressable } from 'react-native';
import React, { useMemo } from 'react';
import { BlurView } from 'expo-blur';
import { ColorFilter, CommonFilterRow } from './FilterViews';
import {
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import Animated, { Extrapolation, FadeInDown, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { capitalize, hp } from '../helpers/common';
import theme from '../constants/Theme';
import { SectionView } from './FilterViews';
import { data } from '../constants/data';

const FiltersModal = ({ modalRef, filters, onClose, onApplay, onReset, setFilters }) => {
  const snapPoints = useMemo(() => ['75%'], []);

  return (
    <BottomSheetModal
      ref={modalRef}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={customBackDrop}
      enablePanDownToClose={true}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.content}>
          <Text style={styles.filterText}>Filters</Text>   
          {
            Object.keys(sections).map((sectionName, index) => {
              let sectionView = sections[sectionName];
              let sectionData = data.filters[sectionName]
              let title = capitalize(sectionName)
              return (
                <Animated.View
                entering={FadeInDown.delay((index*100)+100).springify().damping(11)}
                 key={sectionName}>
                  <SectionView title={title} content={sectionView({
                    data:sectionData,
                    filters,
                    setFilters,
                    filterName: sectionName,
                  })}/>
                </Animated.View>
              );
            })
          } 

          {/* actions */}
          <Animated.View 
            entering={FadeInDown.delay(500).springify().damping(11)}
          style={styles.buttons}>
            <Pressable style ={styles.resetButton} onPress={onReset}>
              <Text style={[styles.buttonText, {color:theme.colors.neutral(0.9)}]}>Reset</Text>
            </Pressable>
            <Pressable style ={styles.applayButton} onPress={onApplay}>
              <Text style={[styles.buttonText, {color:theme.colors.white}]}>Applay</Text>
            </Pressable>
          </Animated.View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const sections = {
  'order': (props) => <CommonFilterRow {...props} />,
  'orientation': (props) => <CommonFilterRow {...props} />,
  'type': (props) => <CommonFilterRow {...props} />,
  'colors': (props) => <ColorFilter {...props} />,
};





const customBackDrop = ({ animatedIndex, style }) => {
  const containerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animatedIndex.value,
      [-1, 0],
      [0, 1],
      Extrapolation.CLAMP
    );

    return {
      opacity,
    };
  });

  const containerStyle = [
    style,
    styles.overlay,
    StyleSheet.absoluteFill,
    containerAnimatedStyle,
  ];

  return (
    <Animated.View style={containerStyle}>
      <BlurView style={StyleSheet.absoluteFill} tint="dark" intensity={25} experimentalBlurMethod='dimezisBlurView' />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  content: {
    width: '100%',
    gap: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  filterText: {
    fontSize: hp(4),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.neutral(0.8),
    marginBottom: 5,
  },

  buttons: {
    flex:1,
    flexDirection:'row',
    alignItems:'center',
    gap:10
  },
  applayButton: {
    flex:1,
    backgroundColor:theme.colors.neutral(0.8),
    padding:12,
    alignItems:'center',
    justifyContent:'center',
    borderRadius: theme.radius.md,
    borderCurve:'continuous'
  },
  resetButton: {
    flex:1,
    backgroundColor:theme.colors.neutral(0.03),
    padding:12,
    alignItems:'center',
    justifyContent:'center',
    borderRadius: theme.radius.md,
    borderCurve:'continuous',
    borderWidth:2,
    borderBlockColor:theme.colors.grayBG
  },
  buttonText: {
    fontSize:hp(2.2)
  }
});

export default FiltersModal;
