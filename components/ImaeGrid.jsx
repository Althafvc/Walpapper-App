import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { MasonryFlashList } from '@shopify/flash-list';
import ImageCard from './ImageCard';
import {wp, getColomnCount} from '../helpers/common'





const ImageGrid = ({images, router}) => {

  const columns = getColomnCount()
  return (
    <View style = {StyleSheet.container}>
      <MasonryFlashList
      data={images}
      numColumns={columns}
      initialNumToRender = {1000}
      contentContainerStyle={styles.listContainerStyle}
      renderItem={({item, index})=> <ImageCard item ={item} router={router} columns = {columns} index={{index}}/>}
      estimatedItemSize={200}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    minHeight: 10,
    width: wp(100)
  },
  listContainerStyle: {
    paddingHorizontal:wp(4)
  }
})

export default ImageGrid