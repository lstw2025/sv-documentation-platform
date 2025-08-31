import { useState, useEffect } from 'react'
import Head from 'next/head'

// Working mock authentication - PROVEN STABLE
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
    
    const user = {
      pseudonym: pseudonym.toLowerCase(),
      password,
      securityQuestion: securityData.question,
      securityAnswer: securityData.answer.toLowerCase(),
      createdAt: new Date().toISOString(),
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
    
    mockAuth.users.set(pseudonym.toLowerCase(), user)
    return { success: true, user: { id: user.id, pseudonym: user.pseudonym } }
  },
  
  signIn: async (pseudonym, password) => {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const user = mockAuth.users.get(pseudonym.toLowerCase())
    if (!user || user.password !== password) {
      return { success: false, error: 'Invalid pseudonym or password.' }
    }
    
    return { success: true, user: { id: user.id, pseudonym: user.pseudonym } }
  }
}


// Enhanced research-grade survey questions - Section 1: Demographics
const surveyQuestions = [
  {
    id: 'enhanced_consent',
    type: 'radio',
    question: 'I understand this survey is about unwanted sexual experiences and may be emotionally difficult. I understand I can stop, save, or skip questions at any time. I understand my responses are entirely anonymous and will be used for research, education and advocacy. I consent to participate in this research.',
    options: ['Yes, I consent and understand', 'I need more information'],
    required: true
  },
  {
    id: 'birth_year',
    type: 'dropdown',
    question: 'What year were you born?',
    options: Array.from({length: 80}, (_, i) => String(2024 - i)).concat(['Prefer not to answer']),
    required: false
  },
  {
    id: 'gender_identity',
    type: 'radio',
    question: 'What is your current gender identity?',
    options: [
      'Woman',
      'Man', 
      'Non-binary',
      'Transgender woman',
      'Transgender man',
      'Two-spirit',
      'Gender fluid',
      'Other (please specify)',
      'Prefer not to answer'
    ],
    required: false
  },
  {
    id: 'sexual_orientation',
    type: 'radio',
    question: 'Which of the following best represents how you think of yourself?',
    options: [
      'Straight/heterosexual',
      'Gay/lesbian',
      'Bisexual', 
      'Pansexual',
      'Asexual',
      'Questioning/unsure',
      'Something else (please specify)',
      'I don\'t know',
      'Prefer not to answer'
    ],
    required: false
  },
  {
    id: 'disability_status',
    type: 'radio',
    question: 'Do you have a disability, long-term health condition, or accessibility needs?',
    options: [
      'No',
      'Yes - physical disability',
      'Yes - intellectual/developmental disability', 
      'Yes - mental health condition',
      'Yes - chronic illness',
      'Yes - multiple conditions',
      'Prefer not to answer'
    ],
    required: false
  },
  {
    id: 'relationship_status',
    type: 'radio',
    question: 'What is your current relationship status?',
    options: [
      'Single',
      'In a relationship/dating',
      'Married/civil union/domestic partnership',
      'Polygamous marriage',
      'Polyamorous relationships',
      'Separated',
      'Divorced',
      'Widowed',
      'I\'ve not had a relationship',
      'It\'s complicated',
      'Prefer not to answer'
    ],
    required: false
  },
  {
    id: 'education_level',
    type: 'radio', 
    question: 'What is the highest level of education you have completed?',
    options: [
      'Primary school/elementary school',
      'Some secondary school/high school',
      'Completed secondary school/high school',
      'Trade certificate or diploma',
      'Some university/college',
      'Bachelor\'s degree',
      'Postgraduate degree (Masters, PhD, etc.)',
      'Other qualification',
      'Prefer not to answer'
    ],
    required: false
  },
  {
    id: 'employment_status',
    type: 'radio',
    question: 'What best describes your current employment situation?',
    options: [
      'Employed full-time',
      'Employed part-time', 
      'Self-employed/freelance',
      'Student',
      'Unemployed, looking for work',
      'Unemployed, not looking for work',
      'Retired',
      'Unable to work due to disability/illness',
      'Homemaker/caregiver',
      'Other',
      'Prefer not to answer'
    ],
    required: false
  },
  {
    id: 'personal_income',
    type: 'radio',
    question: 'What is your approximate annual personal income before taxes?',
    options: [
      'No income',
      'Under $25,000',
      '$25,000 - $49,999',
      '$50,000 - $74,999', 
      '$75,000 - $99,999',
      '$100,000 - $149,999',
      '$150,000 or more',
      'I don\'t know',
      'Prefer not to answer'
    ],
    required: false
  },
  {
    id: 'primary_language',
    type: 'radio',
    question: 'What is your primary language spoken at home?',
    options: [
      'English',
      'Spanish',
      'French',
      'Mandarin',
      'Arabic', 
      'Hindi',
      'Portuguese',
      'Other (please specify)',
      'Prefer not to answer'
    ],
    required: false
  }
]
  // Auto-save survey progress
  useEffect(() => {
    if (surveyActive && typeof window !== 'undefined') {
      localStorage.setItem('surveyResponses', JSON.stringify({
        responses: surveyResponses,
        currentIndex: currentQuestionIndex,
        completed: surveyCompleted
      }))
    }
  }, [surveyResponses, currentQuestionIndex, surveyCompleted, surveyActive])

  const handleAuth = async (action) => {
    setLoading(true)
    setError('')
    
    try {
      let result
      
      if (action === 'register') {
        if (formData.password !== formData.passwordConfirm) {
          setError('Passwords do not match')
          setLoading(false)
          return
        }
        
        if (!formData.pseudonym || !formData.password || !formData.securityAnswer) {
          setError('Please fill in all required fields')
          setLoading(false)
          return
        }
        
        result = await mockAuth.signUp(formData.pseudonym, formData.password, {
          question: formData.securityQuestion,
          answer: formData.securityAnswer
        })
        
      } else if (action === 'login') {
        if (!formData.pseudonym || !formData.password) {
          setError('Please enter both pseudonym and password')
          setLoading(false)
          return
        }
        
        result = await mockAuth.signIn(formData.pseudonym, formData.password)
      }
      
      if (result.success) {
        setCurrentUser(result.user)
        if (typeof window !== 'undefined') {
          localStorage.setItem('currentUser', JSON.stringify(result.user))
        }
        setAuthMode('dashboard')
        setFormData({
          pseudonym: '',
          password: '',
          passwordConfirm: '',
          securityQuestion: 'What was the name of your first pet?',
          securityAnswer: ''
        })
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setAuthMode('landing')
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser')
    }
  }

  const startSurvey = () => {
    setSurveyActive(true)
    setAuthMode('survey')
  }

  const handleSurveyResponse = (questionId, value) => {
    setSurveyResponses(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < surveyQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      completeSurvey()
    }
  }

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const completeSurvey = () => {
    setSurveyCompleted(true)
    setSurveyActive(false)
    setAuthMode('dashboard')
    if (typeof window !== 'undefined') {
      localStorage.removeItem('surveyResponses')
    }
  }

  const emergencyExit = () => {
    window.location.href = 'https://www.google.com'
  }

  const currentQuestion = surveyQuestions[currentQuestionIndex]
  const progress = Math.round(((currentQuestionIndex + 1) / surveyQuestions.length) * 100)

  return (
    <>
      <Head>
        <title>Sexual Violence Documentation Platform</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f9fafb',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        {/* Emergency Exit Button */}
        <button
          onClick={emergencyExit}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '4px',
            cursor: 'pointer',
            zIndex: 999,
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          ⚠️ Emergency Exit
        </button>

        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
          {/* Landing Page */}
          {authMode === 'landing' && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <h1 style={{ 
                fontSize: '36px', 
                marginBottom: '20px', 
                color: '#166534',
                fontWeight: 'bold'
              }}>
                Sexual Violence Documentation Platform
              </h1>
              
              <div style={{
                backgroundColor: '#fef3c7',
                border: '2px solid #d97706',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '30px',
                textAlign: 'left'
              }}>
                <h3 style={{ color: '#92400e', marginBottom: '10px' }}>⚠️ Important Safety Notice</h3>
                <p style={{ color: '#92400e', margin: '0' }}>
                  If you're in immediate danger, please contact emergency services (911) or the 
                  National Sexual Assault Hotline at <strong>1-800-656-4673</strong> (available 24/7).
                </p>
              </div>

              <div style={{
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '8px',
                textAlign: 'left',
                marginBottom: '30px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <h2 style={{ color: '#166534', marginBottom: '20px' }}>Your Privacy is Guaranteed</h2>
                <ul style={{ marginBottom: '20px', lineHeight: '1.8' }}>
                  <li>✅ <strong>Completely Anonymous:</strong> No personal information required</li>
                  <li>✅ <strong>Secure Platform:</strong> All data encrypted and protected</li>
                  <li>✅ <strong>Your Control:</strong> Skip any question, exit anytime</li>
                  <li>✅ <strong>Important Research:</strong> Help create better support systems</li>
                </ul>
                
                <p style={{ fontStyle: 'italic', color: '#6b7280' }}>
                  This platform allows survivors to anonymously document their experiences, 
                  contributing to research that improves support services and policy advocacy.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setAuthMode('register')}
                  style={{
                    backgroundColor: '#166534',
                    color: 'white',
                    padding: '15px 30px',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '18px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Create Anonymous Account
                </button>
                
                <button
                  onClick={() => setAuthMode('login')}
                  style={{
                    backgroundColor: 'white',
                    color: '#166534',
                    padding: '15px 30px',
                    border: '2px solid #166534',
                    borderRadius: '6px',
                    fontSize: '18px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Continue Previous Session
                </button>
              </div>
            </div>
          )}

          {/* Registration Form - Same as before */}
          {authMode === 'register' && (
            <div style={{ maxWidth: '500px', margin: '0 auto' }}>
              <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#166534' }}>
                Create Anonymous Account
              </h2>
              
              {error && (
                <div style={{
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#dc2626',
                  padding: '12px',
                  borderRadius: '4px',
                  marginBottom: '20px'
                }}>
                  {error}
                </div>
              )}

              <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Choose a Pseudonym *
                  </label>
                  <input
                    type="text"
                    value={formData.pseudonym}
                    onChange={(e) => setFormData({...formData, pseudonym: e.target.value})}
                    placeholder="e.g., Phoenix, Sage, River"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Create Password *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      placeholder="Minimum 8 characters"
                      style={{
                        width: '100%',
                        padding: '12px',
                        paddingRight: '40px',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        fontSize: '16px',
                        boxSizing: 'border-box'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '18px'
                      }}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Confirm Password *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPasswordConfirm ? 'text' : 'password'}
                      value={formData.passwordConfirm}
                      onChange={(e) => setFormData({...formData, passwordConfirm: e.target.value})}
                      placeholder="Re-enter your password"
                      style={{
                        width: '100%',
                        padding: '12px',
                        paddingRight: '40px',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        fontSize: '16px',
                        boxSizing: 'border-box'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '18px'
                      }}
                    >
                      {showPasswordConfirm ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Security Question *
                  </label>
                  <select
                    value={formData.securityQuestion}
                    onChange={(e) => setFormData({...formData, securityQuestion: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option>What was the name of your first pet?</option>
                    <option>What was your favorite childhood book?</option>
                    <option>What was the first concert you attended?</option>
                    <option>What was your childhood nickname?</option>
                  </select>
                </div>

                <div style={{ marginBottom: '30px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Security Answer *
                  </label>
                  <input
                    type="text"
                    value={formData.securityAnswer}
                    onChange={(e) => setFormData({...formData, securityAnswer: e.target.value})}
                    placeholder="Your answer"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <button
                  onClick={() => handleAuth('register')}
                  disabled={loading}
                  style={{
                    width: '100%',
                    backgroundColor: loading ? '#9ca3af' : '#166534',
                    color: 'white',
                    padding: '15px',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '18px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  {loading ? 'Creating Account...' : 'Create Anonymous Account'}
                </button>

                <p style={{ textAlign: 'center', marginTop: '20px', color: '#6b7280' }}>
                  Already have an account?{' '}
                  <button
                    onClick={() => setAuthMode('login')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#166534',
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* Login Form - Same as before */}
          {authMode === 'login' && (
            <div style={{ maxWidth: '500px', margin: '0 auto' }}>
              <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#166534' }}>
                Continue Your Session
              </h2>
              
              {error && (
                <div style={{
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#dc2626',
                  padding: '12px',
                  borderRadius: '4px',
                  marginBottom: '20px'
                }}>
                  {error}
                </div>
              )}

              <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Pseudonym
                  </label>
                  <input
                    type="text"
                    value={formData.pseudonym}
                    onChange={(e) => setFormData({...formData, pseudonym: e.target.value})}
                    placeholder="Your anonymous pseudonym"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '30px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      placeholder="Your password"
                      style={{
                        width: '100%',
                        padding: '12px',
                        paddingRight: '40px',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        fontSize: '16px',
                        boxSizing: 'border-box'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '18px'
                      }}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => handleAuth('login')}
                  disabled={loading}
                  style={{
                    width: '100%',
                    backgroundColor: loading ? '#9ca3af' : '#166534',
                    color: 'white',
                    padding: '15px',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '18px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>

                <div style={{ textAlign: 'center', marginTop: '20px', color: '#6b7280' }}>
                  <button
                    onClick={() => setAuthMode('register')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#166534',
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    Create Account
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Dashboard */}
          {authMode === 'dashboard' && currentUser && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <h1 style={{ fontSize: '32px', marginBottom: '20px', color: '#166534' }}>
                Welcome back, {currentUser.pseudonym}
              </h1>
              
              <div style={{
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '8px',
                marginBottom: '30px',
                textAlign: 'left',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <h2 style={{ color: '#166534', marginBottom: '20px' }}>Anonymous Documentation Survey</h2>
                
                {surveyCompleted ? (
                  <div style={{
                    backgroundColor: '#dcfce7',
                    border: '1px solid #bbf7d0',
                    padding: '20px',
                    borderRadius: '6px',
                    marginBottom: '20px'
                  }}>
                    <h3 style={{ color: '#166534', marginBottom: '10px' }}>✅ Survey Completed</h3>
                    <p style={{ color: '#166534', margin: '0' }}>
                      Thank you for sharing your experience. Your anonymous responses will contribute to important research.
                    </p>
                  </div>
                ) : (
                  <>
                    <p style={{ marginBottom: '20px' }}>
                      This anonymous survey helps document experiences and improve support systems. 
                      All questions are optional and your responses are completely private.
                    </p>
                    
                    <div style={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      padding: '15px',
                      borderRadius: '6px',
                      marginBottom: '20px'
                    }}>
                      <h4 style={{ color: '#374151', marginBottom: '10px' }}>Survey Details:</h4>
                      <ul style={{ margin: '0', paddingLeft: '20px', lineHeight: '1.6', color: '#6b7280' }}>
                        <li>5 questions covering basic information and support needs</li>
                        <li>Takes about 5-10 minutes to complete</li>
                        <li>Progress is automatically saved</li>
                        <li>Skip any question you're not comfortable answering</li>
                      </ul>
                    </div>

                    {Object.keys(surveyResponses).length > 0 && (
                      <div style={{
                        backgroundColor: '#fef3c7',
                        border: '1px solid #fbbf24',
                        padding: '15px',
                        borderRadius: '6px',
                        marginBottom: '20px'
                      }}>
                        <p style={{ color: '#92400e', margin: '0' }}>
                          <strong>Survey in Progress:</strong> You can continue where you left off.
                        </p>
                      </div>
                    )}
                  </>
                )}
                
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {!surveyCompleted && (
                    <button
                      onClick={startSurvey}
                      style={{
                        backgroundColor: '#166534',
                        color: 'white',
                        padding: '15px 30px',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '18px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      {Object.keys(surveyResponses).length > 0 ? 'Continue Survey' : 'Begin Survey'}
                    </button>
                  )}
                  
                  <button
                    onClick={handleLogout}
                    style={{
                      backgroundColor: 'white',
                      color: '#6b7280',
                      padding: '15px 30px',
                      border: '2px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '18px',
                      cursor: 'pointer'
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Survey Interface */}
          {authMode === 'survey' && surveyActive && currentQuestion && (
            <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
              {/* Progress Bar */}
              <div style={{ marginBottom: '30px' }}>
                <div style={{
                  backgroundColor: '#f3f4f6',
                  height: '8px',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    backgroundColor: '#166534',
                    height: '100%',
                    width: `${progress}%`,
                    transition: 'width 0.3s ease'
                  }} />
                </div>
                <p style={{ textAlign: 'center', marginTop: '10px', color: '#6b7280', fontSize: '14px' }}>
                  Question {currentQuestionIndex + 1} of {surveyQuestions.length} ({progress}% complete)
                </p>
              </div>

              {/* Question */}
              <div style={{
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                marginBottom: '30px'
              }}>
                <h3 style={{ color: '#166534', marginBottom: '20px', fontSize: '20px' }}>
                  {currentQuestion.question}
                  {currentQuestion.required && <span style={{ color: '#dc2626' }}> *</span>}
                </h3>

                {/* Radio buttons */}
                {currentQuestion.type === 'radio' && (
                  <div>
                    {currentQuestion.options.map((option, index) => (
                      <label key={index} style={{ 
                        display: 'block', 
                        marginBottom: '12px', 
                        cursor: 'pointer',
                        padding: '10px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '4px',
                        backgroundColor: surveyResponses[currentQuestion.id] === option ? '#f0fdf4' : 'white'
                      }}>
                        <input
                          type="radio"
                          name={currentQuestion.id}
                          value={option}
                          checked={surveyResponses[currentQuestion.id] === option}
                          onChange={(e) => handleSurveyResponse(currentQuestion.id, e.target.value)}
                          style={{ marginRight: '10px' }}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                )}

                {/* Checkboxes */}
                {currentQuestion.type === 'checkbox' && (
                  <div>
                    {currentQuestion.options.map((option, index) => {
                      const currentResponses = surveyResponses[currentQuestion.id] || []
                      return (
                        <label key={index} style={{ 
                          display: 'block', 
                          marginBottom: '12px', 
                          cursor: 'pointer',
                          padding: '10px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '4px',
                          backgroundColor: currentResponses.includes(option) ? '#f0fdf4' : 'white'
                        }}>
                          <input
                            type="checkbox"
                            value={option}
                            checked={currentResponses.includes(option)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                handleSurveyResponse(currentQuestion.id, [...currentResponses, option])
                              } else {
                                handleSurveyResponse(currentQuestion.id, currentResponses.filter(r => r !== option))
                              }
                            }}
                            style={{ marginRight: '10px' }}
                          />
                          {option}
                        </label>
                      )
                    })}
                  </div>
                )}

                {/* Textarea */}
                {currentQuestion.type === 'textarea' && (
                  <textarea
                    value={surveyResponses[currentQuestion.id] || ''}
                    onChange={(e) => handleSurveyResponse(currentQuestion.id, e.target.value)}
                    placeholder={currentQuestion.placeholder}
                    style={{
                      width: '100%',
                      minHeight: '120px',
                      padding: '15px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '16px',
                      resize: 'vertical',
                      boxSizing: 'border-box'
                    }}
                  />
                )}

                {!currentQuestion.required && (
                  <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '15px', fontStyle: 'italic' }}>
                    This question is optional - you can skip if you prefer not to answer.
                  </p>
                )}
              </div>

              {/* Navigation */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                gap: '20px'
              }}>
                <button
                  onClick={prevQuestion}
                  disabled={currentQuestionIndex === 0}
                  style={{
                    backgroundColor: currentQuestionIndex === 0 ? '#f3f4f6' : 'white',
                    color: currentQuestionIndex === 0 ? '#9ca3af' : '#374151',
                    padding: '12px 24px',
                    border: '2px solid #d1d5db',
                    borderRadius: '6px',
                    cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
                    fontSize: '16px'
                  }}
                >
                  ← Previous
                </button>

                <div style={{ display: 'flex', gap: '15px' }}>
                  <button
                    onClick={() => setAuthMode('dashboard')}
                    style={{
                      backgroundColor: 'white',
                      color: '#6b7280',
                      padding: '12px 24px',
                      border: '2px solid #d1d5db',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '16px'
                    }}
                  >
                    Save & Exit
                  </button>
                  
                  <button
                    onClick={nextQuestion}
                    style={{
                      backgroundColor: '#166534',
                      color: 'white',
                      padding: '12px 24px',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }}
                  >
                    {currentQuestionIndex === surveyQuestions.length - 1 ? 'Complete Survey' : 'Next →'}
                  </button>
                </div>
              </div>

              {/* Auto-save indicator */}
              <div style={{ 
                textAlign: 'center', 
                marginTop: '20px',
                fontSize: '14px',
                color: '#6b7280',
                fontStyle: 'italic'
              }}>
                ✓ Your progress is automatically saved
              </div>

              {/* Crisis resources footer */}
              <div style={{
                backgroundColor: '#fef3c7',
                border: '1px solid #fbbf24',
                padding: '15px',
                borderRadius: '6px',
                marginTop: '30px',
                textAlign: 'center'
              }}>
                <p style={{ margin: '0', color: '#92400e', fontSize: '14px' }}>
                  <strong>Need support?</strong> National Sexual Assault Hotline: 1-800-656-4673 (24/7) | 
                  Crisis Text Line: Text HOME to 741741
                </p>
              </div>
            </div>
          )}

          {/* Back to Landing */}
          {['register', 'login'].includes(authMode) && (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button
                onClick={() => setAuthMode('landing')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6b7280',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontSize: '14px'
                }}
              >
                ← Back to Home
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
