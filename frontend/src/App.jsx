import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [users, setUsers] = useState([])
  const [inputName, setInputName] = useState('')

  // 💡 수정 기능을 위한 상태값 추가
  const [editingId, setEditingId] = useState(null)     // 현재 수정 중인 항목의 ID (null이면 수정 모드 아님)
  const [editingName, setEditingName] = useState('')   // 수정 중인 새로운 이름 입력값

  // 1. 사용자 목록 가져오기 (Read)
  const fetchUsers = () => {
    axios.get('http://localhost:8080/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error('백엔드 연결 에러:', err))
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // 2. 사용자 추가하기 (Create)
  const handleAddUser = () => {
    if (!inputName.trim()) return
    axios.post(`http://localhost:8080/users?name=${encodeURIComponent(inputName)}`)
      .then(() => {
        setInputName('')
        fetchUsers()
      })
      .catch(err => console.error('저장 실패:', err))
  }

  // 3. 사용자 삭제하기 (Delete)
  const handleDeleteUser = (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return

    axios.delete(`http://localhost:8080/users/${id}`)
      .then(() => {
        fetchUsers() // 삭제 후 목록 새로고침
      })
      .catch(err => console.error('삭제 실패:', err))
  }

  // 4-1. 수정 모드 시작 버튼 눌렀을 때
  const handleStartEdit = (user) => {
    setEditingId(user.id)
    setEditingName(user.name)
  }

  // 4-2. 수정 내용 백엔드로 저장하기 (Update)
  const handleUpdateUser = (id) => {
    if (!editingName.trim()) return

    axios.put(`http://localhost:8080/users/${id}?name=${encodeURIComponent(editingName)}`)
      .then(() => {
        setEditingId(null) // 수정 모드 종료
        fetchUsers()       // 수정 후 목록 새로고침
      })
      .catch(err => console.error('수정 실패:', err))
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
      <div style={{ display: 'inline-block', textAlign: 'left', minWidth: '320px' }}>
        {users.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center' }}>저장된 데이터가 없습니다.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {users.map(user => (
              <li key={user.id} style={{ fontSize: '18px', margin: '12px 0', borderBottom: '1px solid #eee', paddingBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                
                {/* ✏️ 수정 모드일 때와 일반 모드일 때 상이한 UI 표현 */}
                {editingId === user.id ? (
                  // 수정 중일 때
                  <>
                    <input 
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      style={{ padding: '4px 8px', fontSize: '16px', marginRight: '8px' }}
                    />
                    <div>
                      <button 
                        onClick={() => handleUpdateUser(user.id)}
                        style={{ padding: '4px 8px', marginRight: '4px', cursor: 'pointer', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '4px' }}
                      >
                        저장
                      </button>
                      <button 
                        onClick={() => setEditingId(null)}
                        style={{ padding: '4px 8px', cursor: 'pointer', backgroundColor: '#888', color: 'white', border: 'none', borderRadius: '4px' }}
                      >
                        취소
                      </button>
                    </div>
                  </>
                ) : (
                  // 일반 조회 모드일 때
                  <>
                    <span>🆔 {user.id}번: <strong>{user.name}</strong></span>
                    <div style={{ marginLeft: '16px' }}>
                      <button 
                        onClick={() => handleStartEdit(user)}
                        style={{ padding: '4px 8px', marginRight: '4px', cursor: 'pointer', backgroundColor: '#ff9800', color: 'white', border: 'none', borderRadius: '4px' }}
                      >
                        수정
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        style={{ padding: '4px 8px', cursor: 'pointer', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px' }}
                      >
                        삭제
                      </button>
                    </div>
                  </>
                )}

              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default App
