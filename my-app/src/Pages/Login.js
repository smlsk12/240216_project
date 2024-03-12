import React, { useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../Styles/Login.css"

//로그인 페이지 상태 변화 함수
function Login() {
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [loginStatus,setloginStatus]= useState('');
  
  const LoginPageJs = () => {
  
    // 로그인 요청 구현
    axios.post('http://localhost:8000/Login', {
      email: email,
      password: password
    }) //회원 정보 email, password 정보 가져옴
    .then(response => {
      console.log('서버 응답:', response);
      if (response.data.success) {
        const { userid, username } = response.data.data[0]; // 익스플로우세션
        const userData={
          userid: userid,
          username: username
        }
        sessionStorage.setItem('loggedIn', true);
        sessionStorage.setItem('userData',JSON.stringify(userData) );
        // Application에 세션스토리지 안에서 정보를 출력한다
  
        navigate('/');
        window.location.reload(); // 페이지 리로드
      } else {
        // 로그인 실패 시 처리
        console.log('로그인 실패 : ', response.data);
        setloginStatus('로그인 실패 : '+ response.data.message);
      }
    })
  };
  
  return (
    <div className="login-page">
      <div className="login-box">
        <form className="login-form">
          {/* 로그인 아이디 비밀번호 표시 */}
          {/* <p>아이디</p> */}
          <input
            id="id"
            type="text"
            placeholder="아이디를 입력해주세요."
            value={email}
            onChange={(e) => setemail(e.target.value)}
          />
          <br />
          {/* <p>비밀번호</p> */}
          <input
            type="password"
            placeholder="비밀번호를 입력해주세요."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          {/* 로그인 버튼 표시 */}
          <button
            className="login-form__button"
            onClick={(e) => {
              e.preventDefault();
              console.log("버튼 클릭됨");
              LoginPageJs();
            }}
          >
            로그인
          </button>
          <div className="login-page__to-register">
            <Link to="/RegisterPersonal">회원이 아니신가요?</Link>
          </div>
          {loginStatus && <div>{loginStatus}</div>}
        </form>
      </div>
    </div>
  );
}

export default Login;