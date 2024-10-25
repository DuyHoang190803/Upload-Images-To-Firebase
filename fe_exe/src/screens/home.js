import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, Button, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import ImageAPI from '../api/ImageAPI.js';

const Home = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch images from the API
    const fetchImages = async () => {
      try {
        const response = await ImageAPI.getAllImages();
        setImages(response);
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Lỗi", "Ứng dụng cần quyền truy cập thư viện ảnh!");
      return;
    }

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: 10,
      });

      if (result && !result.canceled) {
        if (result.assets && result.assets.length > 0) {
          const newImages = await Promise.all(
            result.assets.map(async (asset) => {
              const fileInfo = await FileSystem.getInfoAsync(asset.uri);
              console.log(`Kích thước tệp: ${(fileInfo.size / (1024 * 1024)).toFixed(2)} MB`);

              // Kiểm tra kích thước tệp
              if (fileInfo.size > 2 * 1024 * 1024) {
                // Giới hạn 2MB
                Alert.alert("Lỗi", "Kích thước tệp tối đa là 2MB.");
                return null; // Trả về null nếu tệp quá lớn
              }

              // Chuyển đổi ảnh sang định dạng jpg và nén
              const manipulatedImage = await ImageManipulator.manipulateAsync(
                asset.uri,
                [],
                { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
              );

              // Chuyển đổi sang base64
              const base64String = await FileSystem.readAsStringAsync(
                manipulatedImage.uri,
                { encoding: FileSystem.EncodingType.Base64 }
              );

              return {
                uri: manipulatedImage.uri,
                name: asset.fileName || `image_${Date.now()}.jpg`,
                type: "image/jpeg",
                base64: base64String,
              };
            })
          );

          // Lọc ra các tệp không hợp lệ (null)
          const validImages = newImages.filter((image) => image !== null);
          const updatedImages = [...images, ...validImages];

          if (updatedImages.length > 10) {
            Alert.alert("Lỗi", "Tối đa chỉ có thể chọn 10 hình ảnh.");
            return;
          }

          setImages(updatedImages);

          // Tự động upload tất cả hình ảnh đã chọn
          await Promise.all(validImages.map((image) => uploadImage(image)));
        } else {
          console.log("Không có hình ảnh nào được chọn.");
          Alert.alert("Lỗi", "Không có hình ảnh nào được chọn.");
        }
      } else {
        console.log("Người dùng đã hủy chọn hình ảnh.");
      }
    } catch (error) {
      console.error("Error picking images: ", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi chọn ảnh.");
    }
  };

  const uploadImage = async (image) => {
    try {
      const body = {
        images: [image.base64], // Mảng chứa base64 của ảnh
        message: "Tôi là Duy Hoàng" // Thêm thông điệp
      };
      await ImageAPI.uploadImage(body);
      // Nếu upload thành công, có thể cập nhật danh sách ảnh
      setImages((prevImages) => [...prevImages, image]);
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload image');
    }
  };


  const renderImage = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item.url }} style={styles.image} />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading images...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        keyExtractor={(item, index) => item.uri + index.toString()} // Sử dụng uri và index làm key
        renderItem={renderImage}
        contentContainerStyle={styles.list}
        horizontal={true}
        showsHorizontalScrollIndicator={true}
        snapToAlignment="center"
        decelerationRate="fast"
      />
      <View style={styles.buttonContainer}>
        <Button title="Chọn Hình Ảnh" onPress={openGallery} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  list: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  imageContainer: {
    marginRight: 10,
  },
  image: {
    width: 300,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default Home;
