// ImagePopup.js

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import '../Styles/ImagePopup.css';
import Draggable from "./Draggable";

const ImagePopup = ({ onClose, handleProfileImg }) => {
  // 이미지 URL 상태
  const [imageUrl, setImageUrl] = useState(""); 
  // file input 요소접근
  const fileInputRef = useRef(null); 

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('img', file);

    try {
      const result = await axios.post('http://localhost:8000/my/profile/img', formData,
      { headers: { 'Content-Type': 'multipart/form-data' }}
      );
      console.log('success: 서버응답', result.data);

      
      // 업로드 성공 시 서버에서 받은 이미지 URL을 상태에 설정
      // setImageUrl(`http://localhost:8000/my/profile/img/${result.data}`);
      const imageUrl = `http://localhost:8000/my/profile/img/${result.data}`;
      setImageUrl(imageUrl);
      handleProfileImg(imageUrl);
      
    } catch (error) {
      console.error('이미지업로드: error', error);
      alert('이미지업로드: error');
    }
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleUpload(file);
    } else {
      alert('이미지가 선택되지 않았습니다.');
    }
  };
  
  // 이미지url을 상태에서 제거하는 함수
  const handleImageDelete = () => {
    setImageUrl("");
    // 로컬스토리지에서 이미지url 제거
    localStorage.removeItem('storageImg');
  };

  // 이미지url을 저장하는 함수
  const handleSaveImage = () => {
    // 이미지url이 존재할 경우에 저장
    // key = saveImgUrl / value = imageUrl
    if (imageUrl) {
      localStorage.setItem('storageImg', imageUrl);
      alert('이미지 저장');
      onClose();
    } else {
      alert('이미지 없음');
    }
  };


  // 파일 선택 창 이벤트 버튼
  const handleUploadBtnRef = () => {
    if(fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      console.log('이미지업로드 버튼 참조 오류');
    }
  };

  useEffect(() => {
    const savedImageUrl = localStorage.getItem('storageImg');
    if (savedImageUrl) {
      setImageUrl(savedImageUrl);
    }
  }, []);

  return (
    <div className="modal">
      <Draggable>
        <div className="modal-content">
          <button onClick={onClose}>X</button>
          <br />
          {/* 업로드 버튼 참조 */}
          <button className="upload-button" onClick={handleUploadBtnRef}>이미지 업로드</button>
          {/* 파일 업로드 버튼 */}
          <input
            type="file"
            ref={fileInputRef} // useRef로 참조한 input요소
            name="image"
            accept="image/*"
            onChange={handleImageSelect}
            style={{ display: "none" }} // input 요소 숨김
          /> 
          <br />
          {imageUrl && ( // 이미지 URL이 존재할 경우 이미지 표시
              <img src={imageUrl} alt="이미지" />
          )}
          <button onClick={handleSaveImage}>저장</button>
          <button onClick={handleImageDelete}>삭제</button>
        </div>
      </Draggable>
    </div>
  );
};

export default ImagePopup;
