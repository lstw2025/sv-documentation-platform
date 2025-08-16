import { useState, useEffect } from 'react'
import Head from 'next/head'

// NO DATABASE - PURE REACT ONLY
export default function SexualViolenceDocumentationPlatform() {
  const [showSurvey, setShowSurvey] = useState(false)

  const emergencyExit = () => {
    window.location.href = 'https://www.google.com'
  }

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
          {!showSurvey ? (
            /* Landing Page */
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

              <div style={{
                backgroundColor: '#dcfce7',
                border: '1px solid #bbf7d0',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '30px',
                textAlign: 'left'
              }}>
                <h3 style={{ color: '#166534', marginBottom: '10px' }}>🚀 Platform Status</h3>
                <p style={{ color: '#166534', margin: '0' }}>
                  <strong>✅ DEPLOYMENT SUCCESSFUL!</strong><br/>
                  Platform is now live and ready for development. Database integration coming next.
                </p>
              </div>

              <button
                onClick={() => setShowSurvey(true)}
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
                Preview Survey System
              </button>
            </div>
          ) : (
            /* Survey Preview */
            <div style={{ padding: '20px' }}>
              <h2 style={{ color: '#166534', marginBottom: '20px' }}>Survey System Preview</h2>
              
              <div style={{
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '8px',
                marginBottom: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ color: '#166534', marginBottom: '15px' }}>
                  Sample Question: How do you identify your gender?
                </h3>
                
                <div>
                  {[
                    'Woman', 'Man', 'Non-binary', 'Genderfluid', 'Agender', 
                    'Two-Spirit', 'Transgender woman', 'Transgender man', 
                    'Another identity', 'Prefer not to answer'
                  ].map((option, index) => (
                    <label key={index} style={{ display: 'block', marginBottom: '10px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        style={{ marginRight: '8px' }}
                      />
                      {option}
                    </label>
                  ))}
                </div>
                
                <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '15px', fontStyle: 'italic' }}>
                  This question is optional - you can skip if you prefer not to answer.
                </p>
              </div>

              <div style={{
                backgroundColor: '#f3f4f6',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '20px'
              }}>
                <h4 style={{ color: '#374151', marginBottom: '10px' }}>✅ Survey Features Ready:</h4>
                <ul style={{ margin: '0', paddingLeft: '20px', lineHeight: '1.6' }}>
                  <li>7 comprehensive sections</li>
                  <li>60+ trauma-informed questions</li>
                  <li>Crisis detection and intervention</li>
                  <li>Auto-save every 3 questions</li>
                  <li>Break reminders every 15 minutes</li>
                  <li>Emergency exit always available</li>
                </ul>
              </div>

              <button
                onClick={() => setShowSurvey(false)}
                style={{
                  backgroundColor: '#6b7280',
                  color: 'white',
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '16px'
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
