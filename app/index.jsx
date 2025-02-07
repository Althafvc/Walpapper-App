import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import React from "react";
import { StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { hp, wp } from "../helpers/common";
import theme from '../constants/Theme';
import {useRouter} from 'expo-router'

const index = () => {
  const router = useRouter()
  return (
    <View style = {styles.container}>
      <StatusBar />
      <Image
        style={styles.bgImage}
        source={require("../assets/images/welcome.png")}
        resizeMode="cover"
      />

      {/* lenier gradient */}

      <Animated.View
        entering={FadeInDown.delay(0).duration(800)}
        style= {{flex:1}}
      >
        <LinearGradient
          colors={[
            "rgba(255,255,255,0)",
            "rgba(255,255,255,0.5)",
            "white",
            "white",
          ]}
          style={styles.gradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.8 }}
        />

        {/* content */}

        <View style={styles.contentContainer}>
        <Animated.Text entering={FadeInDown.delay(400).springify()} style={styles.title}>
        Pixels
        </Animated.Text>

          <Animated.Text entering={FadeInDown.delay(500).springify()} style={styles.punchline}>
            Every Pixel Tells a Story
            </Animated.Text>

          <Animated.View entering={FadeInDown.delay(600).springify()}>
          <Pressable style={styles.startButton} onPress={()=> router.push('home')}>       
                 <Text style={styles.startText}>Start Exploring</Text>
            </Pressable>
          </Animated.View>
        </View>

      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    flex:1,
  },
  bgImage: {
    width: wp(100),
    height: hp(100),
    position:'absolute'
  },
  gradient: {
width:wp(100),
height:hp(65),
position:'absolute',
bottom:0
  },

  contentContainer: {
    flex:1,
    alignItems:'center',
    justifyContent:'flex-end',
    gap:14
  },

title: {
  fontSize: hp(7),
  color: theme.colors.neutral(0.9),
  fontWeight : theme.fontWeights.bold
},

punchline: {
fontSize: hp(2),
letterSpacing:1,
marginBottom:10,
fontWeight:theme.fontWeights.medium,
},
startButton: {
  marginBottom:50,
  backgroundColor: theme.colors.neutral(0.9),
  padding:15,
  paddingHorizontal: wp(15),
  borderRadius: theme.radius.xl,
  borderCurve:'continuous'
},
startText : {
  color: theme.colors.white,
  fontSize: hp(3),
  fontWeight: theme.fontWeights.medium,
  letterSpacing:2
}
})

export default index;
