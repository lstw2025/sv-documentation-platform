import { useState } from 'react'
import Head from 'next/head'

export default function Home() {
  const [showRegistration, setShowRegistration] = useState(false)

  return (
    <>
      <Head>
        <title>Let's Show The World - Anonymous SV Documentation</title>
      </Head>

      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #f0fdf4, #dcfce7)' }}>
        {/* Emergency Exit Button - Top Right */}
        <button
          onClick={() => window.location.href = 'https://www.google.com'}
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

        {/* Header */}
        <header style={{ backgroundColor: '#166534', color: 'white', padding: '1.5rem 0' }}>
          <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '0 1rem' }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: '700', textAlign: 'center', margin: 0 }}>
              Let's Show The World
            </h1>
            <p style={{ textAlign: 'center', marginTop: '0.5rem', color: '#dcfce7', margin: '0.5rem 0 0 0' }}>
              Anonymous Documentation Platform for Change
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main style={{ maxWidth: '56rem', margin: '0 auto', padding: '3rem 1rem' }}>
          
          {!showRegistration ? (
            // Welcome Screen
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

                <div style={{ marginBottom: '1rem' }}>
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
                    Begin Anonymous Documentation
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
          ) : (
            // Registration Form
            <RegistrationForm onBack={() => setShowRegistration(false)} />
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

// Registration Component (Story 1.1: Anonymous Account Creation)
function RegistrationForm({ onBack }) {
  const [formData, setFormData] = useState({
    pseudonym: '',
    password: '',
    confirmPassword: '',
    securityQuestions: {
      question1: '',
      answer1: '',
      question2: '',
      answer2: '',
      question3: '',
      answer3: ''
    },
    geographicPrecision: 'state'
  })

  const securityQuestionOptions = [
    "What was the name of your first pet?",
    "What city were you born in?",
    "What was your favorite childhood book?",
    "What was the model of your first car?",
    "What is your mother's maiden name?",
    "What elementary school did you attend?",
    "What was your childhood nickname?",
    "What street did you grow up on?"
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Implement actual registration with Supabase
    alert('Registration system ready for backend integration!')
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

      <div style={{ 
        backgroundColor: '#f0fdf4', 
        borderLeft: '4px solid #4ade80', 
        padding: '1rem', 
        marginBottom: '1.5rem' 
      }}>
        <p style={{ fontSize: '0.875rem', color: '#166534', margin: 0 }}>
          <strong>Privacy Guarantee:</strong> No personal information is required. 
          Your pseudonym and password are the only identifiers needed.
        </p>
      </div>

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
          />
          <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem', margin: '0.25rem 0 0 0' }}>
            This is how you'll log in. Choose something memorable but not identifying.
          </p>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Create Password *
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
            placeholder="Minimum 12 characters"
            minLength="12"
            required
          />
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            backgroundColor: '#15803d',
            color: 'white',
            padding: '0.75rem',
            borderRadius: '0.375rem',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#166534'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#15803d'}
        >
          Create Anonymous Account
        </button>
      </form>
    </div>
  )
}
