import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";
import theme from "../../constants/Theme";
import { hp, wp } from "../../helpers/common";
import Categories from "../../components/categories";
import { apiCall } from "../../api/index";
import ImageGrid from "../../components/ImaeGrid";
import { useCallback } from "react";
import { debounce, filter } from "lodash";
import FiltersModal from "../../components/FiltersModal";
import Animated from "react-native-reanimated";
import { useRouter } from "expo-router";

var page = 1;

const HomeScreen = () => {
  const modalRef = useRef(null)
  const [search, setSearch] = useState("");
  const [images, setImages] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [filters, setFilters] = useState(null)
  const searchInputRef = useRef(null);
  const scrollRef = useRef(null)
  const router = useRouter()


  useEffect(() => {
    fetchImages();
  }, []);


  const handleSearch = useCallback(
    debounce((text) => {
      if (text.length > 2) {
        page = 1;
        setImages([]);
        setActiveCategory(null)
        fetchImages({ page, q: text, ...filters },false);


      } else if (text === "") {
        page = 1;
        setActiveCategory(null) // clearing category when searching
        searchInputRef.current?.clear();
        setImages([]);
        fetchImages({ page, ...filters },false);
      }
    }, 400),
    []
  );

  const applayFilters = () => {

    if(filters) {
      page = 1
      setImages([])
      let params = {
        page,
        ...filters
      }
      if (activeCategory) params.category = activeCategory

      if (search) params.q = search

      fetchImages(params, false)
    }
     closeFiltersModal()
     
  }
  const resetFilters = () => {

    if(filters) {
        page=1
        setFilters(null)
        setImages([])
      let params = {
        page,
      }
      if (activeCategory) params.category = activeCategory

      if (search) params.q = search

      fetchImages(params, false)

    }
     closeFiltersModal()
     
  }

  const clearThisFilter = (filterName)=> {
    let filterz = {...filters}
    delete filterz [filterName]
    setFilters({...filterz})
    page=1;
    setImages([])

    let params = {
      page,
      ...filters
    }

    if (activeCategory) params.category = activeCategory
    if (search) params.q = search
    fetchImages(params, false)
  }


  const handleScroll = (event)=> {
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollViewHieght = event.nativeEvent.layoutMeasurement.height;
    const scrollOffset =  event.nativeEvent.contentOffset.y;
    const bottomPosition = contentHeight - scrollViewHieght;

    if (scrollOffset >=  bottomPosition-1) {
      // fetch more images here
      ++page       
      let params = {
        page,
        ...filters
      }
      if (activeCategory) params.category = activeCategory
      if (search) params.q = search
      fetchImages(params)
    }
  }

  const clearSearch = () => {
    setSearch("");
  };




  const handleChangeCategory = (cat) => {
    if (cat === activeCategory) {
      setActiveCategory(null);
      setImages([]);
      page = 1;
      fetchImages({page, ...filters});
    } else {
      setActiveCategory(cat);
      clearSearch();
      setImages([]);
      page = 1;
      let params = { page, category: cat };
      fetchImages(params, false);
    }
  };



  const handleTextChange = (text) => {
    setSearch(text);
    handleSearch(text);
  };





  const fetchImages = async (params = { page: 1 }, append = true) => {
    let res = await apiCall(params);
    try {
      if (res.success && res?.data?.hits) {
        setImages((prevImages) =>
          append ? [...prevImages, ...res.data.hits] : res.data.hits
        );
      }
    } catch (err) {
      console.log("Image fetching failed", err);
    }
  };

  const openFiltersModal = () => {
    modalRef?.current?.present(); 
  };


  const closeFiltersModal = ()=> { 
    modalRef?.current?.close()
  }

  const handleScrollUp = ()=> {
    scrollRef?.current?.scrollTo({
      y:0,
      animated:true
    })
  }



  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 10 : 30;
  

  return (
    <View style={[styles.container, { paddingTop }]}>
      {/* header */}
      <View style={styles.header}>
        <Pressable onPress={handleScrollUp}>
          <Text style={styles.title}>Pixels</Text>
        </Pressable>
        <Pressable onPress={openFiltersModal}>
          <FontAwesome6
            name="bars-staggered"
            size={22}
            color={theme.colors.neutral(0.7)}
          />
        </Pressable>
      </View>

      {/* scrolling begins */}
      <ScrollView onScroll={handleScroll}
      scrollEventThrottle={5} // how often scroll event will fire wheel scrolling (in ms)
      ref={scrollRef}
      contentContainerStyle={{ gap: 15 }}>
        {/* searchbar */}
        <View style={styles.searchBar}>
          <View style={styles.searchIcon}>
            <Feather
              name="search"
              size={24}
              color={theme.colors.neutral(0.4)}
            />
          </View>

          <TextInput
            placeholder="Search for photos..."
            style={styles.searchInput}
            value={search}
            ref={searchInputRef}
            onChangeText={handleTextChange}
          />

          {search && (
            <Pressable
              onPress={() => handleSearch("")}
              style={styles.closeIcon}
            >
              <Ionicons
                name="close"
                size={24}
                color={theme.colors.neutral(0.6)}
              />
            </Pressable>
          )}
        </View>

        {/* categories */}
        <View style={styles.categories}>
          <Categories
            activeCategory={activeCategory}
            handleChangeCategory={handleChangeCategory}
          />
        </View>

        {/* filters */}

        {filters && (
  <View>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filters}
    >
      {Object.keys(filters).map((key) => (
  <View key={key} style={styles.filterItem}>
    {key === 'colors' ? (
      <View
        style={{
          height: 20,
          width: 30,
          borderRadius: 7,
          backgroundColor: filters[key],
        }}
      />
    ) : (
      <Text style={styles.filterItemText}>{filters[key]}</Text>
    )}
    
    <Pressable style={styles.filterCloseIcon} onPress={() => clearThisFilter(key)}>
      <Ionicons name="close" size={14} color={theme.colors.neutral(0.9)} />
    </Pressable>
  </View>
))}

    </ScrollView>
  </View>
)}

        {/* Images masonry grid */}
        <View style={styles.imageGridContainer}>
          <ImageGrid images={images} router = {router} />
        </View>

        {/* loading */}

        <View style={{marginBottom:70, marginTop: images.length>0? 10: 70}}>
          <ActivityIndicator size={'large'}/>
        </View>
      </ScrollView>

      {/* filters modal */}

      <FiltersModal modalRef={modalRef} filters={filters} setFilters={setFilters} onClose={closeFiltersModal} onApplay={applayFilters} onReset={resetFilters}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 15,
  },
  header: {
    marginHorizontal: wp(4),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: hp(4),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.neutral(0.9),
  },
  searchBar: {
    marginHorizontal: wp(4),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    backgroundColor: theme.colors.white,
    padding: 6,
    paddingLeft: 10,
    borderRadius: theme.radius.lg,
  },
  searchIcon: {
    padding: 8,
  },
  searchInput: {
    flex: 1,
    borderRadius: theme.radius.sm,
    paddingVertical: 10,
    fontSize: hp(2),
  },
  closeIcon: {
    backgroundColor: theme.colors.neutral(0.1),
    padding: 8,
    borderRadius: theme.radius.sm,
  },

  imageGridContainer : {
    flex: 1,
  },
  filters : {
    paddingHorizontal:wp(4),
    gap:10
  },
  filterItem: {
    backgroundColor:theme.colors.grayBG,
    padding:3,
    flexDirection:'row',
    alignItems:'center',
    borderRadius:theme.radius.xs,
    padding:8,
    gap:10,
    paddingHorizontal:10
  },
  filterItemText: {
    fontSize:hp(1.9),
  },
  filterCloseIcon: {
    backgroundColor:theme.colors.neutral(0.2),
    padding:4,
    borderRadius:7
  }
});

export default HomeScreen;
