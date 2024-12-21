import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Image, Alert } from 'react-native';

const BackgroundChangeModal = ({
  isVisible,
  onClose,
  onChangeBackground,
}: {
  isVisible: boolean;
  onClose: () => void;
  onChangeBackground: (background: string) => void;
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleGallerySelect = () => {
    Alert.alert('갤러리 선택', '갤러리에서 이미지를 선택하는 기능을 구현하세요.');
    // react-native-image-picker 또는 기타 갤러리 관련 코드 추가
  };

  const handleDefaultImageSelect = (imageUri: string) => {
    setSelectedImage(imageUri);
  };

  const handleConfirm = () => {
    if (selectedImage) {
      onChangeBackground(selectedImage); // 부모 컴포넌트로 선택된 배경 전달
      onClose();
    } else {
      Alert.alert('알림', '이미지를 선택해주세요.');
    }
  };

  return (
    <Modal
      transparent
      animationType="slide"
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>배경 변경</Text>

          <TouchableOpacity style={styles.option} onPress={handleGallerySelect}>
            <Image
              source={require('../assets/backgroundchange.png')} // 갤러리 아이콘
              style={styles.optionImage}
            />
            <Text style={styles.optionText}>갤러리</Text>
          </TouchableOpacity>

          <View style={styles.defaultImageContainer}>
            <TouchableOpacity onPress={() => handleDefaultImageSelect('dark')}>
              <Image source={require('../assets/dark.png')} style={styles.defaultImage} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDefaultImageSelect('light')}>
              <Image source={require('../assets/light.png')} style={styles.defaultImage} />
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleConfirm} style={styles.confirmButton}>
              <Text style={styles.confirmText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  optionImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  optionText: {
    fontSize: 16,
  },
  defaultImageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  defaultImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    padding: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
  },
  cancelText: {
    color: '#757575',
  },
  confirmButton: {
    padding: 10,
    backgroundColor: '#6200EE',
    borderRadius: 10,
  },
  confirmText: {
    color: '#FFFFFF',
  },
});

export default BackgroundChangeModal;
