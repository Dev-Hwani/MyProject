import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [users, setUsers] = useState([])
  const [inputName, setInputName] = useState('')

  // 1. Spring Boot 백엔드를 통해 Docker PostgreSQL DB에서 사용자 목록 가져오기
  const fetchUsers = () => {
    axios.get('http://localhost:8080/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error('백엔드 연결 에러:', err))
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // 2. Spring Boot 백엔드로 입력한 이름을 보내서 DB에 저장하기
  const handleAddUser = () => {
    if (!inputName.trim()) return
    axios.post(`http://localhost:8080/users?name=${inputName}`)
      .then(() => {
        setInputName('')
        fetchUsers() // 저장 성공 후 목록 새로고침
      })
      .catch(err => console.error('저장 실패:', err))
  }

  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>🎉 Fullstack Integration Test</h1>
      
      {/* 데이터 입력 영역 */}
      <div style={{ marginBottom: '30px' }}>
        <input 
          type="text" 
          value={inputName} 
          onChange={(e) => setInputName(e.target.value)}
          placeholder="이름을 입력하세요"
          style={{ padding: '10px', fontSize: '16px', marginRight: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button 
          onClick={handleAddUser} 
          style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#646cff', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          DB에 저장
        </button>
      </div>

      {/* DB 저장 목록 표시 영역 */}
      <h3>📦 Docker PostgreSQL DB에 저장된 목록:</h3>
      <div style={{ display: 'inline-block', textAlign: 'left', minWidth: '200px' }}>
        {users.length === 0 ? (
          <p style={{ color: '#888' }}>저장된 데이터가 없습니다.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {users.map(user => (
              <li key={user.id} style={{ fontSize: '18px', margin: '8px 0', borderBottom: '1px solid #eee', paddingBottom: '4px' }}>
                🆔 {user.id}번: <strong>{user.name}</strong>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default App