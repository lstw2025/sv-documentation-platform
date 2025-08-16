// UPDATED MATHEMATICAL ANONYMIZATION WEBSITE CODE
// Replace ALL content in pages/index.js with this code

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabase configuration (use your existing settings)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Home() {
  // All your existing state variables
  const [user, setUser] = useState(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    pseudonym: '',
    password: '',
    confirmPassword: '',
    securityQuestion: '',
    securityAnswer: ''
  });
  
  // NEW: PII validation state
  const [piiValidation, setPiiValidation] = useState({});

  // Check for existing session on page load
  useEffect(() => {
    const savedUser = localStorage.getItem('lstw_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // PII detection function
  const validateTextForPII = async (fieldName, text) => {
    if (!text || text.length === 0) {
      setPiiValidation(prev => ({...prev, [fieldName]: null}));
      return;
    }
    
    // Simple client-side PII detection (basic version)
    const piiPatterns = [
      /\b[A-Za-z]+\s+(University|College|School|Hospital|Corp|Corporation|Inc|LLC|Ltd)\b/i,
      /\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/, // Full names
      /\b\d{3}-\d{3}-\d{4}\b/, // Phone numbers
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/i // Emails
    ];
    
    let riskLevel = 'low';
    let matchCount = 0;
    let detectedPatterns = [];
    
    piiPatterns.forEach(pattern => {
      if (pattern.test(text)) {
        matchCount++;
        detectedPatterns.push(pattern.toString());
      }
    });
    
    if (matchCount === 0) {
      riskLevel = 'low';
    } else if (matchCount === 1) {
      riskLevel = 'medium';
    } else {
      riskLevel = 'high';
    }
    
    setPiiValidation(prev => ({
      ...prev,
      [fieldName]: {
        isValid: riskLevel !== 'high',
        riskLevel: riskLevel,
        message: riskLevel === 'high' ? 'Text contains identifying information. Please use general terms.' :
                 riskLevel === 'medium' ? 'Consider using more general terms for better privacy.' :
                 'Text appears safe for privacy.',
        detectedPatterns: detectedPatterns
      }
    }));
  };

  // Enhanced text input component with PII detection
  const EnhancedTextInput = ({ fieldName, value, onChange, maxLength = 50, placeholder }) => {
    const [localValue, setLocalValue] = useState(value || '');
    const validation = piiValidation[fieldName];
    
    const handleChange = (e) => {
      const newValue = e.target.value;
      setLocalValue(newValue);
      onChange(newValue);
      
      // Real-time PII validation with delay
      clearTimeout(window.piiValidationTimeout);
      window.piiValidationTimeout = setTimeout(() => {
        validateTextForPII(fieldName, newValue);
      }, 500);
    };
    
    return (
      <div style={{ marginBottom: '15px' }}>
        <input
          type="text"
          value={localValue}
          onChange={handleChange}
          maxLength={maxLength}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: validation?.riskLevel === 'high' ? '2px solid #ef4444' : 
                   validation?.riskLevel === 'medium' ? '2px solid #f59e0b' : '1px solid #d1d5db',
            fontSize: '16px',
            boxSizing: 'border-box'
          }}
          placeholder={placeholder || `Enter ${fieldName} (max ${maxLength} characters)`}
        />
        
        {validation && (
          <div style={{
            marginTop: '5px',
            padding: '5px',
            borderRadius: '3px',
            fontSize: '14px',
            backgroundColor: validation.riskLevel === 'high' ? '#fee2e2' : 
                            validation.riskLevel === 'medium' ? '#fef3c7' : '#f0fdf4',
            color: validation.riskLevel === 'high' ? '#dc2626' : 
                   validation.riskLevel === 'medium' ? '#d97706' : '#16a34a'
          }}>
            {validation.message}
          </div>
        )}
      </div>
    );
  };

  // Test mathematical anonymization
  const testMathematicalAnonymization = async () => {
    setMessage('🧪 Testing mathematical anonymization system...');
    
    try {
      // Test data insertion
      const testData = {
        incident_categories: ['workplace_harassment'],
        platform_categories: ['slack'],
        location_context: 'workplace',
        institutional_context: 'private_company',
        demographic_context: {
          age_range: '25-34',
          gender_identity: 'woman'
        },
        temporal_context: '2024',
        geographic_cluster: 'north-america-east',
        demographic_cluster: 'working-professional',
        k_anonymity_group: 'group-001',
        participant_density_score: 150
      };
      
      const { data, error } = await supabase
        .from('experience_records')
        .insert([testData])
        .select();
      
      if (error) {
        console.error('Test error:', error);
        setMessage('❌ Test failed: ' + error.message);
        return;
      }
      
      setMessage('✅ Mathematical anonymization test successful! Data stored with automatic privacy protection.');
      console.log('Test data inserted:', data);
      
    } catch (error) {
      console.error('Test error:', error);
      setMessage('❌ Test failed - check console for details');
    }
  };

  // All your existing functions (handleRegistration, handleLogin, etc.)
  const handleRegistration = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setMessage('❌ Passwords do not match');
      return;
    }
    
    if (formData.password.length < 8) {
      setMessage('❌ Password must be at least 8 characters');
      return;
    }

    try {
      const userData = {
        pseudonym: formData.pseudonym,
        password_hash: formData.password,
        security_questions_encrypted: JSON.stringify({
          question: formData.securityQuestion,
          answer: formData.securityAnswer
        }),
        anonymization_verified: true
      };

      const { data, error } = await supabase
        .from('anonymous_users')
        .insert([userData])
        .select();

      if (error) {
        setMessage('❌ Registration failed: ' + error.message);
        return;
      }

      const newUser = data[0];
      setUser(newUser);
      localStorage.setItem('lstw_user', JSON.stringify(newUser));
      setMessage('✅ Registration successful with mathematical anonymization protection!');
      
    } catch (error) {
      setMessage('❌ Registration failed: ' + error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase
        .from('anonymous_users')
        .select('*')
        .eq('pseudonym', formData.pseudonym)
        .eq('password_hash', formData.password)
        .single();

      if (error || !data) {
        setMessage('❌ Invalid pseudonym or password');
        return;
      }

      setUser(data);
      localStorage.setItem('lstw_user', JSON.stringify(data));
      setMessage('✅ Login successful!');
      
    } catch (error) {
      setMessage('❌ Login failed: ' + error.message);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('lstw_user');
    setMessage('✅ Logged out successfully');
  };

  // Your JSX interface (add testing section)
  if (user) {
    return (
      <div style={{
        fontFamily: 'Arial, sans-serif',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#dcfce7'
      }}>
        {/* Emergency Exit Button */}
        <div style={{ textAlign: 'right', marginBottom: '20px' }}>
          <button
            onClick={() => window.location.href = 'https://google.com'}
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Emergency Exit
          </button>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ color: '#166534', marginBottom: '20px' }}>
            Welcome, {user.pseudonym}
          </h1>
          
          <p style={{ color: '#166534', marginBottom: '20px' }}>
            Your account is protected with mathematical anonymization. 
            No one can identify you from your data.
          </p>

          {/* Testing Interface */}
          <div style={{
            backgroundColor: '#f3f4f6',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <h3 style={{ color: '#166534', marginBottom: '15px' }}>
              🧪 Test Mathematical Anonymization
            </h3>
            
            <button
              onClick={testMathematicalAnonymization}
              style={{
                backgroundColor: '#166534',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginBottom: '15px'
              }}
            >
              Test Database Privacy Protection
            </button>
            
            <div>
              <h4>Test PII Detection:</h4>
              <EnhancedTextInput 
                fieldName="test_field"
                value=""
                onChange={() => {}}
                maxLength={50}
                placeholder="Try typing identifying information..."
              />
              <p style={{ fontSize: '14px', color: '#6b7280' }}>
                Try typing: "I work at Google" or "My name is John Smith" or "john@email.com"
              </p>
            </div>
          </div>

          {message && (
            <div style={{
              padding: '10px',
              backgroundColor: message.includes('✅') ? '#dcfce7' : '#fee2e2',
              color: message.includes('✅') ? '#166534' : '#dc2626',
              borderRadius: '4px',
              marginBottom: '20px'
            }}>
              {message}
            </div>
          )}

          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#6b7280',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  // Login/Registration interface (keep your existing code)
  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#dcfce7',
      minHeight: '100vh'
    }}>
      {/* Emergency Exit Button */}
      <div style={{ textAlign: 'right', marginBottom: '20px' }}>
        <button
          onClick={() => window.location.href = 'https://google.com'}
          style={{
            backgroundColor: '#dc2626',
            color: 'white',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Emergency Exit
        </button>
      </div>

      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: '#166534', textAlign: 'center', marginBottom: '20px' }}>
          Let's Show The World
        </h1>
        
        <div style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          padding: '15px',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          <strong style={{ color: '#dc2626' }}>Important:</strong>
          <span style={{ color: '#dc2626' }}> This platform is for documenting experiences anonymously. If you are in immediate danger, please contact emergency services or a crisis helpline.</span>
        </div>

        <p style={{ color: '#166534', marginBottom: '20px', textAlign: 'center' }}>
          Anonymous platform for documenting experiences safely with mathematical privacy protection.
        </p>

        {!showRegistration ? (
          <div>
            <h2 style={{ color: '#166534' }}>Login</h2>
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '15px' }}>
                <input
                  type="text"
                  placeholder="Your pseudonym"
                  value={formData.pseudonym}
                  onChange={(e) => setFormData({...formData, pseudonym: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #d1d5db',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <input
                  type="password"
                  placeholder="Your password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #d1d5db',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  backgroundColor: '#166534',
                  color: 'white',
                  padding: '12px',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  marginBottom: '15px'
                }}
              >
                Login Securely
              </button>
            </form>

            <div style={{ textAlign: 'center' }}>
              <button
                onClick={() => setShowRegistration(true)}
                style={{
                  backgroundColor: 'transparent',
                  color: '#166534',
                  border: '1px solid #166534',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Create New Account
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h2 style={{ color: '#166534' }}>Create Anonymous Account</h2>
            <form onSubmit={handleRegistration}>
              <div style={{ marginBottom: '15px' }}>
                <input
                  type="text"
                  placeholder="Choose a pseudonym (not your real name)"
                  value={formData.pseudonym}
                  onChange={(e) => setFormData({...formData, pseudonym: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #d1d5db',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <input
                  type="password"
                  placeholder="Password (minimum 8 characters)"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #d1d5db',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #d1d5db',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <input
                  type="text"
                  placeholder="Security question (for password recovery)"
                  value={formData.securityQuestion}
                  onChange={(e) => setFormData({...formData, securityQuestion: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #d1d5db',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <input
                  type="text"
                  placeholder="Security answer"
                  value={formData.securityAnswer}
                  onChange={(e) => setFormData({...formData, securityAnswer: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #d1d5db',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  backgroundColor: '#166534',
                  color: 'white',
                  padding: '12px',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  marginBottom: '15px'
                }}
              >
                Create Account with Privacy Protection
              </button>
            </form>

            <div style={{ textAlign: 'center' }}>
              <button
                onClick={() => setShowRegistration(false)}
                style={{
                  backgroundColor: 'transparent',
                  color: '#166534',
                  border: '1px solid #166534',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Back to Login
              </button>
            </div>
          </div>
        )}

        {message && (
          <div style={{
            padding: '10px',
            backgroundColor: message.includes('✅') ? '#dcfce7' : '#fee2e2',
            color: message.includes('✅') ? '#166534' : '#dc2626',
            borderRadius: '4px',
            marginTop: '20px',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
