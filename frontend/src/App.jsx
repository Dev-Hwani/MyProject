import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const API_BASE_URL = '/api'
const MAX_NAME_LENGTH = 100

function getErrorMessage(error) {
  return error.response?.data?.detail || error.response?.data?.message || '요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.'
}

function App() {
  const [users, setUsers] = useState([])
  const [inputName, setInputName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [busyUserId, setBusyUserId] = useState(null)

  useEffect(() => {
    axios.get(`${API_BASE_URL}/users`)
      .then(res => setUsers(res.data))
      .catch(error => setErrorMessage(getErrorMessage(error)))
      .finally(() => setIsLoading(false))
  }, [])

  const handleAddUser = async () => {
    const name = inputName.trim()
    if (!name || name.length > MAX_NAME_LENGTH || isSaving) return

    setErrorMessage('')
    setIsSaving(true)
    try {
      const { data } = await axios.post(`${API_BASE_URL}/users`, null, { params: { name } })
      setUsers(currentUsers => [...currentUsers, data])
      setInputName('')
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteUser = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?') || busyUserId !== null) return

    setErrorMessage('')
    setBusyUserId(id)
    try {
      await axios.delete(`${API_BASE_URL}/users/${id}`)
      setUsers(currentUsers => currentUsers.filter(user => user.id !== id))
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setBusyUserId(null)
    }
  }

  const handleStartEdit = (user) => {
    setEditingId(user.id)
    setEditingName(user.name)
  }

  const handleUpdateUser = async (id) => {
    const name = editingName.trim()
    if (!name || name.length > MAX_NAME_LENGTH || busyUserId !== null) return

    setErrorMessage('')
    setBusyUserId(id)
    try {
      const { data } = await axios.put(`${API_BASE_URL}/users/${id}`, null, { params: { name } })
      setUsers(currentUsers => currentUsers.map(user => user.id === id ? data : user))
      setEditingId(null)
      setEditingName('')
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setBusyUserId(null)
    }
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
          onKeyDown={(e) => e.key === 'Enter' && handleAddUser()}
          placeholder="이름을 입력하세요"
          maxLength={MAX_NAME_LENGTH}
          style={{ padding: '10px', fontSize: '16px', marginRight: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button 
          onClick={handleAddUser} 
          disabled={isSaving || !inputName.trim() || inputName.trim().length > MAX_NAME_LENGTH}
          style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#646cff', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          {isSaving ? '저장 중...' : 'DB에 저장'}
        </button>
      </div>

      {errorMessage && <p role="alert" style={{ color: '#f44336', marginBottom: '16px' }}>{errorMessage}</p>}

      {/* DB 저장 목록 표시 영역 */}
      <h3>📦 Docker PostgreSQL DB에 저장된 목록:</h3>
      <div style={{ display: 'inline-block', textAlign: 'left', minWidth: '320px' }}>
        {isLoading ? (
          <p style={{ color: '#888', textAlign: 'center' }}>목록을 불러오는 중입니다.</p>
        ) : users.length === 0 ? (
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
                      onKeyDown={(e) => e.key === 'Enter' && handleUpdateUser(user.id)}
                      maxLength={MAX_NAME_LENGTH}
                      style={{ padding: '4px 8px', fontSize: '16px', marginRight: '8px' }}
                    />
                    <div>
                      <button 
                        onClick={() => handleUpdateUser(user.id)}
                        disabled={busyUserId !== null || !editingName.trim() || editingName.trim().length > MAX_NAME_LENGTH}
                        style={{ padding: '4px 8px', marginRight: '4px', cursor: 'pointer', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '4px' }}
                      >
                        {busyUserId === user.id ? '저장 중...' : '저장'}
                      </button>
                      <button 
                        onClick={() => {
                          setEditingId(null)
                          setEditingName('')
                        }}
                        disabled={busyUserId !== null}
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
                        disabled={busyUserId !== null}
                        style={{ padding: '4px 8px', marginRight: '4px', cursor: 'pointer', backgroundColor: '#ff9800', color: 'white', border: 'none', borderRadius: '4px' }}
                      >
                        수정
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={busyUserId !== null}
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
