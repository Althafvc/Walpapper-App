import { Text, Pressable, StyleSheet } from 'react-native'
import React from 'react'
import { Image } from 'expo-image';
import {getImageSize, wp} from '../helpers/common'
import theme from '../constants/Theme'


const ImageCard = ({item, index, columns, router}) => {

  const getImageHeight = () => {
    let {imageHeight: height, imageWidth:width} = item
    return {height: getImageSize(height, width)}
  }



  const isLastInRow = () => {
      return (index+1) % columns ==0;
  }

  
  return (
    
    <Pressable  style={[styles.imageWrapper, !isLastInRow() && styles.spacing]} onPress={() => router.push({pathname:'home/Images', params:{...item}})}
>
<Image
        style={[styles.image, getImageHeight()] }
        source={item?.webformatURL}
         transition={100}
        />
    </Pressable>
  )
}

const styles = StyleSheet.create( {
   image : {
    width:'100%',
    height:300
   },
   imageWrapper: {
    backgroundColor: theme.colors.grayBG,
    borderRadius: theme.radius.xl,
    borderCurve:'continuous',
    overflow: 'hidden',
    marginBottom: wp(2)
   },
   spacing: {
    marginRight:wp(2)
   }
})

export default ImageCard