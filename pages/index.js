import { useState, useEffect } from 'react'
import Head from 'next/head'

// Mock authentication system - WORKING
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
  },
  
  recoverPassword: async (pseudonym, securityAnswer, newPassword) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const user = mockAuth.users.get(pseudonym.toLowerCase())
    if (!user) {
      return { success: false, error: 'Pseudonym not found.' }
    }
    
    if (user.securityAnswer !== securityAnswer.toLowerCase()) {
      return { success: false, error: 'Security answer is incorrect.' }
    }
    
    user.password = newPassword
    return { success: true }
  }
}

// Crisis intervention keywords
const crisisKeywords = [
  'suicide', 'kill myself', 'end it all', 'want to die', 'harm myself',
  'cutting', 'self harm', 'hurt myself', 'overdose', 'can\'t go on'
]

// Survey configuration - COMPREHENSIVE 65-80 MINUTE SURVEY
const surveyConfig = {
  sections: [
    {
      id: 'consent',
      title: 'Informed Consent',
      description: 'Understanding your participation',
      questions: [
        {
          id: 'consent_understanding',
          type: 'radio',
          required: true,
          question: 'I understand that this survey is completely anonymous and no personal identifying information will be collected.',
          options: ['Yes, I understand', 'I need more information']
        },
        {
          id: 'consent_voluntary',
          type: 'radio',
          required: true,
          question: 'I understand that my participation is completely voluntary and I can stop at any time.',
          options: ['Yes, I understand']
        },
        {
          id: 'consent_support',
          type: 'radio',
          required: true,
          question: 'I understand that crisis support resources are available if I need them during or after this survey.',
          options: ['Yes, I understand']
        }
      ]
    },
    {
      id: 'demographics',
      title: 'About You',
      description: 'Basic demographic information (all optional)',
      questions: [
        {
          id: 'age_range',
          type: 'radio',
          question: 'What is your age range?',
          options: ['Under 18', '18-24', '25-34', '35-44', '45-54', '55-64', '65+', 'Prefer not to answer']
        },
        {
          id: 'gender_identity',
          type: 'checkbox',
          question: 'How do you identify your gender? (Select all that apply)',
          options: [
            'Woman', 'Man', 'Non-binary', 'Genderfluid', 'Agender', 'Two-Spirit',
            'Transgender woman', 'Transgender man', 'Another identity', 'Prefer not to answer'
          ]
        },
        {
          id: 'sexual_orientation',
          type: 'checkbox',
          question: 'How do you describe your sexual orientation? (Select all that apply)',
          options: [
            'Heterosexual/Straight', 'Gay', 'Lesbian', 'Bisexual', 'Pansexual',
            'Asexual', 'Queer', 'Another orientation', 'Prefer not to answer'
          ]
        },
        {
          id: 'ethnicity',
          type: 'checkbox',
          question: 'What is your ethnic background? (Select all that apply)',
          options: [
            'White/Caucasian', 'Black/African American', 'Hispanic/Latino', 'Asian',
            'Native American/Indigenous', 'Pacific Islander', 'Middle Eastern',
            'Mixed/Multiracial', 'Another background', 'Prefer not to answer'
          ]
        },
        {
          id: 'disability_status',
          type: 'radio',
          question: 'Do you identify as having a disability?',
          options: ['Yes', 'No', 'Prefer not to answer']
        },
        {
          id: 'location_type',
          type: 'radio',
          question: 'Where do you primarily live?',
          options: ['Urban area', 'Suburban area', 'Rural area', 'Prefer not to answer']
        }
      ]
    },
    {
      id: 'experience_overview',
      title: 'Experience Overview',
      description: 'General information about your experience(s)',
      questions: [
        {
          id: 'experience_count',
          type: 'radio',
          question: 'How many separate experiences of sexual violence have you had?',
          options: ['One experience', '2-3 experiences', '4-5 experiences', 'More than 5 experiences', 'Prefer not to answer']
        },
        {
          id: 'most_recent_timeframe',
          type: 'radio',
          question: 'When did your most recent experience occur?',
          options: [
            'Within the past month', 'Within the past 6 months', 'Within the past year',
            'Within the past 2 years', 'Within the past 5 years', 'More than 5 years ago',
            'Prefer not to answer'
          ]
        },
        {
          id: 'perpetrator_relationship',
          type: 'checkbox',
          question: 'What was your relationship to the perpetrator(s)? (Select all that apply)',
          options: [
            'Stranger', 'Acquaintance', 'Friend', 'Dating partner', 'Spouse/Partner',
            'Ex-partner', 'Family member', 'Authority figure', 'Co-worker',
            'Someone else I knew', 'Prefer not to answer'
          ]
        },
        {
          id: 'experience_types',
          type: 'checkbox',
          question: 'Which of the following describe your experience(s)? (Select all that apply)',
          options: [
            'Unwanted touching/groping', 'Attempted rape', 'Completed rape',
            'Oral sex without consent', 'Sexual coercion', 'Incest',
            'Child sexual abuse', 'Technology-facilitated sexual violence',
            'Other sexual violence', 'Prefer not to answer'
          ]
        }
      ]
    },
    {
      id: 'detailed_experience',
      title: 'Detailed Experience',
      description: 'More specific details about what happened',
      questions: [
        {
          id: 'location_type_incident',
          type: 'radio',
          question: 'Where did the incident primarily take place?',
          options: [
            'My home', 'Perpetrator\'s home', 'Another person\'s home',
            'School/Educational setting', 'Workplace', 'Public transportation',
            'Bar/Club/Party', 'Hotel/Accommodation', 'Vehicle',
            'Public space', 'Online/Digital space', 'Other location',
            'Prefer not to answer'
          ]
        },
        {
          id: 'substances_involved',
          type: 'checkbox',
          question: 'Were substances involved in the incident? (Select all that apply)',
          options: [
            'I had been drinking alcohol', 'Perpetrator had been drinking',
            'I had used drugs', 'Perpetrator had used drugs',
            'I was given something without my knowledge',
            'None of the above', 'Prefer not to answer'
          ]
        },
        {
          id: 'force_tactics',
          type: 'checkbox',
          question: 'What tactics did the perpetrator use? (Select all that apply)',
          options: [
            'Physical force/violence', 'Threats of physical harm',
            'Emotional manipulation', 'Threats to reputation',
            'Economic coercion', 'Threats involving others',
            'Authority/Power abuse', 'Intoxication/Incapacitation',
            'Technology/Digital coercion', 'Other tactics',
            'Prefer not to answer'
          ]
        },
        {
          id: 'physical_injuries',
          type: 'radio',
          question: 'Did you sustain physical injuries?',
          options: ['Yes, minor injuries', 'Yes, serious injuries', 'No physical injuries', 'Prefer not to answer']
        },
        {
          id: 'immediately_after',
          type: 'checkbox',
          question: 'What did you do immediately after the incident? (Select all that apply)',
          options: [
            'Told someone immediately', 'Sought medical attention',
            'Contacted police', 'Went home', 'Continued normal activities',
            'Isolated myself', 'Sought crisis support',
            'Nothing specific', 'Prefer not to answer'
          ]
        }
      ]
    },
    {
      id: 'technology_violence',
      title: 'Technology-Facilitated Violence',
      description: 'Digital and online aspects of sexual violence',
      questions: [
        {
          id: 'tech_violence_experienced',
          type: 'radio',
          question: 'Have you experienced technology-facilitated sexual violence?',
          options: ['Yes', 'No', 'Unsure', 'Prefer not to answer']
        },
        {
          id: 'tech_violence_types',
          type: 'checkbox',
          question: 'Which types of technology-facilitated violence have you experienced? (Select all that apply)',
          condition: 'tech_violence_experienced === "Yes"',
          options: [
            'Non-consensual sharing of intimate images',
            'Threats to share intimate images',
            'Sexual harassment via social media',
            'Unwanted sexual messages/content',
            'Dating app harassment/abuse',
            'Deepfake/AI-generated content',
            'Location tracking/stalking',
            'Password/account hacking',
            'Installation of spyware',
            'Other tech-facilitated violence',
            'Prefer not to answer'
          ]
        },
        {
          id: 'platforms_involved',
          type: 'checkbox',
          question: 'Which platforms were involved? (Select all that apply)',
          condition: 'tech_violence_experienced === "Yes"',
          options: [
            'Facebook/Meta', 'Instagram', 'Twitter/X', 'TikTok', 'Snapchat',
            'WhatsApp', 'Telegram', 'Dating apps', 'Email', 'Text/SMS',
            'Gaming platforms', 'Professional platforms', 'Other platforms',
            'Prefer not to answer'
          ]
        },
        {
          id: 'tech_evidence',
          type: 'radio',
          question: 'Were you able to preserve evidence of the technology-facilitated violence?',
          condition: 'tech_violence_experienced === "Yes"',
          options: ['Yes, I preserved evidence', 'No, I couldn\'t preserve evidence', 'I\'m not sure', 'Prefer not to answer']
        }
      ]
    },
    {
      id: 'disclosure_support',
      title: 'Disclosure and Support',
      description: 'Who you told and what support you received',
      questions: [
        {
          id: 'disclosure_timeline',
          type: 'radio',
          question: 'How long after the incident did you first tell someone?',
          options: [
            'Immediately (same day)', 'Within a week', 'Within a month',
            'Within 6 months', 'Within a year', 'More than a year later',
            'I have never told anyone', 'Prefer not to answer'
          ]
        },
        {
          id: 'who_disclosed_to',
          type: 'checkbox',
          question: 'Who have you disclosed your experience to? (Select all that apply)',
          options: [
            'Family member', 'Friend', 'Romantic partner', 'Mental health professional',
            'Medical professional', 'Police/Law enforcement', 'Lawyer',
            'Crisis counselor/Hotline', 'Religious/Spiritual leader',
            'Teacher/Professor', 'Co-worker/Supervisor', 'Online support group',
            'No one', 'Prefer not to answer'
          ]
        },
        {
          id: 'disclosure_reactions',
          type: 'checkbox',
          question: 'How did people react when you disclosed? (Select all that apply)',
          options: [
            'Supportive and believed me', 'Offered practical help',
            'Blamed me or questioned my actions', 'Minimized the experience',
            'Suggested I report to authorities', 'Avoided the topic',
            'Became overprotective', 'Mixed reactions from different people',
            'I haven\'t told anyone', 'Prefer not to answer'
          ]
        },
        {
          id: 'formal_reporting',
          type: 'radio',
          question: 'Did you make a formal report to any authorities?',
          options: ['Yes, to police', 'Yes, to other authorities', 'No', 'Prefer not to answer']
        },
        {
          id: 'reporting_experience',
          type: 'checkbox',
          question: 'How was your experience with formal reporting? (Select all that apply)',
          condition: 'formal_reporting.includes("Yes")',
          options: [
            'Professional and supportive', 'Believed and taken seriously',
            'Felt blamed or judged', 'Process was traumatic',
            'Helpful outcome', 'Disappointing outcome',
            'Case is still ongoing', 'Prefer not to answer'
          ]
        },
        {
          id: 'support_services_used',
          type: 'checkbox',
          question: 'What support services have you used? (Select all that apply)',
          options: [
            'Crisis hotline', 'Individual counseling', 'Group therapy',
            'Support groups', 'Legal advocacy', 'Medical services',
            'Sexual assault nurse examiner (SANE)', 'Victim compensation',
            'Safety planning', 'None', 'Prefer not to answer'
          ]
        }
      ]
    },
    {
      id: 'impact_recovery',
      title: 'Impact and Recovery',
      description: 'How the experience has affected your life',
      questions: [
        {
          id: 'immediate_impacts',
          type: 'checkbox',
          question: 'What immediate impacts did you experience? (Select all that apply)',
          options: [
            'Sleep difficulties', 'Appetite changes', 'Anxiety/Panic',
            'Depression', 'Anger', 'Guilt/Shame', 'Fear',
            'Difficulty concentrating', 'Physical health issues',
            'Relationship difficulties', 'Academic/Work problems',
            'Substance use changes', 'No immediate impacts',
            'Prefer not to answer'
          ]
        },
        {
          id: 'ongoing_impacts',
          type: 'checkbox',
          question: 'What ongoing impacts do you experience? (Select all that apply)',
          options: [
            'PTSD symptoms', 'Depression', 'Anxiety', 'Trust issues',
            'Intimacy difficulties', 'Body image issues',
            'Hypervigilance', 'Avoidance behaviors',
            'Flashbacks/Nightmares', 'Relationship challenges',
            'Career/Educational impacts', 'Financial difficulties',
            'Physical health problems', 'No ongoing impacts',
            'Prefer not to answer'
          ]
        },
        {
          id: 'coping_strategies',
          type: 'checkbox',
          question: 'What coping strategies have you used? (Select all that apply)',
          options: [
            'Professional therapy', 'Medication', 'Support groups',
            'Exercise/Physical activity', 'Creative activities',
            'Mindfulness/Meditation', 'Spiritual practices',
            'Advocacy/Activism', 'Helping others', 'Journaling',
            'Substance use', 'Isolation', 'Other strategies',
            'Prefer not to answer'
          ]
        },
        {
          id: 'recovery_progress',
          type: 'radio',
          question: 'How would you describe your recovery progress?',
          options: [
            'I feel fully recovered', 'I\'m making good progress',
            'I\'m making some progress', 'Recovery feels difficult',
            'I don\'t feel I\'m recovering', 'Recovery is not linear',
            'Too early to tell', 'Prefer not to answer'
          ]
        },
        {
          id: 'helpful_factors',
          type: 'checkbox',
          question: 'What has been most helpful in your healing? (Select all that apply)',
          options: [
            'Professional support', 'Family support', 'Friend support',
            'Support groups', 'Medication', 'Time passing',
            'Personal strength', 'Spiritual beliefs', 'Advocacy work',
            'Creative expression', 'Physical activity', 'Education about trauma',
            'Nothing has been helpful', 'Prefer not to answer'
          ]
        }
      ]
    }
  ]
}

// Crisis intervention component
function CrisisIntervention({ isVisible, onClose }) {
  if (!isVisible) return null
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#dc2626', marginBottom: '20px' }}>🆘 Crisis Support Available</h2>
        <p style={{ marginBottom: '20px' }}>
          We noticed you may be in crisis. Your safety and wellbeing are important.
        </p>
        
        <div style={{ textAlign: 'left', marginBottom: '20px' }}>
          <h3>Immediate Support:</h3>
          <ul>
            <li><strong>National Crisis Line:</strong> 988</li>
            <li><strong>Crisis Text Line:</strong> Text HOME to 741741</li>
            <li><strong>RAINN Hotline:</strong> 1-800-656-4673</li>
            <li><strong>Emergency:</strong> Call 911</li>
          </ul>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button 
            onClick={() => window.open('tel:988')}
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Call 988 Now
          </button>
          <button 
            onClick={onClose}
            style={{
              backgroundColor: '#166534',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Continue Survey
          </button>
        </div>
      </div>
    </div>
  )
}

// Break reminder component
function BreakReminder({ isVisible, onContinue, onTakeBreak }) {
  if (!isVisible) return null
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#166534', marginBottom: '20px' }}>💙 Take a Moment</h2>
        <p style={{ marginBottom: '20px' }}>
          You've been working through this survey for about 15 minutes. 
          Taking breaks is important for your wellbeing.
        </p>
        <p style={{ marginBottom: '20px', fontStyle: 'italic' }}>
          Remember: Your progress is automatically saved.
        </p>
        
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button 
            onClick={onTakeBreak}
            style={{
              backgroundColor: '#166534',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Take a Break
          </button>
          <button 
            onClick={onContinue}
            style={{
              backgroundColor: '#6b7280',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

// Enhanced survey question component
function SurveyQuestion({ question, value, onChange }) {
  const handleResponseChange = (newValue, isTextResponse = false) => {
    let processedValue = newValue
    
    // Crisis detection
    if (isTextResponse && typeof newValue === 'string') {
      const hasKeywords = crisisKeywords.some(keyword => 
        newValue.toLowerCase().includes(keyword)
      )
      if (hasKeywords) {
        onChange(newValue, true) // true indicates crisis detected
        return
      }
    }
    
    onChange(processedValue)
  }

  const renderQuestion = () => {
    switch (question.type) {
      case 'radio':
        return (
          <div>
            {question.options.map((option, index) => (
              <label key={index} style={{ display: 'block', marginBottom: '10px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleResponseChange(e.target.value)}
                  style={{ marginRight: '8px' }}
                />
                {option}
              </label>
            ))}
          </div>
        )
      
      case 'checkbox':
        const checkboxValue = Array.isArray(value) ? value : []
        return (
          <div>
            {question.options.map((option, index) => (
              <label key={index} style={{ display: 'block', marginBottom: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  value={option}
                  checked={checkboxValue.includes(option)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleResponseChange([...checkboxValue, option])
                    } else {
                      handleResponseChange(checkboxValue.filter(v => v !== option))
                    }
                  }}
                  style={{ marginRight: '8px' }}
                />
                {option}
              </label>
            ))}
          </div>
        )
      
      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => handleResponseChange(e.target.value, true)}
            placeholder="Please share your thoughts..."
            style={{
              width: '100%',
              minHeight: '100px',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '16px',
              resize: 'vertical'
            }}
          />
        )
      
      default:
        return null
    }
  }

  return (
    <div style={{ marginBottom: '30px' }}>
      <h3 style={{ marginBottom: '15px', color: '#166534' }}>
        {question.question}
        {question.required && <span style={{ color: '#dc2626' }}> *</span>}
      </h3>
      {renderQuestion()}
      {!question.required && (
        <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '10px', fontStyle: 'italic' }}>
          This question is optional - you can skip if you prefer not to answer.
        </p>
      )}
    </div>
  )
}

// Main component
export default function SexualViolenceDocumentationPlatform() {
  // Authentication state
  const [currentUser, setCurrentUser] = useState(null)
  const [authMode, setAuthMode] = useState('landing') // 'landing', 'register', 'login', 'recover', 'dashboard', 'survey'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  
  // Survey state
  const [surveyStarted, setSurveyStarted] = useState(false)
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [surveyResponses, setSurveyResponses] = useState({})
  const [questionsSinceLastSave, setQuestionsSinceLastSave] = useState(0)
  const [showCrisisIntervention, setShowCrisisIntervention] = useState(false)
  const [showBreakReminder, setShowBreakReminder] = useState(false)
  const [surveyStartTime, setSurveyStartTime] = useState(null)
  const [lastBreakReminder, setLastBreakReminder] = useState(null)
  
  // Form data
  const [formData, setFormData] = useState({
    pseudonym: '',
    password: '',
    passwordConfirm: '',
    securityQuestion: 'What was the name of your first pet?',
    securityAnswer: ''
  })

  // Session management
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('currentUser')
      const savedSurveyData = localStorage.getItem('surveyData')
      
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser))
        setAuthMode('dashboard')
      }
      
      if (savedSurveyData) {
        const parsed = JSON.parse(savedSurveyData)
        setSurveyResponses(parsed.responses || {})
        setCurrentSectionIndex(parsed.currentSectionIndex || 0)
        setCurrentQuestionIndex(parsed.currentQuestionIndex || 0)
        setSurveyStartTime(parsed.startTime)
      }
    }
  }, [])

  // Auto-save survey progress
  useEffect(() => {
    if (surveyStarted && typeof window !== 'undefined') {
      const surveyData = {
        responses: surveyResponses,
        currentSectionIndex,
        currentQuestionIndex,
        startTime: surveyStartTime
      }
      localStorage.setItem('surveyData', JSON.stringify(surveyData))
    }
  }, [surveyResponses, currentSectionIndex, currentQuestionIndex, surveyStarted, surveyStartTime])

  // Break reminder logic
  useEffect(() => {
    if (surveyStarted && surveyStartTime) {
      const checkForBreakReminder = () => {
        const now = new Date()
        const elapsed = now - new Date(surveyStartTime)
        const minutes = Math.floor(elapsed / 60000)
        
        if (minutes >= 15 && (!lastBreakReminder || minutes - lastBreakReminder >= 15)) {
          setShowBreakReminder(true)
          setLastBreakReminder(minutes)
        }
      }
      
      const interval = setInterval(checkForBreakReminder, 60000) // Check every minute
      return () => clearInterval(interval)
    }
  }, [survey
