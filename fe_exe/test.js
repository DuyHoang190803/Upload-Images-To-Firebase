// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, Button, Alert } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import ImageAPI from '../api/ImageAPI.js';

// const Home = () => {
//   const [images, setImages] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Fetch images from the API
//     const fetchImages = async () => {
//       try {
//         const response = await ImageAPI.getAllImages();
//         setImages(response);
//       } catch (error) {
//         console.error('Error fetching images:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchImages();
//   }, []);

//   const pickImage = async () => {
//     try {
//       // Yêu cầu quyền truy cập vào thư viện ảnh
//       const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (!permissionResult.granted) {
//         Alert.alert('Permission Denied', 'Storage permission is required to select images.');
//         return;
//       }
  
//       // Mở thư viện ảnh để chọn nhiều ảnh
//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsMultipleSelection: true,
//         quality: 1,
//       });
  
//       if (!result.canceled) {
//         // console.log(result.assets); 
//         const selectedImages = result.assets.map(asset => ({
//           uri: asset.uri, // Đây là URI tới tệp thực
//           fileName: asset.fileName || `image-${Date.now()}.jpg`, // Thêm đuôi mở rộng
//           type: asset.type || 'image/jpeg', // Gán type cho ảnh
//         }));
  
//         console.log(selectedImages);
//         // Tải lên các ảnh đã chọn
//         const uploadResponses = await Promise.all(selectedImages.map(image => uploadImage(image)));
//         console.log('Uploaded images:', uploadResponses); // Log phản hồi từ server
//       }
//     } catch (error) {
//       console.error('Error picking image:', error);
//       Alert.alert('Error', 'Failed to pick images.');
//     }
//   };
  

//   const uploadImage = async (image) => {
//     try {
//       // console.log(image.fileName)
//       // setLoading(true);
//       const response = await ImageAPI.uploadImage([image]);
//       // if (response.status === 200) {
//       //   Alert.alert('Success', 'Image uploaded successfully');
//       //   setImages((prevImages) => [...prevImages, image]);
//       // }
//     } catch (error) {
//       console.error('Error uploading image:', error);
//       Alert.alert('Error', 'Failed to upload image');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderImage = ({ item }) => (
//     <View style={styles.imageContainer}>
//       <Image source={{ uri: item.url }} style={styles.image} />
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#0000ff" />
//         <Text>Loading images...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={images}
//         keyExtractor={(item) => item.fileName}
//         renderItem={renderImage}
//         contentContainerStyle={styles.list}
//         horizontal={true}
//         showsHorizontalScrollIndicator={true}
//         snapToAlignment="center"
//         decelerationRate="fast"
//       />
//       <View style={styles.buttonContainer}>
//         <Button title="Upload Image" onPress={pickImage} />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f8f8',
//   },
//   list: {
//     paddingHorizontal: 10,
//     alignItems: 'center',
//   },
//   imageContainer: {
//     marginRight: 10,
//   },
//   image: {
//     width: 300,
//     height: 200,
//     resizeMode: 'cover',
//     borderRadius: 10,
//   },
//   buttonContainer: {
//     marginTop: 20,
//     alignItems: 'center',
//   },
// });

// export default Home;
