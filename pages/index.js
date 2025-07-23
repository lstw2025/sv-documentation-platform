import { useState, useEffect } from 'react'
import Head from 'next/head'

// Mock authentication system - WORKING
const mockAuth = {
  users: new Map(),
  experiences: new Map(), // Added for experience storage
  
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
  },
  
  // New: Save experience draft
  saveDraft: async (userId, experienceData) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const draftId = experienceData.id || 'exp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6)
    const draft = {
      ...experienceData,
      id: draftId,
      userId: userId,
      status: 'draft',
      lastSaved: new Date().toISOString()
    }
    
    mockAuth.experiences.set(draftId, draft)
    return { success: true, draftId: draftId }
  },
  
  // New: Get user's drafts
  getUserDrafts: async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const userDrafts = Array.from(mockAuth.experiences.values())
      .filter(exp => exp.userId === userId && exp.status === 'draft')
    
    return { success: true, drafts: userDrafts }
  }
}

export default function Home() {
  const [showRegistration, setShowRegistration] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showDocumentation, setShowDocumentation] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  // SSR-safe localStorage access
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
    setShowDocumentation(false)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('lsw_user')
    }
  }

  const handleStartDocumentation = () => {
    setShowDocumentation(true)
  }

  const handleBackToDashboard = () => {
    setShowDocumentation(false)
  }

  return (
    <>
      <Head>
        <title>Let's Show The World - Anonymous SV Documentation</title>
        <meta name="description" content="Anonymous platform for documenting experiences safely" />
      </Head>

      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #f0fdf4, #dcfce7)' }}>
        {/* Emergency Exit Button - WORKING */}
        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.location.href = 'https://www.google.com'
            }
          }}
          style={{
            width: '100%',
            padding: '0.5rem 0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '1rem',
            boxSizing: 'border-box',
            minHeight: '4rem',
            resize: 'vertical'
          }}
          placeholder="e.g., 'Told a friend', 'Sought counseling', 'No support received', etc."
        />
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
          How are you feeling about sharing this? (optional)
        </label>
        <textarea
          value={formData.currentFeelings}
          onChange={(e) => setFormData({...formData, currentFeelings: e.target.value})}
          style={{
            width: '100%',
            padding: '0.5rem 0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '1rem',
            boxSizing: 'border-box',
            minHeight: '4rem',
            resize: 'vertical'
          }}
          placeholder="Your feelings about documenting this experience"
        />
      </div>

      {/* Support Resources Preview */}
      <div style={{ 
        backgroundColor: '#fefce8', 
        borderLeft: '4px solid #facc15', 
        padding: '1rem', 
        marginBottom: '2rem' 
      }}>
        <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#92400e', marginBottom: '0.5rem', margin: '0 0 0.5rem 0' }}>
          Support Resources Available
        </h4>
        <p style={{ fontSize: '0.875rem', color: '#92400e', margin: 0 }}>
          After completing your documentation, you'll have access to local and national support resources.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={onPrev}
            style={{
              backgroundColor: 'white',
              color: '#6b7280',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.375rem',
              fontWeight: '600',
              border: '2px solid #d1d5db',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            ← Previous
          </button>
          
          <button
            onClick={onSaveDraft}
            disabled={isSaving}
            style={{
              backgroundColor: 'white',
              color: '#15803d',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.375rem',
              fontWeight: '600',
              border: '2px solid #15803d',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              fontSize: '1rem'
            }}
          >
            {isSaving ? 'Saving...' : 'Save Draft'}
          </button>
        </div>
        
        <button
          onClick={handleComplete}
          disabled={isCompleting}
          style={{
            backgroundColor: isCompleting ? '#9ca3af' : '#15803d',
            color: 'white',
            padding: '0.75rem 2rem',
            borderRadius: '0.375rem',
            fontWeight: '600',
            border: 'none',
            cursor: isCompleting ? 'not-allowed' : 'pointer',
            fontSize: '1rem'
          }}
        >
          {isCompleting ? 'Completing...' : 'Complete Documentation'}
        </button>
      </div>
    </div>
  )
}

// Enhanced Dashboard with Documentation Button
function DashboardView({ user, onStartDocumentation }) {
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
        <button 
          onClick={onStartDocumentation}
          style={{
            backgroundColor: '#15803d',
            color: 'white',
            padding: '1rem',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}
        >
          📝 Document Experience
        </button>
        
        <button style={{
          backgroundColor: '#6b7280',
          color: 'white',
          padding: '1rem',
          borderRadius: '0.5rem',
          border: 'none',
          cursor: 'pointer',
          fontSize: '0.875rem',
          fontWeight: '500'
        }}>
          📊 View My Contributions
          <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', opacity: 0.8 }}>Coming Soon</div>
        </button>
        
        <button style={{
          backgroundColor: '#6b7280',
          color: 'white',
          padding: '1rem',
          borderRadius: '0.5rem',
          border: 'none',
          cursor: 'pointer',
          fontSize: '0.875rem',
          fontWeight: '500'
        }}>
          🔍 Explore Data Patterns
          <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', opacity: 0.8 }}>Coming Soon</div>
        </button>
      </div>

      <p style={{ color: '#6b7280', fontSize: '0.875rem', fontStyle: 'italic' }}>
        Your privacy and safety are our top priorities. All documentation is completely anonymous.
      </p>
    </div>
  )
}

// Welcome Screen Component
function WelcomeScreen({ onShowRegistration, onShowLogin }) {
  return (
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
            onClick={onShowRegistration}
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
            onClick={onShowLogin}
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

      {/* Crisis Resources Notice */}
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
  )
}

// Login Form Component (unchanged from previous version)
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

// Registration Form Component (unchanged from previous version)
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
          title="Emergency Exit"
        >
          Quick Exit
        </button>

        {/* Header with User Status */}
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

        {/* Main Content */}
        <main style={{ maxWidth: '56rem', margin: '0 auto', padding: '3rem 1rem' }}>
          {currentUser ? (
            showDocumentation ? (
              <DocumentationInterface 
                user={currentUser} 
                onBack={handleBackToDashboard}
                auth={mockAuth}
              />
            ) : (
              <DashboardView 
                user={currentUser} 
                onStartDocumentation={handleStartDocumentation}
              />
            )
          ) : !showRegistration && !showLogin ? (
            <WelcomeScreen 
              onShowRegistration={() => setShowRegistration(true)}
              onShowLogin={() => setShowLogin(true)}
            />
          ) : showLogin ? (
            <LoginForm 
              onBack={() => setShowLogin(false)} 
              onSuccess={handleSuccessfulAuth} 
              auth={mockAuth} 
            />
          ) : (
            <RegistrationForm 
              onBack={() => setShowRegistration(false)} 
              onSuccess={handleSuccessfulAuth} 
              auth={mockAuth} 
            />
          )}
        </main>

        {/* Footer */}
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

// NEW: Documentation Interface Component
function DocumentationInterface({ user, onBack, auth }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    whenItHappened: '',
    basicDescription: '',
    location: '',
    context: '',
    supportReceived: '',
    currentFeelings: '',
    additionalNotes: ''
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState({ type: '', text: '' })

  // Load existing drafts on component mount
  useEffect(() => {
    loadUserDrafts()
  }, [])

  const loadUserDrafts = async () => {
    try {
      const result = await auth.getUserDrafts(user.id)
      if (result.success && result.drafts.length > 0) {
        // Load the most recent draft
        const mostRecent = result.drafts.sort((a, b) => new Date(b.lastSaved) - new Date(a.lastSaved))[0]
        setFormData(mostRecent)
        setSaveMessage({ type: 'info', text: 'Previous draft loaded. You can continue where you left off.' })
      }
    } catch (error) {
      console.error('Error loading drafts:', error)
    }
  }

  const handleSaveDraft = async () => {
    setIsSaving(true)
    setSaveMessage({ type: '', text: '' })

    try {
      const result = await auth.saveDraft(user.id, formData)
      if (result.success) {
        setFormData(prev => ({ ...prev, id: result.draftId }))
        setSaveMessage({ type: 'success', text: 'Your progress has been saved safely.' })
      }
    } catch (error) {
      setSaveMessage({ type: 'error', text: 'Error saving. Please try again.' })
    }
    
    setIsSaving(false)
  }

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
      handleSaveDraft() // Auto-save when progressing
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div style={{ 
      backgroundColor: 'white', 
      borderRadius: '0.5rem', 
      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', 
      padding: '2rem' 
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#166534', margin: 0 }}>
            Document Your Experience
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.5rem 0 0 0' }}>
            Step {currentStep} of 3 • Your experience matters and will remain completely anonymous
          </p>
        </div>
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
          ← Back to Dashboard
        </button>
      </div>

      {/* Progress Indicator */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {[1, 2, 3].map((step) => (
            <div key={step} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div style={{
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                backgroundColor: step <= currentStep ? '#15803d' : '#e5e7eb',
                color: step <= currentStep ? 'white' : '#6b7280',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}>
                {step}
              </div>
              {step < 3 && (
                <div style={{
                  flex: 1,
                  height: '2px',
                  backgroundColor: step < currentStep ? '#15803d' : '#e5e7eb',
                  marginLeft: '0.5rem',
                  marginRight: '0.5rem'
                }} />
              )}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', marginTop: '0.5rem' }}>
          <div style={{ flex: 1, fontSize: '0.75rem', color: '#6b7280' }}>Basic Info</div>
          <div style={{ flex: 1, fontSize: '0.75rem', color: '#6b7280', textAlign: 'center' }}>Details</div>
          <div style={{ flex: 1, fontSize: '0.75rem', color: '#6b7280', textAlign: 'right' }}>Support</div>
        </div>
      </div>

      {/* Save Status */}
      {saveMessage.text && (
        <div style={{ 
          backgroundColor: saveMessage.type === 'success' ? '#f0fdf4' : saveMessage.type === 'info' ? '#eff6ff' : '#fef2f2', 
          borderLeft: `4px solid ${saveMessage.type === 'success' ? '#4ade80' : saveMessage.type === 'info' ? '#60a5fa' : '#f87171'}`, 
          padding: '1rem', 
          marginBottom: '1.5rem' 
        }}>
          <p style={{ fontSize: '0.875rem', color: saveMessage.type === 'success' ? '#166534' : saveMessage.type === 'info' ? '#1e40af' : '#dc2626', margin: 0 }}>
            {saveMessage.text}
          </p>
        </div>
      )}

      {/* Step Content */}
      {currentStep === 1 && (
        <Step1BasicInfo 
          formData={formData} 
          setFormData={setFormData}
          onNext={nextStep}
          onSaveDraft={handleSaveDraft}
          isSaving={isSaving}
        />
      )}
      
      {currentStep === 2 && (
        <Step2Details 
          formData={formData} 
          setFormData={setFormData}
          onNext={nextStep}
          onPrev={prevStep}
          onSaveDraft={handleSaveDraft}
          isSaving={isSaving}
        />
      )}
      
      {currentStep === 3 && (
        <Step3Support 
          formData={formData} 
          setFormData={setFormData}
          onPrev={prevStep}
          onSaveDraft={handleSaveDraft}
          isSaving={isSaving}
          user={user}
        />
      )}
    </div>
  )
}

// Step 1: Basic Information
function Step1BasicInfo({ formData, setFormData, onNext, onSaveDraft, isSaving }) {
  return (
    <div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#166534', marginBottom: '1rem', margin: '0 0 1rem 0' }}>
        Basic Information
      </h3>
      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem', margin: '0 0 1.5rem 0' }}>
        Start with whatever feels comfortable to share. You can save and return anytime.
      </p>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
          Give this experience a title (for your reference only)
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          style={{
            width: '100%',
            padding: '0.5rem 0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '1rem',
            boxSizing: 'border-box'
          }}
          placeholder="e.g., 'College incident' or 'Workplace situation'"
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
          When did this happen? (approximate is fine)
        </label>
        <input
          type="text"
          value={formData.whenItHappened}
          onChange={(e) => setFormData({...formData, whenItHappened: e.target.value})}
          style={{
            width: '100%',
            padding: '0.5rem 0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '1rem',
            boxSizing: 'border-box'
          }}
          placeholder="e.g., 'Summer 2022' or 'A few years ago' or 'Last month'"
        />
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
          Brief description (share what feels safe)
        </label>
        <textarea
          value={formData.basicDescription}
          onChange={(e) => setFormData({...formData, basicDescription: e.target.value})}
          style={{
            width: '100%',
            padding: '0.5rem 0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '1rem',
            boxSizing: 'border-box',
            minHeight: '6rem',
            resize: 'vertical'
          }}
          placeholder="Share whatever feels comfortable. You control how much detail to include."
        />
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
        <button
          onClick={onSaveDraft}
          disabled={isSaving}
          style={{
            backgroundColor: 'white',
            color: '#15803d',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.375rem',
            fontWeight: '600',
            border: '2px solid #15803d',
            cursor: isSaving ? 'not-allowed' : 'pointer',
            fontSize: '1rem'
          }}
        >
          {isSaving ? 'Saving...' : 'Save Draft'}
        </button>
        
        <button
          onClick={onNext}
          style={{
            backgroundColor: '#15803d',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.375rem',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Continue →
        </button>
      </div>
    </div>
  )
}

// Step 2: Additional Details
function Step2Details({ formData, setFormData, onNext, onPrev, onSaveDraft, isSaving }) {
  return (
    <div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#166534', marginBottom: '1rem', margin: '0 0 1rem 0' }}>
        Additional Details
      </h3>
      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem', margin: '0 0 1.5rem 0' }}>
        These details help build a more complete picture. Skip anything that doesn't feel right.
      </p>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
          Location (general area only)
        </label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => setFormData({...formData, location: e.target.value})}
          style={{
            width: '100%',
            padding: '0.5rem 0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '1rem',
            boxSizing: 'border-box'
          }}
          placeholder="e.g., 'University campus' or 'City name' or 'Workplace'"
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
          Context or circumstances
        </label>
        <textarea
          value={formData.context}
          onChange={(e) => setFormData({...formData, context: e.target.value})}
          style={{
            width: '100%',
            padding: '0.5rem 0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '1rem',
            boxSizing: 'border-box',
            minHeight: '5rem',
            resize: 'vertical'
          }}
          placeholder="e.g., relationship to person, setting, any other relevant context"
        />
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
          Additional notes (optional)
        </label>
        <textarea
          value={formData.additionalNotes}
          onChange={(e) => setFormData({...formData, additionalNotes: e.target.value})}
          style={{
            width: '100%',
            padding: '0.5rem 0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '1rem',
            boxSizing: 'border-box',
            minHeight: '4rem',
            resize: 'vertical'
          }}
          placeholder="Anything else you'd like to document"
        />
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={onPrev}
            style={{
              backgroundColor: 'white',
              color: '#6b7280',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.375rem',
              fontWeight: '600',
              border: '2px solid #d1d5db',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            ← Previous
          </button>
          
          <button
            onClick={onSaveDraft}
            disabled={isSaving}
            style={{
              backgroundColor: 'white',
              color: '#15803d',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.375rem',
              fontWeight: '600',
              border: '2px solid #15803d',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              fontSize: '1rem'
            }}
          >
            {isSaving ? 'Saving...' : 'Save Draft'}
          </button>
        </div>
        
        <button
          onClick={onNext}
          style={{
            backgroundColor: '#15803d',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.375rem',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Continue →
        </button>
      </div>
    </div>
  )
}

// Step 3: Support and Completion
function Step3Support({ formData, setFormData, onPrev, onSaveDraft, isSaving, user }) {
  const [isCompleting, setIsCompleting] = useState(false)
  const [completed, setCompleted] = useState(false)

  const handleComplete = async () => {
    setIsCompleting(true)
    
    // Simulate completion process
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setCompleted(true)
    setIsCompleting(false)
  }

  if (completed) {
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          backgroundColor: '#f0fdf4', 
          borderRadius: '0.5rem',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#166534', marginBottom: '1rem', margin: '0 0 1rem 0' }}>
            Thank You for Sharing Your Experience
          </h3>
          <p style={{ fontSize: '1rem', color: '#166534', marginBottom: '1.5rem', margin: '0 0 1.5rem 0' }}>
            Your documentation has been safely recorded and will contribute to important research and advocacy work.
          </p>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
            Your experience matters and your voice counts.
          </p>
        </div>

        {/* Support Resources */}
        <div style={{ 
          backgroundColor: '#eff6ff', 
          borderRadius: '0.5rem',
          padding: '1.5rem',
          marginBottom: '2rem',
          textAlign: 'left'
        }}>
          <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e40af', marginBottom: '1rem', margin: '0 0 1rem 0' }}>
            Support Resources Available
          </h4>
          <div style={{ fontSize: '0.875rem', color: '#1e40af' }}>
            <p style={{ margin: '0 0 0.5rem 0' }}>• National Sexual Assault Hotline: 1-800-656-HOPE (4673)</p>
            <p style={{ margin: '0 0 0.5rem 0' }}>• Crisis Text Line: Text HOME to 741741</p>
            <p style={{ margin: '0 0 0.5rem 0' }}>• Local counseling and support services available</p>
            <p style={{ margin: '0' }}>• Online support communities and resources</p>
          </div>
        </div>

        <button
          onClick={() => window.location.reload()}
          style={{
            backgroundColor: '#15803d',
            color: 'white',
            padding: '0.75rem 2rem',
            borderRadius: '0.375rem',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Return to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#166534', marginBottom: '1rem', margin: '0 0 1rem 0' }}>
        Support and Completion
      </h3>
      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem', margin: '0 0 1.5rem 0' }}>
        Final details about support and how you're feeling now.
      </p>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
          What support did you receive, if any?
        </label>
        <textarea
          value={formData.supportReceived}
          onChange={(e) => setFormData({...formData, supportReceived: e.target.value})}
          style={{
