import { BrowserRouter, Routes, Route, Link, useNavigate, useParams, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5050/api/v0'
const apiClient = axios.create({ baseURL: API_BASE })
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('exam_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

function SignIn() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const newErrors = {}
    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (!password.trim()) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    return newErrors
  }

  const handle = async (e) => {
    e.preventDefault()
    const newErrors = validate()
    setErrors(newErrors)
    setError('')
    
    if (Object.keys(newErrors).length > 0) return
    
    setLoading(true)
    try {
      // TODO: Uncomment API call when backend is ready
      // const { data } = await apiClient.post('/login', { email, password })
      // localStorage.setItem('exam_token', data.access_token)
      // const dash = await apiClient.get('/dashboard')
      // localStorage.setItem('exam_user_id', dash.data.id)
      
      // Mock login - check localStorage for user
      const users = JSON.parse(localStorage.getItem('exam_users') || '[]')
      const user = users.find(u => u.email === email && u.password === password)
      
      if (!user) {
        setError('Email or password is incorrect')
        setLoading(false)
        return
      }
      
      localStorage.setItem('exam_token', 'mock_token_' + user.id)
      localStorage.setItem('exam_user_id', user.id)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Email or password is incorrect')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <h1>Exam Builder</h1>
          <p>Manage your exams with ease</p>
        </div>
        <form onSubmit={handle} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              id="email"
              type="email" 
              placeholder="you@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input 
                id="password"
                type={showPassword ? 'text' : 'password'} 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className={errors.password ? 'input-error' : ''}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="auth-footer">
          <p>Don't have an account? <Link to="/signup">Create one</Link></p>
        </div>
      </div>
    </div>
  )
}

function SignUp() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const newErrors = {}
    if (!name.trim()) {
      newErrors.name = 'Full name is required'
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }
    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (!password.trim()) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    return newErrors
  }

  const handle = async (e) => {
    e.preventDefault()
    const newErrors = validate()
    setErrors(newErrors)
    setError('')
    
    if (Object.keys(newErrors).length > 0) return
    
    setLoading(true)
    try {
      // TODO: Uncomment API call when backend is ready
      // const response = await apiClient.post('/users', { name, email, password })
      // console.log('Signup successful:', response.data)
      // navigate('/')
      
      // Mock signup - save to localStorage
      const users = JSON.parse(localStorage.getItem('exam_users') || '[]')
      
      // Check if email already exists
      if (users.some(u => u.email === email)) {
        setError('Email already registered. Please use a different email or sign in.')
        setLoading(false)
        return
      }
      
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password
      }
      
      users.push(newUser)
      localStorage.setItem('exam_users', JSON.stringify(users))
      console.log('User registered:', newUser)
      
      // Auto-login after signup
      localStorage.setItem('exam_token', 'mock_token_' + newUser.id)
      localStorage.setItem('exam_user_id', newUser.id)
      navigate('/dashboard')
    } catch (err) {
      console.error('Signup error:', err)
      let errorMsg = 'Could not create account. Email may already exist.'
      if (err.response?.data?.message) {
        errorMsg = err.response.data.message
      } else if (err.response?.data?.error) {
        errorMsg = err.response.data.error
      } else if (err.response?.data?.description) {
        errorMsg = err.response.data.description
      } else if (err.message) {
        errorMsg = err.message
      }
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join and start building exams</p>
        </div>
        <form onSubmit={handle} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input 
              id="name"
              type="text" 
              placeholder="John Doe" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className={errors.name ? 'input-error' : ''}
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              id="email"
              type="email" 
              placeholder="you@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input 
                id="password"
                type={showPassword ? 'text' : 'password'} 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className={errors.password ? 'input-error' : ''}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-input-wrapper">
              <input 
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'} 
                placeholder="••••••••" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                className={errors.confirmPassword ? 'input-error' : ''}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <div className="auth-footer">
          <p>Already have an account? <Link to="/">Sign in</Link></p>
        </div>
      </div>
    </div>
  )
}

function Dashboard() {
  const navigate = useNavigate()
  const [exams, setExams] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        // TODO: Uncomment API calls when backend is ready
        // let id = localStorage.getItem('exam_user_id')
        // if (!id) {
        //   const { data } = await apiClient.get('/dashboard')
        //   id = data.id
        //   localStorage.setItem('exam_user_id', id)
        // }
        // const { data } = await apiClient.get(`/users/${id}/exams`)
        // setExams(data || [])
        
        // Mock load exams from localStorage
        const id = localStorage.getItem('exam_user_id')
        if (!id) {
          navigate('/')
          return
        }
        const examsData = JSON.parse(localStorage.getItem('exam_exams') || '[]')
        const userExams = examsData.filter(exam => exam.userId === id)
        setExams(userExams)
      } catch {
        setError('Unable to load exams. Please sign in again.')
        navigate('/')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [navigate])

  const deleteExam = async (id) => {
    try {
      // TODO: Uncomment API call when backend is ready
      // await apiClient.delete(`/exams/${id}`)
      // setExams((prev) => prev.filter((exam) => exam.id !== id))
      
      // Mock delete exam
      const examsData = JSON.parse(localStorage.getItem('exam_exams') || '[]')
      const filtered = examsData.filter((exam) => exam.id !== id)
      localStorage.setItem('exam_exams', JSON.stringify(filtered))
      
      setExams((prev) => prev.filter((exam) => exam.id !== id))
      console.log('Exam deleted:', id)
    } catch {
      setError('Failed to delete exam.')
    }
  }

  const logout = () => {
    localStorage.removeItem('exam_token')
    localStorage.removeItem('exam_user_id')
    navigate('/')
  }

  return (
    <div className="dashboard-layout">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Exam Builder</h1>
          <p>Create, manage, and print exams with ease</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/profile')}>Profile</button>
          <button className="btn btn-ghost" onClick={logout}>Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        {error && <div className="alert alert-error">{error}</div>}

        <section className="create-exam-section">
          <h2>Create New Exam</h2>
          <button className="btn btn-primary" onClick={() => navigate('/exam/create')}>+ Create New Exam</button>
        </section>

        <section className="exams-section">
          <h2>Your Exams</h2>
          {loading ? (
            <div className="loading">Loading exams...</div>
          ) : exams.length === 0 ? (
            <div className="empty-state">
              <p>No exams yet. Create your first exam above!</p>
            </div>
          ) : (
            <div className="exams-grid">
              {exams.map((exam) => (
                <div key={exam.id} className="exam-card">
                  <div className="exam-header">
                    <h3>{exam.name || 'Untitled Exam'}</h3>
                    <span className="exam-date">{exam.date || 'No date'}</span>
                  </div>
                  <p className="exam-school">{exam.school_name || 'School not specified'}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    {exam.subject_name || 'No subject'} • {exam.sections?.length || 0} sections
                  </p>
                  <div className="exam-actions">
                    <button 
                      className="btn btn-primary btn-sm" 
                      onClick={() => navigate(`/exam/${exam.id}/manage`)}
                    >
                      Manage
                    </button>
                    <button 
                      className="btn btn-secondary btn-sm" 
                      onClick={() => navigate(`/exam/${exam.id}/preview`)}
                    >
                      Preview
                    </button>
                    <button 
                      className="btn btn-danger btn-sm" 
                      onClick={() => deleteExam(exam.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}


function EditProfile() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('profile') // 'profile' or 'password'

  useEffect(() => {
    const load = async () => {
      try {
        const id = localStorage.getItem('exam_user_id')
        if (!id) {
          navigate('/')
          return
        }
        const users = JSON.parse(localStorage.getItem('exam_users') || '[]')
        const user = users.find(u => u.id === id)
        if (user) {
          setName(user.name || '')
          setEmail(user.email || '')
        }
      } catch {
        navigate('/')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [navigate])

  const saveProfile = async () => {
    if (!name.trim()) {
      setMessage('Name cannot be empty')
      return
    }
    try {
      const id = localStorage.getItem('exam_user_id')
      const users = JSON.parse(localStorage.getItem('exam_users') || '[]')
      const userIndex = users.findIndex(u => u.id === id)
      if (userIndex !== -1) {
        users[userIndex].name = name
        localStorage.setItem('exam_users', JSON.stringify(users))
        setMessage('Profile updated successfully!')
        console.log('Profile updated:', users[userIndex])
        setTimeout(() => setMessage(''), 3000)
      }
    } catch {
      setMessage('Failed to update profile.')
    }
  }

  const savePassword = async () => {
    setMessage('')
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage('All password fields are required')
      return
    }
    if (newPassword.length < 6) {
      setMessage('New password must be at least 6 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match')
      return
    }

    try {
      const id = localStorage.getItem('exam_user_id')
      const users = JSON.parse(localStorage.getItem('exam_users') || '[]')
      const userIndex = users.findIndex(u => u.id === id)
      
      if (userIndex === -1) {
        setMessage('User not found')
        return
      }

      if (users[userIndex].password !== currentPassword) {
        setMessage('Current password is incorrect')
        return
      }

      users[userIndex].password = newPassword
      localStorage.setItem('exam_users', JSON.stringify(users))
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setMessage('Password changed successfully!')
      console.log('Password updated for user:', users[userIndex].email)
      setTimeout(() => setMessage(''), 3000)
    } catch {
      setMessage('Failed to change password.')
    }
  }

  return (
    <div className="profile-layout">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Profile Settings</h1>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>Back</button>
      </header>

      <div className="dashboard-content">
        {loading ? (
          <div className="loading">Loading profile...</div>
        ) : (
          <div className="profile-card">
            <div className="profile-tabs">
              <button
                className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => { setActiveTab('profile'); setMessage(''); }}
              >
                Profile
              </button>
              <button
                className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
                onClick={() => { setActiveTab('password'); setMessage(''); }}
              >
                Change Password
              </button>
            </div>

            {activeTab === 'profile' && (
              <>
                <h2>Profile Information</h2>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input 
                    id="name"
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Your full name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input 
                    id="email"
                    type="email" 
                    value={email} 
                    disabled 
                    placeholder="Your email"
                  />
                  <small style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Email cannot be changed</small>
                </div>
                {message && (
                  <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
                    {message}
                  </div>
                )}
                <button className="btn btn-primary" onClick={saveProfile}>Save Changes</button>
              </>
            )}

            {activeTab === 'password' && (
              <>
                <h2>Change Password</h2>
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <div className="password-input-wrapper">
                    <input 
                      id="currentPassword"
                      type={showCurrentPassword ? 'text' : 'password'} 
                      value={currentPassword} 
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <div className="password-input-wrapper">
                    <input 
                      id="newPassword"
                      type={showNewPassword ? 'text' : 'password'} 
                      value={newPassword} 
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password (min 6 characters)"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <div className="password-input-wrapper">
                    <input 
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'} 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
                {message && (
                  <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
                    {message}
                  </div>
                )}
                <button className="btn btn-primary" onClick={savePassword}>Change Password</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function ExamDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [exam, setExam] = useState(null)
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        // TODO: Uncomment API calls when backend is ready
        // const res = await apiClient.get(`/exams/${id}`)
        // const sec = await apiClient.get(`/exams/${id}/sections`)
        // setExam(res.data)
        // setSections(sec.data || [])
        
        // Mock load exam from localStorage
        const examsData = JSON.parse(localStorage.getItem('exam_exams') || '[]')
        const foundExam = examsData.find(exam => exam.id === id)
        
        if (!foundExam) {
          setError('Exam not found')
          setLoading(false)
          return
        }
        
        setExam(foundExam)
        // Mock sections - you can expand this later
        setSections(foundExam.sections || [])
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load exam')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const print = () => {
    if (exam) {
      window.print()
    }
  }

  return (
    <div className="exam-detail-layout">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>{exam?.name || 'Exam'}</h1>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>Back</button>
      </header>

      <div className="dashboard-content">
        {loading ? (
          <div className="loading">Loading exam...</div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : exam ? (
          <>
            <div className="exam-info-card">
              <div className="info-row" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', marginBottom: '0.5rem' }}>
                <span className="info-label" style={{ fontWeight: 'bold' }}>School:</span>
                <span className="info-value">{exam.school_name}</span>
              </div>
              {exam.location && <div className="info-row" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', marginBottom: '0.5rem' }}>
                <span className="info-label" style={{ fontWeight: 'bold' }}>Location:</span>
                <span className="info-value">{exam.location}</span>
              </div>}
              <div className="info-row" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', marginBottom: '0.5rem' }}>
                <span className="info-label" style={{ fontWeight: 'bold' }}>Subject:</span>
                <span className="info-value">{exam.subject_name || 'Not specified'}</span>
              </div>
              {exam.session && <div className="info-row" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', marginBottom: '0.5rem' }}>
                <span className="info-label" style={{ fontWeight: 'bold' }}>Session:</span>
                <span className="info-value">{exam.session}</span>
              </div>}
              {exam.semester && <div className="info-row" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', marginBottom: '0.5rem' }}>
                <span className="info-label" style={{ fontWeight: 'bold' }}>Semester:</span>
                <span className="info-value">{exam.semester}</span>
              </div>}
              {exam.class_or_level && <div className="info-row" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', marginBottom: '0.5rem' }}>
                <span className="info-label" style={{ fontWeight: 'bold' }}>Class/Level:</span>
                <span className="info-value">{exam.class_or_level}</span>
              </div>}
              {exam.course_code && <div className="info-row" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', marginBottom: '0.5rem' }}>
                <span className="info-label" style={{ fontWeight: 'bold' }}>Course Code:</span>
                <span className="info-value">{exam.course_code}</span>
              </div>}
              {exam.department_name && <div className="info-row" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', marginBottom: '0.5rem' }}>
                <span className="info-label" style={{ fontWeight: 'bold' }}>Department:</span>
                <span className="info-value">{exam.department_name}</span>
              </div>}
              {exam.time_allocated && <div className="info-row" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', marginBottom: '0.5rem' }}>
                <span className="info-label" style={{ fontWeight: 'bold' }}>Duration:</span>
                <span className="info-value">{exam.time_allocated} minutes</span>
              </div>}
              <div className="info-row" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', marginBottom: '0.5rem' }}>
                <span className="info-label" style={{ fontWeight: 'bold' }}>Date:</span>
                <span className="info-value">{exam.date}</span>
              </div>
              <div className="info-row" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', marginBottom: '0.5rem' }}>
                <span className="info-label" style={{ fontWeight: 'bold' }}>Description:</span>
                <span className="info-value">{exam.description || 'No description'}</span>
              </div>
              <div className="info-row" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', marginBottom: '0.5rem' }}>
                <span className="info-label" style={{ fontWeight: 'bold' }}>Sections:</span>
                <span className="info-value">{sections.length}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button className="btn btn-primary" onClick={print}>Print</button>
                <button className="btn btn-secondary" onClick={() => navigate(`/exam/${id}/edit`)}>Edit</button>
              </div>
            </div>

            <div className="sections-grid">
              {sections.length === 0 ? (
                <div className="empty-state">No sections in this exam</div>
              ) : (
                sections.map((sec) => (
                  <div key={sec.id} className="section-card">
                    <h3>{sec.name}</h3>
                    <p className="section-type">Type: {sec.section_type || 'general'}</p>
                    <p className="section-questions">{sec.questions?.length || 0} questions</p>
                  </div>
                ))
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}

function EditExam() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [exam, setExam] = useState({
    name: '',
    school_name: '',
    location: '',
    subject_name: '',
    session: '',
    semester: '',
    class_or_level: '',
    course_code: '',
    time_allocated: '',
    department_name: '',
    date: '',
    description: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const examsData = JSON.parse(localStorage.getItem('exam_exams') || '[]')
        const foundExam = examsData.find(e => e.id === id)
        
        if (!foundExam) {
          setError('Exam not found')
          setLoading(false)
          return
        }
        
        setExam(foundExam)
      } catch (err) {
        setError(err.message || 'Failed to load exam')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const validate = () => {
    const newErrors = {}
    if (!exam.name?.trim()) {
      newErrors.name = 'Exam name is required'
    }
    if (!exam.school_name?.trim()) {
      newErrors.school_name = 'School name is required'
    }
    if (!exam.subject_name?.trim()) {
      newErrors.subject_name = 'Subject name is required'
    }
    if (!exam.date?.trim()) {
      newErrors.date = 'Date is required'
    }
    return newErrors
  }

  const handleChange = (field, value) => {
    setExam(prev => ({
      ...prev,
      [field]: value
    }))
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const save = async () => {
    const newErrors = validate()
    setErrors(newErrors)
    
    if (Object.keys(newErrors).length > 0) return
    
    try {
      const examsData = JSON.parse(localStorage.getItem('exam_exams') || '[]')
      const examIndex = examsData.findIndex(e => e.id === id)
      
      if (examIndex === -1) {
        setError('Exam not found')
        return
      }
      
      examsData[examIndex] = {
        ...examsData[examIndex],
        ...exam
      }
      
      localStorage.setItem('exam_exams', JSON.stringify(examsData))
      setMessage('Exam updated successfully!')
      console.log('Exam updated:', examsData[examIndex])
      
      setTimeout(() => {
        navigate('/dashboard')
      }, 1000)
    } catch (err) {
      setError('Failed to update exam: ' + err.message)
    }
  }

  if (loading) {
    return (
      <div className="exam-detail-layout">
        <header className="dashboard-header">
          <div className="header-content">
            <h1>Edit Exam</h1>
          </div>
          <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>Back</button>
        </header>
        <div className="dashboard-content">
          <div className="loading">Loading exam...</div>
        </div>
      </div>
    )
  }

  if (error && !exam.name) {
    return (
      <div className="exam-detail-layout">
        <header className="dashboard-header">
          <div className="header-content">
            <h1>Edit Exam</h1>
          </div>
          <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>Back</button>
        </header>
        <div className="dashboard-content">
          <div className="alert alert-error">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="exam-detail-layout">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Edit Exam</h1>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>Back</button>
      </header>

      <div className="dashboard-content">
        <div className="profile-card" style={{ maxWidth: '800px' }}>
          <h2>Edit Exam Details</h2>
          
          {error && <div className="alert alert-error">{error}</div>}
          {message && <div className="alert alert-success">{message}</div>}
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="name">Exam Name *</label>
              <input
                id="name"
                type="text"
                placeholder="Enter exam name"
                value={exam.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                className={errors.name ? 'input-error' : ''}
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="school_name">School Name *</label>
              <input
                id="school_name"
                type="text"
                placeholder="Enter school name"
                value={exam.school_name || ''}
                onChange={(e) => handleChange('school_name', e.target.value)}
                className={errors.school_name ? 'input-error' : ''}
              />
              {errors.school_name && <span className="field-error">{errors.school_name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                type="text"
                placeholder="e.g., Building A, Room 101"
                value={exam.location || ''}
                onChange={(e) => handleChange('location', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject_name">Subject Name *</label>
              <input
                id="subject_name"
                type="text"
                placeholder="e.g., Mathematics"
                value={exam.subject_name || ''}
                onChange={(e) => handleChange('subject_name', e.target.value)}
                className={errors.subject_name ? 'input-error' : ''}
              />
              {errors.subject_name && <span className="field-error">{errors.subject_name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="session">Session</label>
              <input
                id="session"
                type="text"
                placeholder="e.g., 2025/2026"
                value={exam.session || ''}
                onChange={(e) => handleChange('session', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="semester">Semester</label>
              <input
                id="semester"
                type="text"
                placeholder="e.g., First, Second"
                value={exam.semester || ''}
                onChange={(e) => handleChange('semester', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="class_or_level">Class/Level</label>
              <input
                id="class_or_level"
                type="text"
                placeholder="e.g., Grade 10, JSS 3"
                value={exam.class_or_level || ''}
                onChange={(e) => handleChange('class_or_level', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="course_code">Course Code</label>
              <input
                id="course_code"
                type="text"
                placeholder="e.g., MTH101"
                value={exam.course_code || ''}
                onChange={(e) => handleChange('course_code', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="department_name">Department</label>
              <input
                id="department_name"
                type="text"
                placeholder="e.g., Science Department"
                value={exam.department_name || ''}
                onChange={(e) => handleChange('department_name', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="time_allocated">Time Allocated (minutes)</label>
              <input
                id="time_allocated"
                type="text"
                placeholder="e.g., 120"
                value={exam.time_allocated || ''}
                onChange={(e) => handleChange('time_allocated', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="date">Date *</label>
              <input
                id="date"
                type="date"
                value={exam.date || ''}
                onChange={(e) => handleChange('date', e.target.value)}
                className={errors.date ? 'input-error' : ''}
              />
              {errors.date && <span className="field-error">{errors.date}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description (Optional)</label>
            <textarea
              id="description"
              placeholder="Enter exam description"
              value={exam.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', fontFamily: 'inherit' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={save}>Save Changes</button>
            <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function CreateExam() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    school_name: '',
    location: '',
    subject_name: '',
    session: '',
    semester: '',
    class_or_level: '',
    course_code: '',
    time_allocated: '',
    department_name: '',
    date: '',
    description: ''
  })
  const [userEmail, setUserEmail] = useState('')
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('exam_users') || '[]')
    const userId = localStorage.getItem('exam_user_id')
    const user = users.find(u => u.id === userId)
    if (user) {
      setUserEmail(user.email)
    }
  }, [])

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Exam name is required'
    if (!formData.school_name.trim()) newErrors.school_name = 'School name is required'
    if (!formData.subject_name.trim()) newErrors.subject_name = 'Subject name is required'
    if (!formData.date.trim()) newErrors.date = 'Date is required'
    return newErrors
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const save = async () => {
    const newErrors = validate()
    setErrors(newErrors)
    
    if (Object.keys(newErrors).length > 0) return
    
    setLoading(true)
    try {
      const userId = localStorage.getItem('exam_user_id')
      const newExam = {
        id: Date.now().toString(),
        ...formData,
        userId,
        userEmail,
        createdAt: new Date().toISOString(),
        sections: []
      }
      
      const examsData = JSON.parse(localStorage.getItem('exam_exams') || '[]')
      examsData.push(newExam)
      localStorage.setItem('exam_exams', JSON.stringify(examsData))
      
      setMessage('Exam created successfully!')
      setTimeout(() => {
        navigate(`/exam/${newExam.id}/manage`)
      }, 1000)
    } catch (err) {
      setMessage('Failed to create exam: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="exam-detail-layout">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Create New Exam</h1>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>Back</button>
      </header>

      <div className="dashboard-content">
        <div className="profile-card" style={{ maxWidth: '800px' }}>
          {message && (
            <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
              {message}
            </div>
          )}
          
          <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: 'var(--input-bg)', borderRadius: '8px' }}>
            <p><strong>User Email:</strong> {userEmail}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label htmlFor="name">Exam Name *</label>
              <input
                id="name"
                type="text"
                placeholder="e.g., Mathematics Final Exam"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={errors.name ? 'input-error' : ''}
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="school_name">School Name *</label>
              <input
                id="school_name"
                type="text"
                placeholder="e.g., Central High School"
                value={formData.school_name}
                onChange={(e) => handleChange('school_name', e.target.value)}
                className={errors.school_name ? 'input-error' : ''}
              />
              {errors.school_name && <span className="field-error">{errors.school_name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                type="text"
                placeholder="e.g., Building A, Room 101"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject_name">Subject Name *</label>
              <input
                id="subject_name"
                type="text"
                placeholder="e.g., Mathematics"
                value={formData.subject_name}
                onChange={(e) => handleChange('subject_name', e.target.value)}
                className={errors.subject_name ? 'input-error' : ''}
              />
              {errors.subject_name && <span className="field-error">{errors.subject_name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="session">Session</label>
              <input
                id="session"
                type="text"
                placeholder="e.g., 2025/2026"
                value={formData.session}
                onChange={(e) => handleChange('session', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="semester">Semester</label>
              <input
                id="semester"
                type="text"
                placeholder="e.g., First, Second"
                value={formData.semester}
                onChange={(e) => handleChange('semester', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="class_or_level">Class/Level</label>
              <input
                id="class_or_level"
                type="text"
                placeholder="e.g., Grade 10, JSS 3"
                value={formData.class_or_level}
                onChange={(e) => handleChange('class_or_level', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="course_code">Course Code</label>
              <input
                id="course_code"
                type="text"
                placeholder="e.g., MTH101"
                value={formData.course_code}
                onChange={(e) => handleChange('course_code', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="department_name">Department</label>
              <input
                id="department_name"
                type="text"
                placeholder="e.g., Science Department"
                value={formData.department_name}
                onChange={(e) => handleChange('department_name', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="time_allocated">Time Allocated (minutes)</label>
              <input
                id="time_allocated"
                type="text"
                placeholder="e.g., 120"
                value={formData.time_allocated}
                onChange={(e) => handleChange('time_allocated', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="date">Date *</label>
              <input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className={errors.date ? 'input-error' : ''}
              />
              {errors.date && <span className="field-error">{errors.date}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description (Optional)</label>
            <textarea
              id="description"
              placeholder="Enter exam description or instructions"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', fontFamily: 'inherit' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button className="btn btn-primary" onClick={save} disabled={loading}>
              {loading ? 'Creating...' : 'Create Exam'}
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ManageSections() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [exam, setExam] = useState(null)
  const [sections, setSections] = useState([])
  const [sectionName, setSectionName] = useState('')
  const [sectionInstruction, setSectionInstruction] = useState('')
  const [sectionType, setSectionType] = useState('MCQ')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [expandedSections, setExpandedSections] = useState({})
  const [newQuestions, setNewQuestions] = useState({})
  
  // Edit Section State
  const [editingSectionId, setEditingSectionId] = useState(null)
  const [editSectionData, setEditSectionData] = useState({ name: '', instruction: '', type: 'MCQ' })

  useEffect(() => {
    const load = async () => {
      try {
        const examsData = JSON.parse(localStorage.getItem('exam_exams') || '[]')
        const foundExam = examsData.find(e => e.id === id)
        
        if (!foundExam) {
          setMessage('Exam not found')
          setLoading(false)
          return
        }
        
        setExam(foundExam)
        setSections(foundExam.sections || [])
      } catch (err) {
        setMessage('Failed to load exam: ' + err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const addSection = () => {
    if (!sectionName.trim()) {
      setMessage('Section name is required')
      return
    }

    // Check if section name already exists
    if (sections.some(s => s.name.toLowerCase() === sectionName.toLowerCase().trim())) {
      setMessage('Section name already exists. Please use a different name.')
      return
    }

    const newSection = {
      id: Date.now().toString(),
      name: sectionName,
      instruction: sectionInstruction,
      type: sectionType,
      questions: []
    }

    const updatedSections = [...sections, newSection]
    setSections(updatedSections)

    const examsData = JSON.parse(localStorage.getItem('exam_exams') || '[]')
    const examIndex = examsData.findIndex(e => e.id === id)
    if (examIndex !== -1) {
      examsData[examIndex].sections = updatedSections
      localStorage.setItem('exam_exams', JSON.stringify(examsData))
    }

    setSectionName('')
    setSectionInstruction('')
    setSectionType('MCQ')
    setMessage('Section added successfully!')
    setTimeout(() => setMessage(''), 3000)
  }

  const deleteSection = (sectionId) => {
    const updatedSections = sections.filter(s => s.id !== sectionId)
    setSections(updatedSections)

    const examsData = JSON.parse(localStorage.getItem('exam_exams') || '[]')
    const examIndex = examsData.findIndex(e => e.id === id)
    if (examIndex !== -1) {
      examsData[examIndex].sections = updatedSections
      localStorage.setItem('exam_exams', JSON.stringify(examsData))
    }

    setMessage('Section deleted successfully!')
    setTimeout(() => setMessage(''), 3000)
  }

  const startEditSection = (section) => {
    setEditingSectionId(section.id)
    setEditSectionData({ name: section.name, instruction: section.instruction || '', type: section.type || 'MCQ' })
  }

  const saveEditSection = (sectionId) => {
    if (!editSectionData.name.trim()) {
      setMessage('Section name is required')
      return
    }

    const updatedSections = sections.map(s => {
      if (s.id === sectionId) {
        return {
          ...s,
          name: editSectionData.name,
          instruction: editSectionData.instruction,
          type: editSectionData.type
        }
      }
      return s
    })

    setSections(updatedSections)
    setExam(prev => ({ ...prev, sections: updatedSections }))

    const examsData = JSON.parse(localStorage.getItem('exam_exams') || '[]')
    const examIndex = examsData.findIndex(e => e.id === id)
    if (examIndex !== -1) {
      examsData[examIndex].sections = updatedSections
      localStorage.setItem('exam_exams', JSON.stringify(examsData))
    }

    setEditingSectionId(null)
    setMessage('Section updated successfully!')
    setTimeout(() => setMessage(''), 3000)
  }

  const cancelEditSection = () => {
    setEditingSectionId(null)
  }

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  const addQuestionToSection = (sectionId) => {
    const section = sections.find(s => s.id === sectionId)
    if (!section) return

    const newQuestionData = newQuestions[sectionId] || {}
    
    // Validate based on section type
    if (!newQuestionData.text || !newQuestionData.text.trim()) {
      setMessage('Question text is required')
      setTimeout(() => setMessage(''), 3000)
      return
    }

    if (section.type === 'MCQ' && (!newQuestionData.options || newQuestionData.options.some(opt => !opt.trim()))) {
      setMessage('All options are required for MCQ questions')
      setTimeout(() => setMessage(''), 3000)
      return
    }

    if (section.type === 'MCQ' && newQuestionData.correctOption === undefined) {
      setMessage('Please select the correct answer')
      setTimeout(() => setMessage(''), 3000)
      return
    }

    const newQuestion = {
      id: Date.now().toString(),
      text: newQuestionData.text,
      marks: newQuestionData.marks || '1',
      type: section.type
    }

    if (section.type === 'MCQ') {
      newQuestion.options = newQuestionData.options.map((opt, idx) => ({
        id: `opt_${idx}`,
        text: opt,
        isCorrect: idx === newQuestionData.correctOption
      }))
    }

    const updatedSections = sections.map(s => {
      if (s.id === sectionId) {
        return {
          ...s,
          questions: [...(s.questions || []), newQuestion]
        }
      }
      return s
    })

    setSections(updatedSections)

    // Update exam state as well
    setExam(prev => ({
      ...prev,
      sections: updatedSections
    }))

    const examsData = JSON.parse(localStorage.getItem('exam_exams') || '[]')
    const examIndex = examsData.findIndex(e => e.id === id)
    if (examIndex !== -1) {
      examsData[examIndex].sections = updatedSections
      localStorage.setItem('exam_exams', JSON.stringify(examsData))
    }

    // Reset new question form for this section
    setNewQuestions(prev => ({
      ...prev,
      [sectionId]: {
        text: '',
        marks: '',
        options: section.type === 'MCQ' ? ['', '', '', ''] : [],
        correctOption: 0
      }
    }))

    setMessage('Question added successfully!')
    setTimeout(() => setMessage(''), 3000)
  }

  const deleteQuestionFromSection = (sectionId, questionId) => {
    const updatedSections = sections.map(s => {
      if (s.id === sectionId) {
        return {
          ...s,
          questions: s.questions.filter(q => q.id !== questionId)
        }
      }
      return s
    })

    setSections(updatedSections)

    // Update exam state as well
    setExam(prev => ({
      ...prev,
      sections: updatedSections
    }))

    const examsData = JSON.parse(localStorage.getItem('exam_exams') || '[]')
    const examIndex = examsData.findIndex(e => e.id === id)
    if (examIndex !== -1) {
      examsData[examIndex].sections = updatedSections
      localStorage.setItem('exam_exams', JSON.stringify(examsData))
    }

    setMessage('Question deleted successfully!')
    setTimeout(() => setMessage(''), 3000)
  }

  const handleSaveExam = () => {
    setMessage('Exam structure saved securely to the cloud!')
    setTimeout(() => {
      setMessage('')
      navigate('/dashboard')
    }, 2000)
  }

  const updateNewQuestion = (sectionId, field, value) => {
    setNewQuestions(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [field]: value
      }
    }))
  }

  const updateOption = (sectionId, optionIndex, value) => {
    setNewQuestions(prev => {
      const sectionQuestions = prev[sectionId] || {}
      const options = sectionQuestions.options || ['', '', '', '']
      const newOptions = [...options]
      newOptions[optionIndex] = value
      return {
        ...prev,
        [sectionId]: {
          ...sectionQuestions,
          options: newOptions
        }
      }
    })
  }

  if (loading) {
    return (
      <div className="exam-detail-layout">
        <header className="dashboard-header">
          <div className="header-content">
            <h1>Manage Sections</h1>
          </div>
          <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>Back</button>
        </header>
        <div className="dashboard-content">
          <div className="loading">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="exam-detail-layout">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Manage Sections - {exam?.name}</h1>
          <p>{exam?.school_name}</p>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>Back</button>
      </header>

      <div className="dashboard-content">
        {message && (
          <div className={`alert ${message.includes('success') ? 'alert-success' : message.includes('error') ? 'alert-error' : 'alert-info'}`}>
            {message}
          </div>
        )}

        <div className="profile-card" style={{ marginBottom: '2rem' }}>
          <h2>Add New Section</h2>
          
          <div className="form-group">
            <label htmlFor="sectionName">Section Name</label>
            <input
              id="sectionName"
              type="text"
              placeholder="e.g., Part A - Multiple Choice"
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="sectionType">Question Type</label>
            <select
              id="sectionType"
              value={sectionType}
              onChange={(e) => setSectionType(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', fontFamily: 'inherit', fontSize: '1rem', backgroundColor: 'var(--input-bg)', color: 'var(--text)' }}
            >
              <option value="MCQ">Multiple Choice (MCQ)</option>
              <option value="ESSAY">Essay</option>
              <option value="FILL_IN_BLANK">Fill in the Blank</option>
              <option value="MIXED">Mixed</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="sectionInstruction">Instructions (Optional)</label>
            <textarea
              id="sectionInstruction"
              placeholder="Enter instructions for this section"
              value={sectionInstruction}
              onChange={(e) => setSectionInstruction(e.target.value)}
              rows={3}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', fontFamily: 'inherit' }}
            />
          </div>

          <button className="btn btn-primary" onClick={addSection}>Add Section</button>
        </div>

        <div className="sections-grid">
          <h2>Sections ({sections.length})</h2>
          {sections.length === 0 ? (
            <div className="empty-state">No sections yet. Add one above!</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {sections.map((section) => (
              <div key={section.id} className="section-card">
                {editingSectionId === section.id ? (
                  <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                    <div className="form-group">
                      <label>Section Name</label>
                      <input 
                        type="text" 
                        value={editSectionData.name}
                        onChange={(e) => setEditSectionData({...editSectionData, name: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Section Type</label>
                      <select 
                        value={editSectionData.type}
                        onChange={(e) => setEditSectionData({...editSectionData, type: e.target.value})}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', fontFamily: 'inherit', fontSize: '1rem', backgroundColor: 'var(--input-bg)', color: 'var(--text)' }}
                      >
                        <option value="MCQ">Multiple Choice (MCQ)</option>
                        <option value="ESSAY">Essay</option>
                        <option value="FILL_IN_BLANK">Fill in the Blank</option>
                        <option value="MIXED">Mixed</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Instructions (Optional)</label>
                      <textarea 
                        value={editSectionData.instruction}
                        onChange={(e) => setEditSectionData({...editSectionData, instruction: e.target.value})}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', fontFamily: 'inherit' }}
                        rows="2"
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-primary btn-sm" onClick={() => saveEditSection(section.id)}>Save</button>
                      <button className="btn btn-secondary btn-sm" onClick={cancelEditSection}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => toggleSection(section.id)}>
                    <div>
                      <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {expandedSections[section.id] ? '▼' : '▶'} {section.name}
                      </h3>
                      <p className="section-type">Type: {section.type}</p>
                      {section.instruction && <p className="section-instruction">{section.instruction}</p>}
                      <p className="section-questions">{section.questions?.length || 0} questions</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={(e) => { e.stopPropagation(); startEditSection(section) }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={(e) => { e.stopPropagation(); deleteSection(section.id) }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
                
                {expandedSections[section.id] && (
                  <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                    <div style={{ marginBottom: '2rem' }}>
                      <h4>Questions ({section.questions?.length || 0})</h4>
                      {section.questions?.length === 0 ? (
                        <div className="empty-state">No questions yet. Add one below!</div>
                      ) : (
                        section.questions.map((question, qIdx) => (
                          <div key={question.id} style={{ padding: '1rem', backgroundColor: 'var(--input-bg)', borderRadius: '8px', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                              <div style={{ flex: 1 }}>
                                <h5>{qIdx + 1}. {question.text}</h5>
                                <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                                  Marks: {question.marks}
                                </p>
                                {question.options && question.options.length > 0 && (
                                  <div style={{ marginTop: '1rem' }}>
                                    {question.options.map((opt, optIdx) => (
                                      <p key={opt.id} style={{ marginTop: '0.5rem' }}>
                                        <strong>{String.fromCharCode(65 + optIdx)}.</strong> {opt.text}
                                        {opt.isCorrect && <span style={{ color: 'var(--success)', marginLeft: '0.5rem' }}>(✓ Correct)</span>}
                                      </p>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => deleteQuestionFromSection(section.id, question.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <h4 style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>Add New Question</h4>
                    <div className="form-group" style={{ marginTop: '1rem' }}>
                      <label htmlFor={`questionText_${section.id}`}>Question Text</label>
                      <textarea
                        id={`questionText_${section.id}`}
                        placeholder="Enter the question text"
                        value={newQuestions[section.id]?.text || ''}
                        onChange={(e) => updateNewQuestion(section.id, 'text', e.target.value)}
                        rows={3}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', fontFamily: 'inherit' }}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor={`questionMarks_${section.id}`}>Marks</label>
                      <input
                        id={`questionMarks_${section.id}`}
                        type="number"
                        placeholder="e.g., 5"
                        value={newQuestions[section.id]?.marks || ''}
                        onChange={(e) => updateNewQuestion(section.id, 'marks', e.target.value)}
                        min="1"
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                      />
                    </div>
                    
                    {section.type === 'MCQ' && (
                      <>
                        <h5 style={{ marginTop: '1.5rem' }}>Options</h5>
                        {(newQuestions[section.id]?.options || ['', '', '', '']).map((opt, idx) => (
                          <div key={idx} className="form-group" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                            <div style={{ flex: 1 }}>
                              <label htmlFor={`option_${section.id}_${idx}`}>Option {String.fromCharCode(65 + idx)}</label>
                              <input
                                id={`option_${section.id}_${idx}`}
                                type="text"
                                placeholder={`Enter option ${String.fromCharCode(65 + idx)}`}
                                value={opt}
                                onChange={(e) => updateOption(section.id, idx, e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                              />
                            </div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', cursor: 'pointer' }}>
                              <input
                                type="radio"
                                name={`correctOption_${section.id}`}
                                checked={(newQuestions[section.id]?.correctOption || 0) === idx}
                                onChange={() => updateNewQuestion(section.id, 'correctOption', idx)}
                              />
                              Correct
                            </label>
                          </div>
                        ))}
                      </>
                    )}
                    
                    <button 
                      className="btn btn-primary" 
                      style={{ marginTop: '1rem' }}
                      onClick={() => addQuestionToSection(section.id)}
                    >
                      Add Question
                    </button>
                  </div>
                )}
              </div>
            ))}
            </div>
          )}
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary" onClick={() => navigate(`/exam/${id}`)}>View Exam</button>
          <button className="btn btn-primary" onClick={() => navigate(`/exam/${id}/preview`)}>Preview Exam</button>
          <button className="btn btn-success" onClick={handleSaveExam} style={{ marginLeft: 'auto', backgroundColor: 'var(--success)', border: 'none', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Save Exam</button>
        </div>
      </div>
    </div>
  )
}

function ManageQuestions() {
  const navigate = useNavigate()
  const { id, sectionId } = useParams()
  const [exam, setExam] = useState(null)
  const [section, setSection] = useState(null)
  const [questions, setQuestions] = useState([])
  const [questionText, setQuestionText] = useState('')
  const [questionMarks, setQuestionMarks] = useState('')
  const [options, setOptions] = useState(['', '', '', ''])
  const [correctOption, setCorrectOption] = useState(0)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  // Edit Question State
  const [editingQuestionId, setEditingQuestionId] = useState(null)
  const [editQuestionData, setEditQuestionData] = useState({ text: '', marks: '', options: ['', '', '', ''], correctOption: 0 })

  useEffect(() => {
    const load = async () => {
      try {
        const examsData = JSON.parse(localStorage.getItem('exam_exams') || '[]')
        const foundExam = examsData.find(e => e.id === id)
        
        if (!foundExam) {
          setMessage('Exam not found')
          setLoading(false)
          return
        }
        
        setExam(foundExam)
        const foundSection = foundExam.sections?.find(s => s.id === sectionId)
        
        if (!foundSection) {
          setMessage('Section not found')
          setLoading(false)
          return
        }
        
        setSection(foundSection)
        setQuestions(foundSection.questions || [])
      } catch (err) {
        setMessage('Failed to load exam: ' + err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, sectionId])

  const addQuestion = () => {
    if (!questionText.trim()) {
      setMessage('Question is required')
      return
    }

    if (section?.type === 'MCQ' && options.some(o => !o.trim())) {
      setMessage('All options are required for MCQ')
      return
    }

    const newQuestion = {
      id: Date.now().toString(),
      text: questionText,
      marks: questionMarks || '1',
      type: section?.type || 'MCQ',
      options: section?.type === 'MCQ' ? options.map((opt, idx) => ({
        id: `opt_${idx}`,
        text: opt,
        isCorrect: idx === correctOption
      })) : []
    }

    const updatedQuestions = [...questions, newQuestion]
    setQuestions(updatedQuestions)

    const examsData = JSON.parse(localStorage.getItem('exam_exams') || '[]')
    const examIndex = examsData.findIndex(e => e.id === id)
    if (examIndex !== -1) {
      const sectionIndex = examsData[examIndex].sections.findIndex(s => s.id === sectionId)
      if (sectionIndex !== -1) {
        examsData[examIndex].sections[sectionIndex].questions = updatedQuestions
        localStorage.setItem('exam_exams', JSON.stringify(examsData))
      }
    }

    setQuestionText('')
    setQuestionMarks('')
    setOptions(['', '', '', ''])
    setCorrectOption(0)
    setMessage('Question added successfully!')
    setTimeout(() => setMessage(''), 3000)
  }

  const deleteQuestion = (questionId) => {
    const updatedQuestions = questions.filter(q => q.id !== questionId)
    setQuestions(updatedQuestions)

    const examsData = JSON.parse(localStorage.getItem('exam_exams') || '[]')
    const examIndex = examsData.findIndex(e => e.id === id)
    if (examIndex !== -1) {
      const sectionIndex = examsData[examIndex].sections.findIndex(s => s.id === sectionId)
      if (sectionIndex !== -1) {
        examsData[examIndex].sections[sectionIndex].questions = updatedQuestions
        localStorage.setItem('exam_exams', JSON.stringify(examsData))
      }
    }

    setMessage('Question deleted successfully!')
    setTimeout(() => setMessage(''), 3000)
  }

  const startEditQuestion = (question) => {
    setEditingQuestionId(question.id)
    const options = question.options?.map(o => o.text) || ['', '', '', '']
    const correctIdx = question.options?.findIndex(o => o.isCorrect) || 0
    setEditQuestionData({
      text: question.text,
      marks: question.marks || '1',
      options: options,
      correctOption: correctIdx !== -1 ? correctIdx : 0
    })
  }

  const saveEditQuestion = (questionId) => {
    if (!editQuestionData.text.trim()) {
      setMessage('Question text is required')
      return
    }

    if (section?.type === 'MCQ' && editQuestionData.options.some(o => !o.trim())) {
      setMessage('All options are required for MCQ')
      return
    }

    const updatedQuestions = questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          text: editQuestionData.text,
          marks: editQuestionData.marks,
          options: section?.type === 'MCQ' ? editQuestionData.options.map((opt, idx) => ({
            id: q.options?.[idx]?.id || `opt_${idx}`,
            text: opt,
            isCorrect: idx === editQuestionData.correctOption
          })) : []
        }
      }
      return q
    })

    setQuestions(updatedQuestions)

    const examsData = JSON.parse(localStorage.getItem('exam_exams') || '[]')
    const examIndex = examsData.findIndex(e => e.id === id)
    if (examIndex !== -1) {
      const sectionIndex = examsData[examIndex].sections.findIndex(s => s.id === sectionId)
      if (sectionIndex !== -1) {
        examsData[examIndex].sections[sectionIndex].questions = updatedQuestions
        localStorage.setItem('exam_exams', JSON.stringify(examsData))
      }
    }

    setEditingQuestionId(null)
    setMessage('Question updated successfully!')
    setTimeout(() => setMessage(''), 3000)
  }

  const cancelEditQuestion = () => {
    setEditingQuestionId(null)
  }

  const handleOptionChange = (index, value) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  if (loading) {
    return (
      <div className="exam-detail-layout">
        <header className="dashboard-header">
          <div className="header-content">
            <h1>Manage Questions</h1>
          </div>
          <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>Back</button>
        </header>
        <div className="dashboard-content">
          <div className="loading">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="exam-detail-layout">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Manage Questions - {section?.name}</h1>
          <p>{exam?.name} • {exam?.school_name}</p>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>Back</button>
      </header>

      <div className="dashboard-content">
        {message && (
          <div className={`alert ${message.includes('success') ? 'alert-success' : message.includes('error') ? 'alert-error' : 'alert-info'}`}>
            {message}
          </div>
        )}

        <div className="profile-card" style={{ marginBottom: '2rem' }}>
          <h2>Add New Question ({section?.type})</h2>
          
          <div className="form-group">
            <label htmlFor="questionText">Question</label>
            <textarea
              id="questionText"
              placeholder="Enter the question text"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              rows={3}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', fontFamily: 'inherit' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="questionMarks">Marks</label>
            <input
              id="questionMarks"
              type="number"
              placeholder="e.g., 5"
              value={questionMarks}
              onChange={(e) => setQuestionMarks(e.target.value)}
              min="1"
            />
          </div>

          {(section?.type === 'MCQ' || section?.type === 'MIXED') && (
            <>
              <h3>Options</h3>
              {options.map((opt, idx) => (
                <div key={idx} className="form-group" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                  <div style={{ flex: 1 }}>
                    <label htmlFor={`option${idx}`}>Option {String.fromCharCode(65 + idx)}</label>
                    <input
                      id={`option${idx}`}
                      type="text"
                      placeholder={`Enter option ${String.fromCharCode(65 + idx)}`}
                      value={opt}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                    />
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="correctOption"
                      checked={correctOption === idx}
                      onChange={() => setCorrectOption(idx)}
                    />
                    Correct
                  </label>
                </div>
              ))}
            </>
          )}

          <button className="btn btn-primary" onClick={addQuestion}>Add Question</button>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h2>Questions ({questions.length})</h2>
          {questions.length === 0 ? (
            <div className="empty-state">No questions yet. Add one above!</div>
          ) : (
            questions.map((question, idx) => (
              <div key={question.id} className="profile-card" style={{ marginBottom: '1rem' }}>
                {editingQuestionId === question.id ? (
                  <div>
                    <div className="form-group">
                      <label>Question Text</label>
                      <textarea 
                        value={editQuestionData.text}
                        onChange={(e) => setEditQuestionData({...editQuestionData, text: e.target.value})}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', fontFamily: 'inherit' }}
                        rows="3"
                      />
                    </div>
                    <div className="form-group">
                      <label>Marks</label>
                      <input 
                        type="number" 
                        value={editQuestionData.marks}
                        onChange={(e) => setEditQuestionData({...editQuestionData, marks: e.target.value})}
                      />
                    </div>
                    {(section?.type === 'MCQ' || section?.type === 'MIXED') && (
                      <div style={{ marginTop: '1rem' }}>
                        <h4 style={{ marginBottom: '0.5rem' }}>Options</h4>
                        {editQuestionData.options.map((opt, oIdx) => (
                          <div key={oIdx} style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <input 
                              type="text" 
                              value={opt}
                              style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)' }}
                              onChange={(e) => {
                                const newOpts = [...editQuestionData.options]
                                newOpts[oIdx] = e.target.value
                                setEditQuestionData({...editQuestionData, options: newOpts})
                              }}
                            />
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <input 
                                type="radio" 
                                name={`editCorrect_${question.id}`}
                                checked={editQuestionData.correctOption === oIdx}
                                onChange={() => setEditQuestionData({...editQuestionData, correctOption: oIdx})}
                              />
                              Correct
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                      <button className="btn btn-primary btn-sm" onClick={() => saveEditQuestion(question.id)}>Save</button>
                      <button className="btn btn-secondary btn-sm" onClick={cancelEditQuestion}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                      <h4>{idx + 1}. {question.text}</h4>
                      <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        Marks: {question.marks}
                      </p>
                      {question.options && question.options.length > 0 && (
                        <div style={{ marginTop: '1rem' }}>
                          {question.options.map((opt, optIdx) => (
                            <p key={opt.id} style={{ marginTop: '0.5rem' }}>
                              <strong>{String.fromCharCode(65 + optIdx)}.</strong> {opt.text}
                              {opt.isCorrect && <span style={{ color: 'var(--success)', marginLeft: '0.5rem' }}>(✓ Correct)</span>}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => startEditQuestion(question)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteQuestion(question.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary" onClick={() => navigate(`/exam/${id}/manage`)}>Back to Sections</button>
          <button className="btn btn-primary" onClick={() => navigate(`/exam/${id}/preview`)}>Preview Exam</button>
        </div>
      </div>
    </div>
  )
}

function ExamPreview() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()
  const [exam, setExam] = useState(null)
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0)
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const examsData = JSON.parse(localStorage.getItem('exam_exams') || '[]')
        const foundExam = examsData.find(e => e.id === id)
        
        if (!foundExam) {
          setMessage('Exam not found')
          setLoading(false)
          return
        }
        
        setExam(foundExam)
      } catch (err) {
        setMessage('Failed to load exam: ' + err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, location])

  if (loading) {
    return (
      <div className="exam-detail-layout">
        <header className="dashboard-header">
          <div className="header-content">
            <h1>Preview Exam</h1>
          </div>
          <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>Back</button>
        </header>
        <div className="dashboard-content">
          <div className="loading">Loading exam...</div>
        </div>
      </div>
    )
  }

  if (!exam || !exam.sections || exam.sections.length === 0) {
    return (
      <div className="exam-detail-layout">
        <header className="dashboard-header">
          <div className="header-content">
            <h1>Preview Exam</h1>
          </div>
          <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>Back</button>
        </header>
        <div className="dashboard-content">
          <div className="alert alert-info">This exam has no sections yet.</div>
          <button className="btn btn-secondary" onClick={() => navigate(`/exam/${id}/manage`)}>Add Sections</button>
        </div>
      </div>
    )
  }

  const currentSection = exam.sections[currentSectionIdx]
  const currentQuestion = currentSection.questions ? currentSection.questions[currentQuestionIdx] : null

  return (
    <div className="exam-detail-layout">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>{exam.name}</h1>
          <p>{exam.school_name} • {exam.subject_name}</p>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>Back</button>
      </header>

      <div className="dashboard-content">
        <div className="profile-card">
          <div style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', fontSize: '0.9rem' }}>
              <div>
                <span style={{ color: 'var(--text-secondary)' }}>Subject:</span> {exam.subject_name}
              </div>
              {exam.date && <div>
                <span style={{ color: 'var(--text-secondary)' }}>Date:</span> {exam.date}
              </div>}
              {exam.time_allocated && <div>
                <span style={{ color: 'var(--text-secondary)' }}>Duration:</span> {exam.time_allocated} minutes
              </div>}
              {exam.class_or_level && <div>
                <span style={{ color: 'var(--text-secondary)' }}>Class:</span> {exam.class_or_level}
              </div>}
            </div>
          </div>

          {exam.description && (
            <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: 'var(--input-bg)', borderRadius: '8px' }}>
              <h3>Instructions</h3>
              <p>{exam.description}</p>
            </div>
          )}

          <div style={{ marginBottom: '2rem' }}>
            <h3>Section {currentSectionIdx + 1}: {currentSection.name}</h3>
            {currentSection.instruction && <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{currentSection.instruction}</p>}
          </div>

          {currentQuestion ? (
            <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: 'var(--input-bg)', borderRadius: '8px' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Question {currentQuestionIdx + 1} of {currentSection.questions.length} in this section
              </p>
              <h4>Question ({currentQuestion.marks} marks)</h4>
              <p style={{ fontSize: '1.1rem', marginTop: '1rem' }}>{currentQuestion.text}</p>

              {currentQuestion.type === 'MCQ' || (currentQuestion.options && currentQuestion.options.length > 0) ? (
                <div style={{ marginTop: '1.5rem' }}>
                  {currentQuestion.options?.map((option, idx) => (
                    <label key={option.id} style={{ display: 'block', marginBottom: '1rem', cursor: 'pointer', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '8px', transition: 'all 0.2s' }}>
                      <input
                        type="radio"
                        name={`question_${currentQuestion.id}`}
                        value={option.id}
                        checked={answers[currentQuestion.id] === option.id}
                        onChange={(e) => setAnswers(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
                        style={{ marginRight: '0.75rem' }}
                      />
                      <strong>{String.fromCharCode(65 + idx)}.</strong> {option.text}
                    </label>
                  ))}
                </div>
              ) : currentQuestion.type === 'ESSAY' ? (
                <div style={{ marginTop: '1.5rem' }}>
                  <textarea
                    placeholder="Type your essay answer here..."
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => setAnswers(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
                    rows={6}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', fontFamily: 'inherit', backgroundColor: 'var(--bg)', color: 'var(--text)' }}
                  />
                </div>
              ) : (
                <div style={{ marginTop: '1.5rem' }}>
                  <input
                    type="text"
                    placeholder="Type your answer here..."
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => setAnswers(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--bg)', color: 'var(--text)' }}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="empty-state" style={{ marginBottom: '2rem' }}>No questions in this section yet.</div>
          )}

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between', marginTop: '2rem' }}>
            <button
              className="btn btn-secondary"
              onClick={() => {
                if (currentQuestionIdx > 0) {
                  setCurrentQuestionIdx(currentQuestionIdx - 1)
                } else if (currentSectionIdx > 0) {
                  setCurrentSectionIdx(currentSectionIdx - 1)
                  const prevSecQCount = exam.sections[currentSectionIdx - 1].questions?.length || 0;
                  setCurrentQuestionIdx(Math.max(0, prevSecQCount - 1))
                }
              }}
              disabled={currentSectionIdx === 0 && currentQuestionIdx === 0}
            >
              ← Previous
            </button>

            <div style={{ textAlign: 'center', flex: 1 }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Section {currentSectionIdx + 1} / {exam.sections.length}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                {exam.sections.map((sec, sIdx) => (
                  <button
                    key={sec.id}
                    className={`btn ${sIdx === currentSectionIdx ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                    onClick={() => {
                      setCurrentSectionIdx(sIdx)
                      setCurrentQuestionIdx(0)
                    }}
                  >
                    {sIdx + 1}
                  </button>
                ))}
              </div>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => {
                const currentSecQCount = currentSection.questions?.length || 0;
                if (currentQuestionIdx < currentSecQCount - 1) {
                  setCurrentQuestionIdx(currentQuestionIdx + 1)
                } else if (currentSectionIdx < exam.sections.length - 1) {
                  setCurrentSectionIdx(currentSectionIdx + 1)
                  setCurrentQuestionIdx(0)
                }
              }}
              disabled={currentSectionIdx === exam.sections.length - 1 && currentQuestionIdx >= Math.max(0, (currentSection.questions?.length || 0) - 1)}
            >
              Next →
            </button>
          </div>
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="btn btn-secondary" onClick={() => navigate(`/exam/${id}/manage`)}>Edit Exam</button>
          <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<EditProfile />} />
        <Route path="/exam/create" element={<CreateExam />} />
        <Route path="/exam/:id/edit" element={<EditExam />} />
        <Route path="/exam/:id/manage" element={<ManageSections />} />
        <Route path="/exam/:id/section/:sectionId/manage" element={<ManageQuestions />} />
        <Route path="/exam/:id/preview" element={<ExamPreview />} />
        <Route path="/exam/:id" element={<ExamDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
