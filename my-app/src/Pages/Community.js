import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import PaginatedItems from '../Util/PaginatedItems';
import './Community.css';
import {Icon} from '@iconify/react';
// import {formattedDate} from '../Util/utils';
// import CommunityItems from './CommunityItems';

// 게시물 목록을 페이지별로 출력하는 컴포넌트
const Community = (loggedIn) => {
  // 게시글 목록, 전체 게시글 갯수, 현재 페이지, 검색어, 검색유형 상태 관리
  const [posts, setPosts] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('title');
  const [selectedCategory, setSelectedCategory] = useState(1);

  const navigate = useNavigate();
  // 검색어 업데이트
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };
  // 검색유형 업데이트
  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };
  // 검색버튼 클릭 시 페이지를 1로 새로고침 후 게시글 불러오기
  const handleSearchButtonClick = () => {
    setCurrentPage(1);
    fetchPosts();
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchPosts();
  }, [currentPage,selectedCategory]);

  // 서버의 다음 엔드포인트에 게시글 목록과 게시글의 총 갯수 GET요청
  const fetchPosts = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/Community?categoryId=${selectedCategory}&page=${currentPage}&searchQuery=${searchQuery}&searchType=${searchType}`);
      setPosts(response.data.posts);
      setTotalItems(response.data.totalItems);
    } catch (error) {
      console.error('데이터를 가져오는 중 오류 발생:', error);
    }
  };

  // 게시글 작성 페이지로 이동하는 함수
  const goCommunityWrite = () => {
    const loggedIn = sessionStorage.getItem("loggedIn");
  if (loggedIn) {
    // 로그인 상태일 경우 글쓰기 페이지로 이동
    navigate('/Community/Write', { state: { selectedCategory } });
  } else {
    // 로그인 상태가 아닐 경우 로그인 페이지로 이동
    if (window.confirm("로그인이 필요한 서비스입니다. 로그인 페이지로 이동하시겠습니까?")) {
      navigate('/Login');
    }
  }
};
  // 현재 페이지를 변경하는 함수
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="Community">
      {/* 게시글 카테고리 탭 */}
      <div className='CategoryBox'>
        <button className={selectedCategory === 1 ? 'selected' : ''} onClick={() => handleCategoryClick(1)}>실천기록</button>
        <button className={selectedCategory === 2 ? 'selected' : ''} onClick={() => handleCategoryClick(2)}>자유게시판</button>
        <button className={selectedCategory === 3 ? 'selected' : ''} onClick={() => handleCategoryClick(3)}>고민과질문</button>
      </div>
        {/* 검색창 */}
      <div className='SearchBox'>
        <div className='SearchBoxExceptButton'>
        <select className='SearchTypeBox' value={searchType} onChange={handleSearchTypeChange}>
          <option value="title">제목</option>
          <option value="content">본문</option>
          <option value="titleAndContent">제목+본문</option>
        </select>
        <input className='SearchQueryBox' type="text" value={searchQuery} onChange={handleSearchInputChange} />
        </div>
        <button onClick={handleSearchButtonClick}>검색</button>
      </div>
      {/* 게시글 목록 출력 */}
      <div className="PostListBox">
      <ul>
        {posts.map((post) => (
          <li key={post.postid}>
            <p>{post.username}</p>
            <Link to={`/Community/Read/${post.postid}`}>
              <strong>{post.title}</strong>
            </Link>
            <p className='View'>
            <Icon icon="fluent-mdl2:view" />
            <span>{post.view}</span></p>
            <p className='Like'>
            <Icon icon="icon-park-outline:like" />
            <span>{post.totalLikes}</span></p>
            <p>{post.createdAt}</p>
          </li>
        ))}
      </ul>
      {/* <CommunityItems posts={posts} /> */}
      </div>
      {/* 글쓰기 버튼 클릭 시 게시글 작성 페이지로 이동 */}
      <div>
        <button onClick={goCommunityWrite}>글쓰기</button>
      </div>
      {/* 페이지네이션 */}
      <div id="PagingBox">
      <PaginatedItems
          totalItems={totalItems}
          itemsPerPage={4}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Community;