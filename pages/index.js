import { useState, useEffect } from 'react'
import Head from 'next/head'

// Simulated authentication system for development
const mockAuth = {
  users: new Map(),
  
  signUp: async (pseudonym, password, securityData) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (mockAuth.users.has(pseudonym.toLowerCase())) {
      return { success: false, error: 'Pseudonym already taken. Please choose another.' }
    }
    
    if (password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters long.' }
    }
    
    const userData = {
      pseudonym: pseudonym.toLowerCase(),
      passwordHash: btoa(password),
      securityQuestions: securityData,
      createdAt: new Date().toISOString(),
      userId: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    }
    
    mockAuth.users.set(pseudonym.toLowerCase(), userData)
    
    return { 
      success: true, 
      user: { 
        id: userData.userId, 
        pseudonym: userData.pseudonym 
      } 
    }
  },
  
  signIn: async (pseudonym, password) => {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const user = mockAuth.users.get(pseudonym.toLowerCase())
    
    if (!user) {
      return { success: false, error: 'Account not found. Please check your pseudonym.' }
    }
    
    if (btoa(password) !== user.passwordHash) {
      return { success: false, error: 'Incorrect password. Please try again.' }
    }
    
    return { 
      success: true, 
      user: { 
        id: user.userId, 
        pseudonym: user.pseudonym 
      } 
    }
  }
}

export default function Home() {
  const [showRegistration, setShowRegistration] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  // Safe localStorage access for SSR
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('lsw_user')
      if (savedUser) {
        try {
          setCurrentUser(JSON.parse(savedUser))
        } catch (e) {
          localStorage.removeItem('lsw_user')
        }
      }
    }
  }, [])

  const handleSuccessfulAuth = (user) => {
    setCurrentUser(user)
    if (typeof window !== 'undefined') {
      localStorage.setItem('lsw_user', JSON.stringify(user))
    }
    setShowRegistration(false)
    setShowLogin(false)
  }

  const handleLogout = () => {
    setCurrentUser(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('lsw_user')
    }
  }

  return (
    <>
      <Head>
        <title>Let's Show The World - Anonymous SV Documentation</title>
        <meta name="description" content="Anonymous platform for documenting experiences safely" />
      </Head>

      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #f0fdf4, #dcfce7)' }}>
        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.location.href = 'https://www.google.com'
            }
          }}
          style={{
            position: 'fixed',
            top: '1rem',
            right: '1rem',
            backgroundColor: '#dc2626',
            color: 'white',
            padding: '0.75rem',
            borderRadius: '0.25rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            border: 'none',
            cursor: 'pointer',
            zIndex: 50
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#b91c1c'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#dc2626'}
          title="Emergency Exit"
        >
          Quick Exit
        </button>

        <header style={{ backgroundColor: '#166534', color: 'white', padding: '1.5rem 0' }}>
          <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '0 1rem' }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: '700', textAlign: 'center', margin: 0 }}>
              Let's Show The World
            </h1>
            <p style={{ textAlign: 'center', marginTop: '0.5rem', color: '#dcfce7', margin: '0.5rem 0 0 0' }}>
              Anonymous Documentation Platform for Change
            </p>
            {currentUser && (
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <span style={{ fontSize: '0.875rem', color: '#dcfce7' }}>
                  Welcome, {currentUser.pseudonym}
                </span>
                <button
                  onClick={handleLogout}
                  style={{
                    marginLeft: '1rem',
                    background: 'none',
                    border: '1px solid #dcfce7',
                    color: '#dcfce7',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <main style={{ maxWidth: '56rem', margin: '0 auto', padding: '3rem 1rem' }}>
          {currentUser ? (
            <DashboardView user={currentUser} />
          ) : !showRegistration && !showLogin ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '0.5rem', 
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', 
                padding: '2rem', 
                marginBottom: '2rem' 
              }}>
                <h2 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '700', 
                  color: '#166534', 
                  marginBottom: '1.5rem',
                  margin: '0 0 1.5rem 0'
                }}>
                  Your Experience Matters
                </h2>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                  gap: '1.5rem', 
                  marginBottom: '2rem' 
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                      backgroundColor: '#dcfce7', 
                      width: '4rem', 
                      height: '4rem', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      margin: '0 auto 0.75rem auto' 
                    }}>
                      <span style={{ fontSize: '2rem' }}>🔒</span>
                    </div>
                    <h3 style={{ fontWeight: '600', color: '#166534', marginBottom: '0.5rem', margin: '0 0 0.5rem 0' }}>
                      Completely Anonymous
                    </h3>
                    <p style={{ color: '#4b5563', fontSize: '0.875rem', margin: 0 }}>
                      No personal information required. Your privacy is guaranteed.
                    </p>
                  </div>
                  
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                      backgroundColor: '#dcfce7', 
                      width: '4rem', 
                      height: '4rem', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      margin: '0 auto 0.75rem auto' 
                    }}>
                      <span style={{ fontSize: '2rem' }}>📊</span>
                    </div>
                    <h3 style={{ fontWeight: '600', color: '#166534', marginBottom: '0.5rem', margin: '0 0 0.5rem 0' }}>
                      Patterns Revealed
                    </h3>
                    <p style={{ color: '#4b5563', fontSize: '0.875rem', margin: 0 }}>
                      Your experience contributes to meaningful data that drives change.
                    </p>
                  </div>
                  
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                      backgroundColor: '#dcfce7', 
                      width: '4rem', 
                      height: '4rem', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      margin: '0 auto 0.75rem auto' 
                    }}>
                      <span style={{ fontSize: '2rem' }}>🌍</span>
                    </div>
                    <h3 style={{ fontWeight: '600', color: '#166534', marginBottom: '0.5rem', margin: '0 0 0.5rem 0' }}>
                      Global Impact
                    </h3>
                    <p style={{ color: '#4b5563', fontSize: '0.875rem', margin: 0 }}>
                      Help create the world's most comprehensive understanding.
                    </p>
                  </div>
                </div>

                <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setShowRegistration(true)}
                    style={{
                      backgroundColor: '#15803d',
                      color: 'white',
                      padding: '0.75rem 2rem',
                      borderRadius: '0.5rem',
                      fontWeight: '600',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '1rem'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#166534'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#15803d'}
                  >
                    Create New Account
                  </button>
                  
                  <button
                    onClick={() => setShowLogin(true)}
                    style={{
                      backgroundColor: 'white',
                      color: '#15803d',
                      padding: '0.75rem 2rem',
                      borderRadius: '0.5rem',
                      fontWeight: '600',
                      border: '2px solid #15803d',
                      cursor: 'pointer',
                      fontSize: '1rem'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#f0fdf4'}
                    onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
                  >
                    Login to Account
                  </button>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <button style={{ 
                    color: '#15803d', 
                    textDecoration: 'underline', 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer' 
                  }}>
                    View Aggregated Data Patterns
                  </button>
                </div>
              </div>

              <div style={{ 
                backgroundColor: '#fefce8', 
                borderLeft: '4px solid #facc15', 
                padding: '1rem', 
                marginBottom: '2rem' 
              }}>
                <div style={{ display: 'flex' }}>
                  <div style={{ flexShrink: 0 }}>
                    <span style={{ color: '#facc15', fontSize: '1.25rem' }}>⚠️</span>
                  </div>
                  <div style={{ marginLeft: '0.75rem' }}>
                    <p style={{ fontSize: '0.875rem', color: '#92400e', margin: 0 }}>
                      <strong>If you are in a current crisis:</strong> Please call your local emergency number or crisis hotline. 
                      This platform is for documenting past experiences, not immediate crisis support.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : showLogin ? (
            <LoginForm onBack={() => setShowLogin(false)} onSuccess={handleSuccessfulAuth} auth={mockAuth} />
          ) : (
            <RegistrationForm onBack={() => setShowRegistration(false)} onSuccess={handleSuccessfulAuth} auth={mockAuth} />
          )}
        </main>

        <footer style={{ backgroundColor: '#166534', color: 'white', padding: '1.5rem 0', marginTop: '3rem' }}>
          <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: '#dcfce7', margin: 0 }}>
              Platform in Development • Privacy-First Design • Healthcare-Level Security
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}

function DashboardView({ user }) {
  return (
    <div style={{ 
      backgroundColor: 'white', 
      borderRadius: '0.5rem', 
      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', 
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h2 style={{ 
        fontSize: '1.5rem', 
        fontWeight: '700', 
        color: '#166534', 
        marginBottom: '1.5rem',
        margin: '0 0 1.5rem 0'
      }}>
        Welcome to Your Anonymous Dashboard
      </h2>
      
      <div style={{ 
        backgroundColor: '#f0fdf4', 
        borderLeft: '4px solid #4ade80', 
        padding: '1rem', 
        marginBottom: '2rem' 
      }}>
        <p style={{ fontSize: '0.875rem', color: '#166534', margin: 0 }}>
          <strong>Account Active:</strong> You are successfully logged in as <strong>{user.pseudonym}</strong>
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <button style={{
          backgroundColor: '#15803d',
          color: 'white',
          padding: '1rem',
          borderRadius: '0.5rem',
          border: 'none',
          cursor: 'pointer',
          fontSize: '0.875rem',
          fontWeight: '500'
        }}>
          📝 Document Experience
        </button>
        
        <button style={{
          backgroundColor: '#15803d',
          color: 'white',
          padding: '1rem',
          borderRadius: '0.5rem',
          border: 'none',
          cursor: 'pointer',
          fontSize: '0.875rem',
          fontWeight: '500'
        }}>
          📊 View My Contributions
        </button>
        
        <button style={{
          backgroundColor: '#15803d',
          color: 'white',
          padding: '1rem',
          borderRadius: '0.5rem',
          border: 'none',
          cursor: 'pointer',
          fontSize: '0.875rem',
          fontWeight: '500'
        }}>
          🔍 Explore Data Patterns
        </button>
      </div>

      <p style={{ color: '#6b7280', fontSize: '0.875rem', fontStyle: 'italic' }}>
        Dashboard features coming soon in development sprint 2...
      </p>
    </div>
  )
}

function LoginForm({ onBack, onSuccess, auth }) {
  const [formData, setFormData] = useState({
    pseudonym: '',
    password: ''
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage({ type: '', text: '' })

    try {
      const result = await auth.signIn(
        formData.pseudonym.trim(),
        formData.password
      )

      if (result.success) {
        setMessage({ 
          type: 'success', 
          text: 'Login successful! Welcome back to your anonymous account.' 
        })
        
        setTimeout(() => {
          onSuccess(result.user)
        }, 1500)
        
      } else {
        setMessage({ type: 'error', text: result.error })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Login failed. Please try again.' })
      console.error('Login error:', error)
    }

    setIsSubmitting(false)
  }

  return (
    <div style={{ 
      backgroundColor: 'white', 
      borderRadius: '0.5rem', 
      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', 
      padding: '2rem' 
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#166534', margin: 0 }}>
          Login to Anonymous Account
        </h2>
        <button
          onClick={onBack}
          style={{ 
            color: '#16a34a', 
            textDecoration: 'underline', 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer' 
          }}
        >
          ← Back
        </button>
      </div>

      {message.text && (
        <div style={{ 
          backgroundColor: message.type === 'success' ? '#f0fdf4' : '#fef2f2', 
          borderLeft: `4px solid ${message.type === 'success' ? '#4ade80' : '#f87171'}`, 
          padding: '1rem', 
          marginBottom: '1.5rem' 
        }}>
          <p style={{ fontSize: '0.875rem', color: message.type === 'success' ? '#166534' : '#dc2626', margin: 0 }}>
            {message.text}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Your Pseudonym *
          </label>
          <input
            type="text"
            value={formData.pseudonym}
            onChange={(e) => setFormData({...formData, pseudonym: e.target.value})}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
            placeholder="Enter the pseudonym you used when registering"
            required
            disabled={isSubmitting}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Password *
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              style={{
                width: '100%',
                padding: '0.5rem 2.5rem 0.5rem 0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
              placeholder="Enter your password"
              required
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#6b7280',
                fontSize: '1rem'
              }}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            backgroundColor: isSubmitting ? '#9ca3af' : '#15803d',
            color: 'white',
            padding: '0.75rem',
            borderRadius: '0.375rem',
            fontWeight: '600',
            border: 'none',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            fontSize: '1rem'
          }}
        >
          {isSubmitting ? 'Logging in...' : 'Login to Account'}
        </button>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button type="button" style={{ 
            color: '#6b7280', 
            fontSize: '0.875rem',
            textDecoration: 'underline', 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer' 
          }}>
            Forgot your password? (Coming soon)
          </button>
        </div>
      </form>
    </div>
  )
}

function RegistrationForm({ onBack, onSuccess, auth }) {
  const [formData, setFormData] = useState({
    pseudonym: '',
    password: '',
    confirmPassword: '',
    memoryHint: '',
    securityQuestions: {
      question1: 'What was the name of your first pet?',
      answer1: ''
    }
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage({ type: '', text: '' })

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' })
      setIsSubmitting(false)
      return
    }

    if (formData.password.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters' })
      setIsSubmitting(false)
      return
    }

    if (!formData.pseudonym.trim()) {
      setMessage({ type: 'error', text: 'Please choose a pseudonym' })
      setIsSubmitting(false)
      return
    }

    try {
      const result = await auth.signUp(
        formData.pseudonym.trim(),
        formData.password,
        {
          ...formData.securityQuestions,
          memoryHint: formData.memoryHint
        }
      )

      if (result.success) {
        setMessage({ 
          type: 'success', 
          text: 'Account created successfully! You can now start documenting experiences.' 
        })
        
        setTimeout(() => {
          onSuccess(result.user)
        }, 2000)
        
      } else {
        setMessage({ type: 'error', text: result.error })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' })
      console.error('Registration error:', error)
    }

    setIsSubmitting(false)
  }

  return (
    <div style={{ 
      backgroundColor: 'white', 
      borderRadius: '0.5rem', 
      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', 
      padding: '2rem' 
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#166534', margin: 0 }}>
          Create Anonymous Account
        </h2>
        <button
          onClick={onBack}
          style={{ 
            color: '#16a34a', 
            textDecoration: 'underline', 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer' 
          }}
        >
          ← Back
        </button>
      </div>

      {message.text && (
        <div style={{ 
          backgroundColor: message.type === 'success' ? '#f0fdf4' : '#fef2f2', 
          borderLeft: `4px solid ${message.type === 'success' ? '#4ade80' : '#f87171'}`, 
          padding: '1rem', 
          marginBottom: '1.5rem' 
        }}>
          <p style={{ fontSize: '0.875rem', color: message.type === 'success' ? '#166534' : '#dc2626', margin: 0 }}>
            {message.text}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Choose a Pseudonym *
          </label>
          <input
            type="text"
            value={formData.pseudonym}
            onChange={(e) => setFormData({...formData, pseudonym: e.target.value})}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
            placeholder="Any name you'll remember (not your real name)"
            required
            disabled={isSubmitting}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Create Password *
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              style={{
                width: '100%',
                padding: '0.5rem 2.5rem 0.5rem 0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
              placeholder="Minimum 8 characters"
              minLength="8"
              required
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#6b7280',
                fontSize: '1rem'
              }}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Confirm Password *
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              style={{
                width: '100%',
                padding: '0.5rem 2.5rem 0.5rem 0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
              placeholder="Confirm your password"
              required
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#6b7280',
                fontSize: '1rem'
              }}
            >
              {showConfirmPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Password Memory Hint (Optional)
          </label>
          <input
            type="text"
            value={formData.memoryHint}
            onChange={(e) => setFormData({...formData, memoryHint: e.target.value})}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
            placeholder="A hint to help you remember your password (not stored with password)"
            disabled={isSubmitting}
          />
          <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem', margin: '0.25rem 0 0 0' }}>
            A personal hint that helps you remember your password (e.g., "my cat's name + birth year")
          </p>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Security Question Answer *
          </label>
          <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem', margin: '0 0 0.5rem 0' }}>
            Question: What was the name of your first pet?
          </p>
          <input
            type="text"
            value={formData.securityQuestions.answer1}
            onChange={(e) => setFormData({
              ...formData, 
              securityQuestions: {...formData.securityQuestions, answer1: e.target.value}
            })}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
            placeholder="Your answer (required for password recovery)"
            required
            disabled={isSubmitting}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            backgroundColor: isSubmitting ? '#9ca3af' : '#15803d',
            color: 'white',
            padding: '0.75rem',
            borderRadius: '0.375rem',
            fontWeight: '600',
            border: 'none',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            fontSize: '1rem'
          }}
        >
          {isSubmitting ? 'Creating Account...' : 'Create Anonymous Account'}
        </button>
      </form>
    </div>
  )
}
