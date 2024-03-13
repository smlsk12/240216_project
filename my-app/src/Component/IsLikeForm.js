// IsLikeForm.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../Styles/MyPage.css";


const IsLikeForm = ({ userId }) => {
  const [isLike, setIsLike] = useState([]); // 게시물 목록 상태

  useEffect(() => {
    const fetchLike = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/my/islike/${userId}`);
        const userData = response.data;
        setIsLike(userData);
        console.log(userData)
      } catch (error) {
        // console.log('Error 좋아요 date:', error);
      }
    };
    fetchLike();
  }, [userId])

  return (
    <div className="like-form">
      <div className="my-form__title">
        <p className="my-form__text">뉴스</p>
      </div>
      <table className='forms-table'>
        <thead>
          <tr>
            {/* <th className='forms-table__num'>No.</th> */}
            <th className='forms-table__title'>내용</th>
            <th className='forms-table__date'>날짜</th>
          </tr>
        </thead>
        <tbody>
          {isLike.map(like => (
            <tr key={like.postid}>
              <td>
                <Link to={`/Community/Read/${like.postid}`}>
                  <span>{like.title}</span>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* 뉴스Link to 추가 */}
    </div>
  );
  
  // return (
  //   <div className="like-form">
  //     <h3 className="my-form__title">좋아요 한 목록</h3>
  //     <ul>
  //       {isLike.map(like => (
  //         <li key={like.postid}>
  //           <Link to={`/Community/Read/${like.postid}`}>
  //           <span>{like.title}</span>
  //           </Link>
  //         </li>
  //       ))}
  //     </ul>
  //     {/* 뉴스Link to 추가 */}
  //   </div>
  // );
};

export default IsLikeForm;