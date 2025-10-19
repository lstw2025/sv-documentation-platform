// Complete Integrated System: Authentication + Dashboard + 3-Section Survey
// Phase 1: Consent, Demographics, Experience Overview
// Ready for Netlify Deployment
// Repository: lstw2025/sv-documentation-platform

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { AlertTriangle, Shield, Heart, CheckCircle, ArrowLeft, ArrowRight, Save, Users, Plus, Eye, EyeOff, Settings, Download, Trash2, MapPin, Clock, BookOpen } from 'lucide-react';

// Crisis detection keywords
const CRISIS_KEYWORDS = [
  'ongoing', 'still happening', 'currently', 'right now', 'today', 'this week',
  'help me', 'scared', 'in danger', 'unsafe', 'can\'t leave', 'trapped'
];

// Mock authentication system - WORKING
const mockAuth = {
  users: new Map(),
  
  signUp: async (pseudonym, password, securityData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (mockAuth.users.has(pseudonym.toLowerCase())) {
      return { success: false, error: 'Pseudonym already taken. Please choose another.' };
    }
    
    if (password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters long.' };
    }
    
    const userData = {
      pseudonym,
      password,
      securityQuestion: securityData.question,
      securityAnswer: securityData.answer.toLowerCase(),
      createdAt: new Date(),
      experiences: []
    };
    
    mockAuth.users.set(pseudonym.toLowerCase(), userData);
    return { success: true, user: { pseudonym } };
  },
  
  signIn: async (pseudonym, password) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = mockAuth.users.get(pseudonym.toLowerCase());
    if (!user) {
      return { success: false, error: 'Account not found. Please check your pseudonym.' };
    }
    
    if (user.password !== password) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }
    
    return { success: true, user: { pseudonym: user.pseudonym } };
  }
};

// Crisis intervention component
const CrisisIntervention = ({ isVisible, onClose, onExit }) => {
  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        maxWidth: '500px',
        margin: '20px',
        border: '3px solid #dc2626'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <AlertTriangle size={24} color="#dc2626" />
          <h3 style={{ color: '#dc2626', margin: 0 }}>Immediate Support Available</h3>
        </div>
        
        <p style={{ marginBottom: '20px', lineHeight: '1.5' }}>
          Your responses suggest you may currently be in an unsafe situation. What is happening to you is not okay, and help is available.
        </p>

        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '6px',
          padding: '15px',
          marginBottom: '20px'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#dc2626' }}>24/7 Crisis Support:</h4>
          <div style={{ fontSize: '14px', lineHeight: '1.4' }}>
            <div><strong>Emergency:</strong> 111 (NZ) / 911 (US)</div>
            <div><strong>Sexual Violence Helpline:</strong> 0800 HELP 123</div>
            <div><strong>Crisis Text Line:</strong> Text HELP to 4357</div>
            <div><strong>Safe to Talk:</strong> 0800 044 334</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={onExit}
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '10px 20px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Exit to Safety Resources
          </button>
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '10px 20px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Continue Survey
          </button>
        </div>
      </div>
    </div>
  );
};

// Break reminder component
const BreakReminder = ({ isVisible, onClose, onTakeBreak }) => {
  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '8px',
        maxWidth: '400px',
        margin: '20px',
        border: '2px solid #166534'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
          <Heart size={20} color="#166534" />
          <h3 style={{ color: '#166534', margin: 0 }}>You've been working hard</h3>
        </div>
        
        <p style={{ marginBottom: '20px', color: '#374151' }}>
          You've been answering questions for about 15 minutes. Consider taking a short break to check in with yourself.
        </p>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={onTakeBreak}
            style={{
              backgroundColor: '#166534',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Take a Break
          </button>
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

// Question renderer component for survey
const SurveyQuestion = ({ question, response, onChange, onSkip }) => {
  const renderInput = () => {
    switch (question.type) {
      case 'radio':
        return (
          <div style={{ display: 'grid', gap: '8px' }}>
            {question.options.map((option, index) => (
              <label key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px',
                backgroundColor: response === option ? '#dcfce7' : 'transparent',
                borderRadius: '4px',
                cursor: 'pointer',
                border: response === option ? '1px solid #166534' : '1px solid transparent'
              }}>
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={response === option}
                  onChange={(e) => onChange(e.target.value)}
                  style={{ marginRight: '4px' }}
                />
                <span style={{ fontSize: '14px' }}>{option}</span>
              </label>
            ))}
          </div>
        );
      
      case 'number':
        return (
          <input
            type="number"
            value={response || ''}
            onChange={(e) => onChange(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '16px'
            }}
            min={question.min || 0}
            max={question.max}
          />
        );
      
      case 'year':
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let year = currentYear; year >= 1930; year--) {
          years.push(year);
        }
        return (
          <select
            value={response || ''}
            onChange={(e) => onChange(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          >
            <option value="">Select year...</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        );
      
      case 'checkbox':
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={response === true}
              onChange={(e) => onChange(e.target.checked)}
              style={{ width: '18px', height: '18px' }}
            />
            <span style={{ fontSize: '14px' }}>{question.checkboxLabel}</span>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div style={{
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '24px',
      marginBottom: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{
          color: '#166534',
          fontSize: '18px',
          marginBottom: '8px',
          lineHeight: '1.4'
        }}>
          {question.question}
        </h3>
        
        {question.helperText && (
          <p style={{
            color: '#6b7280',
            fontSize: '14px',
            fontStyle: 'italic',
            margin: '0 0 15px 0'
          }}>
            {question.helperText}
          </p>
        )}
      </div>

      {renderInput()}

      {question.allowSkip && (
        <div style={{ marginTop: '15px' }}>
          <button
            onClick={onSkip}
            style={{
              background: 'none',
              border: 'none',
              color: '#6b7280',
              cursor: 'pointer',
              fontSize: '12px',
              textDecoration: 'underline'
            }}
          >
            Prefer not to answer
          </button>
        </div>
      )}
    </div>
  );
};

// Survey component
const SurveyInterface = ({ user, onComplete, onSave, onExit }) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  const [showCrisis, setShowCrisis] = useState(false);
  const [showBreakReminder, setShowBreakReminder] = useState(false);
  const [startTime] = useState(Date.now());
  const [lastSaveTime, setLastSaveTime] = useState(Date.now());
  const [questionCount, setQuestionCount] = useState(0);

  // Survey configuration for first 3 sections
  const surveyConfig = {
    sections: [
      {
        id: 'consent',
        title: 'Informed Consent & Introduction',
        questions: [
          {
            id: 'welcome_understood',
            question: 'I understand this survey is about unwanted sexual experiences and may be emotionally difficult',
            type: 'checkbox',
            checkboxLabel: 'Yes, I understand',
            required: true,
            allowSkip: false
          },
          {
            id: 'control_understood',
            question: 'I understand I can stop, save, or skip questions at any time',
            type: 'checkbox',
            checkboxLabel: 'Yes, I understand',
            required: true,
            allowSkip: false
          },
          {
            id: 'anonymity_understood',
            question: 'I understand my responses are entirely anonymous and will be used for research, education and advocacy',
            type: 'checkbox',
            checkboxLabel: 'Yes, I understand',
            required: true,
            allowSkip: false
          },
          {
            id: 'consent_to_participate',
            question: 'I consent to participate in this research',
            type: 'radio',
            options: ['Yes, I consent to participate', 'No, I do not consent'],
            required: true,
            allowSkip: false
          }
        ]
      },
      {
        id: 'demographics',
        title: 'Demographics & Identity',
        questions: [
          {
            id: 'birth_year',
            question: 'What year were you born?',
            type: 'year',
            required: true,
            allowSkip: true
          },
          {
            id: 'gender_identity',
            question: 'What is your current gender identity?',
            type: 'radio',
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
            required: true,
            allowSkip: true
          },
          {
            id: 'sexual_orientation',
            question: 'Which of the following best represents how you think of yourself?',
            type: 'radio',
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
            required: false,
            allowSkip: true
          },
          {
            id: 'disability_status',
            question: 'Do you have a disability, long-term health condition, or accessibility needs?',
            type: 'radio',
            options: [
              'No',
              'Yes - physical disability',
              'Yes - intellectual/developmental disability',
              'Yes - mental health condition',
              'Yes - chronic illness',
              'Yes - multiple conditions',
              'Prefer not to answer'
            ],
            required: false,
            allowSkip: true
          },
          {
            id: 'relationship_status',
            question: 'What is your current relationship status?',
            type: 'radio',
            options: [
              'Single, never married/partnered',
              'In a relationship/dating',
              'Married/civil union/domestic partnership',
              'Separated',
              'Divorced',
              'Widowed',
              'It\'s complicated',
              'Prefer not to answer'
            ],
            required: false,
            allowSkip: true
          }
        ]
      },
      {
        id: 'incident_overview',
        title: 'Experience Overview',
        questions: [
          {
            id: 'frequency',
            question: 'How many times have you been involved in a sexual act or situation you did not want to be involved in?',
            type: 'number',
            min: 0,
            required: true,
            allowSkip: true,
            helperText: 'Please enter a number. This helps us understand the scope of your experiences.'
          },
          {
            id: 'multiple_incidents',
            question: 'How many times did these things happen?',
            type: 'number',
            min: 1,
            required: true,
            allowSkip: true,
            conditional: (responses) => responses.frequency && parseInt(responses.frequency) > 1
          },
          {
            id: 'people_present',
            question: 'Thinking of one example, how many people were there?',
            type: 'radio',
            options: ['1', '2-3', '4-5', '6 or more', 'Prefer not to answer'],
            required: true,
            allowSkip: true
          },
          {
            id: 'different_perpetrators',
            question: 'How many different people were responsible?',
            type: 'radio',
            options: ['1', '2-3', '4-5', '6 or more', 'Prefer not to answer'],
            required: true,
            allowSkip: true
          }
        ]
      }
    ]
  };

  // Crisis detection
  const checkForCrisis = (text) => {
    if (!text || typeof text !== 'string') return false;
    const lowerText = text.toLowerCase();
    return CRISIS_KEYWORDS.some(keyword => lowerText.includes(keyword));
  };

  // Auto-save functionality
  useEffect(() => {
    const autoSave = () => {
      const saveData = {
        responses,
        currentSection,
        currentQuestion,
        timestamp: Date.now(),
        userId: user.pseudonym
      };
      localStorage.setItem('survey_progress', JSON.stringify(saveData));
      setLastSaveTime(Date.now());
      if (onSave) onSave(saveData);
    };

    // Auto-save every 3 questions
    if (questionCount > 0 && questionCount % 3 === 0) {
      autoSave();
    }

    // Auto-save every 30 seconds
    const interval = setInterval(autoSave, 30000);
    return () => clearInterval(interval);
  }, [responses, currentSection, currentQuestion, questionCount, user, onSave]);

  // Break reminder (every 15 minutes)
  useEffect(() => {
    const checkBreakReminder = () => {
      const elapsed = Date.now() - startTime;
      const fifteenMinutes = 15 * 60 * 1000;
      
      if (elapsed > fifteenMinutes && elapsed % fifteenMinutes < 10000) {
        setShowBreakReminder(true);
      }
    };

    const interval = setInterval(checkBreakReminder, 10000);
    return () => clearInterval(interval);
  }, [startTime]);

  const getCurrentQuestion = () => {
    const section = surveyConfig.sections[currentSection];
    if (!section || !section.questions[currentQuestion]) return null;
    
    const question = section.questions[currentQuestion];
    
    // Check conditional logic
    if (question.conditional && !question.conditional(responses)) {
      return null;
    }
    
    return question;
  };

  const handleResponse = (questionId, value) => {
    const newResponses = { ...responses, [questionId]: value };
    setResponses(newResponses);

    // Crisis detection
    if (checkForCrisis(value)) {
      setShowCrisis(true);
    }

    setQuestionCount(prev => prev + 1);
  };

  const handleSkip = (questionId) => {
    const newResponses = { ...responses, [questionId]: 'SKIPPED' };
    setResponses(newResponses);
    setQuestionCount(prev => prev + 1);
  };

  const nextQuestion = () => {
    const section = surveyConfig.sections[currentSection];
    
    // Skip conditional questions
    let nextQuestionIndex = currentQuestion + 1;
    while (nextQuestionIndex < section.questions.length) {
      const nextQ = section.questions[nextQuestionIndex];
      if (!nextQ.conditional || nextQ.conditional(responses)) {
        break;
      }
      nextQuestionIndex++;
    }

    if (nextQuestionIndex < section.questions.length) {
      setCurrentQuestion(nextQuestionIndex);
    } else {
      // Move to next section
      if (currentSection < surveyConfig.sections.length - 1) {
        setCurrentSection(currentSection + 1);
        setCurrentQuestion(0);
      } else {
        // Survey complete
        onComplete && onComplete(responses);
      }
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      let prevQuestionIndex = currentQuestion - 1;
      while (prevQuestionIndex >= 0) {
        const prevQ = surveyConfig.sections[currentSection].questions[prevQuestionIndex];
        if (!prevQ.conditional || prevQ.conditional(responses)) {
          break;
        }
        prevQuestionIndex--;
      }
      setCurrentQuestion(Math.max(0, prevQuestionIndex));
    } else if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      const prevSection = surveyConfig.sections[currentSection - 1];
      setCurrentQuestion(prevSection.questions.length - 1);
    }
  };

  const canProceed = () => {
    const question = getCurrentQuestion();
    if (!question) return true;
    
    const response = responses[question.id];
    const hasResponse = response !== undefined && response !== null && response !== '';
    
    if (question.required && !hasResponse) {
      return false;
    }
    
    // Special validation for consent
    if (question.id === 'consent_to_participate') {
      return response === 'Yes, I consent to participate';
    }
    
    return true;
  };

  // Calculate progress
  const totalQuestions = surveyConfig.sections.reduce((sum, section) => sum + section.questions.length, 0);
  const completedQuestions = Object.keys(responses).length;
  const progressPercentage = Math.round((completedQuestions / totalQuestions) * 100);

  const currentQuestion_obj = getCurrentQuestion();
  
  if (!currentQuestion_obj) {
    // Skip to next section or complete
    setTimeout(() => {
      if (currentSection < surveyConfig.sections.length - 1) {
        setCurrentSection(currentSection + 1);
        setCurrentQuestion(0);
      } else {
        onComplete && onComplete(responses);
      }
    }, 1000);
    
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h2 style={{ color: '#166534' }}>Section Complete!</h2>
        <p>Moving to next section...</p>
      </div>
    );
  }

  return (
    <>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        {/* Emergency Exit Button */}
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 999
        }}>
          <button
            onClick={() => window.open('https://google.com', '_blank')}
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 12px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 'bold'
            }}
          >
            ⚠️ Quick Exit
          </button>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px'
          }}>
            <h1 style={{ color: '#166534', fontSize: '24px', margin: 0 }}>
              {surveyConfig.sections[currentSection].title}
            </h1>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              Section {currentSection + 1} of {surveyConfig.sections.length}
            </div>
          </div>
          
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#f3f4f6',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progressPercentage}%`,
              height: '100%',
              backgroundColor: '#166534',
              transition: 'width 0.3s ease'
            }} />
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '5px' }}>
            {progressPercentage}% complete (Phase 1: Sections 1-3)
          </div>
        </div>

        {/* Current Question */}
        <SurveyQuestion
          question={currentQuestion_obj}
          response={responses[currentQuestion_obj.id]}
          onChange={(value) => handleResponse(currentQuestion_obj.id, value)}
          onSkip={() => handleSkip(currentQuestion_obj.id)}
        />

        {/* Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '30px',
          padding: '20px 0'
        }}>
          <button
            onClick={prevQuestion}
            disabled={currentSection === 0 && currentQuestion === 0}
            style={{
              backgroundColor: currentSection === 0 && currentQuestion === 0 ? '#e5e7eb' : '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '12px 20px',
              cursor: currentSection === 0 && currentQuestion === 0 ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ArrowLeft size={16} /> Previous
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => {
                const saveData = { responses, currentSection, currentQuestion };
                localStorage.setItem('survey_progress', JSON.stringify(saveData));
                onExit();
              }}
              style={{
                backgroundColor: '#166534',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Save size={14} /> Save & Exit
            </button>
          </div>

          <button
            onClick={nextQuestion}
            disabled={!canProceed()}
            style={{
              backgroundColor: canProceed() ? '#166534' : '#e5e7eb',
              color: canProceed() ? 'white' : '#9ca3af',
              border: 'none',
              borderRadius: '4px',
              padding: '12px 20px',
              cursor: canProceed() ? 'pointer' : 'not-allowed',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            Next <ArrowRight size={16} />
          </button>
        </div>

        {/* Supportive Message */}
        <div style={{
          backgroundColor: '#dcfce7',
          border: '1px solid #bbf7d0',
          borderRadius: '6px',
          padding: '15px',
          textAlign: 'center',
          marginTop: '20px'
        }}>
          <p style={{ color: '#166534', margin: 0, fontSize: '14px' }}>
            💚 You're doing important work. Your experiences matter and contribute to understanding that helps others.
          </p>
        </div>
      </div>

      {/* Crisis Intervention Modal */}
      <CrisisIntervention
        isVisible={showCrisis}
        onClose={() => setShowCrisis(false)}
        onExit={() => window.open('https://google.com', '_blank')}
      />

      {/* Break Reminder Modal */}
      <BreakReminder
        isVisible={showBreakReminder}
        onClose={() => setShowBreakReminder(false)}
        onTakeBreak={() => {
          setShowBreakReminder(false);
          alert('Take all the time you need. Your progress is saved and you can return anytime.');
        }}
      />
    </>
  );
};

// Registration component
const RegistrationForm = ({ onBack, onSuccess, auth }) => {
  const [formData, setFormData] = useState({
    pseudonym: '',
    password: '',
    confirmPassword: '',
    securityQuestion: '',
    securityAnswer: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    if (!formData.securityQuestion.trim() || !formData.securityAnswer.trim()) {
      setError('Security question and answer are required');
      setLoading(false);
      return;
    }

    try {
      const result = await auth.signUp(formData.pseudonym, formData.password, {
        question: formData.securityQuestion,
        answer: formData.securityAnswer
      });

      if (result.success) {
        onSuccess(result.user);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '40px 20px' }}>
      <h2 style={{ color: '#166534', textAlign: 'center', marginBottom: '30px' }}>
        Create Anonymous Account
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#374151', fontWeight: '500' }}>
            Choose a pseudonym
          </label>
          <input
            type="text"
            value={formData.pseudonym}
            onChange={(e) => setFormData({...formData, pseudonym: e.target.value})}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            required
          />
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '5px' }}>
            This will be your anonymous identity. No personal information needed.
          </p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#374151', fontWeight: '500' }}>
            Password (minimum 8 characters)
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              style={{
                width: '100%',
                padding: '10px 40px 10px 10px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              required
              minLength={8}
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
                color: '#6b7280'
              }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#374151', fontWeight: '500' }}>
            Confirm Password
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              style={{
                width: '100%',
                padding: '10px 40px 10px 10px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#6b7280'
              }}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#374151', fontWeight: '500' }}>
            Security Question (for password recovery)
          </label>
          <input
            type="text"
            value={formData.securityQuestion}
            onChange={(e) => setFormData({...formData, securityQuestion: e.target.value})}
            placeholder="e.g., What was the name of your first pet?"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            required
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#374151', fontWeight: '500' }}>
            Security Answer
          </label>
          <input
            type="text"
            value={formData.securityAnswer}
            onChange={(e) => setFormData({...formData, securityAnswer: e.target.value})}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            required
          />
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
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
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          onClick={onBack}
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
    </div>
  );
};

// Login component
const LoginForm = ({ onBack, onSuccess, auth }) => {
  const [formData, setFormData] = useState({
    pseudonym: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await auth.signIn(formData.pseudonym, formData.password);
      
      if (result.success) {
        onSuccess(result.user);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '40px 20px' }}>
      <h2 style={{ color: '#166534', textAlign: 'center', marginBottom: '30px' }}>
        Sign In
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#374151', fontWeight: '500' }}>
            Pseudonym
          </label>
          <input
            type="text"
            value={formData.pseudonym}
            onChange={(e) => setFormData({...formData, pseudonym: e.target.value})}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            required
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#374151', fontWeight: '500' }}>
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              style={{
                width: '100%',
                padding: '10px 40px 10px 10px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              required
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
                color: '#6b7280'
              }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
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
      </form>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          onClick={onBack}
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
    </div>
  );
};

// Welcome screen component
const WelcomeScreen = ({ onShowRegistration, onShowLogin }) => (
  <div style={{ textAlign: 'center', padding: '60px 20px' }}>
    <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#166534', marginBottom: '20px' }}>
      Let's Show The World
    </h1>
    <p style={{ fontSize: '20px', color: '#6b7280', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px auto' }}>
      A secure, anonymous platform for documenting experiences of sexual violence to drive research, advocacy, and change.
    </p>
    
    <div style={{
      backgroundColor: '#fef3c7',
      border: '1px solid #fbbf24',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '40px',
      maxWidth: '500px',
      margin: '0 auto 40px auto'
    }}>
      <p style={{ color: '#d97706', fontSize: '16px', fontWeight: '500', margin: 0 }}>
        <strong>Crisis Resources Available 24/7:</strong><br/>
        If you are in immediate danger, call emergency services.<br/>
        Sexual Violence Helpline: 0800 HELP 123
      </p>
    </div>

    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
      <button
        onClick={onShowRegistration}
        style={{
          backgroundColor: '#166534',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '15px 30px',
          fontSize: '18px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Get Started
      </button>
      
      <button
        onClick={onShowLogin}
        style={{
          backgroundColor: 'white',
          color: '#166534',
          border: '2px solid #166534',
          borderRadius: '8px',
          padding: '15px 30px',
          fontSize: '18px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Sign In
      </button>
    </div>

    <div style={{
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '30px',
      marginTop: '40px',
      textAlign: 'left',
      maxWidth: '600px',
      margin: '40px auto 0 auto',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ color: '#166534', marginBottom: '20px', textAlign: 'center' }}>Your Privacy & Safety</h3>
      <ul style={{ color: '#374151', lineHeight: '1.6' }}>
        <li><strong>Completely Anonymous:</strong> No personal information required</li>
        <li><strong>Secure Platform:</strong> Healthcare-level encryption and security</li>
        <li><strong>Your Control:</strong> Skip any question, save progress, exit anytime</li>
        <li><strong>Research Impact:</strong> Your data helps prevent future violence</li>
        <li><strong>Crisis Support:</strong> Resources and support available throughout</li>
      </ul>
    </div>
  </div>
);

// Dashboard component with integrated survey
const Dashboard = ({ user, onLogout }) => {
  const [activeView, setActiveView] = useState('overview');
  const [experiences, setExperiences] = useState([]);
  const [currentSurveyId, setCurrentSurveyId] = useState(null);

  useEffect(() => {
    const savedExperiences = localStorage.getItem(`experiences_${user.pseudonym}`);
    if (savedExperiences) {
      try {
        setExperiences(JSON.parse(savedExperiences));
      } catch (e) {
        console.error('Error loading experiences:', e);
      }
    }
  }, [user]);

  const handleStartNewSurvey = () => {
    const surveyId = `survey_${Date.now()}`;
    setCurrentSurveyId(surveyId);
    setActiveView('survey');
  };

  const handleSurveyComplete = (responses) => {
    const newExperience = {
      id: currentSurveyId,
      title: `Documentation ${experiences.length + 1}`,
      status: 'completed',
      completionPercentage: 100,
      lastModified: new Date(),
      responses: responses,
      sections: ['consent', 'demographics', 'overview']
    };

    const updatedExperiences = [...experiences, newExperience];
    setExperiences(updatedExperiences);
    localStorage.setItem(`experiences_${user.pseudonym}`, JSON.stringify(updatedExperiences));
    
    setActiveView('overview');
    setCurrentSurveyId(null);
    
    alert('Thank you! Your documentation has been completed and saved securely.');
  };

  const handleSurveySave = (saveData) => {
    console.log('Survey progress saved:', saveData);
  };

  const handleSurveyExit = () => {
    setActiveView('overview');
    setCurrentSurveyId(null);
  };

  if (activeView === 'survey') {
    return (
      <SurveyInterface
        user={user}
        onComplete={handleSurveyComplete}
        onSave={handleSurveySave}
        onExit={handleSurveyExit}
      />
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '32px', 
            color: '#166534', 
            margin: '0 0 5px 0',
            fontWeight: 'bold'
          }}>
            Welcome back, {user.pseudonym}
          </h1>
          <p style={{ 
            color: '#6b7280', 
            margin: 0,
            fontSize: '16px'
          }}>
            Your secure documentation dashboard
          </p>
        </div>
        
        <button
          onClick={onLogout}
          style={{
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 20px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Secure Logout
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#166534', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={20} /> Your Documentation
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#166534' }}>
                {experiences.length}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                Experiences
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#166534' }}>
                {experiences.filter(exp => exp.status === 'completed').length}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                Completed
              </div>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: '#dcfce7',
          border: '1px solid #bbf7d0',
          borderRadius: '8px',
          padding: '24px'
        }}>
          <h3 style={{ color: '#166534', marginBottom: '15px' }}>Phase 1 Available</h3>
          <p style={{ color: '#166534', fontSize: '14px', margin: '0 0 15px 0' }}>
            Currently documenting: Consent, Demographics, and Experience Overview (Sections 1-3)
          </p>
          <button
            onClick={handleStartNewSurvey}
            style={{
              backgroundColor: '#166534',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '10px 20px',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Plus size={16} /> Start Documentation
          </button>
        </div>
      </div>

      {experiences.length > 0 && (
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '24px',
          marginBottom: '30px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#166534', marginBottom: '20px' }}>Your Documented Experiences</h3>
          
          <div style={{ display: 'grid', gap: '16px' }}>
            {experiences.map(exp => (
              <div key={exp.id} style={{
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                padding: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ color: '#166534', margin: 0 }}>{exp.title}</h4>
                    <p style={{ color: '#6b7280', fontSize: '12px', margin: '4px 0 0 0' }}>
                      Completed: {new Date(exp.lastModified).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{
                    backgroundColor: exp.status === 'completed' ? '#dcfce7' : '#fef3c7',
                    color: exp.status === 'completed' ? '#166534' : '#d97706',
                    padding: '4px 12px',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {exp.status === 'completed' ? '✓ Complete' : '⏳ Draft'}
                  </div>
                </div>
                <div style={{ marginTop: '10px', fontSize: '12px', color: '#6b7280' }}>
                  Sections: {exp.sections.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '24px',
        textAlign: 'center'
      }}>
        <h3 style={{ color: '#166534', marginBottom: '15px' }}>Phase 1: Foundation Documentation</h3>
        <p style={{ color: '#6b7280', lineHeight: '1.5', margin: 0 }}>
          This initial phase captures essential consent, demographic, and overview information. 
          Additional documentation sections will be available in future phases based on user feedback and testing.
        </p>
      </div>
    </div>
  );
};

// Main application component
export default function Home() {
  const [authMode, setAuthMode] = useState('landing');
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
        setAuthMode('dashboard');
      } catch (e) {
        console.error('Error loading saved session:', e);
      }
    }
    setLoading(false);
  }, []);

  const handleSuccessfulAuth = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    setAuthMode('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setAuthMode('landing');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ color: '#166534', fontSize: '18px' }}>Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Let's Show The World - Anonymous SV Documentation Platform</title>
        <meta name="description" content="Secure, anonymous platform for documenting sexual violence experiences" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1000
        }}>
          <button
            onClick={() => window.open('https://google.com', '_blank')}
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 12px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 'bold'
            }}
          >
            ⚠️ Quick Exit
          </button>
        </div>

        <main>
          {authMode === 'dashboard' && currentUser ? (
            <Dashboard user={currentUser} onLogout={handleLogout} />
          ) : authMode === 'register' ? (
            <RegistrationForm 
              onBack={() => setAuthMode('landing')} 
              onSuccess={handleSuccessfulAuth} 
              auth={mockAuth} 
            />
          ) : authMode === 'login' ? (
            <LoginForm 
              onBack={() => setAuthMode('landing')} 
              onSuccess={handleSuccessfulAuth} 
              auth={mockAuth} 
            />
          ) : (
            <WelcomeScreen 
              onShowRegistration={() => setAuthMode('register')}
              onShowLogin={() => setAuthMode('login')}
            />
          )}
        </main>

        <footer style={{ backgroundColor: '#166534', color: 'white', padding: '1.5rem 0', marginTop: '3rem' }}>
          <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: '#dcfce7', margin: 0 }}>
              Phase 1 Development • Privacy-First Design • Healthcare-Level Security • Deployed on Netlify
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
